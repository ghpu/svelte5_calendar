<script>
  import { onMount } from 'svelte'
  import { locale } from 'svelte-i18n'
  import { initI18n } from './i18n/i18n.js'
  import { calendarStore } from './stores/calendarStore.svelte.js'
  import { settingsStore } from './stores/settingsStore.svelte.js'
  import CalendarHeader from './components/CalendarHeader.svelte'
  import MonthView from './components/MonthView.svelte'
  import WeekView from './components/WeekView.svelte'
  import DayView from './components/DayView.svelte'
  import EventModal from './components/EventModal.svelte'
  import Sidebar from './components/Sidebar.svelte'
  import SettingsPanel from './components/SettingsPanel.svelte'
  import ContextMenu from './components/ContextMenu.svelte'
  import RecurringEditModal from './components/RecurringEditModal.svelte'
  import { KEYBOARD_SHORTCUTS } from './utils/constants.js'

  const store = calendarStore
  const settings = settingsStore

  // Initialize i18n immediately (before component renders)
  initI18n(settings.language)

  let selectedDateForNewEvent = $state(null)
  let selectedTimeForNewEvent = $state(null)
  let showSettings = $state(false)

  // Recurring edit modal state
  let recurringEditModal = $state({
    visible: false,
    action: 'edit', // 'edit' or 'delete'
    event: null
  })

  // Context menu state
  let contextMenu = $state({
    visible: false,
    x: 0,
    y: 0,
    event: null
  })

  function handleNewEvent() {
    selectedDateForNewEvent = null
    selectedTimeForNewEvent = null
    store.openEventModal()
  }

  function handleDateClick(date, time = null) {
    selectedDateForNewEvent = date
    selectedTimeForNewEvent = time
    store.openEventModal()
  }

  function handleOpenSettings() {
    showSettings = true
  }

  function handleCloseSettings() {
    showSettings = false
  }

  function handleEventClick(event) {
    // Check if this is a recurring instance
    if (store.isRecurringInstance(event)) {
      recurringEditModal = {
        visible: true,
        action: 'edit',
        event
      }
    } else {
      store.openEventModal(event)
    }
  }

  function handleCloseModal() {
    store.closeEventModal()
    selectedDateForNewEvent = null
    selectedTimeForNewEvent = null
  }

  // Context menu handlers
  function handleContextMenu(e, event = null) {
    e.preventDefault()
    contextMenu = {
      visible: true,
      x: e.clientX,
      y: e.clientY,
      event
    }
  }

  function handleContextMenuEdit(event) {
    // Check if this is a recurring instance
    if (store.isRecurringInstance(event)) {
      recurringEditModal = {
        visible: true,
        action: 'edit',
        event
      }
    } else {
      store.openEventModal(event)
    }
  }

  function handleContextMenuDuplicate(event) {
    store.duplicateEvent(event)
  }

  function handleContextMenuDelete(event) {
    // Check if this is a recurring instance
    if (store.isRecurringInstance(event)) {
      recurringEditModal = {
        visible: true,
        action: 'delete',
        event
      }
    } else {
      if (confirm('Are you sure you want to delete this event?')) {
        store.deleteEvent(event.id)
      }
    }
  }

  // Recurring edit modal handlers
  function handleEditOccurrence() {
    const event = recurringEditModal.event
    // Get the parent event to use as template
    const parentEvent = store.getParentEvent(event.id)
    // Open modal with instance data (will create exception)
    store.openEventModal({
      ...event,
      _isEditingInstance: true,
      _originalInstance: event
    })
  }

  function handleEditSeries() {
    const event = recurringEditModal.event
    const parentEvent = store.getParentEvent(event.id)
    if (parentEvent) {
      store.openEventModal(parentEvent)
    }
  }

  function handleDeleteOccurrence() {
    const event = recurringEditModal.event
    store.deleteRecurringInstance(event)
  }

  function handleDeleteSeries() {
    const event = recurringEditModal.event
    if (confirm('Are you sure you want to delete all events in this series?')) {
      store.deleteRecurringSeries(event.id)
    }
  }

  function handleContextMenuChangeCategory(event, categoryId) {
    store.changeEventCategory(event.id, categoryId)
  }

  function handleContextMenuChangeStatus(event, status) {
    store.changeEventStatus(event.id, status)
  }

  function handleContextMenuChangePriority(event, priority) {
    store.changeEventPriority(event.id, priority)
  }

  function handleImport(icalContent) {
    store.importFromICal(icalContent)
  }

  // Keyboard shortcuts
  function handleKeyDown(e) {
    // Ignore if typing in input/textarea
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      if (e.key !== 'Escape') return
    }

    const shortcut = KEYBOARD_SHORTCUTS.find(s => s.key === e.key)
    if (!shortcut) return

    e.preventDefault()

    switch (shortcut.action) {
      case 'goToToday':
        store.goToToday()
        break
      case 'newEvent':
        handleNewEvent()
        break
      case 'monthView':
        store.setView('month')
        break
      case 'weekView':
        store.setView('week')
        break
      case 'dayView':
        store.setView('day')
        break
      case 'prevPeriod':
        store.prevPeriod()
        break
      case 'nextPeriod':
        store.nextPeriod()
        break
      case 'search':
        document.querySelector('input[type="text"]')?.focus()
        break
      case 'closeModal':
        if (store.showEventModal) {
          handleCloseModal()
        } else if (showSettings) {
          handleCloseSettings()
        } else if (contextMenu.visible) {
          contextMenu.visible = false
        }
        break
    }
  }

  // Reminder notifications
  function checkReminders() {
    const now = new Date()
    store.events.forEach(event => {
      if (event.reminder && event.reminder !== 'none') {
        const eventStart = new Date(event.startDate)
        const reminderMinutes = {
          '5min': 5,
          '15min': 15,
          '30min': 30,
          '1hour': 60,
          '1day': 1440
        }[event.reminder]

        if (reminderMinutes) {
          const reminderTime = new Date(eventStart.getTime() - reminderMinutes * 60 * 1000)
          const timeDiff = reminderTime - now

          // Show notification if within 1 minute of reminder time
          if (timeDiff > 0 && timeDiff < 60000 && !event.reminderShown) {
            showNotification(event)
            event.reminderShown = true
          }
        }
      }
    })
  }

  function showNotification(event) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Calendar Reminder', {
        body: `${event.title} is coming up soon!`,
        icon: '/vite.svg'
      })
    }
  }

  onMount(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    // Check reminders every minute
    const reminderInterval = setInterval(checkReminders, 60000)

    return () => {
      clearInterval(reminderInterval)
    }
  })

  // Watch for language changes in settings
  $effect(() => {
    if (settings.language) {
      locale.set(settings.language)
    }
  })
