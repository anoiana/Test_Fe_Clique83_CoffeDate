import React from 'react';


interface OptionButtonProps {
    label: string;
    selected: boolean;
    index?: number;
    icon?: string;
    onClick: () => void;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

/**
 * OptionButton — Following "The Ritual" Guide
 * Normal: Paper Warm background, Ink text (70% opacity), Numbers at start.
 * Active: Burgundy background, Paper text, ChevronRight.
 */
export const OptionButton: React.FC<OptionButtonProps> = ({
    label,
    selected,
    index,
    icon,
    onClick,
    className = '',
    size = 'md'
}) => {
    // Format index to 01., 02.
    const formattedIndex = index !== undefined ? `${String(index + 1).padStart(2, '0')}.` : null;

    const sizeClasses = {
        sm: 'py-2 px-4 !w-auto min-h-[36px] text-[11px]',
        md: 'py-3 px-4 min-h-[50px] w-full',
        lg: 'p-5 w-full'
    };

    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                group flex items-center justify-between
                transition-all duration-500 ease-out
                rounded-3xl border
                ${sizeClasses[size]}
                ${selected
                    ? 'bg-primary border-primary shadow-burgundy scale-[1.02]'
                    : 'bg-background-warm border-divider hover:border-kraft/50'
                }
                ${className}
            `}
        >
            <div className="flex items-center gap-3 flex-1">
                {/* Number or Icon */}
                {formattedIndex ? (
                    <span className={`
                        typo-ritual-mono transition-colors duration-300
                        ${selected ? 'text-background-paper/60' : 'text-ink/40'}
                        ${size === 'sm' ? 'text-xs' : 'text-sm'}
                    `}>
                        {formattedIndex}
                    </span>
                ) : icon && (
                    <span className={`
                        material-symbols-outlined transition-colors duration-300
                        ${selected ? 'text-background-paper' : 'text-ink/40'}
                        ${size === 'sm' ? 'text-xl' : 'text-2xl'}
                    `}>
                        {icon}
                    </span>
                )}

                <span className={`
                    text-left transition-colors duration-300 whitespace-normal leading-snug py-1 flex-1
                    ${size === 'sm' ? 'text-[10px] uppercase tracking-wider font-bold' : 'text-[12px] sm:text-sm font-medium'}
                    ${selected ? 'text-background-paper' : 'text-ink/70'}
                `}>
                    {label}
                </span>
            </div>


        </button>
    );
};

