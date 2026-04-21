import React from 'react';
import { Banknote, Calendar, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const NextStepIcon = ({ icon: Icon, label, number, isActive = false }) => (
    <div className={`flex flex-col items-center gap-2 relative z-10 w-1/3 transition-all duration-700 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-700 bg-background-paper ${
            isActive ? 'border-primary border-2 shadow-burgundy scale-110' : 'border-divider border'
        }`}>
            <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-ink/60'}`} />
        </div>
        <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-center whitespace-nowrap mt-1 ${isActive ? 'text-primary' : 'text-ink/30'}`}>
            {number}. {label}
        </span>
    </div>
);

export const BookingProgress = ({ step = 1 }) => {
    const { t } = useTranslation();
    
    return (
        <div className="flex justify-between items-center px-2 py-8 rounded-[2rem] border border-divider bg-background-warm mb-10 relative overflow-hidden">
            <div className="absolute top-3 left-1/2 -translate-x-1/2 text-ink/20 text-[9px] uppercase tracking-[0.3em] font-bold">
                {t('shared.progress')}
            </div>
            
            {/* Connecting Lines */}
            <div className="absolute top-[52px] left-[20%] right-[20%] h-px bg-divider z-0" />
            
            <NextStepIcon icon={Banknote} label={t('shared.steps.pay_fee')} number={1} isActive={step === 1} />
            <NextStepIcon icon={Calendar} label={t('shared.steps.pick_date')} number={2} isActive={step === 2} />
            <NextStepIcon icon={MapPin} label={t('shared.steps.go')} number={3} isActive={step === 3} />
        </div>
    );
};
