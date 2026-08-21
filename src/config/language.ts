/** LocalStorage key used to persist the user's selected app language. */
export const LANGUAGE_STORAGE_KEY = 'app-language';

/** Default language key used before the user picks one. */
const DEFAULT_LANGUAGE_KEY = 'english';

/** Fallback `Accept-Language` value when nothing is stored. */
const DEFAULT_ACCEPT_LANGUAGE = 'en';

/** App language keys mapped to their `Accept-Language` header values. */
const LANGUAGE_HEADER_MAP: Record<string, string> = {
  english: 'en',
  uzbek: 'uz',
  russian: 'ru',
};

/** Read the persisted app language key (e.g. 'english', 'uzbek', 'russian'). */
export function getStoredLanguage(): string {
  return localStorage.getItem(LANGUAGE_STORAGE_KEY) ?? DEFAULT_LANGUAGE_KEY;
}

/** Persist the app language key (e.g. 'english', 'uzbek', 'russian'). */
export function setStoredLanguage(languageKey: string): void {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, languageKey);
}

/** Resolve the value sent in the `Accept-Language` request header. */
export function getAcceptLanguage(): string {
  return LANGUAGE_HEADER_MAP[getStoredLanguage()] ?? DEFAULT_ACCEPT_LANGUAGE;
}

/** Language codes used by the header switcher and the app stores. */
export type LanguageCode = 'EN' | 'UZ' | 'RU';

/** Persisted keys mapped to the header-switcher language codes. */
const LANGUAGE_KEY_TO_CODE: Record<string, LanguageCode> = {
  english: 'EN',
  uzbek: 'UZ',
  russian: 'RU',
};

/** Header-switcher language codes mapped to their persisted keys. */
const LANGUAGE_CODE_TO_KEY: Record<LanguageCode, string> = {
  EN: 'english',
  UZ: 'uzbek',
  RU: 'russian',
};

/** Read the persisted app language as a header-switcher code (EN | UZ | RU). */
export function getStoredLanguageCode(): LanguageCode {
  return LANGUAGE_KEY_TO_CODE[getStoredLanguage()] ?? 'EN';
}

/** Persist the app language using a header-switcher code (EN | UZ | RU). */
export function setStoredLanguageCode(code: LanguageCode): void {
  const languageKey = LANGUAGE_CODE_TO_KEY[code];
  if (languageKey) {
    setStoredLanguage(languageKey);
  }
}
