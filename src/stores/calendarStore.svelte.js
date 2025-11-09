import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  isSameDay,
  parseISO,
  formatISO
} from 'date-fns'
import { formatInTimeZone, toZonedTime } from 'date-fns-tz'

// Event store with Svelte 5 runes
class CalendarStore {
  currentDate = $state(new Date())
  view = $state('month') // 'month', 'week', 'day'
  events = $state([])
  selectedEvent = $state(null)
  showEventModal = $state(false)
  searchQuery = $state('')
  selectedCategories = $state([])
  timezone = $state(Intl.DateTimeFormat().resolvedOptions().timeZone)

  constructor() {
    // Load events from localStorage
    this.loadFromStorage()
  }

  // Navigation
  nextPeriod() {
    switch (this.view) {
      case 'month':
        this.currentDate = addMonths(this.currentDate, 1)
        break
      case 'week':
        this.currentDate = addWeeks(this.currentDate, 1)
        break
      case 'day':
        this.currentDate = addDays(this.currentDate, 1)
        break
    }
  }

  prevPeriod() {
    switch (this.view) {
      case 'month':
        this.currentDate = subMonths(this.currentDate, 1)
        break
      case 'week':
        this.currentDate = subWeeks(this.currentDate, 1)
        break
      case 'day':
        this.currentDate = subDays(this.currentDate, 1)
        break
    }
  }

  goToToday() {
    this.currentDate = new Date()
  }

  setView(view) {
    this.view = view
  }

  // Event management
  addEvent(event) {
    const newEvent = {
      id: crypto.randomUUID(),
      ...event,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.events.push(newEvent)
    this.saveToStorage()
    return newEvent
  }

  updateEvent(id, updates) {
    const index = this.events.findIndex(e => e.id === id)
    if (index !== -1) {
      this.events[index] = {
        ...this.events[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      this.saveToStorage()
    }
  }

  deleteEvent(id) {
    this.events = this.events.filter(e => e.id !== id)
    this.saveToStorage()
  }

  duplicateEvent(event) {
    const duplicated = {
      ...event,
      id: crypto.randomUUID(),
      title: `${event.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.events.push(duplicated)
    this.saveToStorage()
    return duplicated
  }

  changeEventCategory(id, categoryId) {
    this.updateEvent(id, { category: categoryId })
  }

  changeEventStatus(id, status) {
    this.updateEvent(id, { status })
  }

  changeEventPriority(id, priority) {
    this.updateEvent(id, { priority })
  }

  getEventsForDate(date) {
    return this.events.filter(event => {
      if (event.recurrence) {
        return this.isRecurringEventOnDate(event, date)
      }
      return isSameDay(parseISO(event.startDate), date)
    })
  }

  isRecurringEventOnDate(event, date) {
    const startDate = parseISO(event.startDate)
    const eventDate = new Date(date)

    if (eventDate < startDate) return false
    if (event.recurrence.endDate && eventDate > parseISO(event.recurrence.endDate)) return false

    switch (event.recurrence.type) {
      case 'daily':
        return true
      case 'weekly':
        return eventDate.getDay() === startDate.getDay()
      case 'monthly':
        return eventDate.getDate() === startDate.getDate()
      case 'yearly':
        return eventDate.getDate() === startDate.getDate() &&
               eventDate.getMonth() === startDate.getMonth()
      default:
        return false
    }
  }

  // Modal management
  openEventModal(event = null) {
    this.selectedEvent = event
    this.showEventModal = true
  }

  closeEventModal() {
    this.selectedEvent = null
    this.showEventModal = false
  }

  // Search and filter
  setSearchQuery(query) {
    this.searchQuery = query
  }

  toggleCategory(category) {
    const index = this.selectedCategories.indexOf(category)
    if (index > -1) {
      this.selectedCategories.splice(index, 1)
    } else {
      this.selectedCategories.push(category)
    }
  }

  get filteredEvents() {
    let filtered = this.events

    // Search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase()
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query) ||
        event.location?.toLowerCase().includes(query)
      )
    }

    // Category filter
    if (this.selectedCategories.length > 0) {
      filtered = filtered.filter(event =>
        this.selectedCategories.includes(event.category)
      )
    }

    return filtered
  }

  // Storage
  saveToStorage() {
    localStorage.setItem('calendar-events', JSON.stringify(this.events))
  }

  loadFromStorage() {
    const stored = localStorage.getItem('calendar-events')
    if (stored) {
      try {
        this.events = JSON.parse(stored)
      } catch (e) {
        console.error('Failed to load events from storage', e)
      }
    }
  }

  // Import/Export
  exportToICal() {
    let ical = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Calendar Pro//EN\n'

    this.events.forEach(event => {
      ical += 'BEGIN:VEVENT\n'
      ical += `UID:${event.id}\n`
      ical += `DTSTAMP:${this.formatICalDate(event.createdAt)}\n`
      ical += `DTSTART:${this.formatICalDate(event.startDate)}\n`
      ical += `DTEND:${this.formatICalDate(event.endDate)}\n`
      ical += `SUMMARY:${event.title}\n`
      if (event.description) ical += `DESCRIPTION:${event.description}\n`
      if (event.location) ical += `LOCATION:${event.location}\n`
      ical += 'END:VEVENT\n'
    })

    ical += 'END:VCALENDAR'

    const blob = new Blob([ical], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'calendar-export.ics'
    a.click()
    URL.revokeObjectURL(url)
  }

  formatICalDate(dateString) {
    const date = new Date(dateString)
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  importFromICal(icalString) {
    // Basic iCal parser
    const events = []
    const lines = icalString.split('\n')
    let currentEvent = null

    for (const line of lines) {
      if (line.startsWith('BEGIN:VEVENT')) {
        currentEvent = {}
      } else if (line.startsWith('END:VEVENT') && currentEvent) {
        if (currentEvent.title && currentEvent.startDate) {
          this.addEvent(currentEvent)
        }
        currentEvent = null
      } else if (currentEvent) {
        if (line.startsWith('SUMMARY:')) {
          currentEvent.title = line.substring(8)
        } else if (line.startsWith('DESCRIPTION:')) {
          currentEvent.description = line.substring(12)
        } else if (line.startsWith('LOCATION:')) {
          currentEvent.location = line.substring(9)
        } else if (line.startsWith('DTSTART:')) {
          currentEvent.startDate = this.parseICalDate(line.substring(8))
        } else if (line.startsWith('DTEND:')) {
          currentEvent.endDate = this.parseICalDate(line.substring(6))
        }
      }
    }
  }

  parseICalDate(dateString) {
    // Basic iCal date parser
    const year = dateString.substring(0, 4)
    const month = dateString.substring(4, 6)
    const day = dateString.substring(6, 8)
    const hour = dateString.substring(9, 11) || '00'
    const minute = dateString.substring(11, 13) || '00'
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:00`).toISOString()
  }

  setTimezone(tz) {
    this.timezone = tz
  }
}

export const calendarStore = new CalendarStore()
