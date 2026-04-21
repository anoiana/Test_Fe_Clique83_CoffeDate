import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, RefreshCw, X, ChevronLeft, ChevronRight, HelpCircle, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageTransition } from '../shared/components/PageTransition';
import { CalendarDOMGrid } from '../features/scheduling/components/CalendarDOMGrid';
import { useCalendarBlocks } from '../shared/hooks/useAvailabilityGrid';
import { HOURS, DAY_KEYS, COLUMN_WIDTH, TIME_COL_WIDTH, CELL_HEIGHT, formatTime } from '../features/scheduling/data/gridConfig';
import { GridSelectionState } from '../shared/types/index';
import FloatingParticles from '../shared/components/FloatingParticles';

/**
 * GridSelectionPage
 * Dedicated full-page experience for selecting availability slots.
 * Restored to premium 'Click & Drag-to-resize' logic.
 */
export const GridSelectionPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const headerScrollRef = useRef<HTMLDivElement>(null);

  // Get passed state or default
  const { initialSlots = [], meetingId } = (location.state as GridSelectionState) || {};

  // Generate 21 days
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
      return { id: dateId, dayKey: DAY_KEYS[d.getDay()], dateNum: d.getDate(), isToday: i === 0, month: d.getMonth() + 1 };
    });
  }, []);

  const {
    blocks,
    activeBlockId,
    setActiveBlockId,
    createBlock,
    updateBlockStart,
    updateBlockEnd,
    removeBlock,
    setSlots,
    getSelectedSlots,
  } = useCalendarBlocks(new Set(initialSlots));

  // When clicking outside to clear selection (if needed, container handles some)
  const handleClearAll = () => setSlots(new Set());

  // Scroll to 8 AM on load
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = 8 * CELL_HEIGHT - 40;
    }
  }, []);

  // Sync horizontal scroll logic
  const handleGridScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (headerScrollRef.current) {
        headerScrollRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  }, []);

  const handleHeaderScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (scrollRef.current) {
        scrollRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  }, []);

  const handleSave = () => {
    // Return back to AvailabilityPage with the new slots
    navigate('/availability', { 
        state: { 
            meetingId, 
            updatedSlots: Array.from(getSelectedSlots()) 
        },
        replace: true
    });
  };

  const handleCancel = () => {
    navigate('/availability', { state: { meetingId }, replace: true });
  };

  return (
    <PageTransition className="bg-background-paper h-[100dvh] w-full text-ink flex flex-col overflow-hidden" style={{ overscrollBehaviorY: 'contain' }}>
      <FloatingParticles count={20} opacity={0.2} />

      {/* Modern App-style Header */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-divider bg-background-paper/95 backdrop-blur-2xl z-50 shrink-0">
        <div className="flex items-center gap-4">
            <button onClick={handleCancel} className="w-10 h-10 flex items-center justify-center text-ink/50 bg-background-warm rounded-xl border border-divider active:scale-95 transition-all">
                <ChevronLeft size={20} />
            </button>
            <div className="flex flex-col">
                <h1 className="text-ink font-black text-lg tracking-tight leading-tight uppercase italic">Chọn lịch rảnh</h1>
                <p className="text-primary text-[8px] uppercase tracking-[0.2em] font-black mt-0.5 opacity-80">Tap to create • Drag to resize</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
             <button onClick={handleClearAll} className="w-9 h-9 flex items-center justify-center text-ink/20 hover:text-ink/40 transition-colors">
                <RefreshCw size={18} />
            </button>
            <button onClick={handleSave} className="px-6 py-2.5 rounded-xl bg-primary text-black font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary/10 active:scale-95 transition-all">
                Xong
            </button>
        </div>
      </header>

      {/* Grid Controller */}
      <div className="flex-1 flex flex-col overflow-hidden relative bg-ink/40">
        
        {/* Day Headers (Sticky) */}
        <div className="flex overflow-hidden bg-background-paper/95 border-b border-divider shadow-2xl z-40 backdrop-blur-xl shrink-0">
            <div className="flex-shrink-0 border-r border-divider flex flex-col items-center justify-center bg-white/[0.02]" style={{ width: TIME_COL_WIDTH }}>
                <CalendarIcon size={12} className="text-ink/20" />
            </div>
            <div 
                ref={headerScrollRef}
                className="flex overflow-x-auto no-scrollbar" 
                style={{ width: `calc(100% - ${TIME_COL_WIDTH}px)` }}
                onScroll={handleHeaderScroll}
            >
                {dates.map((date) => {
                    const isWeekend = date.dayKey === 'sat' || date.dayKey === 'sun';
                    return (
                        <div key={date.id} className="flex-shrink-0 flex flex-col items-center justify-center py-3 border-r border-divider transition-colors" style={{ width: COLUMN_WIDTH }}>
                            <span className={`text-[8px] font-black uppercase tracking-widest mb-1 ${
                                date.isToday ? 'text-primary' : isWeekend ? 'text-red-400/50' : 'text-ink/20'
                            }`}>
                                {t(`common.days.${date.dayKey}`).substring(0, 3)}
                            </span>
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                                date.isToday ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-ink/80'
                            }`}>
                                <span className="text-xs font-black tracking-tighter">{date.dateNum}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Scrollable Time Grid */}
        <div ref={scrollRef} onScroll={handleGridScroll} className="flex-1 overflow-auto no-scrollbar touch-pan-x touch-pan-y relative bg-gradient-to-b from-transparent to-black/40" style={{ overscrollBehaviorY: 'contain' }}>
            <div className="flex min-h-full pb-32">
                {/* Time Column with Period Labels */}
                <div className="flex flex-col sticky left-0 z-[45] bg-background-paper backdrop-blur-2xl border-r border-divider shrink-0 shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
                    {HOURS.map(hour => {
                        let periodLabel = null;
                        if (hour === 6) periodLabel = t('common.periods.morning');
                        if (hour === 12) periodLabel = t('common.periods.noon');
                        if (hour === 18) periodLabel = t('common.periods.evening');
                        
                        return (
                            <div key={hour} className="flex-shrink-0 flex flex-col items-center justify-start pt-2 relative" style={{ width: TIME_COL_WIDTH, height: CELL_HEIGHT }}>
                                {periodLabel && (
                                    <div className="absolute -left-0 top-0 bottom-0 w-[2px] bg-primary/40 rounded-full" />
                                )}
                                <span className={`text-[9px] font-black tabular-nums transition-colors ${periodLabel ? 'text-primary' : 'text-ink/20'}`}>
                                    {hour.toString().padStart(2, '0')}:00
                                </span>
                                {periodLabel && (
                                    <span className="text-[6px] font-black uppercase tracking-tighter text-primary/60 mt-0.5 leading-none">{periodLabel}</span>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="relative">
                    <CalendarDOMGrid
                        dates={dates}
                        blocks={blocks}
                        activeBlockId={activeBlockId}
                        onBlockTap={setActiveBlockId}
                        onEmptyTap={createBlock}
                        onBlockStartDrag={updateBlockStart}
                        onBlockEndDrag={updateBlockEnd}
                        onBlockRemove={removeBlock}
                        columnWidth={COLUMN_WIDTH}
                        cellHeight={CELL_HEIGHT}
                    />
                </div>
            </div>
        </div>

        {/* Enhanced Guide Overlay */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none z-50 w-full px-10">
            <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-3 px-5 py-3 bg-black/80 backdrop-blur-3xl text-ink rounded-full shadow-2xl border border-divider">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[9px] uppercase tracking-[0.2em] font-black leading-none whitespace-nowrap opacity-80">
                        {t('availability.modal.subtitle', 'Tap to create • Drag to resize')}
                    </span>
                </div>
            </div>
        </div>
      </div>
    </PageTransition>
  );
};
