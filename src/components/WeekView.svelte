<script>
  import { format, isToday } from 'date-fns'
  import { calendarStore } from '../stores/calendarStore.svelte.js'
  import { getWeekDays } from '../utils/dateUtils.js'
  import { CATEGORIES } from '../utils/constants.js'

  let { onEventClick } = $props()

  const store = calendarStore
  const hours = Array.from({ length: 24 }, (_, i) => i)

  function getCategoryColor(categoryId) {
    const category = CATEGORIES.find(c => c.id === categoryId)
    return category?.color || '#6b7280'
  }

  function getEventPosition(event) {
    const start = new Date(event.startDate)
    const end = new Date(event.endDate)
    const startHour = start.getHours() + start.getMinutes() / 60
    const duration = (end - start) / (1000 * 60 * 60)

    return {
      top: `${(startHour / 24) * 100}%`,
      height: `${(duration / 24) * 100}%`
    }
  }

  $effect(() => {
    store.currentDate
    store.events
  })
</script>

<div class="flex flex-col h-full bg-white overflow-hidden">
  <!-- Day headers -->
  <div class="grid grid-cols-[60px_repeat(7,1fr)] border-b border-gray-200 sticky top-0 bg-white z-10">
    <div class="py-3 border-r border-gray-200"></div>
    {#each getWeekDays(store.currentDate) as day}
      {@const isTodayDate = isToday(day)}
      <div class="py-3 text-center border-r border-gray-200 last:border-r-0">
        <div class="text-xs font-medium text-gray-600">{format(day, 'EEE')}</div>
        <div
          class={`text-lg font-semibold ${
            isTodayDate
              ? 'inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white'
              : 'text-gray-900'
          }`}
        >
          {format(day, 'd')}
        </div>
      </div>
    {/each}
  </div>

  <!-- Time grid -->
  <div class="flex-1 overflow-y-auto">
    <div class="relative">
      {#each hours as hour}
        <div class="grid grid-cols-[60px_repeat(7,1fr)] border-b border-gray-200" style="height: 60px;">
          <div class="text-xs text-gray-500 text-right pr-2 pt-1 border-r border-gray-200">
            {format(new Date().setHours(hour, 0, 0, 0), 'h:mm a')}
          </div>
          {#each getWeekDays(store.currentDate) as day}
            <div class="border-r border-gray-200 last:border-r-0 relative hover:bg-gray-50 transition-colors"></div>
          {/each}
        </div>
      {/each}

      <!-- Events overlay -->
      {#each getWeekDays(store.currentDate) as day, dayIndex}
        {@const dayEvents = store.getEventsForDate(day)}
        {#each dayEvents as event}
          {@const color = getCategoryColor(event.category)}
          {@const position = getEventPosition(event)}
          <button
            onclick={() => onEventClick(event)}
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
              {format(new Date(event.startDate), 'h:mm a')} - {format(new Date(event.endDate), 'h:mm a')}
            </div>
          </button>
        {/each}
      {/each}
    </div>
  </div>
</div>
