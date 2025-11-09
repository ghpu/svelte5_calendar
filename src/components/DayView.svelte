<script>
  import { format, startOfDay, endOfDay, isSameDay } from 'date-fns'
  import { calendarStore } from '../stores/calendarStore.svelte.js'
  import { calendarsStore } from '../stores/calendarsStore.svelte.js'
  import { settingsStore } from '../stores/settingsStore.svelte.js'
  import { isWeekend, isWithinWorkingHours, formatDateByPattern } from '../utils/dateUtils.js'
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
    // Regenerate cached instances only when day or events change
    const dayStart = startOfDay(store.currentDate)
    const newKey = `${dayStart.getTime()}-${store.events.length}-${store.filteredEvents.length}`

    if (cacheKey !== newKey) {
      const dayEnd = endOfDay(store.currentDate)

      // Generate instances only once per day
      cachedInstances = getAllEventInstancesInRange(store.filteredEvents, dayStart, dayEnd)

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
    const duration = (end - start) / (1000 * 60 * 60)

    return {
      top: `${(startHour - settings.hourRangeStart) * 60}px`,
      height: `${duration * 60}px`
    }
  }

  function handleTimeSlotClick(hour) {
    const time = `${hour.toString().padStart(2, '0')}:00`
    onTimeSlotClick(store.currentDate, time)
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
    return cachedInstances.filter(event => event.isAllDay)
  }

  function getTimedEvents() {
    const events = cachedInstances.filter(event => !event.isAllDay)

    // Calculate positions for overlapping events
    return calculateEventPositions(events)
  }
</script>

<div class="flex flex-col h-full bg-white dark:bg-gray-800 overflow-hidden">
  <!-- Day header -->
  <div class="border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 bg-white dark:bg-gray-800 z-10">
    <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">{format(store.currentDate, 'EEEE')}</div>
    <div class="text-sm text-gray-600 dark:text-gray-400">
      {formatDateByPattern(store.currentDate, settings.dateFormat)}
    </div>
  </div>

  <!-- All-day events row -->
  {#if getAllDayEvents().length > 0}
    <div class="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 p-3">
      <div class="text-xs text-gray-500 dark:text-gray-400 mb-2">All Day</div>
      <div class="space-y-2">
        {#each getAllDayEvents() as event}
          {@const color = getEventColor(event)}
          {@const isRecurring = isRecurringEvent(event)}
          {@const categoryInfo = CATEGORIES.find(c => c.id === event.category)}
          <button
            onclick={(e) => {
              e.stopPropagation()
              onEventClick(event)
            }}
            oncontextmenu={(e) => {
              e.stopPropagation()
              onContextMenu(e, event)
            }}
            class="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity cursor-pointer"
            style={`background-color: ${color}20; color: ${color}; border-left: 4px solid ${color}`}
            title={event.title}
          >
            <div class="font-bold flex items-center gap-1">
              {#if categoryInfo}
                <div class="w-4 h-4 flex-shrink-0 opacity-75" style={`color: ${categoryInfo.color}`}>
                  {@html categoryInfo.icon}
                </div>
              {/if}
              {#if isRecurring}
                <span class="text-xs">↻</span>
              {/if}
              <span>{event.title}</span>
            </div>
            {#if event.location}
              <div class="text-xs opacity-75 mt-1 flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {event.location}
              </div>
            {/if}
          </button>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Time grid -->
  <div class="flex-1 overflow-y-auto">
    <div class="relative">
      {#each getVisibleHours() as hour}
        {@const isWeekendDay = isWeekend(store.currentDate)}
        <div class="flex border-b border-gray-200 dark:border-gray-700" style="height: 60px;">
          <div class="w-20 text-xs text-gray-500 dark:text-gray-400 text-right pr-2 pt-1 border-r border-gray-200 dark:border-gray-700">
            {format(new Date().setHours(hour, 0, 0, 0), settings.timeFormat === '24h' ? 'HH:mm' : 'h:mm a')}
          </div>
          <div
            class="flex-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer {isWorkingHour(hour) ? 'working-hours' : ''} {isWeekendDay && settings.highlightWeekends ? 'weekend' : ''}"
            onclick={() => handleTimeSlotClick(hour)}
            oncontextmenu={(e) => onContextMenu(e, null)}
          ></div>
        </div>
      {/each}

      <!-- Events overlay (timed events only) -->
      {#each getTimedEvents() as event}
        {@const color = getEventColor(event)}
        {@const position = getEventPosition(event)}
        {@const isRecurring = isRecurringEvent(event)}
        {@const categoryInfo = CATEGORIES.find(c => c.id === event.category)}
        {@const eventWidth = event.widthPercent}
        {@const eventLeft = 84 + (event.leftPercent * 0.01 * (100 - 84))}
        <button
          onclick={(e) => {
            e.stopPropagation()
            onEventClick(event)
          }}
          oncontextmenu={(e) => {
            e.stopPropagation()
            onContextMenu(e, event)
          }}
          class="absolute px-3 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
          style={`
            background-color: ${color}20;
            color: ${color};
            border-left: 4px solid ${color};
            left: calc(${eventLeft}px);
            width: calc(${eventWidth}% * (100vw - 84px) / 100 - 8px);
            top: ${position.top};
            min-height: ${position.height};
          `}
        >
          <div class="font-bold text-base flex items-center gap-1">
            {#if categoryInfo}
              <div class="w-4 h-4 flex-shrink-0 opacity-75" style={`color: ${categoryInfo.color}`}>
                {@html categoryInfo.icon}
              </div>
            {/if}
            {#if isRecurring}
              <span class="text-xs">↻</span>
            {/if}
            <span>{event.title}</span>
          </div>
          <div class="text-xs opacity-75 mt-1">
            {format(new Date(event.startDate), settings.timeFormat === '24h' ? 'HH:mm' : 'h:mm a')} - {format(new Date(event.endDate), settings.timeFormat === '24h' ? 'HH:mm' : 'h:mm a')}
          </div>
          {#if event.location}
            <div class="text-xs opacity-75 mt-1 flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {event.location}
            </div>
          {/if}
        </button>
      {/each}
    </div>
  </div>
</div>
