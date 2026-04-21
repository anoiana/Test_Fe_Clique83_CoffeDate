/**
 * Scheduling Feature: Grid Configuration Constants
 * Centralized configuration for the availability canvas grid.
 */

// Time Boundaries
export const START_HOUR = 0;
export const END_HOUR = 23;
export const HOURS = Array.from({ length: 24 }, (_, i) => i);
export const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

// UI Scaling Constants (Optimized for mobile - Zoomed out)
export const COLUMN_WIDTH = 58;
export const TIME_COL_WIDTH = 46;
export const CELL_HEIGHT = 44;

// Grid Style Configuration
export const GRID_STYLE = {
  COLORS: {
    PRIMARY: 'var(--c-primary)',
    LINE: 'rgba(255, 255, 255, 0.12)',
    RANGE_LABEL_BG: 'var(--c-primary)',
    TEXT: '#000000',
  },
  FONTS: {
    RANGE_LABEL_SIZE: 11,
    RANGE_LABEL: 'bold 9px sans-serif',
  },
  DIMENSIONS: {
    BLOCK_PADDING: 3,
    BORDER_RADIUS: 8,
  }
};

// Helper: Format float hour (9.25) to time string ("09:15")
export const formatTime = (timeFloat) => {
  const h = Math.floor(timeFloat);
  const m = Math.round((timeFloat - h) * 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};
