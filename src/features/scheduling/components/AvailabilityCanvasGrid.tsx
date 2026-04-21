import React, { useRef, useEffect, useCallback } from 'react';
import { GRID_STYLE, formatTime } from '../data/gridConfig';
import { AvailabilityDate } from '../../../shared/types/models';

interface AvailabilityCanvasGridProps {
  dates: AvailabilityDate[];
  selectedSlots: Set<string>;
  onDragStart: (sid: string) => void;
  onDragMove: (sid: string) => void;
  onDragEnd: () => void;
  columnWidth: number;
  cellHeight: number;
  isDragging?: boolean;
  dragMode?: string | null;
}

// Extend CanvasRenderingContext2D for roundRect which is experimental/new in some TS versions
interface ExtendedCanvasRenderingContext2D extends CanvasRenderingContext2D {
  roundRect(x: number, y: number, w: number, h: number, radii: number | number[]): void;
}

/**
 * Scheduling Feature: High Performance Canvas Grid Component
 * Renders an interactive availability grid on HTML Canvas for 60fps performance.
 */
const AvailabilityCanvasGrid: React.FC<AvailabilityCanvasGridProps> = React.memo(({
  dates,
  selectedSlots,
  onDragStart,
  onDragMove,
  onDragEnd,
  columnWidth,
  cellHeight,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPaintingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const LONG_PRESS_DELAY = 50;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true }) as ExtendedCanvasRenderingContext2D;
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const width = dates.length * columnWidth;
    const height = 24 * cellHeight;

    ctx.save();
    ctx.scale(dpr, dpr);

    // 1. Draw Grid Lines
    ctx.strokeStyle = GRID_STYLE.COLORS.LINE;
    ctx.lineWidth = 1;

    for (let i = 0; i <= dates.length; i++) {
      const x = i * columnWidth;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let i = 0; i < 24; i++) {
      const y = i * cellHeight;

      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();

      // Faint 30-min Dash Line
      ctx.beginPath();
      ctx.setLineDash([2, 4]);
      ctx.moveTo(0, y + cellHeight / 2);
      ctx.lineTo(width, y + cellHeight / 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = GRID_STYLE.COLORS.LINE;
    }

    // Draw last bottom line
    ctx.beginPath();
    ctx.moveTo(0, 24 * cellHeight);
    ctx.lineTo(width, 24 * cellHeight);
    ctx.stroke();

    // 2. Draw Selected Slots
    const dateBlocks: Record<string, number[]> = {};
    selectedSlots.forEach(slot => {
      const parts = slot.split('-');
      const h = parts.pop() || '0';
      const dateId = parts.join('-');
      const hour = parseFloat(h);
      if (!dateBlocks[dateId]) dateBlocks[dateId] = [];
      dateBlocks[dateId].push(hour);
    });

    ctx.fillStyle = GRID_STYLE.COLORS.PRIMARY;

    Object.keys(dateBlocks).forEach(dateId => {
      const dateIdx = dates.findIndex(d => d.id === dateId);
      if (dateIdx === -1) return;
      const hours = dateBlocks[dateId].sort((a, b) => a - b);
      if (hours.length === 0) return;
      let startH = hours[0];
      for (let i = 0; i < hours.length; i++) {
        const current = hours[i];
        if (i === hours.length - 1 || hours[i + 1] !== current + 0.25) {
          const endH = current + 0.25;
          const x = dateIdx * columnWidth + GRID_STYLE.DIMENSIONS.BLOCK_PADDING;
          const y = startH * cellHeight + GRID_STYLE.DIMENSIONS.BLOCK_PADDING;
          const w = columnWidth - (GRID_STYLE.DIMENSIONS.BLOCK_PADDING * 2);
          const drawHeight = (endH - startH) * cellHeight - (GRID_STYLE.DIMENSIONS.BLOCK_PADDING * 2);

          if (drawHeight > 0) {
            ctx.beginPath();
            if (ctx.roundRect) {
              ctx.roundRect(x, y, w, drawHeight, GRID_STYLE.DIMENSIONS.BORDER_RADIUS);
            } else {
              ctx.rect(x, y, w, drawHeight);
            }
            ctx.fill();

            // Range Text
            ctx.fillStyle = GRID_STYLE.COLORS.TEXT;
            ctx.font = GRID_STYLE.FONTS.RANGE_LABEL;
            ctx.textAlign = 'center';
            const label = `${formatTime(startH)}-${formatTime(endH)}`;
            const labelW = ctx.measureText(label).width + 8;
            const bubbleH = GRID_STYLE.FONTS.RANGE_LABEL_SIZE + 6;

            if (drawHeight >= bubbleH) {
              ctx.fillStyle = GRID_STYLE.COLORS.RANGE_LABEL_BG;
              ctx.beginPath();
              if (ctx.roundRect) {
                ctx.roundRect(x + (w - labelW) / 2, y + 4, labelW, bubbleH, bubbleH / 2);
              } else {
                ctx.rect(x + (w - labelW) / 2, y + 4, labelW, bubbleH);
              }
              ctx.fill();
              ctx.fillStyle = GRID_STYLE.COLORS.TEXT;
              ctx.fillText(label, x + w / 2, y + 4 + bubbleH / 2 + (GRID_STYLE.FONTS.RANGE_LABEL_SIZE / 3));
            }
          }
          ctx.fillStyle = GRID_STYLE.COLORS.PRIMARY;
          startH = hours[i + 1];
        }
      }
    });

    ctx.restore();
  }, [dates, selectedSlots, columnWidth, cellHeight]);

  useEffect(() => {
    const dpr = window.devicePixelRatio || 1;
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = dates.length * columnWidth * dpr;
      canvas.height = 24 * cellHeight * dpr;
      canvas.style.width = `${dates.length * columnWidth}px`;
      canvas.style.height = `${24 * cellHeight}px`;
      draw();
    }
  }, [dates, columnWidth, cellHeight, draw]);

  useEffect(() => {
    requestAnimationFrame(draw);
  }, [selectedSlots, draw]);

  // Prevent native scroll only when painting
  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      if (isPaintingRef.current) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('touchmove', preventScroll, { passive: false });
    }
    return () => {
      if (canvas) {
        canvas.removeEventListener('touchmove', preventScroll);
      }
    };
  }, []);

  const handlePointerAction = (e: React.PointerEvent<HTMLCanvasElement>, type: 'down' | 'move' | 'up' | 'leave') => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (!clientX || !clientY) return;

    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const colIdx = Math.floor(x / columnWidth);
    const floatRow = y / cellHeight;
    const rowIdx = Math.floor(floatRow * 4) / 4;

    if (type === 'down') {
      const slotId = `${dates[colIdx]?.id}-${rowIdx}`;
      startPosRef.current = { x: clientX, y: clientY };

      if (e.pointerType === 'touch') {
        if (dragTimerRef.current) clearTimeout(dragTimerRef.current);
        dragTimerRef.current = setTimeout(() => {
          isPaintingRef.current = true;
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
          onDragStart(slotId);
          if (typeof window !== 'undefined' && 'vibrate' in window.navigator) {
             window.navigator.vibrate(30);
          }
        }, LONG_PRESS_DELAY);
      } else {
        isPaintingRef.current = true;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        onDragStart(slotId);
      }
    }

    if (type === 'move') {
      if (!isPaintingRef.current) {
        const moveDist = Math.sqrt(Math.pow(clientX - startPosRef.current.x, 2) + Math.pow(clientY - startPosRef.current.y, 2));
        if (moveDist > 8 && dragTimerRef.current) clearTimeout(dragTimerRef.current);
        return;
      }
      const slotId = `${dates[colIdx]?.id}-${rowIdx}`;
      onDragMove(slotId);
    }

    if (type === 'up' || type === 'leave') {
      if (dragTimerRef.current) clearTimeout(dragTimerRef.current);
      if (isPaintingRef.current) {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        onDragEnd();
      }
      isPaintingRef.current = false;
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={(e) => handlePointerAction(e, 'down')}
      onPointerMove={(e) => handlePointerAction(e, 'move')}
      onPointerUp={(e) => handlePointerAction(e, 'up')}
      onPointerLeave={(e) => handlePointerAction(e, 'leave')}
      onContextMenu={(e) => e.preventDefault()}
      className="cursor-crosshair"
      style={{
        imageRendering: 'crisp-edges',
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}
    />
  );
});

AvailabilityCanvasGrid.displayName = 'AvailabilityCanvasGrid';

export default AvailabilityCanvasGrid;
