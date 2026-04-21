import React, { useState, InputHTMLAttributes, ReactNode, forwardRef } from 'react';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  icon?: string;
  prefix?: ReactNode;
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  icon,
  prefix,
  error,
  className = '',
  type = 'text',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === 'password';
  const inputType = isPasswordField ? (showPassword ? 'text' : 'password') : type;

  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <div className={`group relative ${className}`}>
      {label && (
        <label className={`block typo-ritual-label-small mb-1.5 sm:mb-3 ml-1 ${error ? 'text-red-500' : 'text-ink/40'}`}>
          {label}
        </label>
      )}
      <div className={`relative flex items-stretch min-h-[50px] border rounded-3xl overflow-hidden transition-all ${
        error 
          ? 'bg-red-500/5 border-red-500/40 ring-1 ring-red-500/20' 
          : 'bg-background-warm border-divider focus-within:ring-1 focus-within:ring-primary/40 focus-within:border-primary/40'
      }`}>
        {prefix && (
          <div className="flex items-center pl-4 z-10">
            {prefix}
            <div className={`w-[1px] h-5 mx-3 ${error ? 'bg-red-500/20' : 'bg-divider'}`} />
          </div>
        )}
        <div className="relative flex-1">
          <input
            ref={ref}
            type={inputType}
            className="w-full h-full bg-transparent border-none px-4 pr-14 text-sm text-ink placeholder:text-ink/30 focus:outline-none font-sans"
            {...props}
          />

          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {isPasswordField ? (
              <button
                type="button"
                onClick={togglePassword}
                className={`${error ? 'text-red-500/40' : 'text-ink/30'} hover:text-primary transition-colors focus:outline-none`}
              >
                <span className="material-symbols-outlined text-xl">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            ) : (
              icon && <span className={`material-symbols-outlined ${error ? 'text-red-500/40' : 'text-ink/30'}`}>{icon}</span>
            )}
            {error && <span className="material-symbols-outlined text-red-500 text-lg">error</span>}
          </div>
        </div>
      </div>
    </div>
  );
});

Input.displayName = 'Input';
