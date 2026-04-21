import { useState, useCallback, useRef } from 'react';
import { AvailabilityDate, GroupedSlot } from '../../../shared/types/models';

/**
 * Scheduling Feature: Drag Selection Hook
 * Encapsulates the complex drag-to-select/deselect logic for the availability grid.
 */
export const useAvailabilityDrag = (dates: AvailabilityDate[]) => {
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<'select' | 'deselect' | null>(null);
  const lastProcessedSlot = useRef<string | null>(null);
  const dragStartSlotRef = useRef<string | null>(null);
  const initialSlotsRef = useRef<Set<string> | null>(null);

  const updateSlot = useCallback((slotId: string, mode: 'select' | 'deselect' | null) => {
    setSelectedSlots(prev => {
      const newSet = new Set(prev);
      if (mode === 'select') newSet.add(slotId);
      else if (mode === 'deselect') newSet.delete(slotId);
      return newSet;
    });
  }, []);

  const handleDragStart = useCallback((sid: string) => {
    const mode = selectedSlots.has(sid) ? 'deselect' : 'select';
    setIsDragging(true);
    setDragMode(mode);

    dragStartSlotRef.current = sid;
    initialSlotsRef.current = new Set(selectedSlots);

    updateSlot(sid, mode);
    lastProcessedSlot.current = sid;
  }, [selectedSlots, updateSlot]);

  const handleDragMove = useCallback((sid: string) => {
    if (!isDragging || lastProcessedSlot.current === sid || !dragMode) return;

    // Only logic processing if the slot index has actually changed
    lastProcessedSlot.current = sid;

    if (dragStartSlotRef.current && initialSlotsRef.current) {
      const startParts = dragStartSlotRef.current.split('-');
      const currParts = sid.split('-');

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
            const slotId = `${dateStr}-${h}`;
            if (dragMode === 'select') {
              if (!newSet.has(slotId)) {
                newSet.add(slotId);
                hasChanges = true;
              }
            } else {
              if (newSet.has(slotId)) {
                newSet.delete(slotId);
                hasChanges = true;
              }
            }
          }
        }

        if (hasChanges) {
          setSelectedSlots(newSet);
        }
      }
    } else {
      updateSlot(sid, dragMode);
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
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    clearAllSlots,
    removeRange,
    setSelectedSlots,
  };
};
