export const CATEGORIES = [
  { id: 'work', name: 'Work', color: '#3b82f6' },
  { id: 'personal', name: 'Personal', color: '#10b981' },
  { id: 'meeting', name: 'Meeting', color: '#f59e0b' },
  { id: 'appointment', name: 'Appointment', color: '#ef4444' },
  { id: 'holiday', name: 'Holiday', color: '#8b5cf6' },
  { id: 'birthday', name: 'Birthday', color: '#ec4899' },
  { id: 'other', name: 'Other', color: '#6b7280' }
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