</script>

<svelte:window onkeydown={handleKeyDown} />

<div class="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
  <Sidebar onImport={handleImport} />

  <div class="flex-1 flex flex-col overflow-hidden">
    <CalendarHeader onNewEvent={handleNewEvent} onOpenSettings={handleOpenSettings} />

    <main class="flex-1 overflow-hidden">
      {#if store.view === 'month'}
        <MonthView
          onEventClick={handleEventClick}
          onDateClick={handleDateClick}
          onContextMenu={handleContextMenu}
        />
      {:else if store.view === 'week'}
        <WeekView
          onEventClick={handleEventClick}
          onTimeSlotClick={handleDateClick}
          onContextMenu={handleContextMenu}
        />
      {:else if store.view === 'day'}
        <DayView
          onEventClick={handleEventClick}
          onTimeSlotClick={handleDateClick}
          onContextMenu={handleContextMenu}
        />
      {/if}
    </main>
  </div>
</div>

{#if store.showEventModal}
  <EventModal
    event={store.selectedEvent}
    initialDate={selectedDateForNewEvent}
    initialTime={selectedTimeForNewEvent}
    onClose={handleCloseModal}
  />
{/if}

{#if showSettings}
  <SettingsPanel onClose={handleCloseSettings} />
{/if}

<ContextMenu
  bind:visible={contextMenu.visible}
  bind:x={contextMenu.x}
  bind:y={contextMenu.y}
  event={contextMenu.event}
  onNewEvent={handleNewEvent}
  onEdit={handleContextMenuEdit}
  onDuplicate={handleContextMenuDuplicate}
  onDelete={handleContextMenuDelete}
  onChangeCategory={handleContextMenuChangeCategory}
  onChangeStatus={handleContextMenuChangeStatus}
  onChangePriority={handleContextMenuChangePriority}
/>

<RecurringEditModal
  isOpen={recurringEditModal.visible}
  action={recurringEditModal.action}
  onClose={() => recurringEditModal.visible = false}
  onEditOccurrence={recurringEditModal.action === 'edit' ? handleEditOccurrence : handleDeleteOccurrence}
  onEditSeries={recurringEditModal.action === 'edit' ? handleEditSeries : handleDeleteSeries}
/>
