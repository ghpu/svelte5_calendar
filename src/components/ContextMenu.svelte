<script>
  import { CATEGORIES, EVENT_STATUS, EVENT_PRIORITY } from '../utils/constants.js'

  let {
    x = $bindable(0),
    y = $bindable(0),
    visible = $bindable(false),
    event = null,
    onNewEvent,
    onEdit,
    onDuplicate,
    onDelete,
    onChangeCategory,
    onChangeStatus,
    onChangePriority
  } = $props()

  let menuElement = $state(null)

  // Close menu when clicking outside
  function handleClickOutside(e) {
    if (menuElement && !menuElement.contains(e.target)) {
      visible = false
    }
  }

  // Close on escape key
  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      visible = false
    }
  }

  $effect(() => {
    if (visible) {
      document.addEventListener('click', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
      return () => {
        document.removeEventListener('click', handleClickOutside)
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  })

  function handleAction(action, ...args) {
    action(...args)
    visible = false
  }
</script>

{#if visible}
  <div
    bind:this={menuElement}
    class="fixed bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 min-w-[200px] z-[100]"
    style={`left: ${x}px; top: ${y}px;`}
  >
    {#if !event}
      <!-- No event context menu (clicked on empty space) -->
      <button
        onclick={() => handleAction(onNewEvent)}
        class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span class="text-sm text-gray-700 dark:text-gray-300">New Event</span>
      </button>
    {:else}
      <!-- Event context menu -->
      <button
        onclick={() => handleAction(onEdit, event)}
        class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        <span class="text-sm text-gray-700 dark:text-gray-300">Edit Event</span>
      </button>

      <button
        onclick={() => handleAction(onDuplicate, event)}
        class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <span class="text-sm text-gray-700 dark:text-gray-300">Duplicate Event</span>
      </button>

      <div class="h-px bg-gray-200 dark:bg-gray-700 my-1"></div>

      <!-- Change Category submenu -->
      <div class="relative group">
        <button class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span class="text-sm text-gray-700 dark:text-gray-300">Change Category</span>
          </div>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Submenu -->
        <div class="absolute left-full top-0 ml-1 hidden group-hover:block bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 min-w-[160px]">
          {#each CATEGORIES as category}
            <button
              onclick={() => handleAction(onChangeCategory, event, category.id)}
              class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <div class="w-3 h-3 rounded" style={`background-color: ${category.color}`}></div>
              <span class="text-sm text-gray-700 dark:text-gray-300">{category.name}</span>
            </button>
          {/each}
        </div>
      </div>

      <!-- Change Status submenu -->
      <div class="relative group">
        <button class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-sm text-gray-700 dark:text-gray-300">Mark as</span>
          </div>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Submenu -->
        <div class="absolute left-full top-0 ml-1 hidden group-hover:block bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 min-w-[180px]">
          {#each EVENT_STATUS as status}
            <button
              onclick={() => handleAction(onChangeStatus, event, status.id)}
              class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <span class="text-lg" style={`color: ${status.color}`}>{status.icon}</span>
              <span class="text-sm text-gray-700 dark:text-gray-300">{status.name}</span>
            </button>
          {/each}
        </div>
      </div>

      <!-- Change Priority submenu -->
      <div class="relative group">
        <button class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
            <span class="text-sm text-gray-700 dark:text-gray-300">Set Priority</span>
          </div>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Submenu -->
        <div class="absolute left-full top-0 ml-1 hidden group-hover:block bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 min-w-[140px]">
          {#each EVENT_PRIORITY as priority}
            <button
              onclick={() => handleAction(onChangePriority, event, priority.id)}
              class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <span style={`color: ${priority.color}`}>{priority.icon}</span>
              <span class="text-sm text-gray-700 dark:text-gray-300">{priority.name}</span>
            </button>
          {/each}
        </div>
      </div>

      <div class="h-px bg-gray-200 dark:bg-gray-700 my-1"></div>

      <button
        onclick={() => handleAction(onDelete, event)}
        class="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
      >
        <svg class="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        <span class="text-sm text-red-600 dark:text-red-400">Delete Event</span>
      </button>
    {/if}
  </div>
{/if}
