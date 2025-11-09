<script>
  import { format, isToday } from 'date-fns'
  import { calendarStore } from '../stores/calendarStore.svelte.js'
  import { settingsStore } from '../stores/settingsStore.svelte.js'
  import { getWeekDays, isWeekend, isWithinWorkingHours } from '../utils/dateUtils.js'
  import { CATEGORIES } from '../utils/constants.js'

  let { onEventClick, onTimeSlotClick, onContextMenu } = $props()

  const store = calendarStore
  const settings = settingsStore

  $effect(() => {
    store.currentDate
    store.events
  })

  function getCategoryColor(categoryId) {
    const category = CATEGORIES.find(c => c.id === categoryId)
    return category?.color || '#6b7280'
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

  function getAllDayEvents(day) {
    return store.getEventsForDate(day).filter(event => event.isAllDay)
  }

  function getTimedEvents(day) {
    return store.getEventsForDate(day).filter(event => !event.isAllDay)
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
        <div class="text-xs font-medium text-gray-600 dark:text-gray-400">{format(day, 'EEE')}</div>
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
  <div class="grid grid-cols-[60px_repeat(7,1fr)] border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 min-h-[40px]">
    <div class="py-2 px-2 text-xs text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
      All Day
    </div>
    {#each getWeekDays(store.currentDate, settings.firstDayOfWeek) as day}
      {@const allDayEvents = getAllDayEvents(day)}
      <div class="border-r border-gray-200 dark:border-gray-700 last:border-r-0 p-1 space-y-1">
        {#each allDayEvents as event}
          {@const color = getCategoryColor(event.category)}
          <button
            onclick={(e) => {
              e.stopPropagation()
              onEventClick(event)
            }}
            oncontextmenu={(e) => {
              e.stopPropagation()
              onContextMenu(e, event)
            }}
            class="w-full text-left px-2 py-1 rounded text-xs font-medium truncate hover:opacity-80 transition-opacity cursor-pointer"
            style={`background-color: ${color}20; color: ${color}; border-left: 3px solid ${color}`}
            title={event.title}
          >
            {event.title}
          </button>
        {/each}
      </div>
    {/each}
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
          {@const color = getCategoryColor(event.category)}
          {@const position = getEventPosition(event)}
          <button
            onclick={(e) => {
              e.stopPropagation()
              onEventClick(event)
            }}
            oncontextmenu={(e) => {
              e.stopPropagation()
              onContextMenu(e, event)
            }}
            class="absolute px-2 py-1 rounded text-xs font-medium truncate hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
            style={`
              background-color: ${color}20;
              color: ${color};
              border-left: 3px solid ${color};
              left: calc(60px + ${dayIndex} * (100% - 60px) / 7 + 4px);
              width: calc((100% - 60px) / 7 - 8px);
              top: ${position.top};
              min-height: ${position.height};
            `}
            title={event.title}
          >
            <div class="font-semibold">{event.title}</div>
            <div class="text-[10px] opacity-75">
              {format(new Date(event.startDate), settings.timeFormat === '24h' ? 'HH:mm' : 'h:mm a')} - {format(new Date(event.endDate), settings.timeFormat === '24h' ? 'HH:mm' : 'h:mm a')}
            </div>
          </button>
        {/each}
      {/each}
    </div>
  </div>
</div>
