export {}

declare module '*.css'

// Tipado global de next-intl: usa es.json (locale por defecto) como esquema
// de referencia para que useTranslations/getMessages validen namespaces y keys.
declare module 'next-intl' {
  interface AppConfig {
    Messages: typeof import('../messages/es.json')
  }
}
