/**
 * Application Configuration
 *
 * API_MODE determines whether to use localStorage or backend API
 * Set VITE_API_MODE=true in .env to enable API mode
 */

export const API_MODE = import.meta.env.VITE_API_MODE === 'true'
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// Log current mode for debugging
if (import.meta.env.DEV) {
  console.log(`[Config] Running in ${API_MODE ? 'API' : 'LocalStorage'} mode`)
  if (API_MODE) {
    console.log(`[Config] API Base URL: ${API_BASE_URL}`)
  }
}
