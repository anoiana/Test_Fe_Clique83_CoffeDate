import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    MapPin, GraduationCap, Heart, Sparkles,
    Calendar, ArrowLeft, ChevronDown
} from 'lucide-react';
import { matchingApi } from '../../../matching/api/matchingApi';
import { useAsyncAction } from '../../../../shared/hooks/useAsyncAction';
import { useTranslation } from 'react-i18next';

interface IntakeReviewProps {
    onClose: () => void;
    onEdit?: () => void;
    ctaLabel?: string;
}

interface EvaluationData {
    user?: {
        fullName?: string;
    };
    gender: string;
    preferGender: string[];
    birthdate: string;
    location: string;
    education: string;
    workField: string;
    incomeRange: string;
    intentGoals: string[];
    phoneNumber?: string;
}

export const IntakeReview = ({ onClose, onEdit, ctaLabel }: IntakeReviewProps) => {
    const { t } = useTranslation();
    const [data, setData] = useState<EvaluationData | null>(null);
    const { execute } = useAsyncAction();

    useEffect(() => {
        execute(
            async () => await matchingApi.getEvaluationMe(),
            {
                loadingMessage: t('intake.review.subtitle'),
                showToastOnSuccess: false
            }
        ).then((res) => setData(res as EvaluationData)).catch((err: unknown) => console.error('Error fetching evaluation:', (err as Error).message));
    }, [execute, t]);

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '—';
        // Handle DD/MM/YYYY format specifically
        if (dateStr.includes('/')) {
            return dateStr; // It's already in the format we want to display
        }
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr || '—';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const translateValue = (category: string, value: string | string[]) => {
        if (!value) return 'N/A';
        if (Array.isArray(value)) {
            return value
                .filter(v => v !== 'opposite_gender_yes')
                .map(v => translateSingleValue(category, v))
                .join(', ');
        }
        return translateSingleValue(category, value as string);
    };

    const translateSingleValue = (category: string, val: string) => {
        if (!val) return 'N/A';
        let lowVal = val.toLowerCase().trim();
        
        // Handle specific API label mappings to internal keys
        const labelMap: Record<string, string> = {
            'serious relationship': 'serious',
            'casual dating': 'dating',
            'marriage': 'marriage',
            'bachelor\'s degree': 'bachelor',
            'master\'s degree': 'master',
            'doctorate': 'phd',
            'tech, it, software': 'tech'
        };

        if (labelMap[lowVal]) {
            lowVal = labelMap[lowVal];
        }

        const mappings: Record<string, string> = {
            gender: 'intake.gender.options',
            seeking: 'intake.target_gender.options',
            education: 'intake.education.options',
            income: 'intake.income.options',
            work: 'intake.work_field.options',
            intent: 'intake.looking_for.options'
        };

        const baseKey = mappings[category];
        if (!baseKey) return val;

        // Try direct key first
        const directKey = lowVal.replace(' school', '').replace('\'s degree', '').replace(' degree', '').replace(' ', '_').replace('-', '_');
        const translated = t(`${baseKey}.${directKey}`);
        if (translated !== `${baseKey}.${directKey}`) return translated;

        // Try fallback for income ranges like "20-40M VND" -> "20_40"
        if (category === 'income') {
            const incomeKey = lowVal.split('m')[0].replace('-', '_');
            const incTranslated = t(`${baseKey}.${incomeKey}`);
            if (incTranslated !== `${baseKey}.${incomeKey}`) return incTranslated;
        }

        return val;
    };

    if (!data) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background-paper flex flex-col overflow-hidden font-sans"
        >
            {/* Header / Logo Section */}
            <div className="flex items-center justify-between px-6 py-4 shrink-0 bg-background-paper/80 backdrop-blur-md">
                <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-ink/5 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-primary" />
                </button>
                <h1 className="text-2xl font-serif font-bold text-primary italic tracking-tight">
                    CoffeeDate
                </h1>
                <div className="w-10" />
            </div>

            <main className="flex-1 overflow-y-auto px-6 pb-32">
                {/* Profile Header */}
                <div className="pt-8 pb-10">
                    <h2 className="text-4xl font-serif font-bold text-ink leading-tight mb-2">
                        {data.user?.fullName || t('intake.review.member')}
                    </h2>
                    <p className="text-primary font-serif italic opacity-80 decoration-primary/30">
                        "{t('intake.review.quote')}"
                    </p>
                </div>

                {/* BASIC INFO SECTION */}
                <ReviewSection
                    title={t('intake.review.sections.basic')}
                    description={t('intake.review.sections.basic_desc')}
                >
                    <ReviewCard
                        label={t('intake.review.info_labels.full_name', 'HỌ VÀ TÊN')}
                        value={data.user?.fullName}
                        fullWidth
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <ReviewCard
                            label={t('intake.review.info_labels.gender', 'GIỚI TÍNH')}
                            value={translateValue('gender', data.gender)}
                            hasChevron
                        />
                        <ReviewCard
                            label={t('intake.review.info_labels.phone', 'SỐ ĐIỆN THOẠI')}
                            value={data.phoneNumber}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        <ReviewCard
                            label={t('intake.review.info_labels.birthdate')}
                            value={formatDate(data.birthdate)}
                            icon={Calendar}
                        />
                        <ReviewCard
                            label={t('intake.review.info_labels.location')}
                            value={data.location || t('common.not_specified')}
                            icon={MapPin}
                        />
                    </div>
                </ReviewSection>

                {/* CAREER & EDUCATION SECTION */}
                <ReviewSection
                    title={t('intake.review.sections.career')}
                    description={t('intake.review.sections.career_desc')}
                >
                    <ReviewCard
                        label={t('intake.review.info_labels.education')}
                        value={translateValue('education', data.education)}
                        icon={GraduationCap}
                        fullWidth
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <ReviewCard
                            label={t('intake.review.info_labels.work')}
                            value={data.workField || t('common.not_specified')}
                        />
                        <ReviewCard
                            label={t('intake.review.info_labels.income')}
                            value={translateValue('income', data.incomeRange)}
                            hasChevron
                        />
                    </div>
                </ReviewSection>

                {/* INTENTIONS SECTION */}
                <ReviewSection
                    title={t('intake.review.sections.intentions')}
                    description={t('intake.review.sections.intentions_desc')}
                >
                    <div className="bg-background-warm/60 border border-divider/40 rounded-[32px] p-6 relative overflow-hidden">
                        <div className="absolute top-[-20px] right-[-20px] opacity-[0.03] select-none pointer-events-none rotate-12">
                            <span className="text-6xl font-serif font-black break-words block max-w-[200px] leading-none">COFFEE RITUAL CLIQUE</span>
                        </div>

                        <div className="relative z-10">
                            <p className="text-[11px] font-bold text-primary/60 tracking-widest uppercase mb-4">
                                {t('intake.review.info_labels.intent_title', 'MỤC TIÊU MỐI QUAN HỆ')}
                            </p>
                            <div className="flex flex-wrap gap-2.5">
                                {Array.isArray(data.intentGoals) ?
                                    data.intentGoals
                                        .filter(v => v !== 'opposite_gender_yes')
                                        .map((v, i) => (
                                            <div 
                                                key={i} 
                                                className="px-5 py-2.5 rounded-2xl text-[14px] font-medium transition-all bg-background-paper border border-divider/60 text-ink/60 hover:border-primary/30 hover:text-primary transition-colors"
                                            >
                                                {translateSingleValue('intent', v)}
                                            </div>
                                        ))
                                    : translateValue('intent', data.intentGoals)
                                }
                            </div>
                        </div>
                    </div>
                </ReviewSection>
            </main>

            {/* Sticky Footer CTA */}
            <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background-paper via-background-paper to-transparent">
                <button
                    onClick={onClose}
                    className="w-full h-14 rounded-[28px] bg-primary text-background-paper font-bold uppercase tracking-widest text-[13px] shadow-lg shadow-primary/20 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    {ctaLabel || t('intake.review.looks_good')}
                </button>
            </div>
        </motion.div>
    );
};

const ReviewSection = ({ title, description, children }: { title: string, description: string, children: React.ReactNode }) => (
    <div className="mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="flex items-baseline gap-3 mb-6">
            <h3 className="text-2xl font-serif font-black text-ink uppercase tracking-tight">
                {title}
            </h3>
            <span className="text-[12px] text-primary font-serif italic opacity-60">
                {description}
            </span>
        </div>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

const ReviewCard = ({ label, value, icon: Icon, fullWidth, hasChevron }: { label: string, value?: string, icon?: any, fullWidth?: boolean, hasChevron?: boolean }) => (
    <div className={`
        bg-background-warm/60 border border-divider/40 rounded-[28px] p-5 flex flex-col justify-center min-h-[84px]
        ${fullWidth ? 'w-full' : ''}
    `}>
        <div className="text-[11px] font-bold text-ink/30 tracking-widest uppercase mb-1">{label}</div>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
                {Icon && <Icon className="w-4 h-4 text-primary shrink-0" />}
                <span className="text-[16px] font-medium text-ink leading-tight">
                    {value || "—"}
                </span>
            </div>
            {hasChevron && <ChevronDown className="w-4 h-4 text-ink/20 shrink-0" />}
        </div>
    </div>
);
