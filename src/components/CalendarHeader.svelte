<script>
  import { format } from 'date-fns'
  import { _ } from 'svelte-i18n'
  import { calendarStore } from '../stores/calendarStore.svelte.js'
  import { settingsStore } from '../stores/settingsStore.svelte.js'

  let { onNewEvent, onOpenSettings } = $props()

  const store = calendarStore
  const settings = settingsStore

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

  function cycleTheme() {
    const themes = ['light', 'dark', 'high-contrast']
    const currentIndex = themes.indexOf(settings.theme)
    const nextIndex = (currentIndex + 1) % themes.length
    settings.setTheme(themes[nextIndex])
  }

  function getThemeIcon() {
    switch (settings.theme) {
      case 'light':
        return 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
      case 'dark':
        return 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
      case 'high-contrast':
        return 'M12 3v18m0-18a9 9 0 110 18 9 9 0 010-18z'
      default:
        return ''
    }
  }

  function getThemeLabel() {
    switch (settings.theme) {
      case 'light':
        return $_('settings.light')
      case 'dark':
        return $_('settings.dark')
      case 'high-contrast':
        return $_('settings.highContrast')
      default:
        return ''
    }
  }
</script>

<header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-4">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Calendar Pro</h1>

      <button
        onclick={() => store.goToToday()}
        class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
      >
        {$_('common.today')}
      </button>

      <div class="flex items-center gap-2">
        <button
          onclick={() => store.prevPeriod()}
          class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title={$_('navigation.previous')}
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onclick={() => store.nextPeriod()}
          class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title={$_('navigation.next')}
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 min-w-[280px]">
        {getHeaderText()}
      </h2>
    </div>

    <div class="flex items-center gap-3">
      <!-- Theme Toggle -->
      <button
        onclick={cycleTheme}
        class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        title={`${$_('settings.theme')}: ${getThemeLabel()}`}
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={getThemeIcon()} />
        </svg>
      </button>

      <!-- Settings -->
      <button
        onclick={onOpenSettings}
        class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        title={$_('settings.title')}
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      <div class="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

      <div class="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        <button
          onclick={() => store.setView('month')}
          class={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            store.view === 'month'
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          {$_('views.month')}
        </button>
        <button
          onclick={() => store.setView('week')}
          class={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            store.view === 'week'
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          {$_('views.week')}
        </button>
        <button
          onclick={() => store.setView('day')}
          class={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            store.view === 'day'
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          {$_('views.day')}
        </button>
      </div>

      <button
        onclick={onNewEvent}
        class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {$_('event.createNew')}
      </button>
    </div>
  </div>
</header>
