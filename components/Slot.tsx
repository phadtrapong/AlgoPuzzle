import React from 'react';

interface SlotProps {
  id: string;
  isActive: boolean;
  filledCode: string | null;
  onClick: () => void;
  status: 'empty' | 'filled' | 'correct' | 'incorrect';
}

const Slot: React.FC<SlotProps> = ({ isActive, filledCode, onClick, status }) => {
  let baseClasses = "inline-block min-w-[60px] px-2 py-0.5 mx-1 rounded border border-dashed cursor-pointer align-middle transition-colors duration-200 font-mono text-sm select-none";
  
  // Status styling
  let colorClasses = "bg-gray-800 border-gray-500 text-gray-400 hover:bg-gray-700 hover:border-gray-400";

  if (isActive) {
    colorClasses = "bg-blue-900/50 border-blue-400 text-blue-200 ring-2 ring-blue-500/50";
  } else if (status === 'correct') {
    colorClasses = "bg-green-900/50 border-green-500 text-green-300";
  } else if (status === 'incorrect') {
    colorClasses = "bg-red-900/50 border-red-500 text-red-300 line-through decoration-red-500";
  } else if (status === 'filled') {
    colorClasses = "bg-gray-700 border-gray-300 text-white";
  }

  return (
    <span onClick={onClick} className={`${baseClasses} ${colorClasses}`}>
      {filledCode || "???"}
    </span>
  );
};

export default Slot;
