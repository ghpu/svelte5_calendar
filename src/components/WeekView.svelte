<script>
  import { format, isToday, startOfWeek, endOfWeek, isSameDay, startOfDay, endOfDay } from 'date-fns'
  import { calendarStore } from '../stores/calendarStore.svelte.js'
  import { calendarsStore } from '../stores/calendarsStore.svelte.js'
  import { settingsStore } from '../stores/settingsStore.svelte.js'
  import { getWeekDays, isWeekend, isWithinWorkingHours, formatDateI18n, isMultiDayEvent } from '../utils/dateUtils.js'
  import { CATEGORIES } from '../utils/constants.js'
  import { isRecurringEvent, getAllEventInstancesInRange } from '../utils/recurringEvents.js'
  import { calculateEventPositions } from '../utils/eventPositioning.js'

  let { onEventClick, onTimeSlotClick, onContextMenu } = $props()

  const store = calendarStore
  const calendars = calendarsStore
  const settings = settingsStore

  // Memoize recurring instances for performance
  let cachedInstances = $state([])
  let cacheKey = $state('')

  $effect(() => {
    // Regenerate cached instances when week, events, or settings change
    const weekStart = startOfWeek(store.currentDate, { weekStartsOn: settings.firstDayOfWeek })
    const newKey = `${weekStart.getTime()}-${store.eventsVersion}-${store.filteredEvents.length}-${settings.firstDayOfWeek}-${settings.timeFormat}`

    if (cacheKey !== newKey) {
      const weekEnd = endOfWeek(store.currentDate, { weekStartsOn: settings.firstDayOfWeek })

      // Generate instances only once per week
      cachedInstances = getAllEventInstancesInRange(store.filteredEvents, weekStart, weekEnd)

      cacheKey = newKey
    }
  })

  function getEventColor(event) {
    const calendar = calendars.getCalendar(event.calendarId)
    return calendar?.color || '#6b7280'
  }

  function getEventPosition(event) {
    const start = new Date(event.startDate)
    const end = new Date(event.endDate)
    const startHour = start.getHours() + start.getMinutes() / 60
    const endHour = end.getHours() + end.getMinutes() / 60

    // Calculate position relative to visible hour range
    const visibleHours = settings.hourRangeEnd - settings.hourRangeStart
    const relativeStart = startHour - settings.hourRangeStart
    const duration = endHour - startHour

    // Each hour slot is 60px
    return {
      top: `${relativeStart * 60}px`,
      height: `${Math.max(duration * 60, 30)}px` // Minimum 30px height
    }
  }

  // Calculate position for multi-day events on a specific day
  function getEventPositionForDay(event, day) {
    const eventStart = new Date(event.startDate)
    const eventEnd = new Date(event.endDate)
    const dayStart = startOfDay(day)
    const dayEnd = endOfDay(day)

    // Determine the display time range for this specific day
    let displayStart, displayEnd

    if (eventStart < dayStart) {
      // Event started before this day - show from midnight
      displayStart = new Date(dayStart)
    } else {
      // Event starts on this day - show from actual start time
      displayStart = eventStart
    }

    if (eventEnd > dayEnd) {
      // Event continues after this day - show until midnight
      displayEnd = new Date(dayEnd)
    } else {
      // Event ends on this day - show until actual end time
      displayEnd = eventEnd
    }

    const startHour = displayStart.getHours() + displayStart.getMinutes() / 60
    const endHour = displayEnd.getHours() + displayEnd.getMinutes() / 60

    // Calculate position relative to visible hour range
    const relativeStart = startHour - settings.hourRangeStart
    const duration = endHour - startHour

    // Each hour slot is 60px
    return {
      top: `${relativeStart * 60}px`,
      height: `${Math.max(duration * 60, 30)}px` // Minimum 30px height
    }
  }

  function handleTimeSlotClick(day, hour) {
    const time = `${hour.toString().padStart(2, '0')}:00`
    onTimeSlotClick(day, time)
  }

  function getVisibleHours() {
    return Array.from(
      { length: settings.hourRangeEnd - settings.hourRangeStart },
      (_, i) => settings.hourRangeStart + i
    )
  }

  function isWorkingHour(hour) {
    return settings.highlightWorkingHours &&
           isWithinWorkingHours(hour, settings.workingHoursStart, settings.workingHoursEnd)
  }

  function getAllDayEvents() {
    const weekDays = getWeekDays(store.currentDate, settings.firstDayOfWeek)
    const weekStart = startOfDay(weekDays[0])
    const weekEnd = endOfDay(weekDays[6])

    const allDayEvents = cachedInstances.filter(event => event.isAllDay)

    // Process each event to calculate its span across the week
    const processedEvents = []
    allDayEvents.forEach(event => {
      const eventStart = startOfDay(new Date(event.startDate))
      const eventEnd = startOfDay(new Date(event.endDate))

      // Check if event overlaps with this week
      if (eventStart > weekEnd || eventEnd < weekStart) return

      // Find which day column the event starts in (within this week)
      const displayStart = eventStart < weekStart ? weekStart : eventStart
      const displayEnd = eventEnd > weekEnd ? weekEnd : eventEnd

      const startDayIndex = weekDays.findIndex(day => isSameDay(day, displayStart))
      if (startDayIndex === -1) return

      // Calculate how many days this event spans in this week
      let spanDays = 1
      for (let i = startDayIndex + 1; i < weekDays.length; i++) {
        if (displayEnd >= startOfDay(weekDays[i])) {
          spanDays++
        } else {
          break
        }
      }

      processedEvents.push({
        ...event,
        startDayIndex,
        spanDays
      })
    })

    return processedEvents
  }

  function getTimedEvents(day) {
    const dayStart = startOfDay(day)
    const dayEnd = endOfDay(day)

    const events = cachedInstances.filter(event => {
      if (event.isAllDay) return false

      const eventStart = startOfDay(new Date(event.startDate))
      const eventEnd = startOfDay(new Date(event.endDate))

      // Include event if it overlaps with this day
      // Event overlaps if: eventStart <= dayEnd AND eventEnd >= dayStart
      return eventStart <= dayEnd && eventEnd >= dayStart
    })

    // Calculate positions for overlapping events
    return calculateEventPositions(events)
  }
