import React, { useState, useMemo } from 'react';
import { HistoryItem, Question } from '../types';
import { QUESTION_BANK } from '../services/geminiService';
import { Trophy, BookOpen, X, ChevronDown, ChevronUp, Check, Lock, Zap, Crown, Map, FileCode2, Code, Terminal, Play } from 'lucide-react';
import MarkdownLite from './MarkdownLite';

interface ProgressDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectQuestion: (question: Question) => void;
}

// Define the roadmap structure (The "75" style path)
const ROADMAP_STRUCTURE = {
  Easy: {
    title: "Phase 1: Essentials",
    subtitle: "Arrays, Strings & Hash Maps",
    topics: [
      "Two Sum", 
      "Valid Palindrome", 
      "Best Time to Buy Stock", 
      "Valid Anagram", 
      "Valid Parentheses", 
      "Binary Search", 
      "Linked List Cycle", 
      "Invert Binary Tree"
    ]
  },
  Medium: {
    title: "Phase 2: Core Algorithms",
    subtitle: "Trees, Graphs & Heaps",
    topics: [
      "Maximum Subarray", 
      "Container With Most Water", 
      "Level Order Traversal", 
      "Product of Array Except Self", 
      "Group Anagrams", 
      "Top K Frequent Elements", 
      "Longest Consecutive Sequence", 
      "Number of Islands",
      "Clone Graph",
      "Pacific Atlantic Water Flow"
    ]
  },
  Hard: {
    title: "Phase 3: Advanced Mastery",
    subtitle: "Dynamic Programming & System Design",
    topics: [
      "Trapping Rain Water", 
      "Merge k Sorted Lists", 
      "Median of Two Sorted Arrays", 
      "Word Ladder", 
      "Largest Rectangle in Histogram", 
      "Serialize Binary Tree", 
      "N-Queens",
      "Alien Dictionary"
    ]
  }
};

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ isOpen, onClose, history, onSelectQuestion }) => {
  const [activeTab, setActiveTab] = useState<'path' | 'review'>('path');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // Calculate Stats
  const stats = useMemo(() => {
    const totalSolved = history.length;
    const streak = totalSolved > 0 ? 1 : 0; // Simple streak logic
    return { totalSolved, streak };
  }, [history]);

  if (!isOpen) return null;

  // Helper to render a "Phase" header
  const PhaseHeader = ({ color, title, description, progress, total }: { color: string, title: string, description: string, progress: number, total: number }) => (
    <div className={`rounded-2xl p-5 mb-8 flex items-center justify-between border-b-4 text-white shadow-lg relative overflow-hidden`}
         style={{ backgroundColor: color, borderColor: 'rgba(0,0,0,0.2)' }}>
      <div className="relative z-10">
        <h3 className="text-2xl font-extrabold tracking-tight uppercase drop-shadow-md">{title}</h3>
        <p className="opacity-90 font-medium text-sm mt-1">{description}</p>
        <div className="mt-3 inline-flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-sm">
          <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
             <div className="h-full bg-white rounded-full" style={{ width: `${Math.min(100, (progress/total)*100)}%` }}></div>
          </div>
          <span>{progress} / {total}</span>
        </div>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10 rotate-12 transform scale-150">
        <Terminal className="w-32 h-32" />
      </div>
    </div>
  );

  // Helper to render the roadmap path
  const RoadmapPhase = ({ 
    difficulty, 
    themeColor 
  }: { 
    difficulty: 'Easy' | 'Medium' | 'Hard', 
    themeColor: string
  }) => {
    const config = ROADMAP_STRUCTURE[difficulty];
    // Filter history to find unique solved titles in this difficulty
    const solvedTitles = new Set(history.filter(h => h.question.difficulty === difficulty).map(h => h.question.title));
    
    const effectiveSolvedCount = history.filter(h => h.question.difficulty === difficulty).length;
    
    // Get available templates from bank
    const bankQuestions = QUESTION_BANK.filter(q => q.difficulty === difficulty);
    const safeBank = bankQuestions.length > 0 ? bankQuestions : QUESTION_BANK; // Fallback to any questions if difficulty empty

    const totalSteps = config.topics.length;

    return (
      <div className="mb-16 relative">
        <PhaseHeader 
          color={themeColor} 
          title={config.title} 
          description={config.subtitle} 
          progress={Math.min(effectiveSolvedCount, totalSteps)}
          total={totalSteps}
        />
        
        <div className="flex flex-col items-center space-y-8 relative py-4 pb-8">
          
          {config.topics.map((topicName, index) => {
            const isSolved = index < effectiveSolvedCount;
            const isCurrent = index === effectiveSolvedCount;
            const isLocked = index > effectiveSolvedCount;
            
            // Prioritize finding an exact match for the topic in our bank
            // This fixes issues where "Group Anagrams" might map to "Container with Most Water" due to index cycling
            let template = safeBank.find(q => q.title === topicName);
            
            // Fallback to fuzzy match if exact title not found
            if (!template) {
               template = safeBank.find(q => q.title.includes(topicName));
            }

            // Last resort: Cycle through available questions so the node is at least playable
            if (!template) {
               template = safeBank[index % safeBank.length];
            }

            const questionToPlay: Question = {
                ...template,
                title: topicName, // Overlay the roadmap title so UI stays consistent
                difficulty: difficulty
            };

            // Winding path effect
            // Zig-zag pattern: Center -> Left -> Center -> Right
            const xOffset = index % 4 === 1 ? -60 : index % 4 === 3 ? 60 : 0;
            
            return (
              <div 
                key={index} 
                className="relative group z-10 flex flex-col items-center transition-transform duration-500"
                style={{ transform: `translateX(${xOffset}px)` }}
              >
                 {/* Connector Line */}
                 {index < totalSteps - 1 && (
                   <div 
                      className="absolute top-16 left-1/2 w-3 -ml-1.5 -z-10 rounded-full"
                      style={{ 
                        height: '100px',
                        background: isSolved ? themeColor : '#333',
                        opacity: isLocked ? 0.3 : 1
                      }}
                   ></div>
                 )}

                 {/* Node Circle */}
                 <button 
                 onClick={() => {
                    if (!isLocked && questionToPlay) {
                        onSelectQuestion(questionToPlay);
                    }
                 }}
                 disabled={isLocked}
                 className={`
                    w-24 h-24 rounded-[2rem] flex items-center justify-center border-b-8 transition-all duration-200 outline-none
                    ${isSolved 
                        ? 'bg-neutral-800 border-neutral-950 ring-4 ring-offset-4 ring-offset-[#131f24]' 
                        : ''}
                    ${isCurrent 
                        ? `${themeColor === '#58cc02' ? 'bg-[#58cc02] border-[#46a302]' : themeColor === '#ce82ff' ? 'bg-[#ce82ff] border-[#a64bf4]' : 'bg-[#ff4b4b] border-[#d40000]'} ring-4 ring-white/20 active:border-b-0 active:translate-y-2 scale-110 shadow-[0_0_40px_rgba(0,0,0,0.3)]` 
                        : ''}
                    ${isLocked 
                        ? 'bg-neutral-800/50 border-neutral-900/50 cursor-not-allowed opacity-60 grayscale' 
                        : ''}
                 `}
                 style={{
                    '--ring-color': isSolved ? themeColor : 'transparent'
                 } as React.CSSProperties}
                 >
                    {isSolved && (
                        <div className="relative">
                            <Check className="w-10 h-10" style={{ color: themeColor }} strokeWidth={4} />
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-0.5">
                                {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: themeColor }}></div>)}
                            </div>
                        </div>
                    )}
                    
                    {isCurrent && (
                      <div className="relative animate-bounce-gentle">
                         <Code className="w-10 h-10 text-white drop-shadow-md" strokeWidth={3} />
                         
                         {/* "START" Bubble */}
                         <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-black px-3 py-1.5 rounded-xl uppercase tracking-widest whitespace-nowrap shadow-xl animate-bounce z-20 border-2 border-neutral-200">
                           Start
                           <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-b-2 border-r-2 border-neutral-200"></div>
                         </div>
                      </div>
                    )}
                    
                    {isLocked && <Lock className="w-8 h-8 text-neutral-600" />}
                 </button>
                 
                 {/* Label */}
                 <div className={`mt-3 px-4 py-2 rounded-xl border transition-colors text-center max-w-[180px] backdrop-blur-sm
                    ${isCurrent ? 'bg-neutral-800/90 border-neutral-600 transform scale-105' : 'bg-neutral-900/60 border-neutral-800/60'}
                 `}>
                    <span className={`text-[10px] font-black uppercase tracking-widest block mb-0.5 ${isSolved ? 'text-green-500' : 'text-neutral-500'}`}>
                        {isSolved ? 'Solved' : isLocked ? 'Locked' : 'Current'}
                    </span>
                    <span className={`text-sm font-bold leading-tight ${isLocked ? 'text-neutral-600' : 'text-white'}`}>
                       {topicName}
                    </span>
                 </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in font-sans">
      <div className="bg-[#131f24] w-full max-w-5xl h-[90vh] rounded-[2.5rem] border-4 border-neutral-800 shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 bg-[#131f24] flex items-center justify-between shrink-0 z-20 relative">
          <div className="flex items-center gap-6">
             <button onClick={onClose} className="hover:bg-neutral-800 p-3 rounded-2xl transition-colors group border border-transparent hover:border-neutral-700">
                <X className="w-6 h-6 text-neutral-400 group-hover:text-white" />
             </button>
             <h2 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
                <div className="p-2 bg-blue-500/20 rounded-xl">
                    <Map className="w-6 h-6 text-blue-500" />
                </div>
                Interview Prep 75
             </h2>
          </div>
           {/* Stats Bar */}
           <div className="flex items-center gap-4 hidden sm:flex">
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-inner">
                  <Zap className="w-5 h-5 text-yellow-400 fill-current animate-pulse" />
                  <span className="font-bold text-yellow-400">{stats.streak} Day Streak</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-inner">
                  <Crown className="w-5 h-5 text-blue-400" />
                  <span className="font-bold text-blue-400">{stats.totalSolved} Solved</span>
              </div>
           </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-800 bg-[#131f24] shrink-0 z-20 px-6 gap-4 pt-4">
          <button 
            onClick={() => setActiveTab('path')}
            className={`flex-1 pb-4 text-sm font-extrabold tracking-widest flex items-center justify-center gap-2 border-b-4 transition-all uppercase rounded-t-lg
              ${activeTab === 'path' ? 'border-blue-500 text-blue-400 bg-gradient-to-t from-blue-900/20 to-transparent' : 'border-transparent text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/30'}
            `}
          >
            <Map className="w-4 h-4" /> Learning Path
          </button>
          <button 
            onClick={() => setActiveTab('review')}
            className={`flex-1 pb-4 text-sm font-extrabold tracking-widest flex items-center justify-center gap-2 border-b-4 transition-all uppercase rounded-t-lg
              ${activeTab === 'review' ? 'border-green-500 text-green-400 bg-gradient-to-t from-green-900/20 to-transparent' : 'border-transparent text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/30'}
            `}
          >
            <BookOpen className="w-4 h-4" /> Review Guide
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#131f24] p-6 relative">
          
          {activeTab === 'path' && (
            <div className="max-w-2xl mx-auto pt-8">
              <RoadmapPhase 
                 difficulty="Easy" 
                 themeColor="#58cc02" 
              />
              <RoadmapPhase 
                 difficulty="Medium" 
                 themeColor="#ce82ff" 
              />
              <RoadmapPhase 
                 difficulty="Hard" 
                 themeColor="#ff4b4b" 
              />
              
              <div className="text-center py-20 opacity-50 flex flex-col items-center">
                <div className="w-32 h-32 bg-neutral-800 rounded-full flex items-center justify-center mb-6 grayscale border-4 border-neutral-700 border-dashed">
                    <Trophy className="w-16 h-16 text-yellow-500" />
                </div>
                <h3 className="text-2xl font-bold text-white">Certification Pending</h3>
                <p className="text-neutral-400 mt-2">Complete all 75 questions to unlock the master trophy</p>
              </div>
            </div>
          )}

          {activeTab === 'review' && (
            <div className="grid grid-cols-1 gap-4 max-w-3xl mx-auto pt-4">
              {history.length === 0 ? (
                <div className="col-span-full text-center py-24 text-neutral-500 flex flex-col items-center">
                  <div className="bg-neutral-800/50 w-32 h-32 rounded-3xl mb-6 flex items-center justify-center -rotate-6 border-4 border-neutral-800">
                     <BookOpen className="w-16 h-16 opacity-50" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Your guidebook is empty</h3>
                  <p className="text-neutral-400 max-w-xs mx-auto">Solve puzzles in the Learning Path to fill this library with your victories!</p>
                  <button 
                    onClick={() => setActiveTab('path')}
                    className="mt-8 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-transform hover:scale-105 active:scale-95"
                  >
                    Start Learning
                  </button>
                </div>
              ) : (
                history.slice().reverse().map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-[#1f2937] rounded-2xl border-2 border-neutral-800 overflow-hidden hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-2xl transition-all duration-200 group"
                  >
                    <div 
                      onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                      className="p-6 cursor-pointer flex gap-4"
                    >
                       <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border-b-4
                          ${item.question.difficulty === 'Easy' ? 'bg-green-500/20 text-green-500 border-green-900/50' : 
                            item.question.difficulty === 'Medium' ? 'bg-purple-500/20 text-purple-500 border-purple-900/50' : 
                            'bg-red-500/20 text-red-500 border-red-900/50'
                          }
                       `}>
                          <Code className="w-8 h-8" />
                       </div>
                       
                       <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                                <span className={`text-[10px] font-black uppercase tracking-widest
                                    ${item.question.difficulty === 'Easy' ? 'text-green-500' : 
                                    item.question.difficulty === 'Medium' ? 'text-purple-500' : 
                                    'text-red-500'
                                    }
                                `}>
                                    {item.question.difficulty}
                                </span>
                                <span className="text-xs font-mono text-neutral-500">{new Date(item.dateSolved).toLocaleDateString()}</span>
                            </div>
                            <h4 className="font-bold text-xl text-white truncate group-hover:text-blue-400 transition-colors">{item.question.title}</h4>
                            <p className="text-sm text-neutral-400 truncate">{item.question.topic}</p>
                       </div>
                       
                       <div className="self-center">
                          {expandedItem === item.id ? <ChevronUp className="w-5 h-5 text-neutral-500" /> : <ChevronDown className="w-5 h-5 text-neutral-500" />}
                       </div>
                    </div>

                    {/* Expandable Section */}
                    <div className={`
                       border-t-2 border-neutral-800 bg-black/20 transition-all duration-300 overflow-hidden
                       ${expandedItem === item.id ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}
                    `}>
                       <div className="p-6 text-sm overflow-y-auto max-h-[400px]">
                          <MarkdownLite content={item.question.explanation} />
                       </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;