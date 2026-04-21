import { useState, useCallback, useRef, useMemo } from 'react';
import { AvailabilityDate, GroupedSlot } from '../types/models';
import { formatTime } from '../../features/scheduling/data/gridConfig';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

// ─── Constants ───────────────────────────────────────────────────────────────
const SNAP_STEP = 0.25; // 15-minute grid snap

// ─── Grid Date Generation ────────────────────────────────────────────────────
export const generateGridDates = (days = 21): AvailabilityDate[] => {
  const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const today = new Date();
  const baseDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateId = `${year}-${month}-${day}`;
    return { id: dateId, dayKey: DAY_KEYS[d.getDay()], dateNum: d.getDate(), isToday: i === 0 };
  });
};

// ─── Slot ↔ Block Converters ────────────────────────────────────────────────
export interface TimeBlock {
  id: string;
  dateStr: string;
  startHour: number;
  endHour: number;
}

let _counter = 0;
const genId = () => `blk-${++_counter}-${Date.now()}`;
const snap = (v: number) => Math.round(v / SNAP_STEP) * SNAP_STEP;
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export const convertSlotsToBlocks = (slotsSet: Set<string>): TimeBlock[] => {
  const dateBlocks: Record<string, number[]> = {};
  slotsSet.forEach(slot => {
    const parts = slot.split('-');
    const h = parseFloat(parts.pop() || '0');
    const dateId = parts.join('-');
    if (!dateBlocks[dateId]) dateBlocks[dateId] = [];
    dateBlocks[dateId].push(h);
  });
  const blocks: TimeBlock[] = [];
  Object.entries(dateBlocks).forEach(([dateId, hours]) => {
    hours.sort((a, b) => a - b);
    if (hours.length === 0) return;
    let startH = hours[0];
    for (let i = 0; i < hours.length; i++) {
      const current = hours[i];
      if (i === hours.length - 1 || hours[i + 1] !== current + 0.25) {
        blocks.push({ id: `${dateId}-${startH}-${current + 0.25}`, dateStr: dateId, startHour: startH, endHour: current + 0.25 });
        startH = hours[i + 1];
      }
    }
  });
  return blocks;
};

export const convertBlocksToSlots = (blocks: TimeBlock[]): Set<string> => {
  const s = new Set<string>();
  blocks.forEach(b => { for (let h = b.startHour; h < b.endHour; h += 0.25) { s.add(`${b.dateStr}-${Math.round(h * 100) / 100}`); } });
  return s;
};

// ─── Grouped Slots ────────────────────────────────────────────────────────────
export const groupSelectedSlots = (selectedSlots: Set<string>, dates: AvailabilityDate[], t: TFunction, language: string): GroupedSlot[] => {
  const result: GroupedSlot[] = [];
  const sortedSlots = (Array.from(selectedSlots) as string[]).sort();
  const dateGroups: Record<string, number[]> = {};
  sortedSlots.forEach(slot => {
    const parts = slot.split('-');
    const hour = parts.pop()!;
    const date = parts.join('-');
    if (!dateGroups[date]) dateGroups[date] = [];
    dateGroups[date].push(parseFloat(hour));
  });
  Object.keys(dateGroups).sort().forEach(date => {
    const hours = dateGroups[date].sort((a, b) => a - b);
    if (hours.length === 0) return;
    let start = hours[0];
    for (let i = 0; i < hours.length; i++) {
      const current = hours[i];
      if (i === hours.length - 1 || hours[i + 1] !== current + 0.25) {
        const end = current + 0.25;
        const d = dates.find(d => d.id === date);
        result.push({ id: `g-${date}-${start}-${end}`, dateStr: date, display: d ? `${t(`common.days.${d.dayKey}`)} ${t('matching.round2.common.day_prefix')}${d.dateNum}` : date, timeRange: `${formatTime(start)} - ${formatTime(end)}`, startHour: start, endHour: end });
        start = hours[i + 1];
      }
    }
  });
  return result;
};

