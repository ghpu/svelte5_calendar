import { addDays, addWeeks, addMonths, addYears, startOfDay, endOfDay, isBefore, isAfter, isSameDay } from 'date-fns'

/**
 * Generate instances of a recurring event within a date range
 * @param {Object} event - The recurring event
 * @param {Date} rangeStart - Start of the range to generate instances
 * @param {Date} rangeEnd - End of the range to generate instances
 * @returns {Array} Array of event instances
 */
export function generateRecurringInstances(event, rangeStart, rangeEnd) {
  if (!event.recurrence || event.recurrence.type === 'none') {
    return [event]
  }

  const instances = []
  const eventStart = new Date(event.startDate)
  const eventEnd = new Date(event.endDate)
  const duration = eventEnd - eventStart

  // Calculate recurrence end date
  const recurrenceEnd = event.recurrence.endDate
    ? new Date(event.recurrence.endDate)
    : addYears(rangeEnd, 2) // Default: 2 years from range end

  let currentDate = new Date(eventStart)
  let instanceCount = 0
  const maxInstances = 365 // Safety limit

  while (isBefore(currentDate, recurrenceEnd) && instanceCount < maxInstances) {
    // Check if this instance falls within our range
    if (!isBefore(currentDate, rangeStart) && !isAfter(currentDate, rangeEnd)) {
      const instanceStart = new Date(currentDate)
      const instanceEnd = new Date(currentDate.getTime() + duration)

      instances.push({
        ...event,
        id: `${event.id}_${currentDate.getTime()}`, // Unique ID for each instance
        startDate: instanceStart.toISOString(),
        endDate: instanceEnd.toISOString(),
        isRecurring: true,
        recurringParentId: event.id,
        instanceDate: currentDate.toISOString()
      })
    }

    // Move to next occurrence
    switch (event.recurrence.type) {
      case 'daily':
        currentDate = addDays(currentDate, 1)
        break
      case 'weekly':
        currentDate = addWeeks(currentDate, 1)
        break
      case 'monthly':
        currentDate = addMonths(currentDate, 1)
        break
      case 'yearly':
        currentDate = addYears(currentDate, 1)
        break
      default:
        return instances
    }

    instanceCount++

    // Stop if we're way past the range (optimization)
    if (isAfter(currentDate, addMonths(rangeEnd, 3))) {
      break
    }
  }

  return instances
}

/**
 * Check if an event is a recurring event
 */
export function isRecurringEvent(event) {
  return event.recurrence && event.recurrence.type !== 'none'
}

/**
 * Check if an event is an instance of a recurring event
 */
export function isRecurringInstance(event) {
  return event.isRecurring && event.recurringParentId
}

/**
 * Get all instances of recurring events in a date range
 */
export function getAllEventInstancesInRange(events, rangeStart, rangeEnd) {
  const allInstances = []

  events.forEach(event => {
    if (isRecurringEvent(event)) {
      const instances = generateRecurringInstances(event, rangeStart, rangeEnd)
      allInstances.push(...instances)
    } else {
      // Check if non-recurring event falls in range
      const eventStart = startOfDay(new Date(event.startDate))
      const eventEnd = startOfDay(new Date(event.endDate))

      if (!isAfter(eventStart, rangeEnd) && !isBefore(eventEnd, rangeStart)) {
        allInstances.push(event)
      }
    }
  })

  return allInstances
}
