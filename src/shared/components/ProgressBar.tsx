import React from 'react';

/**
 * ProgressBar Component
 * A cinematic progress bar following the Golden/Dark theme.
 * 
 * @param {Object} props
 * @param {number} props.progress - Value from 0 to 100
 * @param {string} [props.className]
 */
export const ProgressBar = ({ progress, className = "" }) => {
  return (
    <div className={`w-full h-[6px] bg-divider/20 rounded-full overflow-hidden ${className}`}>
      <div 
        className="h-full bg-primary transition-all duration-700 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
