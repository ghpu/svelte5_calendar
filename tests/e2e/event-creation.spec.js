import { test, expect } from '@playwright/test'

test.describe('Event Creation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('should open event modal when clicking New Event button', async ({ page }) => {
    await page.getByRole('button', { name: 'New Event' }).click()

    await expect(page.getByText('Create New Event')).toBeVisible()
    await expect(page.getByLabel('Title *')).toBeVisible()
  })

  test('should create a basic event', async ({ page }) => {
    // Open modal
    await page.getByRole('button', { name: 'New Event' }).click()

    // Fill form
    await page.getByLabel('Title *').fill('Team Meeting')
    await page.getByLabel('Description').fill('Discuss Q4 plans')
    await page.getByLabel('Location').fill('Conference Room A')

    // Submit
    await page.getByRole('button', { name: 'Create Event' }).click()

    // Modal should close
    await expect(page.getByText('Create New Event')).not.toBeVisible()

    // Event should appear in calendar
    await expect(page.getByText('Team Meeting')).toBeVisible()
  })

  test('should require title field', async ({ page }) => {
    await page.getByRole('button', { name: 'New Event' }).click()

    // Try to submit without title
    await page.getByRole('button', { name: 'Create Event' }).click()

    // Modal should still be visible (HTML5 validation)
    await expect(page.getByText('Create New Event')).toBeVisible()
  })

  test('should create event with custom date and time', async ({ page }) => {
    await page.getByRole('button', { name: 'New Event' }).click()

    // Fill event details
    await page.getByLabel('Title *').fill('Doctor Appointment')
    await page.getByLabel('Start Date *').fill('2025-12-25')
    await page.getByLabel('Start Time *').fill('10:30')
    await page.getByLabel('End Date *').fill('2025-12-25')
    await page.getByLabel('End Time *').fill('11:30')

    await page.getByRole('button', { name: 'Create Event' }).click()

    // Event created
    await expect(page.getByText('Create New Event')).not.toBeVisible()
  })

  test('should create event with category', async ({ page }) => {
    await page.getByRole('button', { name: 'New Event' }).click()

    await page.getByLabel('Title *').fill('Birthday Party')
    await page.getByLabel('Category').selectOption('birthday')

    await page.getByRole('button', { name: 'Create Event' }).click()

    await expect(page.getByText('Create New Event')).not.toBeVisible()
  })

  test('should create event with recurrence', async ({ page }) => {
    await page.getByRole('button', { name: 'New Event' }).click()

    await page.getByLabel('Title *').fill('Daily Standup')
    await page.getByLabel('Recurrence').selectOption('daily')

    await page.getByRole('button', { name: 'Create Event' }).click()

    await expect(page.getByText('Create New Event')).not.toBeVisible()
  })

  test('should create event with reminder', async ({ page }) => {
    await page.getByRole('button', { name: 'New Event' }).click()

    await page.getByLabel('Title *').fill('Important Meeting')
    await page.getByLabel('Reminder').selectOption('15min')

    await page.getByRole('button', { name: 'Create Event' }).click()

    await expect(page.getByText('Create New Event')).not.toBeVisible()
  })

  test('should create event with attendees', async ({ page }) => {
    await page.getByRole('button', { name: 'New Event' }).click()

    await page.getByLabel('Title *').fill('Team Sync')
    await page.getByLabel('Attendees (comma-separated emails)').fill('john@example.com, jane@example.com')

    await page.getByRole('button', { name: 'Create Event' }).click()

    await expect(page.getByText('Create New Event')).not.toBeVisible()
  })

  test('should close modal when clicking Cancel', async ({ page }) => {
    await page.getByRole('button', { name: 'New Event' }).click()
    await expect(page.getByText('Create New Event')).toBeVisible()

    await page.getByRole('button', { name: 'Cancel' }).click()
    await expect(page.getByText('Create New Event')).not.toBeVisible()
  })

  test('should close modal when clicking X button', async ({ page }) => {
    await page.getByRole('button', { name: 'New Event' }).click()
    await expect(page.getByText('Create New Event')).toBeVisible()

    // Click the X button (close button)
    await page.locator('button[type="button"]').filter({ has: page.locator('svg') }).first().click()
    await expect(page.getByText('Create New Event')).not.toBeVisible()
  })

  test('should persist events in localStorage', async ({ page }) => {
    // Create an event
    await page.getByRole('button', { name: 'New Event' }).click()
    await page.getByLabel('Title *').fill('Persistent Event')
    await page.getByRole('button', { name: 'Create Event' }).click()

    // Reload page
    await page.reload()

    // Event should still be visible
    await expect(page.getByText('Persistent Event')).toBeVisible()
  })

  test('should show event in all categories by default', async ({ page }) => {
    // Create events with different categories
    const categories = [
      { title: 'Work Task', category: 'work' },
      { title: 'Personal Task', category: 'personal' },
      { title: 'Team Meeting', category: 'meeting' }
    ]

    for (const event of categories) {
      await page.getByRole('button', { name: 'New Event' }).click()
      await page.getByLabel('Title *').fill(event.title)
      await page.getByLabel('Category').selectOption(event.category)
      await page.getByRole('button', { name: 'Create Event' }).click()
      await page.waitForTimeout(200)
    }

    // All events should be visible
    for (const event of categories) {
      await expect(page.getByText(event.title)).toBeVisible()
    }
  })
})
