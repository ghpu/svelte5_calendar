import { test, expect } from '@playwright/test'

test.describe('Search and Filter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())

    // Create multiple events with different categories
    const events = [
      { title: 'Work Meeting', category: 'work', description: 'Quarterly review' },
      { title: 'Personal Appointment', category: 'personal', description: 'Dentist visit' },
      { title: 'Team Standup', category: 'meeting', description: 'Daily sync' },
      { title: 'Birthday Party', category: 'birthday', description: 'John\'s birthday' }
    ]

    for (const event of events) {
      await page.getByRole('button', { name: 'New Event' }).click()
      await page.getByLabel('Title *').fill(event.title)
      await page.getByLabel('Description').fill(event.description)
      await page.getByLabel('Category').selectOption(event.category)
      await page.getByRole('button', { name: 'Create Event' }).click()
      await page.waitForTimeout(200)
    }
  })

  test('should display search box in sidebar', async ({ page }) => {
    const searchBox = page.getByPlaceholder('Search events... (Press /)')
    await expect(searchBox).toBeVisible()
  })

  test('should search events by title', async ({ page }) => {
    const searchBox = page.getByPlaceholder('Search events... (Press /)')
    await searchBox.fill('Meeting')

    // Only "Work Meeting" should be visible
    await expect(page.getByText('Work Meeting')).toBeVisible()
    await expect(page.getByText('Personal Appointment')).not.toBeVisible()
  })

  test('should search events by description', async ({ page }) => {
    const searchBox = page.getByPlaceholder('Search events... (Press /)')
    await searchBox.fill('Dentist')

    // Only event with "Dentist" in description should be visible
    await expect(page.getByText('Personal Appointment')).toBeVisible()
    await expect(page.getByText('Work Meeting')).not.toBeVisible()
  })

  test('should show all events when search is cleared', async ({ page }) => {
    const searchBox = page.getByPlaceholder('Search events... (Press /)')
    await searchBox.fill('Meeting')
    await page.waitForTimeout(200)

    // Clear search
    await searchBox.clear()
    await page.waitForTimeout(200)

    // All events should be visible
    await expect(page.getByText('Work Meeting')).toBeVisible()
    await expect(page.getByText('Personal Appointment')).toBeVisible()
    await expect(page.getByText('Team Standup')).toBeVisible()
  })

  test('should display category filters', async ({ page }) => {
    const categories = ['Work', 'Personal', 'Meeting', 'Appointment', 'Holiday', 'Birthday', 'Other']

    for (const category of categories) {
      await expect(page.getByText(category).first()).toBeVisible()
    }
  })

  test('should filter events by category', async ({ page }) => {
    // Check the "Work" category checkbox
    const workCheckbox = page.locator('label').filter({ hasText: 'Work' }).locator('input')
    await workCheckbox.check()
    await page.waitForTimeout(200)

    // Only work events should be visible
    await expect(page.getByText('Work Meeting')).toBeVisible()
    await expect(page.getByText('Personal Appointment')).not.toBeVisible()
    await expect(page.getByText('Team Standup')).not.toBeVisible()
  })

  test('should filter by multiple categories', async ({ page }) => {
    // Check multiple categories
    const workCheckbox = page.locator('label').filter({ hasText: 'Work' }).locator('input')
    const personalCheckbox = page.locator('label').filter({ hasText: 'Personal' }).locator('input')

    await workCheckbox.check()
    await personalCheckbox.check()
    await page.waitForTimeout(200)

    // Work and personal events should be visible
    await expect(page.getByText('Work Meeting')).toBeVisible()
    await expect(page.getByText('Personal Appointment')).toBeVisible()
    await expect(page.getByText('Team Standup')).not.toBeVisible()
  })

  test('should unfilter when unchecking category', async ({ page }) => {
    // Check and then uncheck
    const workCheckbox = page.locator('label').filter({ hasText: 'Work' }).locator('input')
    await workCheckbox.check()
    await page.waitForTimeout(200)
    await workCheckbox.uncheck()
    await page.waitForTimeout(200)

    // All events should be visible again
    await expect(page.getByText('Work Meeting')).toBeVisible()
    await expect(page.getByText('Personal Appointment')).toBeVisible()
  })

  test('should combine search and filter', async ({ page }) => {
    // Search for "Party"
    const searchBox = page.getByPlaceholder('Search events... (Press /)')
    await searchBox.fill('Party')

    // Also filter by birthday category
    const birthdayCheckbox = page.locator('label').filter({ hasText: 'Birthday' }).locator('input')
    await birthdayCheckbox.check()
    await page.waitForTimeout(200)

    // Only Birthday Party should be visible
    await expect(page.getByText('Birthday Party')).toBeVisible()
    await expect(page.getByText('Work Meeting')).not.toBeVisible()
  })

  test('should display event count statistics', async ({ page }) => {
    // Total events should be 4
    await expect(page.getByText('Total Events:')).toBeVisible()
    await expect(page.getByText('4')).toBeVisible()

    // Filter to reduce count
    const workCheckbox = page.locator('label').filter({ hasText: 'Work' }).locator('input')
    await workCheckbox.check()
    await page.waitForTimeout(200)

    // Filtered count should be 1
    await expect(page.getByText('Filtered Events:')).toBeVisible()
  })

  test('should show category color indicators', async ({ page }) => {
    // Category checkboxes should have colored indicators
    const categories = page.locator('.w-3.h-3.rounded')
    const count = await categories.count()
    expect(count).toBeGreaterThan(0)
  })
})
