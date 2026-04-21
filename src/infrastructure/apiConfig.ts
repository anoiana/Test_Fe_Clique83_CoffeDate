/**
 * Infrastructure Layer: API Configuration
 * Centralizes the base URL and other API-related constants.
 * Uses Vite environment variables for easy deployment.
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.clique83.com',
  TIMEOUT: 20000,
  USE_MOCK: import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.VITE_USE_MOCK === true,
};
//  hih