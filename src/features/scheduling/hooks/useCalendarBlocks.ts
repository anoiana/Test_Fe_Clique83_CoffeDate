import { useState, useCallback, useMemo } from 'react';
import { formatTime } from '../data/gridConfig';

export interface TimeBlock {
  id: string;
  dateStr: string;
  startHour: number; // e.g. 9 = 9:00, 9.25 = 9:15
  endHour: number;   // exclusive
}

const SNAP_STEP = 0.25; // 15-minute snap
let _counter = 0;
const genId = () => `blk-${++_counter}-${Date.now()}`;
const snap = (v: number) => Math.round(v / SNAP_STEP) * SNAP_STEP;
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

// ── Slot ↔ Block converters ─────────────────────────────────────────────────

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
        blocks.push({
          id: `${dateId}-${startH}-${current + 0.25}`,
          dateStr: dateId,
          startHour: startH,
          endHour: current + 0.25,
        });
        startH = hours[i + 1];
      }
    }
  });
  return blocks;
};

export const convertBlocksToSlots = (blocks: TimeBlock[]): Set<string> => {
  const s = new Set<string>();
  blocks.forEach(b => {
    for (let h = b.startHour; h < b.endHour; h += 0.25) {
      s.add(`${b.dateStr}-${Math.round(h * 100) / 100}`);
    }
  });
  return s;
};

// ── Hook ───────────────────────────────────────────────────────────────────

export const useCalendarBlocks = (initialSlots: Set<string> = new Set()) => {
  const [blocks, setBlocks] = useState<TimeBlock[]>(() =>
    initialSlots.size > 0 ? convertSlotsToBlocks(initialSlots) : [],
  );
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

  const createBlock = useCallback((dateStr: string, hour: number) => {
    const start = snap(hour);
    const end = Math.min(start + 1, 24); 
    const newBlock: TimeBlock = { id: genId(), dateStr, startHour: start, endHour: end };
    setBlocks(prev => [...prev, newBlock]);
    setActiveBlockId(newBlock.id);
  }, []);

  const updateBlockStart = useCallback((id: string, newStartRaw: number) => {
    const newStart = clamp(snap(newStartRaw), 0, 23.75);
    setBlocks(prev =>
      prev.map(b => {
        if (b.id !== id) return b;
        if (newStart >= b.endHour - SNAP_STEP) return b;
        return { ...b, startHour: newStart };
      }),
    );
  }, []);

  const updateBlockEnd = useCallback((id: string, newEndRaw: number) => {
    const newEnd = clamp(snap(newEndRaw), SNAP_STEP, 24);
    setBlocks(prev =>
      prev.map(b => {
        if (b.id !== id) return b;
        if (newEnd <= b.startHour + SNAP_STEP) return b;
        return { ...b, endHour: newEnd };
      }),
    );
  }, []);

  const removeBlock = useCallback((id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
    if (activeBlockId === id) setActiveBlockId(null);
  }, [activeBlockId]);

  const getSelectedSlots = useCallback(() => convertBlocksToSlots(blocks), [blocks]);

  const setSlots = useCallback((slots: Set<string>) => {
    setBlocks(convertSlotsToBlocks(slots));
  }, []);

  return {
    blocks,
    activeBlockId,
    setActiveBlockId,
    createBlock,
    updateBlockStart,
    updateBlockEnd,
    removeBlock,
    getSelectedSlots,
    setSlots,
  };
};