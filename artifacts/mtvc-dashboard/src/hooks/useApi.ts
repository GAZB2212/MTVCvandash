// useApi.ts — same interface as useLiveData but fetches from API
// Use this for Pi deployment by replacing useLiveData with useApi in your pages
import { useLiveData } from './useLiveData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function useApi() {
  // For now, fall back to live data simulation
  // TODO: Replace with actual fetch calls to API_URL when deploying to Pi
  console.debug('API URL:', API_URL);
  return useLiveData();
}