export const buildAvailabilityPayload = (selectedSlots: Set<string>) => {
  const slotsByDay: Record<string, string[]> = {};
  const sortedSlots = (Array.from(selectedSlots) as string[]).sort();
  const dayHours: Record<string, number[]> = {};
  sortedSlots.forEach(slot => {
    const parts = slot.split('-');
    const hourStr = parts.pop()!;
    const date = parts.join('-');
    if (!dayHours[date]) dayHours[date] = [];
    dayHours[date].push(parseFloat(hourStr));
  });
  Object.keys(dayHours).sort().forEach(date => {
    const hours = dayHours[date].sort((a, b) => a - b);
    const ranges: string[] = [];
    let start = hours[0];
    for (let i = 0; i < hours.length; i++) {
      const current = hours[i];
      if (i === hours.length - 1 || hours[i + 1] !== current + 0.25) {
        const end = current + 0.25;
        const startH = Math.floor(start); const startM = Math.round((start % 1) * 60);
        const endH = Math.floor(end); const endM = Math.round((end % 1) * 60);
        ranges.push(`${startH.toString().padStart(2, '0')}:${startM.toString().padStart(2, '0')}-${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`);
        start = hours[i + 1];
      }
    }
    slotsByDay[date] = ranges;
  });
  return Object.entries(slotsByDay).map(([day, slots]) => ({ day, slots }));
};

// ─── useAvailabilityGrid Hook (Drag Mode) ────────────────────────────────────
export interface UseAvailabilityGridResult {
  selectedSlots: Set<string>;
  isDragging: boolean;
  dragMode: 'select' | 'deselect' | null;
  dates: AvailabilityDate[];
  groupedAvailability: GroupedSlot[];
  handleDragStart: (slotId: string) => void;
  handleDragMove: (slotId: string) => void;
  handleDragEnd: () => void;
  clearAllSlots: () => void;
  removeRange: (group: { startHour: number; endHour: number; dateStr: string }) => void;
  setSelectedSlots: (slots: Set<string>) => void;
}

export const useAvailabilityDrag = (days = 21): UseAvailabilityGridResult => {
  const { t, i18n } = useTranslation();
  const dates = useMemo(() => generateGridDates(days), [days]);
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<'select' | 'deselect' | null>(null);
  const lastProcessedSlot = useRef<string | null>(null);
  const dragStartSlotRef = useRef<string | null>(null);
  const initialSlotsRef = useRef<Set<string> | null>(null);
  const lastGroupedRef = useRef<GroupedSlot[]>([]);

  const groupedAvailability = useMemo(() => {
    if (isDragging) return lastGroupedRef.current;
    const grouped = groupSelectedSlots(selectedSlots, dates, t, i18n.language);
    lastGroupedRef.current = grouped;
    return grouped;
  }, [selectedSlots, dates, isDragging, t, i18n.language]);

  const updateSlot = useCallback((slotId: string, mode: 'select' | 'deselect' | null) => {
    setSelectedSlots(prev => {
      const newSet = new Set(prev);
      if (mode === 'select') newSet.add(slotId);
      else if (mode === 'deselect') newSet.delete(slotId);
      return newSet;
    });
  }, []);

  const handleDragStart = useCallback((slotId: string) => {
    const mode = selectedSlots.has(slotId) ? 'deselect' : 'select';
    setIsDragging(true);
    setDragMode(mode);
    dragStartSlotRef.current = slotId;
    initialSlotsRef.current = new Set(selectedSlots);
    updateSlot(slotId, mode);
    lastProcessedSlot.current = slotId;
  }, [selectedSlots, updateSlot]);

  const handleDragMove = useCallback((slotId: string) => {
    if (!isDragging || lastProcessedSlot.current === slotId || !dragMode) return;
    lastProcessedSlot.current = slotId;
    if (dragStartSlotRef.current && initialSlotsRef.current) {
      const startParts = dragStartSlotRef.current.split('-');
      const currParts = slotId.split('-');
      const startH = parseFloat(startParts.pop() || '0');
      const startDate = startParts.join('-');
      const currH = parseFloat(currParts.pop() || '0');
      const currDate = currParts.join('-');
      const startIdx = dates.findIndex(d => d.id === startDate);
      const currIdx = dates.findIndex(d => d.id === currDate);
      if (startIdx !== -1 && currIdx !== -1) {
        const minCol = Math.min(startIdx, currIdx);
        const maxCol = Math.max(startIdx, currIdx);
        const minH = Math.min(startH, currH);
        const maxH = Math.max(startH, currH);
        const newSet = new Set(initialSlotsRef.current);
        let hasChanges = false;
        for (let c = minCol; c <= maxCol; c++) {
          const dateStr = dates[c].id;
          for (let h = minH; h <= maxH; h += 0.25) {
            const sid = `${dateStr}-${h}`;
            if (dragMode === 'select') {
              if (!newSet.has(sid)) {
                newSet.add(sid);
                hasChanges = true;
              }
            } else {
              if (newSet.has(sid)) {
                newSet.delete(sid);
                hasChanges = true;
              }
            }
          }
        }
        if (hasChanges) setSelectedSlots(newSet);
      }
    } else {
      updateSlot(slotId, dragMode);
    }
  }, [isDragging, dragMode, dates, updateSlot]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDragMode(null);
    lastProcessedSlot.current = null;
    dragStartSlotRef.current = null;
    initialSlotsRef.current = null;
  }, []);

  const clearAllSlots = useCallback(() => {
    setSelectedSlots(new Set());
  }, []);

  const removeRange = useCallback((group: { startHour: number; endHour: number; dateStr: string }) => {
    setSelectedSlots(prev => {
      const newSet = new Set(prev);
      for (let h = group.startHour; h < group.endHour; h += 0.25) {
        newSet.delete(`${group.dateStr}-${h}`);
      }
      return newSet;
    });
  }, []);

  return {
    selectedSlots,
    isDragging,
    dragMode,
    dates,
    groupedAvailability,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    clearAllSlots,
    removeRange,
    setSelectedSlots
  };
};

