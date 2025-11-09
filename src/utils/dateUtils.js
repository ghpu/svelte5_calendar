import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  addDays,
  startOfDay,
  endOfDay,
  differenceInDays,
  differenceInMinutes
} from 'date-fns'

export function getMonthDays(date, weekStartsOn = 0) {
  const start = startOfWeek(startOfMonth(date), { weekStartsOn })
  const end = endOfWeek(endOfMonth(date), { weekStartsOn })
  return eachDayOfInterval({ start, end })
}

export function getWeekDays(date, weekStartsOn = 0) {
  const start = startOfWeek(date, { weekStartsOn })
  const end = endOfWeek(date, { weekStartsOn })
  return eachDayOfInterval({ start, end })
}

export function formatDate(date, formatString = 'PPP') {
  return format(date, formatString)
}

export function formatTime(date, use24Hour = false) {
  return format(date, use24Hour ? 'HH:mm' : 'h:mm a')
}

export function formatDateTime(date, use24Hour = false) {
  return format(date, use24Hour ? 'PPP HH:mm' : 'PPP p')
}

export function formatDateByPattern(date, pattern) {
  // Convert custom patterns to date-fns format
  const patternMap = {
    'MM/DD/YYYY': 'MM/dd/yyyy',
    'DD/MM/YYYY': 'dd/MM/yyyy',
    'YYYY-MM-DD': 'yyyy-MM-dd'
  }
  const dateFormat = patternMap[pattern] || 'MM/dd/yyyy'
  return format(date, dateFormat)
}

export function getTimeSlots(hourStart = 0, hourEnd = 24, use24Hour = false) {
  const slots = []
  for (let hour = hourStart; hour < hourEnd; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = new Date()
      time.setHours(hour, minute, 0, 0)
      slots.push({
        value: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
        label: format(time, use24Hour ? 'HH:mm' : 'h:mm a')
      })
    }
  }
  return slots
}

export function getVisibleHours(hourStart = 0, hourEnd = 24) {
  const hours = []
  for (let i = hourStart; i < hourEnd; i++) {
    hours.push(i)
  }
  return hours
}

export function createDateTimeString(date, time) {
  const [hours, minutes] = time.split(':')
  // Parse date as local (YYYY-MM-DD format)
  const [year, month, day] = date.split('-').map(Number)
  // Create date in local timezone (month is 0-indexed)
  const dateObj = new Date(year, month - 1, day, parseInt(hours), parseInt(minutes), 0, 0)
  // Return ISO string in local time (not UTC)
  // Format: YYYY-MM-DDTHH:mm:ss
  const pad = (num) => String(num).padStart(2, '0')
  return `${year}-${pad(month)}-${pad(day)}T${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}:00`
}

export function getDateFromDateTime(dateTime) {
  return format(new Date(dateTime), 'yyyy-MM-dd')
}

export function getTimeFromDateTime(dateTime) {
  return format(new Date(dateTime), 'HH:mm')
}

export function isDateInCurrentMonth(date, currentDate) {
  return isSameMonth(date, currentDate)
}

export function isDateToday(date) {
  return isToday(date)
}

export function isDateSame(date1, date2) {
  return isSameDay(date1, date2)
}

export function isMultiDayEvent(startDate, endDate) {
  const start = startOfDay(new Date(startDate))
  const end = startOfDay(new Date(endDate))
  return differenceInDays(end, start) > 0
}

export function getEventDuration(startDate, endDate) {
  return differenceInMinutes(new Date(endDate), new Date(startDate))
}

export function isWeekend(date) {
  const day = date.getDay()
  return day === 0 || day === 6
}

export function isWithinWorkingHours(hour, workStart, workEnd) {
  return hour >= workStart && hour < workEnd
}

export function getWeekNumber(date) {
  const startOfYear = new Date(date.getFullYear(), 0, 1)
  const days = differenceInDays(date, startOfYear)
  return Math.ceil((days + startOfYear.getDay() + 1) / 7)
}
