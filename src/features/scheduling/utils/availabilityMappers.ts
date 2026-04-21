import { TFunction } from 'i18next';
import { formatTime } from '../data/gridConfig';
import { AvailabilityDate, GroupedSlot } from '../../../shared/types/models';

/**
 * groupSelectedSlots — Groups individual 15-min slots into continuous time ranges for UI display.
 */
export const groupSelectedSlots = (
  selectedSlots: Set<string>,
  dates: AvailabilityDate[],
  t: TFunction,
  language: string
): GroupedSlot[] => {
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
        result.push({
          id: `g-${date}-${start}-${end}`,
          dateStr: date,
          display: d ? `${t(`common.days.${d.dayKey}`)} ${t('matching.round2.common.day_prefix')}${d.dateNum}` : date,
          timeRange: `${formatTime(start)} - ${formatTime(end)}`,
          startHour: start,
          endHour: end
        });
        start = hours[i + 1];
      }
    }
  });

  return result;
};

/**
 * buildAvailabilityPayload — Converts the Set of internal slot IDs into the backend-required payload format.
 */
export const buildAvailabilityPayload = (selectedSlots: Set<string>) => {
  const slotsByDay: Record<string, string[]> = {};
  
  // Sort slots to ensure sequential processing
  const sortedSlots = (Array.from(selectedSlots) as string[]).sort();

  // Step 1: Group hours by date
  const dayHours: Record<string, number[]> = {};
  sortedSlots.forEach(slot => {
    const parts = slot.split('-');
    const hourStr = parts.pop()!;
    const date = parts.join('-');
    if (!dayHours[date]) dayHours[date] = [];
    dayHours[date].push(parseFloat(hourStr));
  });

  // Step 2: Merge sequential slots into time ranges (e.g., 08:00-09:00)
  Object.keys(dayHours).sort().forEach(date => {
    const hours = dayHours[date].sort((a, b) => a - b);
    const ranges: string[] = [];
    let start = hours[0];

    for (let i = 0; i < hours.length; i++) {
      const current = hours[i];
      if (i === hours.length - 1 || hours[i + 1] !== current + 0.25) {
        const end = current + 0.25;
        const startH = Math.floor(start);
        const startM = Math.round((start % 1) * 60);
        const endH = Math.floor(end);
        const endM = Math.round((end % 1) * 60);
        
        ranges.push(
          `${startH.toString().padStart(2, '0')}:${startM.toString().padStart(2, '0')}-${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`
        );
        start = hours[i + 1];
      }
    }

    slotsByDay[date] = ranges;
  });

  // Step 3: Map to final API structure
  return Object.entries(slotsByDay).map(([day, slots]) => ({ day, slots }));
};
