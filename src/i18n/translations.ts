export const translations = {
  en: {
    title: 'HAVEN',
    subtitle: 'Sovereign AI & Offline-First Infrastructure',
  },
  ar: {
    title: 'HAVEN',
    subtitle: 'الذكاء الاصطناعي السيادي والبنية التحتية المحلية أولاً',
  },
};

export function useTranslation(language: 'en' | 'ar') {
  return translations[language];
}
