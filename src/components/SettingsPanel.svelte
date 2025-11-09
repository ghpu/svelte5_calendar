<script>
  import { _ } from 'svelte-i18n'
  import { settingsStore } from '../stores/settingsStore.svelte.js'
  import {
    THEMES,
    DATE_FORMATS,
    TIME_FORMATS,
    FIRST_DAY_OPTIONS,
    REMINDER_OPTIONS
  } from '../utils/constants.js'

  let { onClose } = $props()

  const settings = settingsStore
  let activeTab = $state('general')

  function handleReset() {
    if (confirm('Reset all settings to defaults?')) {
      settings.reset()
    }
  }
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onclick={onClose}>
  <div
    class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
    onclick={(e) => e.stopPropagation()}
  >
    <!-- Header -->
    <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
      <button
        onclick={onClose}
        class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        title="Close settings"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Tabs and Content -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Tab List -->
      <div class="w-48 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
        <button
          onclick={() => activeTab = 'general'}
          class={`w-full text-left px-4 py-2 rounded-lg mb-2 transition-colors ${
            activeTab === 'general'
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
          }`}
        >
          General
        </button>
        <button
          onclick={() => activeTab = 'display'}
          class={`w-full text-left px-4 py-2 rounded-lg mb-2 transition-colors ${
            activeTab === 'display'
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
          }`}
        >
          Display
        </button>
        <button
          onclick={() => activeTab = 'theme'}
          class={`w-full text-left px-4 py-2 rounded-lg mb-2 transition-colors ${
            activeTab === 'theme'
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
          }`}
        >
          Theme
        </button>
        <button
          onclick={() => activeTab = 'notifications'}
          class={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'notifications'
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
          }`}
        >
          Notifications
        </button>
      </div>

      <!-- Tab Content -->
      <div class="flex-1 p-6 overflow-y-auto">
        {#if activeTab === 'general'}
          <div class="space-y-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">General Settings</h3>

            <!-- Language -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <select
                bind:value={settings.language}
                onchange={() => settings.setLanguage(settings.language)}
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {#each settings.languages as lang}
                  <option value={lang.code}>{lang.name}</option>
                {/each}
              </select>
            </div>

            <!-- First Day of Week -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                First Day of Week
              </label>
              <select
                bind:value={settings.firstDayOfWeek}
                onchange={() => settings.setFirstDayOfWeek(settings.firstDayOfWeek)}
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {#each FIRST_DAY_OPTIONS as option}
                  <option value={option.id}>{option.name}</option>
                {/each}
              </select>
            </div>

            <!-- Date Format -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date Format
              </label>
              <select
                bind:value={settings.dateFormat}
                onchange={() => settings.setDateFormat(settings.dateFormat)}
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {#each DATE_FORMATS as format}
                  <option value={format.id}>{format.name}</option>
                {/each}
              </select>
            </div>

            <!-- Time Format -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time Format
              </label>
              <select
                bind:value={settings.timeFormat}
                onchange={() => settings.setTimeFormat(settings.timeFormat)}
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {#each TIME_FORMATS as format}
                  <option value={format.id}>{format.name}</option>
                {/each}
              </select>
            </div>

            <!-- Show Week Numbers -->
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Show Week Numbers
              </label>
              <input
                type="checkbox"
                checked={settings.showWeekNumbers}
                onchange={() => settings.setShowWeekNumbers(!settings.showWeekNumbers)}
                class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
          </div>

        {:else if activeTab === 'display'}
          <div class="space-y-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Display Settings</h3>

            <!-- Default View -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default View
              </label>
              <select
                bind:value={settings.defaultView}
                onchange={() => settings.setDefaultView(settings.defaultView)}
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="month">Month</option>
                <option value="week">Week</option>
                <option value="day">Day</option>
              </select>
            </div>

            <!-- Hour Range -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hour Range for Day/Week View
              </label>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">Start Hour</label>
                  <select
                    bind:value={settings.hourRangeStart}
                    onchange={() => settings.setHourRange(settings.hourRangeStart, settings.hourRangeEnd)}
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {#each Array.from({ length: 24 }, (_, i) => i) as hour}
                      <option value={hour}>{hour}:00</option>
                    {/each}
                  </select>
                </div>
                <div>
                  <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">End Hour</label>
                  <select
                    bind:value={settings.hourRangeEnd}
                    onchange={() => settings.setHourRange(settings.hourRangeStart, settings.hourRangeEnd)}
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {#each Array.from({ length: 24 }, (_, i) => i + 1) as hour}
                      <option value={hour}>{hour}:00</option>
                    {/each}
                  </select>
                </div>
              </div>
            </div>

            <!-- Working Hours -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Working Hours
              </label>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">Start</label>
                  <select
                    bind:value={settings.workingHoursStart}
                    onchange={() => settings.setWorkingHours(settings.workingHoursStart, settings.workingHoursEnd)}
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {#each Array.from({ length: 24 }, (_, i) => i) as hour}
                      <option value={hour}>{hour}:00</option>
                    {/each}
                  </select>
                </div>
                <div>
                  <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">End</label>
                  <select
                    bind:value={settings.workingHoursEnd}
                    onchange={() => settings.setWorkingHours(settings.workingHoursStart, settings.workingHoursEnd)}
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {#each Array.from({ length: 24 }, (_, i) => i + 1) as hour}
                      <option value={hour}>{hour}:00</option>
                    {/each}
                  </select>
                </div>
              </div>
            </div>

            <!-- Toggles -->
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Highlight Working Hours
                </label>
                <input
                  type="checkbox"
                  checked={settings.highlightWorkingHours}
                  onchange={() => settings.toggleHighlightWorkingHours()}
                  class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>

              <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Highlight Weekends
                </label>
                <input
                  type="checkbox"
                  checked={settings.highlightWeekends}
                  onchange={() => settings.toggleHighlightWeekends()}
                  class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>

              <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Compact Mode
                </label>
                <input
                  type="checkbox"
                  checked={settings.compactMode}
                  onchange={() => settings.toggleCompactMode()}
                  class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>

              <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Show Event Preview on Hover
                </label>
                <input
                  type="checkbox"
                  checked={settings.showEventPreviewOnHover}
                  onchange={() => settings.toggleEventPreviewOnHover()}
                  class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

        {:else if activeTab === 'theme'}
          <div class="space-y-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Theme Settings</h3>

            <div class="grid grid-cols-3 gap-4">
              {#each THEMES as theme}
                <button
                  onclick={() => settings.setTheme(theme.id)}
                  class={`p-6 rounded-lg border-2 transition-all ${
                    settings.theme === theme.id
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                  }`}
                >
                  <div class="text-center">
                    <div class={`mx-auto w-12 h-12 rounded-full mb-3 ${
                      theme.id === 'light' ? 'bg-white border-2 border-gray-300' :
                      theme.id === 'dark' ? 'bg-gray-900 border-2 border-gray-700' :
                      'bg-black border-2 border-yellow-400'
                    }`}></div>
                    <div class="font-medium text-gray-900 dark:text-white">{theme.name}</div>
                  </div>
                </button>
              {/each}
            </div>
          </div>

        {:else if activeTab === 'notifications'}
          <div class="space-y-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notification Settings</h3>

            <!-- Default Reminder -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Reminder
              </label>
              <select
                bind:value={settings.defaultReminder}
                onchange={() => settings.setDefaultReminder(settings.defaultReminder)}
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {#each REMINDER_OPTIONS as option}
                  <option value={option.id}>{option.name}</option>
                {/each}
              </select>
            </div>

            <!-- Toggles -->
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sound Notifications
                </label>
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onchange={() => settings.toggleSound()}
                  class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>

              <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Desktop Notifications
                </label>
                <input
                  type="checkbox"
                  checked={settings.desktopNotifications}
                  onchange={() => settings.toggleDesktopNotifications()}
                  class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
      <button
        onclick={handleReset}
        class="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
      >
        Reset to Defaults
      </button>
      <button
        onclick={onClose}
        class="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Close
      </button>
    </div>
  </div>
</div>
