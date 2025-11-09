import { test, expect } from '@playwright/test'

test.describe('Keyboard Shortcuts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('should navigate to today with "t" key', async ({ page }) => {
    // Navigate away from today
    await page.locator('button[title="Next"]').click()
    await page.locator('button[title="Next"]').click()

    // Press 't' key
    await page.keyboard.press('t')

    // Should show current month
    const currentDate = new Date()
    const monthYear = currentDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    })

    await expect(page.locator('h2').filter({ hasText: monthYear })).toBeVisible()
  })

  test('should open new event modal with "n" key', async ({ page }) => {
    await page.keyboard.press('n')

    await expect(page.getByText('Create New Event')).toBeVisible()
  })

  test('should switch to month view with "m" key', async ({ page }) => {
    // Switch to day view first
    await page.getByRole('button', { name: 'Day' }).click()

    // Press 'm' key
    await page.keyboard.press('m')

    // Should be in month view
    await expect(page.getByRole('button', { name: 'Month' })).toHaveClass(/bg-white/)
  })

  test('should switch to week view with "w" key', async ({ page }) => {
    // Press 'w' key
    await page.keyboard.press('w')

    // Should be in week view
    await expect(page.getByRole('button', { name: 'Week' })).toHaveClass(/bg-white/)
  })

  test('should switch to day view with "d" key', async ({ page }) => {
    // Press 'd' key
    await page.keyboard.press('d')

    // Should be in day view
    await expect(page.getByRole('button', { name: 'Day' })).toHaveClass(/bg-white/)
  })

  test('should navigate to next period with ArrowRight key', async ({ page }) => {
    const initialMonth = await page.locator('h2').last().textContent()

    await page.keyboard.press('ArrowRight')

    const newMonth = await page.locator('h2').last().textContent()
    expect(newMonth).not.toBe(initialMonth)
  })

  test('should navigate to previous period with ArrowLeft key', async ({ page }) => {
    const initialMonth = await page.locator('h2').last().textContent()

    await page.keyboard.press('ArrowLeft')

    const newMonth = await page.locator('h2').last().textContent()
    expect(newMonth).not.toBe(initialMonth)
  })

  test('should focus search with "/" key', async ({ page }) => {
    await page.keyboard.press('/')

    const searchBox = page.getByPlaceholder('Search events... (Press /)')
    await expect(searchBox).toBeFocused()
  })

  test('should close modal with Escape key', async ({ page }) => {
    // Open modal
    await page.keyboard.press('n')
    await expect(page.getByText('Create New Event')).toBeVisible()

    // Press Escape
    await page.keyboard.press('Escape')
    await expect(page.getByText('Create New Event')).not.toBeVisible()
  })

  test('should not trigger shortcuts when typing in input', async ({ page }) => {
    // Open modal
    await page.keyboard.press('n')

    // Focus title input
    await page.getByLabel('Title *').focus()

    // Type 'm' - should not switch view
    await page.keyboard.type('Meeting')

    // Should still be in modal with "Meeting" in title
    await expect(page.getByText('Create New Event')).toBeVisible()
    await expect(page.getByLabel('Title *')).toHaveValue('Meeting')
  })

  test('should not trigger shortcuts when typing in textarea', async ({ page }) => {
    await page.keyboard.press('n')

    // Focus description textarea
    await page.getByLabel('Description').focus()

    // Type 'd' - should not switch to day view
    await page.keyboard.type('daily meeting')

    // Should still be in modal
    await expect(page.getByText('Create New Event')).toBeVisible()
    await expect(page.getByLabel('Description')).toHaveValue('daily meeting')
  })

  test('should close modal with Escape but not trigger if typing', async ({ page }) => {
    await page.keyboard.press('n')
    await page.getByLabel('Title *').focus()

    // Escape should close modal even when in input
    await page.keyboard.press('Escape')
    await expect(page.getByText('Create New Event')).not.toBeVisible()
  })

  test('should navigate periods in different views', async ({ page }) => {
    // Test in week view
    await page.keyboard.press('w')
    const weekHeader = await page.locator('h2').last().textContent()
    await page.keyboard.press('ArrowRight')
    const newWeekHeader = await page.locator('h2').last().textContent()
    expect(newWeekHeader).not.toBe(weekHeader)

    // Test in day view
    await page.keyboard.press('d')
    const dayHeader = await page.locator('h2').last().textContent()
    await page.keyboard.press('ArrowRight')
    const newDayHeader = await page.locator('h2').last().textContent()
    expect(newDayHeader).not.toBe(dayHeader)
  })

  test('should work with keyboard shortcuts in quick succession', async ({ page }) => {
    // Quick succession of shortcuts
    await page.keyboard.press('m') // Month view
    await page.waitForTimeout(100)
    await page.keyboard.press('ArrowRight') // Next month
    await page.waitForTimeout(100)
    await page.keyboard.press('ArrowRight') // Next month again
    await page.waitForTimeout(100)
    await page.keyboard.press('t') // Back to today
    await page.waitForTimeout(100)
    await page.keyboard.press('w') // Week view

    // Should end in week view on current date
    await expect(page.getByRole('button', { name: 'Week' })).toHaveClass(/bg-white/)
  })

  test('should display keyboard shortcuts in sidebar', async ({ page }) => {
    // Click to show shortcuts
    await page.getByRole('button', { name: /Keyboard Shortcuts/i }).click()

    // Shortcuts should be visible
    await expect(page.getByText('Go to today')).toBeVisible()
    await expect(page.getByText('Create new event')).toBeVisible()
    await expect(page.getByText('Month view')).toBeVisible()
  })
})
