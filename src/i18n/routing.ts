import { defineRouting } from 'next-intl/routing';
import { ELanguage } from '@/common/enums';
import { enTranslation } from './en';
import { vnTranslation } from './vn';

export const I18N_RESOURCES = {
  [ELanguage.EN]: { translation: enTranslation },
  [ELanguage.VN]: { translation: vnTranslation },
};

export const routing = defineRouting({
  locales: [ELanguage.EN, ELanguage.VN],
  defaultLocale: ELanguage.EN,
});
