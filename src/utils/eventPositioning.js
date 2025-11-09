/**
 * Utility functions for positioning overlapping events in calendar views
 */

/**
 * Check if two events overlap in time
 */
export function eventsOverlap(event1, event2) {
  const start1 = new Date(event1.startDate).getTime()
  const end1 = new Date(event1.endDate).getTime()
  const start2 = new Date(event2.startDate).getTime()
  const end2 = new Date(event2.endDate).getTime()

  return start1 < end2 && start2 < end1
}

/**
 * Calculate positioning for overlapping events
 * Returns array of events with additional positioning properties
 */
export function calculateEventPositions(events) {
  if (events.length === 0) return []
  if (events.length === 1) {
    return events.map(event => ({
      ...event,
      columnIndex: 0,
      totalColumns: 1,
      widthPercent: 100,
      leftPercent: 0
    }))
  }

  // Sort events by start time, then by duration (longer events first)
  const sortedEvents = [...events].sort((a, b) => {
    const startDiff = new Date(a.startDate) - new Date(b.startDate)
    if (startDiff !== 0) return startDiff

    // If same start time, longer events come first
    const durationA = new Date(a.endDate) - new Date(a.startDate)
    const durationB = new Date(b.endDate) - new Date(b.startDate)
    return durationB - durationA
  })

  // Group overlapping events into columns
  const columns = []
  const eventPositions = new Map()

  sortedEvents.forEach(event => {
    // Find the first column where this event doesn't overlap
    let columnIndex = 0
    let placed = false

    while (!placed) {
      if (!columns[columnIndex]) {
        columns[columnIndex] = []
      }

      // Check if event overlaps with any event in this column
      const overlaps = columns[columnIndex].some(existingEvent =>
        eventsOverlap(event, existingEvent)
      )

      if (!overlaps) {
        columns[columnIndex].push(event)
        eventPositions.set(event, { columnIndex, event })
        placed = true
      } else {
        columnIndex++
      }
    }
  })

  const totalColumns = columns.length

  // Calculate positions for each event
  return sortedEvents.map(event => {
    const position = eventPositions.get(event)
    const columnIndex = position.columnIndex

    // Find how many columns this event spans
    // (check if there are overlapping events in adjacent columns)
    let columnsToSpan = 1
    let maxColumn = columnIndex

    // Check events that overlap with this one
    for (let col = columnIndex + 1; col < totalColumns; col++) {
      const hasOverlap = columns[col].some(e => eventsOverlap(event, e))
      if (hasOverlap) {
        maxColumn = col
      }
    }

    // Calculate width - leave some gap between events
    const gapPercent = 1 // 1% gap between events
    const widthPercent = (100 / totalColumns) - gapPercent
    const leftPercent = (columnIndex * 100 / totalColumns)

    return {
      ...event,
      columnIndex,
      totalColumns,
      widthPercent,
      leftPercent
    }
  })
}

/**
 * Group events by day for multi-day views
 */
export function groupEventsByDay(events) {
  const grouped = new Map()

  events.forEach(event => {
    const dayKey = new Date(event.startDate).toDateString()

    if (!grouped.has(dayKey)) {
      grouped.set(dayKey, [])
    }

    grouped.get(dayKey).push(event)
  })

  return grouped
}

/**
 * Calculate event position in week/day view based on time
 */
export function calculateTimePosition(event, hourRangeStart = 0, hourRangeEnd = 24) {
  const startDate = new Date(event.startDate)
  const endDate = new Date(event.endDate)

  const startHour = startDate.getHours()
  const startMinute = startDate.getMinutes()
  const endHour = endDate.getHours()
  const endMinute = endDate.getMinutes()

  const startDecimal = startHour + startMinute / 60
  const endDecimal = endHour + endMinute / 60

  const totalHours = hourRangeEnd - hourRangeStart
  const hourHeight = 60 // pixels per hour

  const top = (startDecimal - hourRangeStart) * hourHeight
  const bottom = (endDecimal - hourRangeStart) * hourHeight
  const height = bottom - top

  return {
    top: `${top}px`,
    height: `${Math.max(height, 20)}px` // Minimum 20px height
  }
}
