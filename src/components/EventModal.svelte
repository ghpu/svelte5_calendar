<script>
  import { _ } from 'svelte-i18n'
  import { calendarStore } from '../stores/calendarStore.svelte.js'
  import { calendarsStore } from '../stores/calendarsStore.svelte.js'
  import { CATEGORIES, RECURRENCE_TYPES, REMINDER_OPTIONS, EVENT_STATUS, EVENT_PRIORITY } from '../utils/constants.js'
  import { getDateFromDateTime, getTimeFromDateTime, createDateTimeString } from '../utils/dateUtils.js'

  let { event = null, onClose, initialDate = null, initialTime = null } = $props()

  const store = calendarStore
  const calendars = calendarsStore

  let formData = $state({
    title: '',
    description: '',
    startDate: '',
    startTime: '09:00',
    endDate: '',
    endTime: '10:00',
    location: '',
    calendarId: calendars.getDefaultCalendar().id,
    category: 'work',
    status: 'busy',
    priority: 'normal',
    isAllDay: false,
    recurrenceType: 'none',
    recurrenceEndDate: '',
    reminder: 'none',
    attendees: ''
  })

  // Helper function to add hours to a time string
  function addHoursToTime(timeStr, hours) {
    const [h, m] = timeStr.split(':').map(Number)
    const totalMinutes = h * 60 + m + (hours * 60)
    const newHours = Math.floor(totalMinutes / 60) % 24
    const newMinutes = totalMinutes % 60
    return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`
  }

  // Helper function to convert Date to YYYY-MM-DD in local timezone
  function formatDateLocal(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  $effect(() => {
    if (event) {
      formData.title = event.title
      formData.description = event.description || ''
      formData.startDate = getDateFromDateTime(event.startDate)
      formData.startTime = getTimeFromDateTime(event.startDate)
      formData.endDate = getDateFromDateTime(event.endDate)
      formData.endTime = getTimeFromDateTime(event.endDate)
      formData.location = event.location || ''
      formData.calendarId = event.calendarId || calendars.getDefaultCalendar().id
      formData.category = event.category || 'work'
      formData.status = event.status || 'busy'
      formData.priority = event.priority || 'normal'
      formData.isAllDay = event.isAllDay || false
      formData.recurrenceType = event.recurrence?.type || 'none'
      formData.recurrenceEndDate = event.recurrence?.endDate ? getDateFromDateTime(event.recurrence.endDate) : ''
      formData.reminder = event.reminder || 'none'
      formData.attendees = event.attendees?.join(', ') || ''
    } else if (initialDate) {
      const dateStr = formatDateLocal(initialDate)
      formData.startDate = dateStr
      formData.endDate = dateStr

      // Set time if provided, otherwise use current time rounded to next hour
      if (initialTime) {
        formData.startTime = initialTime
        formData.endTime = addHoursToTime(initialTime, 1)
      } else {
        const now = new Date()
        const nextHour = new Date(now)
        nextHour.setHours(now.getHours() + 1, 0, 0, 0)
        formData.startTime = `${String(nextHour.getHours()).padStart(2, '0')}:00`
        formData.endTime = addHoursToTime(formData.startTime, 1)
      }
    } else {
      const now = new Date()
      const dateStr = formatDateLocal(now)
      formData.startDate = dateStr
      formData.endDate = dateStr
      // Round to next hour
      const nextHour = new Date(now)
      nextHour.setHours(now.getHours() + 1, 0, 0, 0)
      formData.startTime = `${String(nextHour.getHours()).padStart(2, '0')}:00`
      formData.endTime = addHoursToTime(formData.startTime, 1)
    }
  })

  function handleSubmit(e) {
    e.preventDefault()

    const eventData = {
      title: formData.title,
      description: formData.description,
      startDate: createDateTimeString(formData.startDate, formData.startTime),
      endDate: createDateTimeString(formData.endDate, formData.endTime),
      location: formData.location,
      calendarId: formData.calendarId,
      category: formData.category,
      status: formData.status,
      priority: formData.priority,
      isAllDay: formData.isAllDay,
      reminder: formData.reminder,
      attendees: formData.attendees.split(',').map(a => a.trim()).filter(Boolean)
    }

    if (formData.recurrenceType !== 'none') {
      eventData.recurrence = {
        type: formData.recurrenceType,
        endDate: formData.recurrenceEndDate ? createDateTimeString(formData.recurrenceEndDate, '23:59') : null
      }
    }

    if (event) {
      // Check if editing a recurring instance
      if (event._isEditingInstance && event._originalInstance) {
        // Create an exception for this specific occurrence
        store.editRecurringInstance(event._originalInstance, eventData)
      } else {
        // Regular update
        store.updateEvent(event.id, eventData)
      }
    } else {
      store.addEvent(eventData)
    }

    onClose()
  }

  function handleDelete() {
    if (event && confirm($_('calendars.confirmDelete'))) {
      store.deleteEvent(event.id)
      onClose()
    }
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70" onclick={handleBackdropClick}>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onclick={(e) => e.stopPropagation()}>
    <form onsubmit={handleSubmit}>
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {event ? $_('event.editEvent') : $_('event.createNew')}
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

      <!-- Form content -->
      <div class="p-6 space-y-4">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{$_('event.titleRequired')}</label>
          <input
            type="text"
            bind:value={formData.title}
            required
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={$_('event.title')}
          />
        </div>

        <!-- Date and time -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{$_('event.startDateRequired')}</label>
            <input
              type="date"
              bind:value={formData.startDate}
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{$_('event.startTimeRequired')}</label>
            <input
              type="time"
              bind:value={formData.startTime}
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{$_('event.endDateRequired')}</label>
            <input
              type="date"
              bind:value={formData.endDate}
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{$_('event.endTimeRequired')}</label>
            <input
              type="time"
              bind:value={formData.endTime}
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{$_('event.description')}</label>
          <textarea
            bind:value={formData.description}
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
            placeholder={$_('event.description')}
          ></textarea>
        </div>

        <!-- Location -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{$_('event.location')}</label>
          <input
            type="text"
            bind:value={formData.location}
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={$_('event.location')}
          />
        </div>

        <!-- Calendar -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{$_('event.calendar')}</label>
          <select
            bind:value={formData.calendarId}
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {#each calendars.calendars as calendar}
              <option value={calendar.id}>● {calendar.name}</option>
            {/each}
          </select>
        </div>

        <!-- Category -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{$_('event.category')}</label>
          {#each [formData.category] as currentCategoryId}
            {@const selectedCategory = CATEGORIES.find(c => c.id === currentCategoryId)}
            <div class="flex gap-2">
              <div class="w-10 h-10 flex items-center justify-center border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg" style={`color: ${selectedCategory?.color}`}>
                {#if selectedCategory}
                  <div class="w-6 h-6">
                    {@html selectedCategory.icon}
                  </div>
                {/if}
              </div>
              <select
                bind:value={formData.category}
                class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {#each CATEGORIES as category}
                  <option value={category.id}>{$_(`categories.${category.id}`)}</option>
                {/each}
              </select>
            </div>
          {/each}
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{$_('event.status')}</label>
          <select
            bind:value={formData.status}
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {#each EVENT_STATUS as status}
              <option value={status.id}>
                {status.icon} {$_(`statuses.${status.id}`)}
              </option>
            {/each}
          </select>
        </div>

        <!-- Priority -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{$_('event.priority')}</label>
          <select
            bind:value={formData.priority}
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {#each EVENT_PRIORITY as priority}
              <option value={priority.id}>
                {priority.icon} {$_(`priorities.${priority.id}`)}
              </option>
            {/each}
          </select>
        </div>

        <!-- All-Day Event -->
        <div class="flex items-center">
          <input
            type="checkbox"
            id="isAllDay"
            bind:checked={formData.isAllDay}
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
          <label for="isAllDay" class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            {$_('event.allDayEvent')}
          </label>
        </div>

        <!-- Recurrence -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{$_('event.recurrence')}</label>
          <select
            bind:value={formData.recurrenceType}
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {#each RECURRENCE_TYPES as type}
              <option value={type.id}>{$_(`recurrence.${type.id}`)}</option>
            {/each}
          </select>
        </div>

        {#if formData.recurrenceType !== 'none'}
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{$_('event.recurrenceEndDate')}</label>
            <input
              type="date"
              bind:value={formData.recurrenceEndDate}
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        {/if}

        <!-- Reminder -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{$_('event.reminder')}</label>
          <select
            bind:value={formData.reminder}
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {#each REMINDER_OPTIONS as option}
              <option value={option.id}>{$_(`reminders.${option.id}`)}</option>
            {/each}
          </select>
        </div>

        <!-- Attendees -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{$_('event.attendees')}</label>
          <input
            type="text"
            bind:value={formData.attendees}
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={$_('event.attendees')}
          />
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div>
          {#if event}
            <button
              type="button"
              onclick={handleDelete}
              class="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            >
              {$_('contextMenu.deleteEvent')}
            </button>
          {/if}
        </div>
        <div class="flex gap-3">
          <button
            type="button"
            onclick={onClose}
            class="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            {$_('common.cancel')}
          </button>
          <button
            type="submit"
            class="px-6 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            {event ? $_('common.save') : $_('common.create')}
          </button>
        </div>
      </div>
    </form>
  </div>
</div>
