// src/components/CollapsibleSection.js

import React, { useState } from 'react';

function CollapsibleSection({ title, children }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Header */}
      <button 
        type="button" // Added this line
        onClick={toggleExpansion} 
        className="w-full flex justify-between items-center p-4 bg-gray-100 hover:bg-gray-200 transition-colors"
      >
        <span className="text-lg font-semibold text-gray-700">{title}</span>
        <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  );
}

export default CollapsibleSection;