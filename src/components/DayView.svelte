<script>
  import { format } from 'date-fns'
  import { calendarStore } from '../stores/calendarStore.svelte.js'
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
      top: `${startHour * 60}px`,
      height: `${duration * 60}px`
    }
  }

  $effect(() => {
    store.currentDate
    store.events
  })
</script>

<div class="flex flex-col h-full bg-white overflow-hidden">
  <!-- Day header -->
  <div class="border-b border-gray-200 p-4 sticky top-0 bg-white z-10">
    <div class="text-2xl font-bold text-gray-900">{format(store.currentDate, 'EEEE')}</div>
    <div class="text-sm text-gray-600">{format(store.currentDate, 'MMMM d, yyyy')}</div>
  </div>

  <!-- Time grid -->
  <div class="flex-1 overflow-y-auto">
    <div class="relative">
      {#each hours as hour}
        <div class="flex border-b border-gray-200" style="height: 60px;">
          <div class="w-20 text-xs text-gray-500 text-right pr-2 pt-1 border-r border-gray-200">
            {format(new Date().setHours(hour, 0, 0, 0), 'h:mm a')}
          </div>
          <div class="flex-1 hover:bg-gray-50 transition-colors"></div>
        </div>
      {/each}

      <!-- Events overlay -->
      {#each store.getEventsForDate(store.currentDate) as event}
        {@const color = getCategoryColor(event.category)}
        {@const position = getEventPosition(event)}
        <button
          onclick={() => onEventClick(event)}
          class="absolute px-3 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
          style={`
            background-color: ${color}20;
            color: ${color};
            border-left: 4px solid ${color};
            left: 84px;
            right: 8px;
            top: ${position.top};
            min-height: ${position.height};
          `}
        >
          <div class="font-bold text-base">{event.title}</div>
          <div class="text-xs opacity-75 mt-1">
            {format(new Date(event.startDate), 'h:mm a')} - {format(new Date(event.endDate), 'h:mm a')}
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
