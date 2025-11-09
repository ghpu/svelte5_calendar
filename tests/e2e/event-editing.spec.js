import { test, expect } from '@playwright/test'

test.describe('Event Editing and Deletion', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())

    // Create a test event
    await page.getByRole('button', { name: 'New Event' }).click()
    await page.getByLabel('Title *').fill('Test Event')
    await page.getByLabel('Description').fill('Original description')
    await page.getByLabel('Location').fill('Room 101')
    await page.getByRole('button', { name: 'Create Event' }).click()
    await page.waitForTimeout(200)
  })

  test('should open edit modal when clicking on event', async ({ page }) => {
    // Click on the event
    await page.getByText('Test Event').click()

    // Edit modal should open with existing data
    await expect(page.getByText('Edit Event')).toBeVisible()
    await expect(page.getByLabel('Title *')).toHaveValue('Test Event')
    await expect(page.getByLabel('Description')).toHaveValue('Original description')
    await expect(page.getByLabel('Location')).toHaveValue('Room 101')
  })

  test('should update event title', async ({ page }) => {
    await page.getByText('Test Event').click()

    await page.getByLabel('Title *').clear()
    await page.getByLabel('Title *').fill('Updated Event Title')
    await page.getByRole('button', { name: 'Update Event' }).click()

    // Updated title should be visible
    await expect(page.getByText('Updated Event Title')).toBeVisible()
    await expect(page.getByText('Test Event')).not.toBeVisible()
  })

  test('should update event description', async ({ page }) => {
    await page.getByText('Test Event').click()

    await page.getByLabel('Description').clear()
    await page.getByLabel('Description').fill('Updated description')
    await page.getByRole('button', { name: 'Update Event' }).click()

    // Verify update by opening event again
    await page.getByText('Test Event').click()
    await expect(page.getByLabel('Description')).toHaveValue('Updated description')
  })

  test('should update event location', async ({ page }) => {
    await page.getByText('Test Event').click()

    await page.getByLabel('Location').clear()
    await page.getByLabel('Location').fill('Room 202')
    await page.getByRole('button', { name: 'Update Event' }).click()

    // Verify update
    await page.getByText('Test Event').click()
    await expect(page.getByLabel('Location')).toHaveValue('Room 202')
  })

  test('should update event category', async ({ page }) => {
    await page.getByText('Test Event').click()

    await page.getByLabel('Category').selectOption('meeting')
    await page.getByRole('button', { name: 'Update Event' }).click()

    // Verify update
    await page.getByText('Test Event').click()
    await expect(page.getByLabel('Category')).toHaveValue('meeting')
  })

  test('should update event time', async ({ page }) => {
    await page.getByText('Test Event').click()

    await page.getByLabel('Start Time *').fill('14:30')
    await page.getByLabel('End Time *').fill('15:30')
    await page.getByRole('button', { name: 'Update Event' }).click()

    // Event should show updated time
    await expect(page.getByText(/2:30 PM.*Test Event/)).toBeVisible()
  })

  test('should cancel edit without saving', async ({ page }) => {
    await page.getByText('Test Event').click()

    await page.getByLabel('Title *').clear()
    await page.getByLabel('Title *').fill('Should Not Save')
    await page.getByRole('button', { name: 'Cancel' }).click()

    // Original title should still be visible
    await expect(page.getByText('Test Event')).toBeVisible()
    await expect(page.getByText('Should Not Save')).not.toBeVisible()
  })

  test('should delete event', async ({ page }) => {
    await page.getByText('Test Event').click()

    // Handle confirmation dialog
    page.on('dialog', dialog => dialog.accept())

    await page.getByRole('button', { name: 'Delete Event' }).click()

    // Event should be removed
    await expect(page.getByText('Test Event')).not.toBeVisible()
  })

  test('should not delete event if confirmation is cancelled', async ({ page }) => {
    await page.getByText('Test Event').click()

    // Handle confirmation dialog - dismiss it
    page.on('dialog', dialog => dialog.dismiss())

    await page.getByRole('button', { name: 'Delete Event' }).click()

    // Modal should still be open
    await expect(page.getByText('Edit Event')).toBeVisible()
  })

  test('should persist event updates across page reloads', async ({ page }) => {
    await page.getByText('Test Event').click()
    await page.getByLabel('Title *').clear()
    await page.getByLabel('Title *').fill('Persisted Update')
    await page.getByRole('button', { name: 'Update Event' }).click()

    // Reload page
    await page.reload()

    // Updated event should still be visible
    await expect(page.getByText('Persisted Update')).toBeVisible()
  })

  test('should update event with all fields', async ({ page }) => {
    await page.getByText('Test Event').click()

    // Update all fields
    await page.getByLabel('Title *').clear()
    await page.getByLabel('Title *').fill('Complete Update')
    await page.getByLabel('Description').clear()
    await page.getByLabel('Description').fill('New description')
    await page.getByLabel('Location').clear()
    await page.getByLabel('Location').fill('New location')
    await page.getByLabel('Category').selectOption('personal')
    await page.getByLabel('Recurrence').selectOption('weekly')
    await page.getByLabel('Reminder').selectOption('1hour')
    await page.getByLabel('Attendees (comma-separated emails)').fill('test@example.com')

    await page.getByRole('button', { name: 'Update Event' }).click()

    // Verify all updates
    await page.getByText('Complete Update').click()
    await expect(page.getByLabel('Title *')).toHaveValue('Complete Update')
    await expect(page.getByLabel('Description')).toHaveValue('New description')
    await expect(page.getByLabel('Location')).toHaveValue('New location')
    await expect(page.getByLabel('Category')).toHaveValue('personal')
    await expect(page.getByLabel('Recurrence')).toHaveValue('weekly')
    await expect(page.getByLabel('Reminder')).toHaveValue('1hour')
    await expect(page.getByLabel('Attendees (comma-separated emails)')).toHaveValue('test@example.com')
  })
})
