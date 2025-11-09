<script>
  let { isOpen = false, onClose, onEditOccurrence, onEditSeries, action = 'edit' } = $props()

  function handleEditOccurrence() {
    onEditOccurrence()
    onClose()
  }

  function handleEditSeries() {
    onEditSeries()
    onClose()
  }
</script>

{#if isOpen}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onclick={onClose}>
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4"
      onclick={(e) => e.stopPropagation()}
    >
      <div class="p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {action === 'edit' ? 'Edit Recurring Event' : 'Delete Recurring Event'}
        </h3>

        <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
          This is a recurring event. What would you like to {action}?
        </p>

        <div class="space-y-3">
          <button
            onclick={handleEditOccurrence}
            class="w-full px-4 py-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-lg transition-colors"
          >
            <div class="font-medium text-gray-900 dark:text-gray-100">
              {action === 'edit' ? 'This occurrence only' : 'Only this occurrence'}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {action === 'edit' ? 'Edit only this event instance' : 'Delete only this event instance'}
            </div>
          </button>

          <button
            onclick={handleEditSeries}
            class="w-full px-4 py-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-lg transition-colors"
          >
            <div class="font-medium text-gray-900 dark:text-gray-100">
              {action === 'edit' ? 'All events in series' : 'All events in the series'}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {action === 'edit' ? 'Edit all recurring instances' : 'Delete all recurring instances'}
            </div>
          </button>
        </div>

        <div class="mt-6 flex justify-end">
          <button
            onclick={onClose}
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
