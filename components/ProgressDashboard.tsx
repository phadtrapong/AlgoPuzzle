import React, { useState, useMemo } from 'react';
import { HistoryItem } from '../types';
import { Trophy, Target, BookOpen, X, ChevronDown, ChevronUp, Calendar, CheckCircle2, Map, Lock, Star } from 'lucide-react';
import MarkdownLite from './MarkdownLite';

interface ProgressDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
}

const GOALS = {
  Easy: 15,
  Medium: 25,
  Hard: 10
};

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ isOpen, onClose, history }) => {
  const [activeTab, setActiveTab] = useState<'path' | 'review'>('path');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // Calculate Stats
  const stats = useMemo(() => {
    const counts = { Easy: 0, Medium: 0, Hard: 0 };
    const topics: Record<string, number> = {};

    history.forEach(item => {
      // Difficulty Count
      if (counts[item.question.difficulty] !== undefined) {
        counts[item.question.difficulty]++;
      }
      // Topic Count
      const topic = item.question.topic || 'General';
      topics[topic] = (topics[topic] || 0) + 1;
    });

    const totalSolved = history.length;
    const totalGoal = GOALS.Easy + GOALS.Medium + GOALS.Hard;
    const overallProgress = Math.min(100, Math.round((totalSolved / totalGoal) * 100));

    return { counts, topics, totalSolved, overallProgress };
  }, [history]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-neutral-900 w-full max-w-5xl h-[90vh] rounded-2xl border border-neutral-800 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-900">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-600/20 rounded-lg">
              <Trophy className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Interview Prep Hub</h2>
              <p className="text-xs text-neutral-400">Track your journey to Google</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-800 rounded-full transition-colors text-neutral-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-800 bg-neutral-900/50">
          <button 
            onClick={() => setActiveTab('path')}
            className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'path' ? 'border-blue-500 text-blue-400 bg-blue-900/10' : 'border-transparent text-neutral-400 hover:text-neutral-200'}`}
          >
            <Target className="w-4 h-4" /> Learning Path
          </button>
          <button 
            onClick={() => setActiveTab('review')}
            className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'review' ? 'border-green-500 text-green-400 bg-green-900/10' : 'border-transparent text-neutral-400 hover:text-neutral-200'}`}
          >
            <BookOpen className="w-4 h-4" /> Review Notes
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-neutral-950 p-6">
          
          {activeTab === 'path' && (
            <div className="space-y-8">
              {/* Overall Progress */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-neutral-900 rounded-xl p-6 border border-neutral-800">
                  <div className="flex justify-between items-end mb-2">
                    <h3 className="text-lg font-semibold text-white">Google Readiness</h3>
                    <span className="text-3xl font-bold text-blue-500">{stats.overallProgress}%</span>
                  </div>
                  <div className="w-full bg-neutral-800 rounded-full h-4 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(37,99,235,0.5)]" 
                      style={{ width: `${stats.overallProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-neutral-500 mt-2">
                    {stats.totalSolved} solved out of {GOALS.Easy + GOALS.Medium + GOALS.Hard} recommended core problems.
                  </p>
                  
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    {(['Easy', 'Medium', 'Hard'] as const).map(diff => {
                        const current = stats.counts[diff];
                        const goal = GOALS[diff];
                        const color = diff === 'Easy' ? 'green' : diff === 'Medium' ? 'yellow' : 'red';
                        return (
                            <div key={diff} className="text-center">
                                <div className={`text-xs uppercase font-bold text-${color}-500 mb-1`}>{diff}</div>
                                <div className="text-xl font-mono text-white">{current}/{goal}</div>
                            </div>
                        )
                    })}
                  </div>
                </div>

                {/* Topic Cloud */}
                <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
                   <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" /> Mastery Areas
                   </h3>
                   <div className="flex flex-wrap gap-2">
                     {Object.entries(stats.topics).length === 0 && (
                       <p className="text-neutral-500 text-sm italic">Solve questions to unlock topics.</p>
                     )}
                     {Object.entries(stats.topics).map(([topic, count]) => (
                       <span key={topic} className="px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs flex items-center gap-2">
                         {topic}
                         <span className="bg-neutral-700 px-1.5 py-0.5 rounded-full text-[10px] text-white">{count}</span>
                       </span>
                     ))}
                   </div>
                </div>
              </div>

              {/* Detailed Roadmap */}
              <div>
                 <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Map className="w-5 h-5 text-blue-500" /> 
                    Your Quest Log
                 </h3>
                 <div className="space-y-6">
                    {(['Easy', 'Medium', 'Hard'] as const).map(diff => {
                       const solved = history.filter(h => h.question.difficulty === diff);
                       const total = GOALS[diff];
                       const colorClass = diff === 'Easy' ? 'border-l-green-500' : diff === 'Medium' ? 'border-l-yellow-500' : 'border-l-red-500';
                       const textClass = diff === 'Easy' ? 'text-green-500' : diff === 'Medium' ? 'text-yellow-500' : 'text-red-500';

                       return (
                         <div key={diff} className={`bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden`}>
                            <div className={`px-4 py-3 border-b border-neutral-800 bg-neutral-900 flex justify-between items-center border-l-4 ${colorClass}`}>
                                <h4 className="font-bold text-neutral-200">{diff} Track</h4>
                                <span className="text-xs text-neutral-500">{solved.length} of {total} Completed</span>
                            </div>
                            
                            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {/* Render Solved Items */}
                                {solved.map((item) => (
                                    <div key={item.id} className="flex flex-col p-3 rounded-lg bg-neutral-900 border border-neutral-800/80 shadow-sm group hover:border-neutral-700 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <CheckCircle2 className={`w-5 h-5 ${textClass}`} />
                                            <span className="text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-400 truncate max-w-[80px]">{item.question.topic || 'Algo'}</span>
                                        </div>
                                        <div className="text-sm font-medium text-neutral-200 truncate" title={item.question.title}>{item.question.title}</div>
                                        <div className="text-xs text-neutral-500 mt-1">Solved {new Date(item.dateSolved).toLocaleDateString()}</div>
                                    </div>
                                ))}
                                
                                {/* Render Next Available Slot */}
                                {solved.length < total && (
                                    <div className="flex flex-col p-3 rounded-lg bg-blue-900/10 border border-blue-900/30 border-dashed relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-1">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                                        </div>
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="w-5 h-5 rounded-full border-2 border-blue-500/50 flex items-center justify-center">
                                                 <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                            </div>
                                        </div>
                                        <div className="text-sm font-medium text-blue-200">Next Challenge</div>
                                        <div className="text-xs text-blue-400/60 mt-1">Ready to start</div>
                                    </div>
                                )}

                                {/* Render Locked Slots (limit to show context but not overwhelm) */}
                                {Array.from({ length: Math.min(total - solved.length - 1, 7) }).map((_, idx) => (
                                     <div key={idx} className="flex flex-col p-3 rounded-lg bg-neutral-900/20 border border-neutral-800/30 opacity-50">
                                        <div className="flex justify-between items-start mb-2">
                                            <Lock className="w-4 h-4 text-neutral-700" />
                                        </div>
                                        <div className="h-4 w-20 bg-neutral-800 rounded mb-1"></div>
                                        <div className="h-2 w-12 bg-neutral-800 rounded"></div>
                                    </div>
                                ))}
                                
                                {total - solved.length - 1 > 7 && (
                                    <div className="flex items-center justify-center p-3 rounded-lg text-xs text-neutral-600 italic bg-neutral-900/10 border border-neutral-800/20">
                                        +{total - solved.length - 8} more
                                    </div>
                                )}
                            </div>
                         </div>
                       )
                    })}
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'review' && (
            <div className="space-y-4">
              {history.length === 0 ? (
                <div className="text-center py-12 text-neutral-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No review notes yet.</p>
                  <p className="text-sm">Complete puzzles to build your personal knowledge base.</p>
                </div>
              ) : (
                history.slice().reverse().map((item) => (
                  <div key={item.id} className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden transition-colors hover:border-neutral-700">
                    <div 
                      onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                      className="p-4 flex items-center justify-between cursor-pointer bg-neutral-900 hover:bg-neutral-800/50"
                    >
                      <div className="flex items-center gap-4">
                         <div className={`w-2 h-2 rounded-full ${
                           item.question.difficulty === 'Easy' ? 'bg-green-500' : 
                           item.question.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                         }`}></div>
                         <div>
                           <h4 className="font-semibold text-neutral-200">{item.question.title}</h4>
                           <div className="flex items-center gap-3 text-xs text-neutral-500 mt-0.5">
                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(item.dateSolved).toLocaleDateString()}</span>
                              <span>•</span>
                              <span>{item.question.topic}</span>
                           </div>
                         </div>
                      </div>
                      {expandedItem === item.id ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                    </div>
                    
                    {expandedItem === item.id && (
                      <div className="border-t border-neutral-800 bg-neutral-950/50 p-6 animate-fade-in">
                         <div className="mb-6">
                           <h5 className="text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-2">Problem Description</h5>
                           <p className="text-sm text-neutral-300 leading-relaxed">{item.question.description}</p>
                         </div>
                         <div>
                           <h5 className="text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-2">Solution Notes</h5>
                           <div className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800">
                              <MarkdownLite content={item.question.explanation} />
                           </div>
                         </div>
                      </div>
                    )}
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