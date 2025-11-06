# Calendar Pro - Full-Featured Calendar Application

A modern, full-featured calendar application built with **Svelte 5** and **Tailwind CSS 4.1**, designed to compete with Outlook 365's calendar functionality. This application provides a comprehensive set of features for managing events, scheduling meetings, and organizing your time effectively.

![Calendar Pro](https://img.shields.io/badge/Svelte-5.15-FF3E00?style=flat-square&logo=svelte)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?style=flat-square&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat-square&logo=vite)

## Features

### Core Calendar Views
- **Month View** - Full month grid with event previews
- **Week View** - Time-based weekly schedule with hourly slots
- **Day View** - Detailed daily schedule with all events

### Event Management
- **Create, Edit, and Delete Events** - Full CRUD operations for events
- **Drag-and-Drop Rescheduling** - Simply drag events to new dates
- **Event Details**:
  - Title, description, and location
  - Start and end date/time
  - Category/color coding
  - Attendee list
  - Reminder notifications
  - Recurring events (daily, weekly, monthly, yearly)

### Smart Features
- **Search & Filter** - Quickly find events by title, description, or location
- **Category Filtering** - Filter events by category (Work, Personal, Meeting, etc.)
- **Color Coding** - Visual distinction with 7 predefined categories:
  - Work (Blue)
  - Personal (Green)
  - Meeting (Orange)
  - Appointment (Red)
  - Holiday (Purple)
  - Birthday (Pink)
  - Other (Gray)

### Advanced Functionality
- **Timezone Support** - Choose from 12 major timezones worldwide
- **Import/Export** - iCal (.ics) format support for calendar data
- **Reminder System** - Browser notifications (5min, 15min, 30min, 1hr, 1 day before)
- **Recurring Events** - Create events that repeat daily, weekly, monthly, or yearly
- **Local Storage** - All events persist automatically in your browser

### User Experience
- **Keyboard Shortcuts** - Fast navigation and actions:
  - `t` - Go to today
  - `n` - Create new event
  - `m` - Month view
  - `w` - Week view
  - `d` - Day view
  - `←/→` - Previous/Next period
  - `/` - Focus search
  - `Esc` - Close modal

- **Responsive Design** - Works seamlessly on all screen sizes
- **Modern UI** - Clean, professional interface with smooth transitions

## Technology Stack

- **Svelte 5** - Latest version with runes for reactive state management
- **Tailwind CSS 4.1** - Modern utility-first CSS framework
- **Vite 6** - Fast build tool and development server
- **date-fns** - Modern date utility library
- **date-fns-tz** - Timezone support

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd svelte5_calendar

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Development

The development server will start at `http://localhost:5173` with hot module replacement enabled.

```bash
npm run dev
```

## Building for Production

```bash
npm run build
```

The optimized production files will be in the `dist/` directory.

## Project Structure

```
svelte5_calendar/
├── src/
│   ├── components/
│   │   ├── CalendarHeader.svelte    # Navigation and view controls
│   │   ├── MonthView.svelte         # Monthly calendar grid
│   │   ├── WeekView.svelte          # Weekly schedule view
│   │   ├── DayView.svelte           # Daily schedule view
│   │   ├── EventModal.svelte        # Event creation/editing form
│   │   └── Sidebar.svelte           # Search, filters, and tools
│   ├── stores/
│   │   └── calendarStore.svelte.js  # Svelte 5 runes-based state
│   ├── utils/
│   │   ├── constants.js             # App constants and config
│   │   └── dateUtils.js             # Date manipulation helpers
│   ├── App.svelte                   # Main application component
│   ├── main.js                      # Application entry point
│   └── app.css                      # Global styles and Tailwind
├── index.html                       # HTML entry point
├── vite.config.js                   # Vite configuration
├── svelte.config.js                 # Svelte configuration
└── package.json                     # Dependencies and scripts
```

## Usage Guide

### Creating an Event
1. Click the **"New Event"** button in the header, OR
2. Press `n` on your keyboard, OR
3. Click on any date in the calendar

Fill in the event details:
- **Required**: Title, start date/time, end date/time
- **Optional**: Description, location, attendees, category, recurrence, reminder

### Editing an Event
- Click on any event to open the edit modal
- Make your changes and click "Update Event"
- Or delete the event by clicking "Delete Event"

### Rescheduling Events
- In month view, simply **drag and drop** an event to a new date
- The time will be preserved when moving events

### Navigating the Calendar
- Use the **arrow buttons** or arrow keys to move between periods
- Click **"Today"** or press `t` to return to the current date
- Switch views using the **Month/Week/Day** buttons or `m/w/d` keys

### Search and Filter
- Use the **search box** to find events by text (press `/` to focus)
- Toggle **category filters** to show/hide specific event types
- View event statistics at the bottom of the sidebar

### Import/Export
- **Export**: Click "Export to iCal" to download all events as .ics file
- **Import**: Click "Import iCal" and select an .ics file to import

### Timezone
- Select your preferred timezone from the dropdown in the sidebar
- All times will be displayed in the selected timezone

## Browser Compatibility

- Modern browsers with ES6+ support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Data Persistence

All calendar events are automatically saved to your browser's localStorage. Your data persists across browser sessions but is local to your device and browser.

## Contributing

This is a demonstration project showcasing modern web development with Svelte 5 and Tailwind CSS 4.1.

## License

MIT License - feel free to use this project for learning or as a starting point for your own calendar application.

## Acknowledgments

- Built with [Svelte 5](https://svelte.dev/)
- Styled with [Tailwind CSS 4.1](https://tailwindcss.com/)
- Date handling by [date-fns](https://date-fns.org/)
- Bundled with [Vite](https://vitejs.dev/)

---

**Note**: This is a frontend-only application. For a production calendar with multi-user support, you would need to add a backend API and database.
