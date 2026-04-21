import React, { useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar as CalendarIcon, Clock, Trash2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageTransition } from '../shared/components/PageTransition';
import { useAvailabilityDrag } from '../shared/hooks/useAvailabilityGrid';
import { DAY_KEYS } from '../features/scheduling/data/gridConfig';
import { meetingApi } from '../features/match/api/meetingApi';
import { useLoading } from '../shared/context/LoadingContext';
import { useNotification } from '../shared/context/NotificationContext';
import { groupSelectedSlots, buildAvailabilityPayload, UseAvailabilityGridResult } from '../shared/hooks/useAvailabilityGrid';
import { GroupedSlot } from '../shared/types/models';

import FloatingParticles from '../shared/components/FloatingParticles';

/**
 * AvailabilityPage
 * Refactored to leverage centralized utilities for data transformation.
 */
export const AvailabilityPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { showLoader, hideLoader } = useLoading();
  const { showSuccess, showError } = useNotification();
  const meetingId = location.state?.meetingId;

  // Generate the next 21 days
  const dates = useMemo(() => {
    const today = new Date();
    const baseDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return Array.from({ length: 21 }, (_, i) => {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateId = `${year}-${month}-${day}`;
      return { id: dateId, dayKey: DAY_KEYS[d.getDay()], dateNum: d.getDate(), isToday: i === 0 };
    });
  }, []);

  const {
    selectedSlots,
    isDragging,
    removeRange,
    setSelectedSlots,
  } = useAvailabilityDrag(dates.length) as UseAvailabilityGridResult;

  useEffect(() => {
    if (location.state?.updatedSlots) {
       const incoming = new Set(location.state.updatedSlots);
       setSelectedSlots(incoming as Set<string>);
    }
  }, [location.state, setSelectedSlots]);

  const lastGroupedRef = useRef<GroupedSlot[]>([]);

  const groupedAvailability = useMemo(() => {
    if (isDragging) return lastGroupedRef.current;
    const grouped = groupSelectedSlots(selectedSlots, dates, t, i18n.language);
    lastGroupedRef.current = grouped;
    return grouped;
  }, [selectedSlots, dates, isDragging, t, i18n.language]);

  const handleSubmit = async () => {
    if (!meetingId) {
      showError(t('availability.errors.no_meeting'));
      return;
    }

    try {
      showLoader(t('availability.submitting'));
      const apiSlots = buildAvailabilityPayload(selectedSlots);
      await meetingApi.submitAvailability(meetingId, apiSlots);
      showSuccess(t('availability.success'));
      navigate('/scheduling-success', { state: { meetingId, type: 'scheduling' } });
    } catch (err: unknown) {
      console.error('AVAILABILITY_SUBMIT_ERROR:', err);
      showError(err instanceof Error ? err.message : t('availability.errors.submit_failed'));
    } finally {
      hideLoader();
    }
  };

  return (
    <PageTransition className="bg-background-paper min-h-screen text-ink relative flex flex-col">
      <FloatingParticles count={40} opacity={0.4} />

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[140px]" />
      </div>

      <div className="flex flex-col flex-1 relative max-w-lg mx-auto w-full p-6 z-10 overflow-hidden">
        <div className="mt-4 mb-10 text-center flex flex-col items-center shrink-0">
          <motion.h1 className="text-2xl md:text-3xl text-ink font-extralight tracking-widest uppercase leading-tight">
            {t('availability.title')}
          </motion.h1>
          <motion.h2 className="text-primary text-[10px] md:text-xs tracking-[0.3em] font-bold mt-4 uppercase drop-shadow-sm px-4 text-center">
            {t('availability.subtitle')}
          </motion.h2>
        </div>

        <section className="mt-2 flex-1 overflow-y-auto no-scrollbar pb-40 pr-1">
          {groupedAvailability.length > 0 && (
            <div className="flex justify-between items-center mb-8 px-2 overflow-x-auto no-scrollbar py-2 shrink-0">
              {dates.slice(0, 7).map((d) => {
                const hasSlots = groupedAvailability.some(g => g.dateStr === d.id);
                return (
                  <div key={d.id} className="flex flex-col items-center gap-2 shrink-0 px-2 transition-transform hover:scale-105">
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${d.isToday ? 'text-primary' : 'text-ink/20'}`}>
                      {t(`common.days.${d.dayKey}`).substring(0, 3)}
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-500 ${
                      hasSlots 
                        ? 'bg-primary border-primary shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
                        : 'bg-background-warm/60 border-divider'
                    }`}>
                      <span className={`text-xs font-bold ${hasSlots ? 'text-black' : 'text-ink/40'}`}>{d.dateNum}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="pr-1">
            {groupedAvailability.length > 0 ? (
              <div className="space-y-8">
                {Array.from(new Set(groupedAvailability.map(g => g.dateStr))).sort().map(dateStr => {
                  const daySlots = groupedAvailability.filter(g => g.dateStr === dateStr);
                  const d = dates.find(date => date.id === dateStr);
                  return (
                    <div key={dateStr} className="flex flex-col gap-4">
                      <div className="flex items-center gap-3 px-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80">
                          {d ? `${t(`common.days.${d.dayKey}`)} ${i18n.language.startsWith('vi') ? 'ngày ' : ''}${d.dateNum}` : dateStr}
                        </span>
                        <div className="flex-1 h-px bg-background-warm" />
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3">
                        {daySlots.map((group) => (
                          <motion.div
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={group.id}
                            className="p-5 rounded-[2rem] bg-gradient-to-br from-white/[0.04] to-transparent border border-divider flex items-center justify-between group shadow-xl"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/10 shadow-inner">
                                <Clock className="w-5 h-5 text-primary" />
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <span className="text-ink font-bold text-sm tracking-tight">{group.timeRange}</span>
                                <span className="text-ink/20 text-[9px] font-black uppercase tracking-widest">
                                  {t('availability.confirmed_window')}
                                </span>
                              </div>
                            </div>
                            <button 
                              onClick={() => removeRange(group)} 
                              className="w-10 h-10 flex items-center justify-center text-ink/10 hover:text-red-400 hover:bg-red-400/10 rounded-xl active:scale-90 border border-divider transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10" />
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-[2.5rem] border border-divider bg-white/[0.02] backdrop-blur-md flex items-center justify-center mb-10 relative group">
                    <div className="absolute inset-0 bg-primary/10 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CalendarIcon className="w-10 h-10 text-ink/20" />
                    <Plus className="absolute -bottom-2 -right-2 w-8 h-8 text-primary bg-background-paper border border-divider rounded-full p-1.5 shadow-xl" />
                  </div>
                  <div className="flex flex-col items-center gap-4 text-center px-10">
                    <h3 className="text-sm font-black uppercase tracking-[0.4em] text-ink/40">{t('availability.no_slots')}</h3>
                    <p className="text-[13px] text-ink/20 font-light leading-relaxed max-w-[260px]">{t('availability.no_slots_desc')}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg p-8 pt-10 bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent z-30 backdrop-blur-[4px]">
        <div className="flex flex-col gap-3">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/availability/selection', { state: { meetingId, initialSlots: Array.from(selectedSlots) } })}
            className="w-full py-5 rounded-2xl bg-ink/[0.04] border border-divider text-primary font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-white/[0.08] transition-all flex items-center justify-center gap-3 backdrop-blur-sm shadow-xl"
          >
            <Plus className="w-4 h-4" /> {t('availability.add_availability')}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            disabled={selectedSlots.size === 0}
            onClick={handleSubmit}
            className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.4em] text-[11px] shadow-2xl transition-all duration-500 ${selectedSlots.size > 0 ? 'bg-primary text-black shadow-primary/20' : 'bg-background-warm text-ink/10'}`}
          >
            {t('availability.confirm_schedule')}
          </motion.button>
        </div>
      </div>
    </PageTransition>
  );
};

