import React from 'react';

interface CodeTokenProps {
  text: string;
}

// A very basic tokenizer for visual flair
const CodeToken: React.FC<CodeTokenProps> = ({ text }) => {
  // Keywords map
  const keywords = new Set([
    'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 
    'import', 'export', 'interface', 'type', 'class', 'new', 'this', 'async', 'await'
  ]);

  const types = new Set([
    'string', 'number', 'boolean', 'void', 'any', 'Map', 'Set', 'Array', 'Promise', 'Object'
  ]);

  // Split by word boundaries but keep delimiters
  const parts = text.split(/([a-zA-Z0-9_$]+)/g);

  return (
    <span>
      {parts.map((part, i) => {
        if (keywords.has(part)) {
          return <span key={i} className="text-purple-400">{part}</span>;
        }
        if (types.has(part)) {
          return <span key={i} className="text-yellow-400">{part}</span>;
        }
        if (!isNaN(Number(part)) && part.trim() !== '') {
             return <span key={i} className="text-orange-300">{part}</span>;
        }
        return <span key={i} className="text-gray-300">{part}</span>;
      })}
    </span>
  );
};

export default CodeToken;
