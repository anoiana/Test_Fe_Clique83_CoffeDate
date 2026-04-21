import React from 'react';
import { motion } from 'framer-motion';

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
  id?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, label, id }) => {
  return (
    <div 
      className="flex items-center gap-3 cursor-pointer group select-none"
      onClick={onChange}
    >
      <div className={`
        relative w-6 h-6 rounded-lg border-2 transition-all duration-300 flex items-center justify-center
        ${checked 
          ? 'bg-primary border-primary shadow-sm shadow-primary/20' 
          : 'bg-transparent border-divider group-hover:border-primary/40'}
      `}>
        {checked && (
          <motion.svg
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-3.5 h-3.5 text-background-paper"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </motion.svg>
        )}
      </div>
      {label && (
        <span className={`text-sm transition-colors duration-300 ${checked ? 'text-primary font-medium' : 'text-ink/60'}`}>
          {label}
        </span>
      )}
    </div>
  );
};
