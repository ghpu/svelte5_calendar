<script>
  import { _ } from 'svelte-i18n'
  import { calendarStore } from '../stores/calendarStore.svelte.js'
  import { calendarsStore } from '../stores/calendarsStore.svelte.js'
  import { settingsStore } from '../stores/settingsStore.svelte.js'
  import { CATEGORIES, TIMEZONES, KEYBOARD_SHORTCUTS } from '../utils/constants.js'
  import { format, startOfMonth, addMonths, subMonths, isSameMonth, isToday, isSameDay } from 'date-fns'
  import { getMonthDays, formatDateI18n } from '../utils/dateUtils.js'
  import CalendarManagementModal from './CalendarManagementModal.svelte'

  let { onImport } = $props()

  const store = calendarStore
  const calendars = calendarsStore
  const settings = settingsStore
  let showShortcuts = $state(false)
  let showCalendarManagement = $state(false)
  let fileInput
  let miniCalendarDate = $state(new Date())

  function goToPreviousMonth() {
    miniCalendarDate = subMonths(miniCalendarDate, 1)
  }

  function goToNextMonth() {
    miniCalendarDate = addMonths(miniCalendarDate, 1)
  }

  function selectDate(date) {
    store.setCurrentDate(date)
  }

  function getMiniCalendarWeekDays() {
    const allDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    const startDay = settings.firstDayOfWeek
    return [...allDays.slice(startDay), ...allDays.slice(0, startDay)]
  }

  function handleImportClick() {
    fileInput.click()
  }

  function handleFileSelect(e) {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        onImport(e.target.result)
      }
      reader.readAsText(file)
    }
  }
</script>

<aside class="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full overflow-hidden">
  <!-- Search -->
  <div class="p-4 border-b border-gray-200 dark:border-gray-700">
    <div class="relative">
      <input
        type="text"
        bind:value={store.searchQuery}
        placeholder="Search events... (Press /)"
        class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500"
      />
      <svg
        class="absolute left-3 top-2.5 w-5 h-5 text-gray-400 dark:text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  </div>

  <!-- Mini calendar -->
  <div class="p-4 border-b border-gray-200 dark:border-gray-700">
    <!-- Month navigation -->
    <div class="flex items-center justify-between mb-3">
      <button
        onclick={goToPreviousMonth}
        class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
      >
        <svg class="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div class="text-sm font-semibold text-gray-700 dark:text-gray-300">
        {formatDateI18n(miniCalendarDate, 'MMMM yyyy')}
      </div>
      <button
        onclick={goToNextMonth}
        class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
      >
        <svg class="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Calendar grid -->
    <div class="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
      <!-- Week day headers -->
      {#each getMiniCalendarWeekDays() as day}
        <div class="bg-white dark:bg-gray-800 text-center py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
          {day}
        </div>
      {/each}

      <!-- Calendar days -->
      {#each getMonthDays(miniCalendarDate, settings.firstDayOfWeek) as day}
        {@const isCurrentMonth = isSameMonth(day, miniCalendarDate)}
        {@const isTodayDate = isToday(day)}
        {@const isSelected = isSameDay(day, store.currentDate)}
        {@const hasEvents = store.getEventsForDate(day).length > 0}
        <button
          onclick={() => selectDate(day)}
          class="bg-white dark:bg-gray-800 aspect-square text-xs flex items-center justify-center transition-colors relative {!isCurrentMonth ? 'text-gray-400 dark:text-gray-600' : 'text-gray-900 dark:text-gray-100'} {isTodayDate ? 'font-bold' : ''} {isSelected ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}"
        >
          {format(day, 'd')}
          {#if hasEvents && !isSelected}
            <div class="absolute bottom-0.5 w-1 h-1 bg-blue-500 rounded-full"></div>
          {/if}
        </button>
      {/each}
    </div>
  </div>

  <!-- Calendars -->
  <div class="p-4 border-b border-gray-200 dark:border-gray-700">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">{$_('sidebar.calendars')}</h3>
      <button
        onclick={() => showCalendarManagement = true}
        class="p-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        title="Manage calendars"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    </div>
    <div class="space-y-2">
      {#each calendars.calendars as calendar}
        <label class="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors">
          <input
            type="checkbox"
            checked={calendar.visible}
            onchange={() => calendars.toggleCalendar(calendar.id)}
            class="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
          />
          <div class="flex items-center gap-2 flex-1">
            <div class="w-3 h-3 rounded-full" style={`background-color: ${calendar.color}`}></div>
            <span class="text-sm text-gray-700 dark:text-gray-300">{calendar.name}</span>
          </div>
        </label>
      {/each}
    </div>
  </div>

  <!-- Categories filter -->
  <div class="p-4 border-b border-gray-200 dark:border-gray-700">
    <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{$_('sidebar.categories')}</h3>
    <div class="space-y-2">
      {#each CATEGORIES as category}
        {@const isSelected = store.selectedCategories.includes(category.id)}
        <label class="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors">
          <input
            type="checkbox"
            checked={isSelected}
            onchange={() => store.toggleCategory(category.id)}
            class="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
          />
          <div class="flex items-center gap-2 flex-1">
            <div class="w-5 h-5" style={`color: ${category.color}`}>
              {@html category.icon}
            </div>
            <span class="text-sm text-gray-700 dark:text-gray-300">{$_(`categories.${category.id}`)}</span>
          </div>
        </label>
      {/each}
    </div>
  </div>

  <!-- Timezone -->
  <div class="p-4 border-b border-gray-200 dark:border-gray-700">
    <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{$_('sidebar.timezone')}</h3>
    <select
      bind:value={store.timezone}
      class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      {#each TIMEZONES as tz}
        <option value={tz}>{tz}</option>
      {/each}
    </select>
  </div>

  <!-- Actions -->
  <div class="p-4 border-b border-gray-200 space-y-2">
    <button
      onclick={() => store.exportToICal()}
      class="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Export to iCal
    </button>

    <button
      onclick={handleImportClick}
      class="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
      Import iCal
    </button>

    <input
      bind:this={fileInput}
      type="file"
      accept=".ics,.ical"
      onchange={handleFileSelect}
      class="hidden"
    />
  </div>

  <!-- Keyboard shortcuts -->
  <div class="p-4 flex-1">
    <button
      onclick={() => showShortcuts = !showShortcuts}
      class="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
    >
      <span class="flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        {$_('sidebar.keyboardShortcuts')}
      </span>
      <svg
        class="w-4 h-4 transition-transform {showShortcuts ? 'rotate-180' : ''}"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    {#if showShortcuts}
      <div class="mt-3 space-y-2 text-xs">
        {#each KEYBOARD_SHORTCUTS as shortcut}
          <div class="flex items-center justify-between text-gray-600 dark:text-gray-400">
            <span>{shortcut.description}</span>
            <kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 font-mono text-gray-700 dark:text-gray-300">
              {shortcut.key}
            </kbd>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Stats -->
  <div class="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
    <div class="text-xs text-gray-600 dark:text-gray-400">
      <div class="flex items-center justify-between mb-1">
        <span>Total Events:</span>
        <span class="font-semibold text-gray-900 dark:text-gray-100">{store.events.length}</span>
      </div>
      <div class="flex items-center justify-between">
        <span>Filtered Events:</span>
        <span class="font-semibold text-gray-900 dark:text-gray-100">{store.filteredEvents.length}</span>
      </div>
    </div>
  </div>
</aside>

<CalendarManagementModal
  isOpen={showCalendarManagement}
  onClose={() => showCalendarManagement = false}
/>
