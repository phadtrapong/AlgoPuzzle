import React from 'react';

interface PuzzlePieceProps {
  code: string;
  isSelected: boolean;
  onClick: () => void;
  isCorrect?: boolean | null; // null = unchecked, true = correct, false = wrong
  disabled?: boolean;
}

const PuzzlePiece: React.FC<PuzzlePieceProps> = ({ code, isSelected, onClick, isCorrect, disabled }) => {
  let baseClasses = "relative group cursor-pointer transition-all duration-200 border-l-4 p-3 rounded shadow-md font-mono text-sm flex items-center";
  let colorClasses = "bg-gray-800 border-gray-600 hover:bg-gray-700 hover:border-gray-500 text-gray-300";

  if (isSelected) {
    colorClasses = "bg-blue-900/40 border-blue-500 text-blue-100";
  }
  
  if (isCorrect === true) {
    colorClasses = "bg-green-900/40 border-green-500 text-green-100";
  } else if (isCorrect === false) {
    colorClasses = "bg-red-900/40 border-red-500 text-red-100 opacity-60";
  }

  if (disabled) {
    baseClasses += " opacity-50 cursor-not-allowed";
  }

  return (
    <div 
      onClick={!disabled ? onClick : undefined} 
      className={`${baseClasses} ${colorClasses}`}
    >
      <div className="mr-3 opacity-50 group-hover:opacity-100">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
           <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
           <polyline points="14 2 14 8 20 8"></polyline>
           <line x1="16" y1="13" x2="8" y2="13"></line>
           <line x1="16" y1="17" x2="8" y2="17"></line>
           <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      </div>
      <span className="truncate">{code}</span>
      
      {/* Selection Indicator */}
      {isSelected && !isCorrect && isCorrect !== false && (
        <div className="absolute right-2 w-2 h-2 rounded-full bg-blue-500"></div>
      )}
    </div>
  );
};

export default PuzzlePiece;
