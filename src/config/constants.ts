export const APP_NAME = "GpsTracker";
export const COOKIE_SECRET = import.meta.env.VITE_COOKIE_SECRET;
export const APP_KEY = APP_NAME + "V" + COOKIE_SECRET;
export const webSocketUrl = import.meta.env.VITE_WEBSOCKET_URL;
export const historyApiurl = import.meta.env.VITE_HISTORY_API_URL;
export const baseURL = import.meta.env.VITE_BASE_URL;
export const adminURL = import.meta.env.VITE_ADMIN_URL;