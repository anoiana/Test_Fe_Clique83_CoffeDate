import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, AlertCircle, ChevronRight, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { PageTransition } from '../shared/components/PageTransition';
import { Meeting } from '../features/match/api/meetingApi';
import { useAuthContext } from '../shared/context/AuthContext';
import { MeetingStepProgress } from '../features/match/components/MeetingStepProgress';
import { ConfirmedDateCard } from '../features/match/components/ConfirmedDateCard';
import { useMeetingStatus, useStatusGridLogic } from '../features/match/hooks/useMeetingStatus';

/**
 * MeetingStatusPage — Comprehensive view of all active/past dating journeys.
 * Refactored to leverage React Query and extracted hooks.
 */
export const MeetingStatusPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const currentUser = user?.id || user?.userId || '';

    const { meetings, isRefreshing, hasMeetings } = useMeetingStatus(currentUser);

    if (!hasMeetings && !isRefreshing) {
        return (
            <PageTransition className="bg-background-paper min-h-screen flex flex-col items-center justify-center p-6 text-center font-sans">
                <AlertCircle className="w-16 h-16 text-ink/10 mb-8" />
                <h1 className="text-ink text-xl font-bold uppercase tracking-[0.3em] opacity-40">{t('meeting_status.no_meetings')}</h1>
                <button 
                  onClick={() => navigate('/match')} 
                  className="mt-12 px-8 py-4 rounded-full border border-divider typo-caption text-primary active:scale-95 transition-all"
                >
                    {t('meeting_status.back_to_search')}
                </button>
            </PageTransition>
        );
    }

    return (
        <PageTransition className="bg-background-paper flex flex-col min-h-screen">
            <div className="flex flex-col flex-1 p-6 pb-20 font-sans relative overflow-x-hidden max-w-lg mx-auto w-full">
                
                {/* Simplified Header */}
                <header className="flex items-center justify-between mt-4 mb-2">
                    <div className="flex flex-col">
                        <span className="typo-caption-cinematic text-primary mb-1">{t('meeting_status.header')}</span>
                        <div className="h-0.5 w-12 bg-primary/40 rounded-full" />
                    </div>
                </header>

                <div className="mt-8 mb-12 text-center flex flex-col items-center px-4">
                    <h1 className="text-3xl md:text-4xl text-ink font-black tracking-tight uppercase leading-none mb-3">
                        {t('meeting_status.title')}
                    </h1>
                </div>

                {/* Vertical Scroll of Dating Journeys */}
                <div className="flex flex-col gap-8">
                    {meetings.map((meeting) => {
                        const { details } = meeting;
                        return (
                            <motion.div
                                key={meeting.id}
                                layout
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative"
                            >
                                <MeetingStepProgress currentStatus={meeting.status} />

                                <div className="relative pt-4 pb-8 overflow-hidden">
                                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[100px] opacity-10 transition-colors duration-1000 ${details.color.replace('text-', 'bg-')}`} />
                                    
                                    <div className="relative z-10 flex flex-col items-center text-center">
                                        <div className="flex flex-col items-center mb-10 w-full">
                                            <div className="relative mb-6">
                                                <div className={`absolute inset-0 blur-[24px] opacity-30 ${details.color.replace('text-', 'bg-')} scale-110`} />
                                                <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center border shadow-xl bg-background-paper/90 backdrop-blur-md relative z-10 ${details.color.replace('text-', 'border-')}`}>
                                                    <details.icon className={`w-7 h-7 ${details.color} drop-shadow-md`} />
                                                </div>
                                            </div>
                                            <h2 className="text-2xl md:text-3xl font-extralight tracking-widest uppercase text-ink mb-4">{details.label}</h2>
                                        </div>

                                        {/* Status Comparison Logic */}
                                        {(['awaiting_payment', 'awaiting_availability', 'slot_found', 'awaiting_location'].includes(meeting.status)) && (
                                            <StatusGrid meeting={meeting} currentUser={currentUser} t={t} />
                                        )}

                                        {/* Final Destination Card */}
                                        {meeting.status === 'confirmed' && meeting.agreedSlot && (
                                            <ConfirmedDateCard meeting={meeting} />
                                        )}

                                        {/* ── Phase 33: Feedback Route Trigger ── */}
                                        {meeting.status === 'completed' && (
                                            <div className="w-full mt-4 flex flex-col gap-3">
                                                <button
                                                  onClick={() => navigate(`/meeting/${meeting.id}/feedback`)}
                                                  className="w-full py-5 rounded-full bg-background-warm/80 border border-primary/30 text-primary font-bold uppercase tracking-[0.2em] text-[12px] shadow-[0_0_20px_rgba(122,46,46,0.1)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
                                                >
                                                  <Users size={16} className="group-hover:scale-110 transition-transform" />
                                                  {t('feedback.actions.submit')}
                                                </button>
                                            </div>
                                        )}

                                        {/* Dynamic Action Button */}
                                        {details.actionLabel ? (
                                                <button 
                                                    onClick={() => navigate(details.actionRoute!, { state: { meetingId: meeting.id }, replace: true })}
                                                    className="w-full py-5 rounded-full bg-primary text-black font-bold uppercase tracking-[0.2em] text-[12px] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
                                                >
                                                    <span className="relative z-10">{details.actionLabel}</span>
                                                    <ChevronRight size={16} className="relative z-10 transition-transform group-hover:translate-x-1" strokeWidth={3} />
                                                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                                                </button>
                                        ) : (
                                            (['awaiting_payment', 'awaiting_availability', 'slot_found', 'awaiting_location'].includes(meeting.status)) && (
                                                <div className="w-full py-4 sm:py-5 rounded-full bg-background-warm/60 border border-divider text-center flex flex-wrap items-center justify-center gap-2 px-4 text-ink/50">
                                                    <Clock size={14} className="text-primary animate-pulse" />
                                                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest">
                                                        {meeting.status === 'awaiting_payment' ? t('meeting_status.waiting_match_payment') :
                                                         meeting.status === 'awaiting_availability' ? t('meeting_status.waiting_match_availability') :
                                                         t('meeting_status.waiting_match_location')}
                                                    </span>
                                                </div>
                                            )
                                        )}

                                        {(meeting.status === 'expired' || meeting.status === 'completed') && (
                                            <div className="mt-4">
                                                <span className="text-xs font-black text-ink/50 uppercase tracking-[0.3em]">{t('meeting_status.meeting_closed')}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </PageTransition>
    );
};

/**
 * StatusGrid — Compares completion status between "You" and "Match".
 */
const StatusGrid = ({ meeting, currentUser, t }: { meeting: Meeting, currentUser: string, t: TFunction }) => {
    const { youDone, matchDone } = useStatusGridLogic(meeting, currentUser);

    const StatItem = ({ label, isDone }: { label: string, isDone: boolean }) => (
        <div className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-2 py-3 rounded-full transition-all duration-500 ${isDone ? 'bg-primary/10 text-primary' : 'text-ink/20'}`}>
            {isDone ? <CheckCircle2 size={16} /> : <Clock size={16} />}
            <span className="text-[11px] font-bold uppercase tracking-wider">{label}</span>
        </div>
    );

    return (
        <div className="w-full flex items-center justify-between bg-white/[0.02] border border-divider rounded-full p-2 mb-10">
            <StatItem label={t('meeting_status.you')} isDone={youDone} />
            <StatItem label={t('meeting_status.match')} isDone={matchDone} />
        </div>
    );
};

export default MeetingStatusPage;


