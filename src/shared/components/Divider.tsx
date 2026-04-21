import React from 'react';

/**
 * Visual Divider component.
 * @param {Object} props
 * @param {string} props.children - Text to display in the divider
 */
export const Divider = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center my-4 sm:my-6 typo-ritual-label-small text-ink/40 ${className}`}>
      <div className="flex-1 border-t border-divider"></div>
      <span className="px-6 whitespace-nowrap">
        {children}
      </span>
      <div className="flex-1 border-t border-divider"></div>
    </div>
  );
};
