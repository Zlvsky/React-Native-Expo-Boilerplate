import { getLocales } from 'expo-localization'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Your translation files "en", "pl", "it", "de", "es", "fi", "ro", "pt"
import en from './translations/en.json'
import pl from './translations/pl.json'


const resources = {
  en: { translation: en },
  pl: { translation: pl },
}

const DEFAULT_LANGUAGE = 'en'

const getLocale = () => {
  const deviceLanguage = getLocales()?.[0]?.languageCode ?? DEFAULT_LANGUAGE
  const isLanguageSupported = Object.keys(resources).includes(deviceLanguage)
  return isLanguageSupported ? deviceLanguage : DEFAULT_LANGUAGE
}

const initI18n = () => {
  const language = getLocale()
  i18n.use(initReactI18next).init({
    resources,
    lng: language,
    fallbackLng: DEFAULT_LANGUAGE,
    // Disable language code normalization to keep dev-xx as-is
    cleanCode: true,
    lowerCaseLng: true,
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed'
    }
  })
}

initI18n()

export default i18n
