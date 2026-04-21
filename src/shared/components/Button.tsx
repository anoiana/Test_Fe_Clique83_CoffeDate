import React, { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'golden' | 'glass' | 'icon-only';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children?: ReactNode;
  icon?: string;
}

export const Button = ({
  variant = 'golden',
  children,
  icon,
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyles = "flex items-center justify-center transition-all active:scale-[0.98] outline-none focus:outline-none font-sans disabled:opacity-40 disabled:pointer-events-none disabled:active:scale-100";

  const variants = {
    golden: "w-full min-h-[50px] rounded-3xl typo-ritual-btn text-background-paper bg-primary hover:brightness-95 active:scale-[0.96] shadow-burgundy box-border",
    glass: "flex min-h-[50px] w-full items-center justify-center rounded-3xl typo-ritual-btn border-2 border-primary/20 text-primary hover:bg-primary/5 transition-all active:scale-[0.96] group box-border",
    'icon-only': "size-9 sm:size-10 shrink-0 rounded-3xl border border-divider bg-background-warm hover:bg-background-warm/80 active:scale-90 text-primary shadow-paper flex items-center justify-center"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
      {icon && (
        <span className={`material-symbols-outlined ${children ? 'ml-2' : ''} text-xl`}>
          {icon}
        </span>
      )}
    </button>
  );
};
