// Settings store with Svelte 5 runes
class SettingsStore {
  // General settings
  language = $state('en')
  firstDayOfWeek = $state(0) // 0 = Sunday, 1 = Monday
  dateFormat = $state('MM/DD/YYYY') // 'MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'
  timeFormat = $state('12h') // '12h' or '24h'
  showWeekNumbers = $state(false)

  // Display settings
  defaultView = $state('month')
  hourRangeStart = $state(0) // 0-23
  hourRangeEnd = $state(24) // 1-24
  highlightWorkingHours = $state(true)
  workingHoursStart = $state(9) // 9 AM
  workingHoursEnd = $state(17) // 5 PM
  highlightWeekends = $state(true)
  compactMode = $state(false)
  showEventPreviewOnHover = $state(true)

  // Theme settings
  theme = $state('light') // 'light', 'dark', 'high-contrast'

  // Notification settings
  defaultReminder = $state('15min')
  soundEnabled = $state(true)
  desktopNotifications = $state(true)

  constructor() {
    this.loadFromStorage()
  }

  // Language options
  // NOTE: Language selection is currently for preference storage only.
  // Full internationalization (i18n) is not yet implemented.
  // To implement: integrate a library like svelte-i18n or typesafe-i18n
  get languages() {
    return [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Español' },
      { code: 'fr', name: 'Français' },
      { code: 'de', name: 'Deutsch' },
      { code: 'it', name: 'Italiano' },
      { code: 'pt', name: 'Português' },
      { code: 'ja', name: '日本語' },
      { code: 'zh', name: '中文' },
      { code: 'ko', name: '한국어' },
      { code: 'ru', name: 'Русский' },
    ]
  }

  // Update methods
  setLanguage(lang) {
    this.language = lang
    this.saveToStorage()
  }

  setFirstDayOfWeek(day) {
    this.firstDayOfWeek = day
    this.saveToStorage()
  }

  setDateFormat(format) {
    this.dateFormat = format
    this.saveToStorage()
  }

  setTimeFormat(format) {
    this.timeFormat = format
    this.saveToStorage()
  }

  setShowWeekNumbers(show) {
    this.showWeekNumbers = show
    this.saveToStorage()
  }

  setDefaultView(view) {
    this.defaultView = view
    this.saveToStorage()
  }

  setHourRange(start, end) {
    this.hourRangeStart = start
    this.hourRangeEnd = end
    this.saveToStorage()
  }

  setWorkingHours(start, end) {
    this.workingHoursStart = start
    this.workingHoursEnd = end
    this.saveToStorage()
  }

  toggleHighlightWorkingHours() {
    this.highlightWorkingHours = !this.highlightWorkingHours
    this.saveToStorage()
  }

  toggleHighlightWeekends() {
    this.highlightWeekends = !this.highlightWeekends
    this.saveToStorage()
  }

  toggleCompactMode() {
    this.compactMode = !this.compactMode
    this.saveToStorage()
  }

  toggleEventPreviewOnHover() {
    this.showEventPreviewOnHover = !this.showEventPreviewOnHover
    this.saveToStorage()
  }

  setTheme(theme) {
    this.theme = theme
    this.applyTheme()
    this.saveToStorage()
  }

  applyTheme() {
    // Remove all theme classes
    document.documentElement.classList.remove('light', 'dark', 'high-contrast')
    // Add current theme class
    document.documentElement.classList.add(this.theme)
  }

  setDefaultReminder(reminder) {
    this.defaultReminder = reminder
    this.saveToStorage()
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled
    this.saveToStorage()
  }

  toggleDesktopNotifications() {
    this.desktopNotifications = !this.desktopNotifications
    this.saveToStorage()
  }

  // Storage
  saveToStorage() {
    const settings = {
      language: this.language,
      firstDayOfWeek: this.firstDayOfWeek,
      dateFormat: this.dateFormat,
      timeFormat: this.timeFormat,
      showWeekNumbers: this.showWeekNumbers,
      defaultView: this.defaultView,
      hourRangeStart: this.hourRangeStart,
      hourRangeEnd: this.hourRangeEnd,
      highlightWorkingHours: this.highlightWorkingHours,
      workingHoursStart: this.workingHoursStart,
      workingHoursEnd: this.workingHoursEnd,
      highlightWeekends: this.highlightWeekends,
      compactMode: this.compactMode,
      showEventPreviewOnHover: this.showEventPreviewOnHover,
      theme: this.theme,
      defaultReminder: this.defaultReminder,
      soundEnabled: this.soundEnabled,
      desktopNotifications: this.desktopNotifications,
    }
    localStorage.setItem('calendar-settings', JSON.stringify(settings))
  }

  loadFromStorage() {
    const stored = localStorage.getItem('calendar-settings')
    if (stored) {
      try {
        const settings = JSON.parse(stored)
        Object.assign(this, settings)
        this.applyTheme()
      } catch (e) {
        console.error('Failed to load settings from storage', e)
      }
    } else {
      // Apply default theme
      this.applyTheme()
    }
  }

  reset() {
    this.language = 'en'
    this.firstDayOfWeek = 0
    this.dateFormat = 'MM/DD/YYYY'
    this.timeFormat = '12h'
    this.showWeekNumbers = false
    this.defaultView = 'month'
    this.hourRangeStart = 0
    this.hourRangeEnd = 24
    this.highlightWorkingHours = true
    this.workingHoursStart = 9
    this.workingHoursEnd = 17
    this.highlightWeekends = true
    this.compactMode = false
    this.showEventPreviewOnHover = true
    this.theme = 'light'
    this.defaultReminder = '15min'
    this.soundEnabled = true
    this.desktopNotifications = true
    this.saveToStorage()
    this.applyTheme()
  }
}

export const settingsStore = new SettingsStore()
