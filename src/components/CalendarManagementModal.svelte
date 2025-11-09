<script>
  import { _ } from 'svelte-i18n'
  import { calendarsStore } from '../stores/calendarsStore.svelte.js'

  let { isOpen = false, onClose } = $props()

  const calendars = calendarsStore

  let formData = $state({
    name: '',
    color: '#3b82f6'
  })

  let editingCalendar = $state(null)

  const colorOptions = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Orange', value: '#f59e0b' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Teal', value: '#14b8a6' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Gray', value: '#6b7280' }
  ]

  function handleAddCalendar(e) {
    e.preventDefault()
    if (formData.name.trim()) {
      calendars.addCalendar(formData.name.trim(), formData.color)
      formData = { name: '', color: '#3b82f6' }
    }
  }

  function handleEditCalendar(calendar) {
    editingCalendar = calendar
    formData = {
      name: calendar.name,
      color: calendar.color
    }
  }

  function handleUpdateCalendar(e) {
    e.preventDefault()
    if (editingCalendar && formData.name.trim()) {
      calendars.updateCalendar(editingCalendar.id, {
        name: formData.name.trim(),
        color: formData.color
      })
      editingCalendar = null
      formData = { name: '', color: '#3b82f6' }
    }
  }

  function handleCancelEdit() {
    editingCalendar = null
    formData = { name: '', color: '#3b82f6' }
  }

  function handleDeleteCalendar(calendar) {
    if (calendar.isDefault) {
      alert('Cannot delete the default calendar')
      return
    }
    if (confirm(`Are you sure you want to delete "${calendar.name}"?`)) {
      calendars.deleteCalendar(calendar.id)
    }
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }
</script>

{#if isOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70" onclick={handleBackdropClick}>
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col" onclick={(e) => e.stopPropagation()}>
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {$_('calendars.manage')}
        </h2>
        <button
          type="button"
          onclick={onClose}
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6">
        <!-- Add/Edit Form -->
        <form onsubmit={editingCalendar ? handleUpdateCalendar : handleAddCalendar} class="space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {editingCalendar ? $_('calendars.editCalendar') : $_('calendars.createNew')}
          </h3>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{$_('calendars.name')}</label>
            <input
              type="text"
              bind:value={formData.name}
              required
              placeholder={$_('calendars.name')}
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{$_('calendars.color')}</label>
            <div class="grid grid-cols-5 gap-2">
              {#each colorOptions as colorOption}
                <button
                  type="button"
                  onclick={() => formData.color = colorOption.value}
                  class="flex items-center justify-center h-10 rounded-lg border-2 transition-all {formData.color === colorOption.value ? 'border-gray-900 dark:border-gray-100 scale-110' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'}"
                  style={`background-color: ${colorOption.value}`}
                  title={colorOption.name}
                >
                  {#if formData.color === colorOption.value}
                    <svg class="w-5 h-5 text-white drop-shadow" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  {/if}
                </button>
              {/each}
            </div>
          </div>

          <div class="flex gap-2">
            {#if editingCalendar}
              <button
                type="button"
                onclick={handleCancelEdit}
                class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                {$_('common.cancel')}
              </button>
              <button
                type="submit"
                class="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {$_('common.save')}
              </button>
            {:else}
              <button
                type="submit"
                class="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {$_('calendars.createNew')}
              </button>
            {/if}
          </div>
        </form>

        <!-- Calendar List -->
        <div class="space-y-2">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">{$_('sidebar.calendars')}</h3>
          {#each calendars.calendars as calendar}
            <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div class="w-4 h-4 rounded-full" style={`background-color: ${calendar.color}`}></div>
              <div class="flex-1">
                <div class="font-medium text-gray-900 dark:text-gray-100">{calendar.name}</div>
                {#if calendar.isDefault}
                  <div class="text-xs text-gray-500 dark:text-gray-400">{$_('calendars.name')}</div>
                {/if}
              </div>
              <div class="flex gap-2">
                <button
                  onclick={() => handleEditCalendar(calendar)}
                  class="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  title={$_('common.edit')}
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                {#if !calendar.isDefault}
                  <button
                    onclick={() => handleDeleteCalendar(calendar)}
                    class="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    title={$_('common.delete')}
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onclick={onClose}
          class="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {$_('common.close')}
        </button>
      </div>
    </div>
  </div>
{/if}
