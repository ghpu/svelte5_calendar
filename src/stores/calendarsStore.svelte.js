class CalendarsStore {
  calendars = $state([
    {
      id: 'default',
      name: 'My Calendar',
      color: '#3b82f6',
      visible: true,
      isDefault: true
    },
    {
      id: 'work',
      name: 'Work',
      color: '#8b5cf6',
      visible: true,
      isDefault: false
    },
    {
      id: 'personal',
      name: 'Personal',
      color: '#10b981',
      visible: true,
      isDefault: false
    },
    {
      id: 'family',
      name: 'Family',
      color: '#f59e0b',
      visible: true,
      isDefault: false
    }
  ])

  constructor() {
    this.loadFromStorage()
  }

  loadFromStorage() {
    const stored = localStorage.getItem('calendars')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        this.calendars = parsed
      } catch (e) {
        console.error('Failed to load calendars from storage:', e)
      }
    }
  }

  saveToStorage() {
    localStorage.setItem('calendars', JSON.stringify(this.calendars))
  }

  addCalendar(name, color) {
    const newCalendar = {
      id: crypto.randomUUID(),
      name,
      color,
      visible: true,
      isDefault: false
    }
    this.calendars.push(newCalendar)
    this.saveToStorage()
    return newCalendar
  }

  updateCalendar(id, updates) {
    const calendar = this.calendars.find(c => c.id === id)
    if (calendar) {
      Object.assign(calendar, updates)
      this.saveToStorage()
    }
  }

  deleteCalendar(id) {
    const calendar = this.calendars.find(c => c.id === id)
    if (calendar && !calendar.isDefault) {
      this.calendars = this.calendars.filter(c => c.id !== id)
      this.saveToStorage()
      return true
    }
    return false
  }

  toggleCalendar(id) {
    const calendar = this.calendars.find(c => c.id === id)
    if (calendar) {
      calendar.visible = !calendar.visible
      this.saveToStorage()
    }
  }

  getVisibleCalendarIds() {
    return this.calendars.filter(c => c.visible).map(c => c.id)
  }

  getCalendar(id) {
    return this.calendars.find(c => c.id === id)
  }

  getDefaultCalendar() {
    return this.calendars.find(c => c.isDefault) || this.calendars[0]
  }
}

export const calendarsStore = new CalendarsStore()
