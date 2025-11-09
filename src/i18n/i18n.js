import { addMessages, init, getLocaleFromNavigator } from 'svelte-i18n'

import en from './locales/en.json'
import es from './locales/es.json'
import fr from './locales/fr.json'
import de from './locales/de.json'
import it from './locales/it.json'
import pt from './locales/pt.json'
import ja from './locales/ja.json'
import zh from './locales/zh.json'
import ko from './locales/ko.json'
import ru from './locales/ru.json'

// Add all translations
addMessages('en', en)
addMessages('es', es)
addMessages('fr', fr)
addMessages('de', de)
addMessages('it', it)
addMessages('pt', pt)
addMessages('ja', ja)
addMessages('zh', zh)
addMessages('ko', ko)
addMessages('ru', ru)

// Initialize i18n
export function initI18n(initialLocale) {
  init({
    fallbackLocale: 'en',
    initialLocale: initialLocale || getLocaleFromNavigator() || 'en',
  })
}
