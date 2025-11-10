<script>
  import { _ } from 'svelte-i18n'
  import { get } from 'svelte/store'
  import { format, isSameMonth, isToday, isSameDay, startOfDay, endOfDay, isWithinInterval, addDays, differenceInDays, getWeek, startOfMonth, endOfMonth, isAfter, isBefore } from 'date-fns'
  import { calendarStore } from '../stores/calendarStore.svelte.js'
  import { calendarsStore } from '../stores/calendarsStore.svelte.js'
  import { getMonthDays, createDateTimeString, getTimeFromDateTime } from '../utils/dateUtils.js'
  import { CATEGORIES } from '../utils/constants.js'
  import { settingsStore } from '../stores/settingsStore.svelte.js'
  import { isRecurringEvent, getAllEventInstancesInRange } from '../utils/recurringEvents.js'

  let { onEventClick, onDateClick, onContextMenu } = $props()

  const store = calendarStore
  const calendars = calendarsStore
  const settings = settingsStore

  function getWeekDayHeaders() {
    const t = get(_)
    const allDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    const startDay = settings.firstDayOfWeek
    const reorderedDays = [...allDays.slice(startDay), ...allDays.slice(0, startDay)]
    return reorderedDays.map(day => t(`weekDays.${day}`))
  }

  let draggedEvent = $state(null)
  let dragOverDate = $state(null)
  let monthDays = $state([])

  // Memoize recurring instances for performance
  let cachedInstances = $state([])
  let cacheKey = $state('')

  // Get events for a specific day with multi-day info
  function getEventsForDay(day) {
    const dayStart = startOfDay(day)
    const dayEnd = endOfDay(day)

    // Filter from cached instances instead of regenerating
    const dayEvents = cachedInstances.filter(event => {
      const eventStart = startOfDay(new Date(event.startDate))
      const eventEnd = startOfDay(new Date(event.endDate))

      // Check if event overlaps with this day
      return !isAfter(eventStart, dayEnd) && !isBefore(eventEnd, dayStart)
    })

    return dayEvents.map(event => {
      const eventStart = startOfDay(new Date(event.startDate))
      const eventEnd = startOfDay(new Date(event.endDate))
      const isFirst = isSameDay(dayStart, eventStart)
      const isLast = isSameDay(dayStart, eventEnd)
      const isMultiDay = differenceInDays(eventEnd, eventStart) > 0

      return {
        ...event,
        isFirst,
        isLast,
        isMultiDay,
        isContinuation: !isFirst && !isLast
      }
    })
  }

  $effect(() => {
    monthDays = getMonthDays(store.currentDate, settings.firstDayOfWeek)

    // Regenerate cached instances when month, events, or settings change
    const newKey = `${store.currentDate.getFullYear()}-${store.currentDate.getMonth()}-${store.eventsVersion}-${store.filteredEvents.length}-${settings.firstDayOfWeek}`
    if (cacheKey !== newKey) {
      const monthStart = startOfMonth(store.currentDate)
      const monthEnd = endOfMonth(store.currentDate)

      // Generate instances only once per month
      cachedInstances = getAllEventInstancesInRange(store.filteredEvents, monthStart, monthEnd)

      cacheKey = newKey
    }
  })

  function getEventColor(event) {
    const calendar = calendars.getCalendar(event.calendarId)
    return calendar?.color || '#6b7280'
  }

  function handleDragStart(event, e) {
    draggedEvent = event
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleDragOver(e) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  function handleDragEnter(date) {
    dragOverDate = date
  }

  function handleDragLeave() {
    dragOverDate = null
  }

  function handleDrop(date, e) {
    e.preventDefault()
    e.stopPropagation()
    dragOverDate = null

    if (draggedEvent) {
      const oldStartTime = getTimeFromDateTime(draggedEvent.startDate)
      const oldEndTime = getTimeFromDateTime(draggedEvent.endDate)

      const newStartDate = createDateTimeString(format(date, 'yyyy-MM-dd'), oldStartTime)
      const newEndDate = createDateTimeString(format(date, 'yyyy-MM-dd'), oldEndTime)

      store.updateEvent(draggedEvent.id, {
        startDate: newStartDate,
        endDate: newEndDate
      })

      draggedEvent = null
    }
  }

  $effect(() => {
    // Force reactivity on store changes
    store.currentDate
    store.events
  })
</script>

<div class="flex flex-col h-full bg-white dark:bg-gray-800">
  <!-- Week day headers -->
  <div class="grid {settings.showWeekNumbers ? 'grid-cols-[40px_repeat(7,1fr)]' : 'grid-cols-7'} border-b border-gray-200 dark:border-gray-700">
    {#if settings.showWeekNumbers}
      <div class="py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
        Wk
      </div>
    {/if}
    {#each getWeekDayHeaders() as day}
      <div class="py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 last:border-r-0">
        {day}
      </div>
    {/each}
  </div>

  <!-- Calendar grid -->
  <div class="grid {settings.showWeekNumbers ? 'grid-cols-[40px_repeat(7,1fr)]' : 'grid-cols-7'} flex-1 border-l border-gray-200 dark:border-gray-700">
    {#each monthDays as day, index}
      {@const dayEvents = getEventsForDay(day)}
      {@const isCurrentMonth = isSameMonth(day, store.currentDate)}
      {@const isTodayDate = isToday(day)}

      {#if settings.showWeekNumbers && index % 7 === 0}
        <div class="flex items-center justify-center border-r border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
          <span class="text-xs font-medium text-gray-500 dark:text-gray-400">
            {getWeek(day, { weekStartsOn: settings.firstDayOfWeek })}
          </span>
        </div>
      {/if}

      <div
        class="min-h-[120px] border-r border-b border-gray-200 dark:border-gray-700 p-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors {!isCurrentMonth ? 'bg-gray-50/50 dark:bg-gray-900/50' : ''} {dragOverDate && isSameMonth(dragOverDate, day) && format(dragOverDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd') ? 'bg-blue-100 dark:bg-blue-900/30' : ''}"
        onclick={() => onDateClick(day)}
        oncontextmenu={(e) => onContextMenu(e, null)}
        ondragover={handleDragOver}
        ondragenter={() => handleDragEnter(day)}
        ondragleave={handleDragLeave}
        ondrop={(e) => handleDrop(day, e)}
      >
        <div class="flex items-center justify-between mb-1">
          <span
            class={`text-sm font-medium ${
              isTodayDate
                ? 'flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white'
                : !isCurrentMonth
                ? 'text-gray-400 dark:text-gray-600'
                : 'text-gray-900 dark:text-gray-100'
            }`}
          >
            {format(day, 'd')}
          </span>
        </div>

        <div class="space-y-1">
          {#each dayEvents.slice(0, 3) as eventInfo}
            {@const color = getEventColor(eventInfo)}
            {@const showTime = !eventInfo.isAllDay && eventInfo.isFirst}
            {@const isRecurring = isRecurringEvent(eventInfo)}
            {@const categoryInfo = CATEGORIES.find(c => c.id === eventInfo.category)}
            <button
              draggable="true"
              ondragstart={(e) => handleDragStart(eventInfo, e)}
              onclick={(e) => {
                e.stopPropagation()
                onEventClick(eventInfo)
              }}
              oncontextmenu={(e) => {
                e.stopPropagation()
                onContextMenu(e, eventInfo)
              }}
              class="w-full text-left px-2 py-1 text-xs font-medium truncate hover:opacity-80 transition-opacity cursor-move flex items-center gap-1 {eventInfo.isMultiDay ? (eventInfo.isFirst ? 'rounded-l' : eventInfo.isLast ? 'rounded-r' : 'rounded-none') : 'rounded'}"
              style={`background-color: ${color}20; color: ${color}; border-left: 3px solid ${color}`}
              title={eventInfo.title}
            >
              {#if !eventInfo.isFirst}
                <span class="text-[10px] opacity-60">←</span>
              {/if}
              {#if categoryInfo}
                <div class="w-3 h-3 flex-shrink-0 opacity-75" style={`color: ${categoryInfo.color}`}>
                  {@html categoryInfo.icon}
                </div>
              {/if}
              {#if isRecurring}
                <span class="text-[10px] opacity-75">↻</span>
              {/if}
              {#if showTime}
                <span class="opacity-75">{format(new Date(eventInfo.startDate), 'h:mm a')}</span>
              {/if}
              <span class="flex-1 truncate">{eventInfo.title}</span>
              {#if eventInfo.isMultiDay && !eventInfo.isLast}
                <span class="text-[10px] opacity-60">→</span>
              {/if}
            </button>
          {/each}

          {#if dayEvents.length > 3}
            <div class="text-xs text-gray-500 dark:text-gray-400 px-2">
              +{dayEvents.length - 3} more
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>