</script>

<div class="flex flex-col h-full bg-white dark:bg-gray-800 overflow-hidden">
  <!-- Day headers -->
  <div class="grid grid-cols-[60px_repeat(7,1fr)] border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
    <div class="py-3 border-r border-gray-200 dark:border-gray-700"></div>
    {#each getWeekDays(store.currentDate, settings.firstDayOfWeek) as day}
      {@const isTodayDate = isToday(day)}
      {@const isWeekendDay = isWeekend(day)}
      <div class="py-3 text-center border-r border-gray-200 dark:border-gray-700 last:border-r-0 {isWeekendDay && settings.highlightWeekends ? 'bg-gray-100/50 dark:bg-gray-900/50' : ''}">
        <div class="text-xs font-medium text-gray-600 dark:text-gray-400">{formatDateI18n(day, 'EEE')}</div>
        <div
          class={`text-lg font-semibold ${
            isTodayDate
              ? 'inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white'
              : 'text-gray-900 dark:text-gray-100'
          }`}
        >
          {format(day, 'd')}
        </div>
      </div>
    {/each}
  </div>

  <!-- All-day events row -->
  <div class="relative grid grid-cols-[60px_repeat(7,1fr)] border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 min-h-[40px]">
    <div class="py-2 px-2 text-xs text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
      All Day
    </div>
    <div class="col-span-7 relative p-1 space-y-1">
      {#each getAllDayEvents() as event}
        {@const color = getEventColor(event)}
        {@const isRecurring = isRecurringEvent(event)}
        {@const categoryInfo = CATEGORIES.find(c => c.id === event.category)}
        {@const dayColumnWidth = (100 / 7)}
        {@const eventLeft = event.startDayIndex * dayColumnWidth}
        {@const eventWidth = event.spanDays * dayColumnWidth}
        <button
          onclick={(e) => {
            e.stopPropagation()
            onEventClick(event)
          }}
          oncontextmenu={(e) => {
            e.stopPropagation()
            onContextMenu(e, event)
          }}
          class="absolute text-left px-2 py-1 rounded text-xs font-medium truncate hover:opacity-80 transition-opacity cursor-pointer flex items-center gap-1"
          style={`
            background-color: ${color}20;
            color: ${color};
            border-left: 3px solid ${color};
            left: calc(${eventLeft}% + 2px);
            width: calc(${eventWidth}% - 4px);
          `}
          title={event.title}
        >
          {#if categoryInfo}
            <div class="w-3 h-3 flex-shrink-0 opacity-75" style={`color: ${categoryInfo.color}`}>
              {@html categoryInfo.icon}
            </div>
          {/if}
          {#if isRecurring}
            <span class="text-[10px]">↻</span>
          {/if}
          <span class="flex-1 truncate">{event.title}</span>
        </button>
      {/each}
    </div>
  </div>

  <!-- Time grid -->
  <div class="flex-1 overflow-y-auto">
    <div class="relative">
      {#each getVisibleHours() as hour}
        <div class="grid grid-cols-[60px_repeat(7,1fr)] border-b border-gray-200 dark:border-gray-700" style="height: 60px;">
          <div class="text-xs text-gray-500 dark:text-gray-400 text-right pr-2 pt-1 border-r border-gray-200 dark:border-gray-700">
            {format(new Date().setHours(hour, 0, 0, 0), settings.timeFormat === '24h' ? 'HH:mm' : 'h:mm a')}
          </div>
          {#each getWeekDays(store.currentDate, settings.firstDayOfWeek) as day}
            {@const isWeekendDay = isWeekend(day)}
            <div
              class="border-r border-gray-200 dark:border-gray-700 last:border-r-0 relative hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer {isWorkingHour(hour) ? 'working-hours' : ''} {isWeekendDay && settings.highlightWeekends ? 'weekend' : ''}"
              onclick={() => handleTimeSlotClick(day, hour)}
              oncontextmenu={(e) => onContextMenu(e, null)}
            ></div>
          {/each}
        </div>
      {/each}

      <!-- Events overlay (timed events only) -->
      {#each getWeekDays(store.currentDate, settings.firstDayOfWeek) as day, dayIndex}
        {@const timedEvents = getTimedEvents(day)}
        {#each timedEvents as event}
          {@const color = getEventColor(event)}
          {@const position = getEventPositionForDay(event, day)}
          {@const isRecurring = isRecurringEvent(event)}
          {@const categoryInfo = CATEGORIES.find(c => c.id === event.category)}
          {@const isMultiDay = isMultiDayEvent(event.startDate, event.endDate)}
          <button
            onclick={(e) => {
              e.stopPropagation()
              onEventClick(event)
            }}
            oncontextmenu={(e) => {
              e.stopPropagation()
              onContextMenu(e, event)
            }}
            class="absolute px-2 py-1 rounded text-xs font-medium hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
            style={`
              background-color: ${color}20;
              color: ${color};
              border-left: 3px solid ${color};
              left: calc(60px + (100% - 60px) * ${dayIndex} / 7 + (100% - 60px) * ${event.leftPercent} / 700);
              width: calc((100% - 60px) * ${event.widthPercent} / 700 - 4px);
              top: ${position.top};
              min-height: ${position.height};
            `}
            title={event.title}
          >
            <div class="font-semibold flex items-center gap-1">
              {#if categoryInfo}
                <div class="w-3 h-3 flex-shrink-0 opacity-75" style={`color: ${categoryInfo.color}`}>
                  {@html categoryInfo.icon}
                </div>
              {/if}
              {#if isRecurring}
                <span class="text-[10px]">↻</span>
              {/if}
              <span class="truncate">{event.title}</span>
            </div>
            <div class="text-[10px] opacity-75">
              {#if isMultiDay}
                {formatDateI18n(new Date(event.startDate), 'EEE')} {format(new Date(event.startDate), settings.timeFormat === '24h' ? 'HH:mm' : 'h:mm a')} - {formatDateI18n(new Date(event.endDate), 'EEE')} {format(new Date(event.endDate), settings.timeFormat === '24h' ? 'HH:mm' : 'h:mm a')}
              {:else}
                {format(new Date(event.startDate), settings.timeFormat === '24h' ? 'HH:mm' : 'h:mm a')} - {format(new Date(event.endDate), settings.timeFormat === '24h' ? 'HH:mm' : 'h:mm a')}
              {/if}
            </div>
          </button>
        {/each}
      {/each}
    </div>
  </div>
</div>
