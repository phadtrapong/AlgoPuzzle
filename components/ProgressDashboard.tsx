import React, { useState, useMemo } from 'react';
import { HistoryItem, Question } from '../types';
import { QUESTION_BANK } from '../services/geminiService';
import { Trophy, BookOpen, X, ChevronDown, ChevronUp, Check, Lock, Zap, Crown, Map, FileCode2, Code } from 'lucide-react';
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
      "Valid Anagram", 
      "Best Time to Buy Stock", 
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
        <h3 className="text-2xl font-extrabold tracking-tight uppercase">{title}</h3>
        <p className="opacity-90 font-medium text-sm mt-1">{description}</p>
        <div className="mt-3 inline-block bg-black/20 px-3 py-1 rounded-lg text-xs font-bold">
          {progress} / {total} COMPLETED
        </div>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
        <FileCode2 className="w-24 h-24" />
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
    const solved = history.filter(h => h.question.difficulty === difficulty);
    const solvedCount = solved.length;
    
    // Get known questions from the bank for this difficulty (for real data mapping)
    const bankQuestions = QUESTION_BANK.filter(q => q.difficulty === difficulty);
    
    const totalSteps = config.topics.length;
    const currentStep = solvedCount; // 0-based index of the next problem

    return (
      <div className="mb-12 relative">
        <PhaseHeader 
          color={themeColor} 
          title={config.title} 
          description={config.subtitle} 
          progress={solvedCount}
          total={totalSteps}
        />
        
        <div className="flex flex-col items-center space-y-6 relative py-4 pb-12">
          
          {config.topics.map((topicName, index) => {
            const isSolved = index < solvedCount;
            const isCurrent = index === currentStep;
            const isLocked = index > currentStep;
            
            // Use the bank title if we have it (so it matches the actual game data), otherwise use the topic name
            const questionData = bankQuestions[index];
            const displayTitle = questionData ? questionData.title : topicName;

            // Winding path effect using translation
            // Zig-zag pattern: 0 -> 0, 1 -> -40, 2 -> 0, 3 -> 40
            const xOffset = index % 4 === 1 ? -40 : index % 4 === 3 ? 40 : 0;
            
            return (
              <div 
                key={index} 
                className="relative group z-10 flex flex-col items-center"
                style={{ transform: `translateX(${xOffset}px)` }}
              >
                 {/* Connector Line */}
                 {index < totalSteps - 1 && (
                   <div 
                      className="absolute top-10 left-1/2 w-2 h-24 -ml-1 -z-10"
                      style={{ 
                        height: '90px',
                        background: isSolved ? themeColor : '#262626',
                      }}
                   ></div>
                 )}

                 {/* Node Circle */}
                 <div 
                 onClick={() => {
                    if (!isLocked && questionData) {
                        onSelectQuestion(questionData);
                    }
                 }}
                 className={`
                    w-20 h-20 rounded-full flex items-center justify-center border-b-4 transition-all duration-300
                    ${isSolved ? 'bg-neutral-800 border-neutral-950 cursor-pointer ring-4' : ''}
                    ${isCurrent ? `${themeColor} border-black/20 cursor-pointer active:border-b-0 active:translate-y-1 shadow-[0_0_30px_rgba(255,255,255,0.15)] scale-110` : ''}
                    ${isLocked ? 'bg-neutral-800 border-neutral-900 cursor-not-allowed opacity-80' : ''}
                 `}
                 style={{
                    // Dynamic ring color for solved items
                    '--tw-ring-color': isSolved ? themeColor : 'transparent'
                 } as React.CSSProperties}
                 >
                    {isSolved && <Check className="w-10 h-10" style={{ color: themeColor }} strokeWidth={4} />}
                    {isCurrent && (
                      <div className="relative">
                         <Code className="w-10 h-10 text-white animate-pulse" strokeWidth={3} />
                         {/* "START" Bubble */}
                         <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white text-black text-sm font-extrabold px-4 py-2 rounded-xl whitespace-nowrap shadow-xl animate-bounce z-20 border-2 border-neutral-200">
                           START
                           <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-b-2 border-r-2 border-neutral-200"></div>
                         </div>
                      </div>
                    )}
                    {isLocked && <Lock className="w-8 h-8 text-neutral-600" />}
                 </div>
                 
                 {/* Label */}
                 <div className={`mt-3 px-4 py-2 rounded-xl border transition-colors text-center max-w-[160px]
                    ${isCurrent ? 'bg-neutral-800 border-neutral-600' : 'bg-neutral-900/80 border-neutral-800'}
                 `}>
                    <span className={`text-xs font-bold uppercase tracking-wider block mb-1 ${isSolved ? 'text-green-500' : 'text-neutral-500'}`}>
                        {isSolved ? 'Completed' : isLocked ? 'Locked' : 'Next Challenge'}
                    </span>
                    <span className={`text-sm font-bold leading-tight ${isLocked ? 'text-neutral-600' : 'text-white'}`}>
                       {displayTitle}
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-[#131f24] w-full max-w-4xl h-[90vh] rounded-3xl border-2 border-neutral-800 shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 bg-[#131f24] flex items-center justify-between shrink-0 z-20 relative">
          <div className="flex items-center gap-6">
             <button onClick={onClose} className="hover:bg-neutral-800 p-2 rounded-full transition-colors">
                <X className="w-6 h-6 text-neutral-400 hover:text-white" />
             </button>
             <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Map className="w-5 h-5 text-blue-500" />
                Interview Prep 75
             </h2>
          </div>
           {/* Stats Bar */}
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-neutral-900 border border-neutral-800">
                  <Zap className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-bold text-yellow-400">{stats.streak} Day Streak</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-neutral-900 border border-neutral-800">
                  <Crown className="w-5 h-5 text-blue-400" />
                  <span className="font-bold text-blue-400">{stats.totalSolved} Solved</span>
              </div>
           </div>
        </div>

        {/* Tabs (Sticky-ish) */}
        <div className="flex border-b border-neutral-800 bg-[#131f24] shrink-0 z-20">
          <button 
            onClick={() => setActiveTab('path')}
            className={`flex-1 py-4 text-sm font-extrabold tracking-widest flex items-center justify-center gap-2 border-b-4 transition-all uppercase
              ${activeTab === 'path' ? 'border-blue-500 text-blue-400 bg-blue-900/10' : 'border-transparent text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/30'}
            `}
          >
            Learning Path
          </button>
          <button 
            onClick={() => setActiveTab('review')}
            className={`flex-1 py-4 text-sm font-extrabold tracking-widest flex items-center justify-center gap-2 border-b-4 transition-all uppercase
              ${activeTab === 'review' ? 'border-green-500 text-green-400 bg-green-900/10' : 'border-transparent text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/30'}
            `}
          >
            Review Guide
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#131f24] p-6 relative">
          
          {activeTab === 'path' && (
            <div className="max-w-lg mx-auto">
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
              
              <div className="text-center py-16 opacity-50">
                <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4 grayscale" />
                <h3 className="text-xl font-bold text-white">Certification Pending</h3>
                <p className="text-sm text-neutral-400">Complete all phases to unlock</p>
              </div>
            </div>
          )}

          {activeTab === 'review' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {history.length === 0 ? (
                <div className="col-span-full text-center py-20 text-neutral-500">
                  <div className="bg-neutral-800 w-24 h-24 rounded-3xl mx-auto mb-4 flex items-center justify-center rotate-12">
                     <BookOpen className="w-12 h-12 opacity-50" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Your guidebook is empty</h3>
                  <p>Solve puzzles in the Learning Path to fill this library with solutions!</p>
                </div>
              ) : (
                history.slice().reverse().map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-[#1f2937] rounded-2xl border-2 border-neutral-800 overflow-hidden hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-xl transition-all duration-200 group"
                  >
                    <div 
                      onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                      className="p-5 cursor-pointer"
                    >
                       <div className="flex justify-between items-start mb-3">
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border-b-2 
                             ${item.question.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400 border-green-500/50' : 
                               item.question.difficulty === 'Medium' ? 'bg-purple-500/20 text-purple-400 border-purple-500/50' : 
                               'bg-red-500/20 text-red-400 border-red-500/50'
                             }`}>
                             {item.question.difficulty}
                          </span>
                          <span className="text-xs font-mono text-neutral-500">{new Date(item.dateSolved).toLocaleDateString()}</span>
                       </div>
                       
                       <h4 className="font-bold text-lg text-white mb-1 group-hover:text-blue-400 transition-colors">{item.question.title}</h4>
                       <p className="text-sm text-neutral-400">{item.question.topic}</p>
                    </div>

                    {/* Expandable Section */}
                    <div className={`
                       border-t-2 border-neutral-800 bg-neutral-900/50 transition-all duration-300 overflow-hidden
                       ${expandedItem === item.id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
                    `}>
                       <div className="p-5 text-sm overflow-y-auto max-h-[400px]">
                          <MarkdownLite content={item.question.explanation} />
                       </div>
                    </div>
                    
                    {/* Expand Button Strip */}
                    <button 
                       onClick={(e) => {
                         e.stopPropagation();
                         setExpandedItem(expandedItem === item.id ? null : item.id);
                       }}
                       className="w-full py-2 bg-neutral-800/50 hover:bg-neutral-800 flex items-center justify-center text-neutral-500 group-hover:text-white transition-colors"
                    >
                       {expandedItem === item.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
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