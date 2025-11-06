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
  endOfDay
} from 'date-fns'

export function getMonthDays(date) {
  const start = startOfWeek(startOfMonth(date))
  const end = endOfWeek(endOfMonth(date))
  return eachDayOfInterval({ start, end })
}

export function getWeekDays(date) {
  const start = startOfWeek(date)
  const end = endOfWeek(date)
  return eachDayOfInterval({ start, end })
}

export function formatDate(date, formatString = 'PPP') {
  return format(date, formatString)
}

export function formatTime(date) {
  return format(date, 'h:mm a')
}

export function formatDateTime(date) {
  return format(date, 'PPP p')
}

export function getTimeSlots() {
  const slots = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = new Date()
      time.setHours(hour, minute, 0, 0)
      slots.push({
        value: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
        label: format(time, 'h:mm a')
      })
    }
  }
  return slots
}

export function createDateTimeString(date, time) {
  const [hours, minutes] = time.split(':')
  const dateObj = new Date(date)
  dateObj.setHours(parseInt(hours), parseInt(minutes), 0, 0)
  return dateObj.toISOString()
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
