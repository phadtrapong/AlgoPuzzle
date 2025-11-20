import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { generateQuestion } from './services/geminiService';
import { Question, GameState, Option, HistoryItem } from './types';
import CodeToken from './components/CodeToken';
import PuzzlePiece from './components/PuzzlePiece';
import Slot from './components/Slot';
import ProgressDashboard from './components/ProgressDashboard';
import MarkdownLite from './components/MarkdownLite';
import { Loader2, CheckCircle2, XCircle, RefreshCw, Play, ChevronRight, BrainCircuit, Code2, Lightbulb, Info, Trophy } from 'lucide-react';

const App: React.FC = () => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [gameState, setGameState] = useState<GameState>('loading');
  const [difficulty, setDifficulty] = useState<string>('Medium');
  
  // Track history to avoid duplicates and for progress
  const [seenTitles, setSeenTitles] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  const [showDashboard, setShowDashboard] = useState(false);
  
  // Map of Slot ID -> Selected Option ID
  const [selections, setSelections] = useState<Record<string, string>>({});
  // Active Slot ID (the one user is currently trying to fill)
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);
  // Track which slots have been validated and their result
  const [validationResults, setValidationResults] = useState<Record<string, boolean>>({});

  // Load from local storage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('algoPuzzleHistory');
    const savedSeen = localStorage.getItem('algoPuzzleSeen');
    
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
    if (savedSeen) {
      try {
        setSeenTitles(JSON.parse(savedSeen));
      } catch (e) {
        console.error("Failed to parse seen titles", e);
      }
    }
  }, []);

  // Save to local storage whenever updated
  useEffect(() => {
    localStorage.setItem('algoPuzzleHistory', JSON.stringify(history));
    localStorage.setItem('algoPuzzleSeen', JSON.stringify(seenTitles));
  }, [history, seenTitles]);

  const fetchNewQuestion = useCallback(async () => {
    setGameState('loading');
    setSelections({});
    setValidationResults({});
    setActiveSlotId(null);
    try {
      const q = await generateQuestion(difficulty, seenTitles);
      setQuestion(q);
      // Update history of titles immediately to prevent re-fetching same in same session if user skips
      if (!seenTitles.includes(q.title)) {
         setSeenTitles(prev => [...prev, q.title]);
      }
      
      // Automatically select the first slot
      if (q.slots.length > 0) {
        setActiveSlotId(q.slots[0].id);
      }
      setGameState('playing');
    } catch (e) {
      console.error(e);
      setGameState('error');
    }
  }, [difficulty, seenTitles]);

  const handleQuestionSelect = (q: Question) => {
    setQuestion(q);
    setDifficulty(q.difficulty);
    setSelections({});
    setValidationResults({});
    setGameState('playing');
    setShowDashboard(false);
    
    if (q.slots.length > 0) {
      setActiveSlotId(q.slots[0].id);
    } else {
      setActiveSlotId(null);
    }

    // Ensure it's marked as seen
    if (!seenTitles.includes(q.title)) {
        setSeenTitles(prev => [...prev, q.title]);
    }
  };

  // Initial Load
  useEffect(() => {
    // Only fetch if we haven't loaded one yet (strict mode safety)
    if (!question) {
        fetchNewQuestion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSlotClick = (slotId: string) => {
    if (gameState === 'success') return;
    setActiveSlotId(slotId);
  };

  const handleOptionClick = (slotId: string, option: Option) => {
    if (gameState === 'success') return;
    
    setSelections(prev => ({
      ...prev,
      [slotId]: option.id
    }));
    
    // Clear validation result for this slot if it was wrong previously
    if (validationResults[slotId] === false) {
        const newResults = {...validationResults};
        delete newResults[slotId];
        setValidationResults(newResults);
    }

    // Auto-advance logic: If valid next slot exists and is empty, move there
    if (question) {
      const currentSlotIndex = question.slots.findIndex(s => s.id === slotId);
      const nextSlot = question.slots[currentSlotIndex + 1];
      if (nextSlot && !selections[nextSlot.id]) {
        setActiveSlotId(nextSlot.id);
      }
    }
  };

  const submitPuzzle = () => {
    if (!question) return;

    const results: Record<string, boolean> = {};
    let allCorrect = true;

    question.slots.forEach(slot => {
      const selectedId = selections[slot.id];
      const correctOption = slot.options.find(o => o.isCorrect);
      const isCorrect = selectedId === correctOption?.id;
      
      results[slot.id] = isCorrect;
      if (!isCorrect) allCorrect = false;
    });

    setValidationResults(results);

    if (allCorrect) {
      setGameState('success');
      setActiveSlotId(null);
      
      // Add to History
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        question: question,
        dateSolved: new Date().toISOString()
      };
      setHistory(prev => [...prev, newHistoryItem]);
    }
  };

  // Parse code template into segments of Text and Slots
  const parsedCode = useMemo(() => {
    if (!question) return [];
    
    // Regex to find {{SLOT_X}}
    const regex = /({{SLOT_\d+}})/g;
    const parts = question.codeTemplate.split(regex);
    
    return parts.map((part, index) => {
      if (part.match(regex)) {
        return { type: 'slot', content: part };
      }
      return { type: 'code', content: part };
    });
  }, [question]);

  // Get current active slot options
  const activeSlotOptions = useMemo(() => {
      if(!question || !activeSlotId) return [];
      const slot = question.slots.find(s => s.id === activeSlotId);
      return slot ? slot.options : [];
  }, [question, activeSlotId]);

  const isAllFilled = useMemo(() => {
      if (!question) return false;
      return question.slots.every(s => !!selections[s.id]);
  }, [question, selections]);

  if (gameState === 'loading') {
    return (
      <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center text-white space-y-6">
        <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full"></div>
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin relative z-10" />
        </div>
        <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Constructing Interview Matrix</h2>
            <p className="text-neutral-400 text-sm">Retrieving next {difficulty} challenge...</p>
        </div>
      </div>
    );
  }

  if (gameState === 'error' || !question) {
    return (
      <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center text-white">
        <XCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">System Failure</h2>
        <p className="text-neutral-400 mb-6">Unable to retrieve puzzle data.</p>
        <button 
          onClick={fetchNewQuestion}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold flex items-center gap-2 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col font-sans">
      <ProgressDashboard 
        isOpen={showDashboard} 
        onClose={() => setShowDashboard(false)} 
        history={history} 
        onSelectQuestion={handleQuestionSelect}
      />

      {/* Header */}
      <header className="h-16 border-b border-neutral-800 flex items-center justify-between px-6 bg-neutral-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 rounded-lg">
            <Code2 className="w-6 h-6 text-blue-400" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white">Algo<span className="text-blue-500">Puzzle</span></h1>
        </div>
        
        <div className="flex items-center gap-4">
           <button 
             onClick={() => setShowDashboard(true)}
             className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm rounded-full transition-colors border border-neutral-700"
           >
             <Trophy className="w-4 h-4 text-yellow-500" />
             <span>My Progress</span>
           </button>
           <div className="h-6 w-px bg-neutral-800"></div>
           <select 
             value={difficulty}
             onChange={(e) => setDifficulty(e.target.value)}
             className="bg-neutral-800 border border-neutral-700 text-sm rounded px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none"
           >
             <option value="Easy">Easy</option>
             <option value="Medium">Medium</option>
             <option value="Hard">Hard</option>
           </select>
           <button 
             onClick={fetchNewQuestion} 
             className="p-2 hover:bg-neutral-800 rounded-full transition-colors text-neutral-400 hover:text-white"
             title="New Question"
           >
             <RefreshCw className="w-5 h-5" />
           </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Problem Description & Result */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-full">
           
           {/* Problem Card */}
           <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium
                        ${question.difficulty === 'Easy' ? 'bg-green-900/30 text-green-400 border border-green-800' : 
                        question.difficulty === 'Medium' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800' : 
                        'bg-red-900/30 text-red-400 border border-red-800'}`}>
                        {question.difficulty}
                    </span>
                    {question.topic && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-800">
                            {question.topic}
                        </span>
                    )}
                 </div>
                 <span className="text-neutral-500 text-xs font-mono">TypeScript</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">{question.title}</h2>
              <div className="prose prose-invert prose-sm max-w-none text-neutral-300 leading-relaxed">
                 {question.description.split('\n').map((line, i) => (
                   <p key={i} className="mb-2 min-h-[0.5rem] whitespace-pre-wrap">{line}</p>
                 ))}
              </div>
           </div>

           {/* Instructions (Visible when Playing) */}
           {gameState !== 'success' && (
             <div className="bg-blue-900/10 border border-blue-800/30 rounded-xl p-4 flex gap-3 items-start">
                <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                   <h4 className="text-sm font-semibold text-blue-300 mb-1">How to Play</h4>
                   <p className="text-xs text-blue-200/70 leading-relaxed">
                     Click the dashed slots <span className="inline-block w-3 h-3 border border-dashed border-gray-400 align-middle mx-1"></span> in the code to reveal options. Select the correct code snippet to complete the logic. Click "Run Tests" when finished.
                   </p>
                </div>
             </div>
           )}

           {/* Explanation Panel (Visible on Success) */}
           {gameState === 'success' && (
             <div className="bg-green-950/30 border border-green-800/50 rounded-xl p-6 animate-fade-in flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-4 text-green-400">
                  <Lightbulb className="w-6 h-6" />
                  <h3 className="font-bold text-lg">Solution Explained</h3>
                </div>
                
                <div className="flex-1 overflow-y-auto pr-2 max-h-[400px] custom-scrollbar mb-6">
                   <MarkdownLite content={question.explanation} />
                </div>

                <button 
                  onClick={fetchNewQuestion}
                  className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-900/20 mt-auto"
                >
                   Next Challenge <ChevronRight className="w-4 h-4" />
                </button>
             </div>
           )}
        </div>

        {/* Center/Right: Code Editor & Puzzle Pieces */}
        <div className="lg:col-span-8 flex flex-col gap-6">
           
           {/* Code Area */}
           <div className="bg-neutral-900 rounded-xl border border-neutral-800 shadow-2xl overflow-hidden flex flex-col relative">
              {/* Top Bar */}
              <div className="h-10 bg-neutral-950 border-b border-neutral-800 flex items-center px-4 gap-2 justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                    <span className="ml-4 text-xs text-neutral-500 font-mono">solution.ts</span>
                </div>
                <div className="text-xs text-neutral-600 font-mono">
                    {Object.keys(selections).length}/{question.slots.length} Slots Filled
                </div>
              </div>
              
              <div className="p-6 overflow-x-auto font-mono text-sm leading-7 text-neutral-300 min-h-[300px]">
                <pre>
                  <code>
                    {parsedCode.map((item, idx) => {
                      if (item.type === 'slot') {
                        const slotId = item.content;
                        const selectedOptionId = selections[slotId];
                        // Find the option content if selected
                        const slotObj = question.slots.find(s => s.id === slotId);
                        const optionContent = slotObj?.options.find(o => o.id === selectedOptionId)?.code;
                        
                        let status: 'empty' | 'filled' | 'correct' | 'incorrect' = 'empty';
                        if (selectedOptionId) status = 'filled';
                        if (validationResults[slotId] === true) status = 'correct';
                        if (validationResults[slotId] === false) status = 'incorrect';

                        return (
                          <Slot 
                            key={idx} 
                            id={slotId}
                            isActive={activeSlotId === slotId}
                            filledCode={optionContent || null}
                            onClick={() => handleSlotClick(slotId)}
                            status={status}
                          />
                        );
                      } else {
                        return <CodeToken key={idx} text={item.content} />;
                      }
                    })}
                  </code>
                </pre>
              </div>
           </div>

           {/* Interaction Area: Options Deck */}
           <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 min-h-[240px] flex flex-col shadow-md">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                   <BrainCircuit className="w-4 h-4 text-blue-500" />
                   {activeSlotId ? "Select Matching Fragment" : "Select a slot to view options"}
                 </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 content-start">
                {activeSlotId ? (
                  activeSlotOptions.map((option) => (
                    <PuzzlePiece
                      key={option.id}
                      code={option.code}
                      isSelected={selections[activeSlotId] === option.id}
                      onClick={() => handleOptionClick(activeSlotId, option)}
                      // Only show correct/incorrect visually after submission
                      isCorrect={gameState === 'success' ? option.isCorrect : (validationResults[activeSlotId] !== undefined && selections[activeSlotId] === option.id) ? validationResults[activeSlotId] : null}
                      disabled={gameState === 'success'}
                    />
                  ))
                ) : (
                  <div className="col-span-full h-full flex flex-col items-center justify-center text-neutral-600 border-2 border-dashed border-neutral-800/50 rounded-lg p-8">
                     <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mb-3 shadow-inner">
                        <Code2 className="w-6 h-6 text-neutral-500" />
                     </div>
                     <p className="text-sm">Click any <span className="text-blue-400 font-mono">???</span> slot in the code editor to begin</p>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="mt-6 pt-4 border-t border-neutral-800 flex justify-between items-center">
                 <div className="text-xs text-neutral-500 italic">
                   {gameState === 'success' ? 'Great job! Check the solution explanation.' : 'Review your choices before running tests.'}
                 </div>
                 {gameState === 'playing' && (
                   <button
                     onClick={submitPuzzle}
                     disabled={!isAllFilled}
                     className={`
                       px-8 py-2.5 rounded-lg font-bold text-white shadow-lg flex items-center gap-2 transition-all
                       ${isAllFilled 
                         ? 'bg-blue-600 hover:bg-blue-500 hover:scale-105 shadow-blue-900/20' 
                         : 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'}
                     `}
                   >
                     <Play className="w-4 h-4 fill-current" /> Run Tests
                   </button>
                 )}
              </div>
           </div>

        </div>
      </main>
    </div>
  );
};

export default App;