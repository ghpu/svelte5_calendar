<script>
  import { onMount } from 'svelte'
  import { calendarStore } from './stores/calendarStore.svelte.js'
  import CalendarHeader from './components/CalendarHeader.svelte'
  import MonthView from './components/MonthView.svelte'
  import WeekView from './components/WeekView.svelte'
  import DayView from './components/DayView.svelte'
  import EventModal from './components/EventModal.svelte'
  import Sidebar from './components/Sidebar.svelte'
  import { KEYBOARD_SHORTCUTS } from './utils/constants.js'

  const store = calendarStore

  let selectedDateForNewEvent = $state(null)

  function handleNewEvent() {
    selectedDateForNewEvent = null
    store.openEventModal()
  }

  function handleDateClick(date) {
    selectedDateForNewEvent = date
    store.openEventModal()
  }

  function handleEventClick(event) {
    store.openEventModal(event)
  }

  function handleCloseModal() {
    store.closeEventModal()
    selectedDateForNewEvent = null
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
</script>

<svelte:window onkeydown={handleKeyDown} />

<div class="flex h-screen overflow-hidden bg-gray-100">
  <Sidebar onImport={handleImport} />

  <div class="flex-1 flex flex-col overflow-hidden">
    <CalendarHeader onNewEvent={handleNewEvent} />

    <main class="flex-1 overflow-hidden">
      {#if store.view === 'month'}
        <MonthView onEventClick={handleEventClick} onDateClick={handleDateClick} />
      {:else if store.view === 'week'}
        <WeekView onEventClick={handleEventClick} />
      {:else if store.view === 'day'}
        <DayView onEventClick={handleEventClick} />
      {/if}
    </main>
  </div>
</div>

{#if store.showEventModal}
  <EventModal
    event={store.selectedEvent}
    initialDate={selectedDateForNewEvent}
    onClose={handleCloseModal}
  />
{/if}
