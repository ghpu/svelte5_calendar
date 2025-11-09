export const CATEGORIES = [
  {
    id: 'work',
    name: 'Work',
    color: '#3b82f6',
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>'
  },
  {
    id: 'personal',
    name: 'Personal',
    color: '#10b981',
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>'
  },
  {
    id: 'meeting',
    name: 'Meeting',
    color: '#f59e0b',
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/></svg>'
  },
  {
    id: 'appointment',
    name: 'Appointment',
    color: '#ef4444',
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>'
  },
  {
    id: 'holiday',
    name: 'Holiday',
    color: '#8b5cf6',
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V7H1v10h22v-6c0-2.21-1.79-4-4-4zm-2 9.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM22 3H2C.9 3 0 3.9 0 5v14c0 1.1.9 2 2 2h20c1.1 0 1.99-.9 1.99-2L24 5c0-1.1-.9-2-2-2zm0 16H2V5h20v14z"/></svg>'
  },
  {
    id: 'birthday',
    name: 'Birthday',
    color: '#ec4899',
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 6c1.11 0 2-.9 2-2 0-.38-.1-.73-.29-1.03L12 0l-1.71 2.97c-.19.3-.29.65-.29 1.03 0 1.1.9 2 2 2zm4.6 9.99l-1.07-1.07-1.08 1.07c-1.3 1.3-3.58 1.31-4.89 0l-1.07-1.07-1.09 1.07C6.75 16.64 5.88 17 4.96 17c-.73 0-1.4-.23-1.96-.61V21c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-4.61c-.56.38-1.23.61-1.96.61-.92 0-1.79-.36-2.44-1.01zM18 9h-5V7h-2v2H6c-1.66 0-3 1.34-3 3v1.54c0 1.08.88 1.96 1.96 1.96.52 0 1.02-.2 1.38-.57l2.14-2.13 2.13 2.13c.74.74 2.03.74 2.77 0l2.14-2.13 2.13 2.13c.37.37.86.57 1.38.57 1.08 0 1.96-.88 1.96-1.96V12C21 10.34 19.66 9 18 9z"/></svg>'
  },
  {
    id: 'other',
    name: 'Other',
    color: '#6b7280',
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>'
  }
]

export const RECURRENCE_TYPES = [
  { id: 'none', name: 'Does not repeat' },
  { id: 'daily', name: 'Daily' },
  { id: 'weekly', name: 'Weekly' },
  { id: 'monthly', name: 'Monthly' },
  { id: 'yearly', name: 'Yearly' }
]

export const REMINDER_OPTIONS = [
  { id: 'none', name: 'None' },
  { id: '5min', name: '5 minutes before', minutes: 5 },
  { id: '15min', name: '15 minutes before', minutes: 15 },
  { id: '30min', name: '30 minutes before', minutes: 30 },
  { id: '1hour', name: '1 hour before', minutes: 60 },
  { id: '1day', name: '1 day before', minutes: 1440 }
]

export const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Dubai',
  'Australia/Sydney',
  'Pacific/Auckland'
]

export const KEYBOARD_SHORTCUTS = [
  { key: 't', description: 'Go to today', action: 'goToToday' },
  { key: 'n', description: 'Create new event', action: 'newEvent' },
  { key: 'm', description: 'Month view', action: 'monthView' },
  { key: 'w', description: 'Week view', action: 'weekView' },
  { key: 'd', description: 'Day view', action: 'dayView' },
  { key: 'ArrowLeft', description: 'Previous period', action: 'prevPeriod' },
  { key: 'ArrowRight', description: 'Next period', action: 'nextPeriod' },
  { key: '/', description: 'Search', action: 'search' },
  { key: 'Escape', description: 'Close modal', action: 'closeModal' }
]

export const EVENT_STATUS = [
  { id: 'free', name: 'Free', color: '#10b981', icon: '○' },
  { id: 'busy', name: 'Busy', color: '#ef4444', icon: '●' },
  { id: 'tentative', name: 'Tentative', color: '#f59e0b', icon: '◐' },
  { id: 'out-of-office', name: 'Out of Office', color: '#8b5cf6', icon: '✈' }
]

export const EVENT_PRIORITY = [
  { id: 'low', name: 'Low', icon: '↓', color: '#6b7280' },
  { id: 'normal', name: 'Normal', icon: '−', color: '#3b82f6' },
  { id: 'high', name: 'High', icon: '↑', color: '#ef4444' }
]

export const THEMES = [
  { id: 'light', name: 'Light' },
  { id: 'dark', name: 'Dark' },
  { id: 'high-contrast', name: 'High Contrast' }
]

export const DATE_FORMATS = [
  { id: 'MM/DD/YYYY', name: 'MM/DD/YYYY (US)' },
  { id: 'DD/MM/YYYY', name: 'DD/MM/YYYY (Europe)' },
  { id: 'YYYY-MM-DD', name: 'YYYY-MM-DD (ISO)' }
]

export const TIME_FORMATS = [
  { id: '12h', name: '12-hour (AM/PM)' },
  { id: '24h', name: '24-hour' }
]

export const FIRST_DAY_OPTIONS = [
  { id: 0, name: 'Sunday' },
  { id: 1, name: 'Monday' }
]
