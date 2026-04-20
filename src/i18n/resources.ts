export const defaultNS = "common"

export const resources = {
  "pt-BR": {
    common: {
      appName: "One Pace BR Hub",
      actions: {
        play: "Reproduzir",
        continue: "Continuar",
      },
      home: {
        sagaTitle: "Romance Dawn",
        sagaDescription:
          "Monkey D. Luffy embarca em uma aventura para reunir uma tripulação e conquistar o título de Rei dos Piratas.",
      },
    },
  },
  en: {
    common: {
      appName: "One Pace BR Hub",
      actions: {
        play: "Play",
        continue: "Continue",
      },
      home: {
        sagaTitle: "Romance Dawn",
        sagaDescription:
          "Monkey D. Luffy sets out on an adventure to gather a crew and become the King of the Pirates.",
      },
    },
  },
} as const

export type AppLanguage = keyof typeof resources
