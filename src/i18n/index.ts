import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import { defaultNS, resources, type AppLanguage } from "./resources"

const STORAGE_KEY = "app-language"

const getInitialLanguage = (): AppLanguage => {
  const savedLanguage = localStorage.getItem(STORAGE_KEY)

  if (savedLanguage && savedLanguage in resources) {
    return savedLanguage as AppLanguage
  }

  return navigator.language.toLowerCase().startsWith("pt") ? "pt-BR" : "en"
}

void i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: "pt-BR",
  defaultNS,
  ns: [defaultNS],
  interpolation: {
    escapeValue: false,
  },
  returnNull: false,
})

export const changeLanguage = async (language: AppLanguage): Promise<void> => {
  await i18n.changeLanguage(language)
  localStorage.setItem(STORAGE_KEY, language)
}

export default i18n
