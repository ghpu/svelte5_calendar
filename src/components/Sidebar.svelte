<script>
  import { calendarStore } from '../stores/calendarStore.svelte.js'
  import { CATEGORIES, TIMEZONES, KEYBOARD_SHORTCUTS } from '../utils/constants.js'
  import { format } from 'date-fns'

  let { onImport } = $props()

  const store = calendarStore
  let showShortcuts = $state(false)
  let fileInput

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

<aside class="w-80 bg-white border-r border-gray-200 flex flex-col h-full overflow-hidden">
  <!-- Search -->
  <div class="p-4 border-b border-gray-200">
    <div class="relative">
      <input
        type="text"
        bind:value={store.searchQuery}
        placeholder="Search events... (Press /)"
        class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <svg
        class="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
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
  <div class="p-4 border-b border-gray-200">
    <div class="text-sm font-semibold text-gray-700 mb-2">
      {format(store.currentDate, 'MMMM yyyy')}
    </div>
    <div class="text-xs text-gray-500">
      Quick navigation for current period
    </div>
  </div>

  <!-- Categories filter -->
  <div class="p-4 border-b border-gray-200">
    <h3 class="text-sm font-semibold text-gray-700 mb-3">Categories</h3>
    <div class="space-y-2">
      {#each CATEGORIES as category}
        {@const isSelected = store.selectedCategories.includes(category.id)}
        <label class="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
          <input
            type="checkbox"
            checked={isSelected}
            onchange={() => store.toggleCategory(category.id)}
            class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <div class="flex items-center gap-2 flex-1">
            <div class="w-3 h-3 rounded" style={`background-color: ${category.color}`}></div>
            <span class="text-sm text-gray-700">{category.name}</span>
          </div>
        </label>
      {/each}
    </div>
  </div>

  <!-- Timezone -->
  <div class="p-4 border-b border-gray-200">
    <h3 class="text-sm font-semibold text-gray-700 mb-3">Timezone</h3>
    <select
      bind:value={store.timezone}
      class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      class="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Export to iCal
    </button>

    <button
      onclick={handleImportClick}
      class="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
      class="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <span class="flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        Keyboard Shortcuts
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
          <div class="flex items-center justify-between text-gray-600">
            <span>{shortcut.description}</span>
            <kbd class="px-2 py-1 bg-gray-100 rounded border border-gray-300 font-mono">
              {shortcut.key}
            </kbd>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Stats -->
  <div class="p-4 bg-gray-50 border-t border-gray-200">
    <div class="text-xs text-gray-600">
      <div class="flex items-center justify-between mb-1">
        <span>Total Events:</span>
        <span class="font-semibold">{store.events.length}</span>
      </div>
      <div class="flex items-center justify-between">
        <span>Filtered Events:</span>
        <span class="font-semibold">{store.filteredEvents.length}</span>
      </div>
    </div>
  </div>
</aside>
