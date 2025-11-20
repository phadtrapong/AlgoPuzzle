import React from 'react';

interface MarkdownLiteProps {
  content: string;
}

// Helper component to render specific Markdown features without a heavy library
const MarkdownLite: React.FC<MarkdownLiteProps> = ({ content }) => {
  // Split by headers (### Title)
  // The regex captures the delimiter (### ...) so we can render it
  const parts = content.split(/(### .+)/g);

  return (
    <div className="space-y-3 text-sm">
      {parts.map((part, i) => {
        if (part.trim().startsWith('###')) {
          // Render Header
          const headerText = part.replace(/^###\s*/, '');
          return <h4 key={i} className="text-base font-bold text-green-400 mt-4 mb-1 border-b border-green-800/30 pb-1">{headerText}</h4>;
        }
        if (!part.trim()) return null;

        // Render Body Text with Bold support
        return (
          <div key={i} className="text-neutral-300 leading-relaxed whitespace-pre-wrap">
            {part.split(/(\*\*.*?\*\*)/g).map((sub, j) => {
              if (sub.startsWith('**') && sub.endsWith('**')) {
                return <strong key={j} className="text-white font-semibold">{sub.slice(2, -2)}</strong>;
              }
              return sub;
            })}
          </div>
        );
      })}
    </div>
  );
};

export default MarkdownLite;