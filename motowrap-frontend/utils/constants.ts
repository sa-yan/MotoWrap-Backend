import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};

export const API_BASE_URL =
  (process.env.EXPO_PUBLIC_API_BASE_URL ?? String(extra.apiBaseUrl ?? '')).replace(/\/$/, '') ||
  'http://localhost:8080';

export const GPS_SUBMISSION_INTERVAL_MS = Number(
  process.env.EXPO_PUBLIC_GPS_SUBMISSION_INTERVAL_MS ?? extra.gpsSubmissionIntervalMs ?? 10000,
);

export const GPS_WATCH_INTERVAL_MS = Number(
  process.env.EXPO_PUBLIC_GPS_WATCH_INTERVAL_MS ?? extra.gpsWatchIntervalMs ?? 5000,
);
