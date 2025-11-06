<script>
  import { format } from 'date-fns'
  import { calendarStore } from '../stores/calendarStore.svelte.js'

  let { onNewEvent } = $props()

  const store = calendarStore

  function getHeaderText() {
    switch (store.view) {
      case 'month':
        return format(store.currentDate, 'MMMM yyyy')
      case 'week':
        return format(store.currentDate, "'Week of' MMM d, yyyy")
      case 'day':
        return format(store.currentDate, 'EEEE, MMMM d, yyyy')
      default:
        return ''
    }
  }
</script>

<header class="bg-white border-b border-gray-200 px-6 py-4">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-4">
      <h1 class="text-2xl font-bold text-gray-900">Calendar Pro</h1>

      <button
        onclick={() => store.goToToday()}
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Today
      </button>

      <div class="flex items-center gap-2">
        <button
          onclick={() => store.prevPeriod()}
          class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Previous"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onclick={() => store.nextPeriod()}
          class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Next"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <h2 class="text-xl font-semibold text-gray-800 min-w-[280px]">
        {getHeaderText()}
      </h2>
    </div>

    <div class="flex items-center gap-3">
      <div class="flex gap-1 bg-gray-100 rounded-lg p-1">
        <button
          onclick={() => store.setView('month')}
          class={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            store.view === 'month'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Month
        </button>
        <button
          onclick={() => store.setView('week')}
          class={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            store.view === 'week'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Week
        </button>
        <button
          onclick={() => store.setView('day')}
          class={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            store.view === 'day'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Day
        </button>
      </div>

      <button
        onclick={onNewEvent}
        class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Event
      </button>
    </div>
  </div>
</header>
