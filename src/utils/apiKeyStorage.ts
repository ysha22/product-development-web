const KEY = 'pharmadd_gemini_api_key';
export function readApiKey(): string {
  try { return localStorage.getItem(KEY) ?? ''; }
  catch { return ''; }
}
export function saveApiKey(value: string): void {
  try {
    if (value.trim()) localStorage.setItem(KEY, value.trim());
    else localStorage.removeItem(KEY);
  } catch { /* Storage may be unavailable for local files; current input still works. */ }
}
