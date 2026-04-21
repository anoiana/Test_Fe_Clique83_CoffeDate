import React, { useRef, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { GRID_STYLE, formatTime } from '../data/gridConfig';
import { TimeBlock } from '../../../shared/hooks/useAvailabilityGrid';
import { Trash2 } from 'lucide-react';

interface CalendarDate {
  id: string;
  dayKey: string;
  dateNum: number;
  isToday: boolean;
  month: number;
}

interface CalendarDOMGridProps {
  dates: CalendarDate[];
  blocks: TimeBlock[];
  activeBlockId: string | null;
  onBlockTap: (id: string | null) => void;
  onEmptyTap: (dateStr: string, hour: number) => void;
  onBlockStartDrag: (id: string, newStart: number) => void;
  onBlockEndDrag: (id: string, newEnd: number) => void;
  onBlockRemove: (id: string) => void;
  columnWidth: number;
  cellHeight: number;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export const CalendarDOMGrid: React.FC<CalendarDOMGridProps> = ({
  dates,
  blocks,
  activeBlockId,
  onBlockTap,
  onEmptyTap,
  onBlockStartDrag,
  onBlockEndDrag,
  onBlockRemove,
  columnWidth,
  cellHeight,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative select-none"
      style={{ width: dates.length * columnWidth, minHeight: 24 * cellHeight }}
    >
        {/* Grid body */}
        <div className="relative overflow-hidden" style={{ width: dates.length * columnWidth, minHeight: 24 * cellHeight }}>
          {/* Vertical column lines */}
          {Array.from({ length: dates.length + 1 }).map((_, i) => (
            <div
              key={`vline-${i}`}
              className="absolute top-0 bottom-0 border-r border-divider pointer-events-none"
              style={{ left: i * columnWidth }}
            />
          ))}

          {/* Horizontal row lines */}
          {HOURS.map(hour => (
            <React.Fragment key={`hline-${hour}`}>
              {/* Full-hour line */}
              <div
                className="absolute left-0 right-0 border-t border-divider pointer-events-none"
                style={{ top: hour * cellHeight }}
              />
              {/* Half-hour dashed line */}
              <div
                className="absolute left-0 right-0 border-t border-divider/30 border-dashed pointer-events-none"
                style={{ top: hour * cellHeight + cellHeight / 2 }}
              />
            </React.Fragment>
          ))}

          {/* Clickable cells */}
          {dates.map((date, colIdx) =>
            HOURS.map(hour => (
              <div
                key={`cell-${date.id}-${hour}`}
                className="absolute active:bg-primary/5 cursor-pointer pointer-events-auto"
                style={{
                  left: colIdx * columnWidth,
                  top: hour * cellHeight,
                  width: columnWidth,
                  height: cellHeight,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onEmptyTap(date.id, hour);
                }}
              />
            )),
          )}

          {/* Time blocks */}
          {blocks.map(block => {
            const colIdx = dates.findIndex(d => d.id === block.dateStr);
            if (colIdx === -1) return null;
            const isActive = activeBlockId === block.id;
            return (
              <BlockUI
                key={block.id}
                block={block}
                isActive={isActive}
                left={colIdx * columnWidth + GRID_STYLE.DIMENSIONS.BLOCK_PADDING}
                top={block.startHour * cellHeight + GRID_STYLE.DIMENSIONS.BLOCK_PADDING}
                width={columnWidth - GRID_STYLE.DIMENSIONS.BLOCK_PADDING * 2}
                height={(block.endHour - block.startHour) * cellHeight - GRID_STYLE.DIMENSIONS.BLOCK_PADDING * 2}
                cellHeight={cellHeight}
                onTap={() => onBlockTap(isActive ? null : block.id)}
                onStartDrag={(deltaY: number) => onBlockStartDrag(block.id, block.startHour + deltaY)}
                onEndDrag={(deltaY: number) => onBlockEndDrag(block.id, block.endHour + deltaY)}
                onRemove={() => onBlockRemove(block.id)}
              />
            );
          })}
        </div>
    </div>
  );
};

// ── Single Block UI with handles ───────────────────────────────────────
interface BlockUIProps {
  block: TimeBlock;
  isActive: boolean;
  left: number;
  top: number;
  width: number;
  height: number;
  cellHeight: number;
  onTap: () => void;
  onStartDrag: (deltaY: number) => void;
  onEndDrag: (deltaY: number) => void;
  onRemove: () => void;
}

const BlockUI: React.FC<BlockUIProps> = ({
  block,
  isActive,
  left,
  top,
  width,
  height,
  cellHeight,
  onTap,
  onStartDrag,
  onEndDrag,
  onRemove,
}) => {
  const snap = (v: number) => Math.round(v / (cellHeight / 4)) * (cellHeight / 4);
  const clamped = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

  const [liveDeltaTop, setLiveDeltaTop] = useState(0);
  const [liveDeltaBottom, setLiveDeltaBottom] = useState(0);

  const displayTop = top + liveDeltaTop;
  const displayH = height - liveDeltaTop + liveDeltaBottom;
  const label = `${formatTime(block.startHour + liveDeltaTop / cellHeight)} – ${formatTime(block.endHour + liveDeltaBottom / cellHeight)}`;

  const MIN_H = cellHeight / 4;

  const handleStartDrag = (e: React.PointerEvent) => {
    e.stopPropagation();
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);
    const initialY = e.clientY;
    
    const onMove = (ev: PointerEvent) => {
      const dy = ev.clientY - initialY;
      setLiveDeltaTop(clamped(snap(dy), -(24 * cellHeight), height - MIN_H));
    };
    
    const onUp = (ev: PointerEvent) => {
      target.releasePointerCapture(e.pointerId);
      const dy = clamped(snap(ev.clientY - initialY), -(24 * cellHeight), height - MIN_H);
      onStartDrag(dy / cellHeight);
      setLiveDeltaTop(0);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const handleEndDrag = (e: React.PointerEvent) => {
    e.stopPropagation();
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);
    const initialY = e.clientY;
    
    const onMove = (ev: PointerEvent) => {
      const dy = ev.clientY - initialY;
      setLiveDeltaBottom(clamped(snap(dy), -(height - MIN_H), 24 * cellHeight));
    };
    
    const onUp = (ev: PointerEvent) => {
      target.releasePointerCapture(e.pointerId);
      const dy = clamped(snap(ev.clientY - initialY), -(height - MIN_H), 24 * cellHeight);
      onEndDrag(dy / cellHeight);
      setLiveDeltaBottom(0);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <div
      className={`absolute flex flex-col items-center select-none pointer-events-auto transition-all ${isActive ? 'z-30 scale-[1.01]' : 'z-20'}`}
      style={{
        left,
        top: displayTop,
        width,
        height: displayH,
        background: isActive
          ? 'linear-gradient(135deg, var(--c-primary) 0%, var(--c-primary-dark) 100%)'
          : 'linear-gradient(135deg, rgba(209,169,62,0.7) 0%, rgba(160,120,40,0.7) 100%)',
        borderRadius: GRID_STYLE.DIMENSIONS.BORDER_RADIUS,
        boxShadow: isActive
          ? '0 15px 30px rgba(0,0,0,0.4), 0 0 0 1px var(--c-primary-a50)'
          : '0 5px 10px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        transition: liveDeltaTop === 0 && liveDeltaBottom === 0 ? 'all 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none',
        cursor: 'pointer',
        touchAction: 'pan-x pan-y'
      }}
      onClick={(e) => { e.stopPropagation(); onTap(); }}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="px-2 py-0.5 bg-ink/40 backdrop-blur-md rounded-full text-[8px] font-black text-ink shadow-inner border border-divider uppercase tracking-tighter whitespace-nowrap">
          {label}
        </div>
      </div>

      {isActive && (
        <>
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2.5 -right-2.5 w-7 h-7 bg-red-500 text-ink rounded-lg flex items-center justify-center shadow-lg active:scale-90 z-50 border border-divider"
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
          >
            <Trash2 className="w-3 h-3" />
          </motion.button>
          
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-8 flex justify-center items-center cursor-ns-resize z-40 touch-none group" style={{ touchAction: 'none' }} onPointerDown={handleStartDrag}>
            <div className="w-4 h-4 bg-white border-2 border-primary rounded-full shadow-xl transition-transform group-active:scale-125 ring-2 ring-primary/20" />
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-8 flex justify-center items-center cursor-ns-resize z-40 touch-none group" style={{ touchAction: 'none' }} onPointerDown={handleEndDrag}>
            <div className="w-4 h-4 bg-white border-2 border-primary rounded-full shadow-xl transition-transform group-active:scale-125 ring-2 ring-primary/20" />
          </div>
        </>
      )}
    </div>
  );
};