export const useAvailabilityGrid = useAvailabilityDrag; // Alias for backward compatibility

// ─── useCalendarBlocks Hook (Block Mode) ─────────────────────────────────────
export interface UseCalendarBlocksResult {
  blocks: TimeBlock[]; activeBlockId: string | null; setActiveBlockId: (id: string | null) => void;
  createBlock: (dateStr: string, hour: number) => void; updateBlockStart: (id: string, newStart: number) => void;
  updateBlockEnd: (id: string, newEnd: number) => void; removeBlock: (id: string) => void;
  getSelectedSlots: () => Set<string>; setSlots: (slots: Set<string>) => void;
}

export const useCalendarBlocks = (initialSlots: Set<string> = new Set()): UseCalendarBlocksResult => {
  const [blocks, setBlocks] = useState<TimeBlock[]>(() => initialSlots.size > 0 ? convertSlotsToBlocks(initialSlots) : []);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

  const createBlock = useCallback((dateStr: string, hour: number) => {
    const start = snap(hour); const end = Math.min(start + 1, 24);
    const newBlock: TimeBlock = { id: genId(), dateStr, startHour: start, endHour: end };
    setBlocks(prev => [...prev, newBlock]); setActiveBlockId(newBlock.id);
  }, []);

  const updateBlockStart = useCallback((id: string, newStartRaw: number) => {
    const newStart = clamp(newStartRaw, 0, 23.75);
    setBlocks(prev => prev.map(b => { if (b.id !== id) return b; if (newStart >= b.endHour - SNAP_STEP) return b; return { ...b, startHour: newStart }; }));
  }, []);

  const updateBlockEnd = useCallback((id: string, newEndRaw: number) => {
    const newEnd = clamp(newEndRaw, SNAP_STEP, 24);
    setBlocks(prev => prev.map(b => { if (b.id !== id) return b; if (newEnd <= b.startHour + SNAP_STEP) return b; return { ...b, endHour: newEnd }; }));
  }, []);

  const removeBlock = useCallback((id: string) => { setBlocks(prev => prev.filter(b => b.id !== id)); if (activeBlockId === id) setActiveBlockId(null); }, [activeBlockId]);
  const getSelectedSlots = useCallback(() => convertBlocksToSlots(blocks), [blocks]);
  const setSlots = useCallback((slots: Set<string>) => { setBlocks(convertSlotsToBlocks(slots)); }, []);

  return { blocks, activeBlockId, setActiveBlockId, createBlock, updateBlockStart, updateBlockEnd, removeBlock, getSelectedSlots, setSlots };
};
