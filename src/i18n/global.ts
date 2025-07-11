import { I18N_RESOURCES } from '@/i18n/routing';

declare module 'next-intl' {
  interface AppConfig {
    Messages: (typeof I18N_RESOURCES)['en']['translation'];
  }
}
