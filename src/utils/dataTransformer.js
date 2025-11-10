/**
 * Data Transformer Utility
 * Converts between backend (snake_case) and frontend (camelCase) formats
 */

/**
 * Convert snake_case to camelCase
 */
function snakeToCamel(str) {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * Convert camelCase to snake_case
 */
function camelToSnake(str) {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
}

/**
 * Transform object keys from snake_case to camelCase
 */
export function transformFromApi(obj) {
  if (obj === null || obj === undefined) return obj
  if (typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(transformFromApi)

  const transformed = {}
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = snakeToCamel(key)
    transformed[camelKey] = typeof value === 'object' ? transformFromApi(value) : value
  }
  return transformed
}

/**
 * Transform object keys from camelCase to snake_case
 */
export function transformToApi(obj) {
  if (obj === null || obj === undefined) return obj
  if (typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(transformToApi)

  const transformed = {}
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = camelToSnake(key)
    transformed[snakeKey] = typeof value === 'object' ? transformToApi(value) : value
  }
  return transformed
}

/**
 * Transform event from API format to frontend format
 */
export function transformEventFromApi(apiEvent) {
  return {
    id: apiEvent.id,
    title: apiEvent.title,
    description: apiEvent.description || '',
    startDate: apiEvent.start_date,
    endDate: apiEvent.end_date,
    location: apiEvent.location || '',
    calendarId: apiEvent.calendar_id,
    category: apiEvent.category,
    status: apiEvent.status,
    priority: apiEvent.priority,
    isAllDay: apiEvent.is_all_day,
    reminder: apiEvent.reminder,
    attendees: apiEvent.attendees || [],
    recurrence: apiEvent.recurrence,
    isException: apiEvent.is_exception || false,
    isDeleted: apiEvent.is_deleted || false,
    originalEventId: apiEvent.original_event_id || null,
    exceptionDate: apiEvent.exception_date || null,
    createdAt: apiEvent.created_at,
    updatedAt: apiEvent.updated_at
  }
}

/**
 * Transform event from frontend format to API format
 */
export function transformEventToApi(event) {
  return {
    title: event.title,
    description: event.description || '',
    start_date: event.startDate,
    end_date: event.endDate,
    location: event.location || '',
    calendar_id: event.calendarId,
    category: event.category,
    status: event.status || 'confirmed',
    priority: event.priority || 'medium',
    is_all_day: event.isAllDay || false,
    reminder: event.reminder || 'none',
    attendees: event.attendees || [],
    recurrence: event.recurrence || null
  }
}

/**
 * Transform calendar from API format to frontend format
 */
export function transformCalendarFromApi(apiCalendar) {
  return {
    id: apiCalendar.id,
    name: apiCalendar.name,
    color: apiCalendar.color,
    visible: apiCalendar.visible,
    isDefault: apiCalendar.is_default,
    createdAt: apiCalendar.created_at,
    updatedAt: apiCalendar.updated_at
  }
}

/**
 * Transform calendar from frontend format to API format
 */
export function transformCalendarToApi(calendar) {
  return {
    name: calendar.name,
    color: calendar.color,
    visible: calendar.visible,
    is_default: calendar.isDefault || false
  }
}
