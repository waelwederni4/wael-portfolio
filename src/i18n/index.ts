import { createI18n } from 'vue-i18n'
import en from './en.json'
import fr from './fr.json'

export const i18n = createI18n({
  legacy: false,
  locale: (localStorage.getItem('lang') as 'en'|'fr') || 'en',
  fallbackLocale: 'en',
  messages: { en, fr }
})

export function setLocale(locale: 'en'|'fr'){
  i18n.global.locale.value = locale
  localStorage.setItem('lang', locale)
}
