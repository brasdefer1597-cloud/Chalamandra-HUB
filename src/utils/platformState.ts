const KOFI_CLICKS_STORAGE_KEY = 'chalamandra_kofi_clicks_by_day';
export const PANIC_MODE_STORAGE_KEY = 'chalamandra_panic_mode';

const getTodayKey = () => new Date().toISOString().slice(0, 10);

export const getKofiClicksToday = (): number => {
  const stored = localStorage.getItem(KOFI_CLICKS_STORAGE_KEY);
  if (!stored) {
    return 0;
  }

  const parsed: Record<string, number> = JSON.parse(stored);
  return parsed[getTodayKey()] ?? 0;
};

export const trackKofiClick = () => {
  const stored = localStorage.getItem(KOFI_CLICKS_STORAGE_KEY);
  const parsed: Record<string, number> = stored ? JSON.parse(stored) : {};
  const today = getTodayKey();

  parsed[today] = (parsed[today] ?? 0) + 1;

  localStorage.setItem(KOFI_CLICKS_STORAGE_KEY, JSON.stringify(parsed));
  window.dispatchEvent(new Event('chalamandra:kofi-clicks-updated'));
};

export const isPanicModeEnabled = (): boolean => {
  return localStorage.getItem(PANIC_MODE_STORAGE_KEY) === 'true';
};

export const setPanicMode = (enabled: boolean) => {
  localStorage.setItem(PANIC_MODE_STORAGE_KEY, enabled ? 'true' : 'false');
  window.dispatchEvent(new Event('chalamandra:panic-mode-updated'));
};
