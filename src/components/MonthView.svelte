<script>
  import { format, isSameMonth, isToday } from 'date-fns'
  import { calendarStore } from '../stores/calendarStore.svelte.js'
  import { getMonthDays, createDateTimeString, getTimeFromDateTime } from '../utils/dateUtils.js'
  import { CATEGORIES } from '../utils/constants.js'

  let { onEventClick, onDateClick, onContextMenu } = $props()

  const store = calendarStore
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  let draggedEvent = $state(null)
  let dragOverDate = $state(null)

  function getCategoryColor(categoryId) {
    const category = CATEGORIES.find(c => c.id === categoryId)
    return category?.color || '#6b7280'
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
  <div class="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
    {#each weekDays as day}
      <div class="py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 last:border-r-0">
        {day}
      </div>
    {/each}
  </div>

  <!-- Calendar grid -->
  <div class="grid grid-cols-7 flex-1 border-l border-gray-200 dark:border-gray-700">
    {#each getMonthDays(store.currentDate) as day}
      {@const dayEvents = store.getEventsForDate(day)}
      {@const isCurrentMonth = isSameMonth(day, store.currentDate)}
      {@const isTodayDate = isToday(day)}

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
          {#each dayEvents.slice(0, 3) as event}
            {@const color = getCategoryColor(event.category)}
            <button
              draggable="true"
              ondragstart={(e) => handleDragStart(event, e)}
              onclick={(e) => {
                e.stopPropagation()
                onEventClick(event)
              }}
              oncontextmenu={(e) => {
                e.stopPropagation()
                onContextMenu(e, event)
              }}
              class="w-full text-left px-2 py-1 rounded text-xs font-medium truncate hover:opacity-80 transition-opacity cursor-move"
              style={`background-color: ${color}20; color: ${color}; border-left: 3px solid ${color}`}
              title={event.title}
            >
              {format(new Date(event.startDate), 'h:mm a')} {event.title}
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
