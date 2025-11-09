import { test, expect } from '@playwright/test'

test.describe('Calendar Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Clear localStorage before each test
    await page.evaluate(() => localStorage.clear())
  })

  test('should display calendar header with current month', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Calendar Pro')

    const currentDate = new Date()
    const monthYear = currentDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    })

    await expect(page.locator('h2').filter({ hasText: monthYear })).toBeVisible()
  })

  test('should have Today button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Today' })).toBeVisible()
  })

  test('should have Month, Week, Day view buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Month' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Week' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Day' })).toBeVisible()
  })

  test('should navigate to next month', async ({ page }) => {
    const initialMonth = await page.locator('h2').last().textContent()

    // Click next button
    await page.locator('button[title="Next"]').click()

    const newMonth = await page.locator('h2').last().textContent()
    expect(newMonth).not.toBe(initialMonth)
  })

  test('should navigate to previous month', async ({ page }) => {
    const initialMonth = await page.locator('h2').last().textContent()

    // Click previous button
    await page.locator('button[title="Previous"]').click()

    const newMonth = await page.locator('h2').last().textContent()
    expect(newMonth).not.toBe(initialMonth)
  })

  test('should switch to week view', async ({ page }) => {
    await page.getByRole('button', { name: 'Week' }).click()

    // Week view should show days of the week with dates
    await expect(page.getByText('Sun')).toBeVisible()
    await expect(page.getByText('Mon')).toBeVisible()
    await expect(page.getByText('Sat')).toBeVisible()
  })

  test('should switch to day view', async ({ page }) => {
    await page.getByRole('button', { name: 'Day' }).click()

    // Day view should show hourly slots
    await expect(page.getByText('9:00 AM')).toBeVisible()
    await expect(page.getByText('10:00 AM')).toBeVisible()
  })

  test('should return to today when clicking Today button', async ({ page }) => {
    // Navigate to next month
    await page.locator('button[title="Next"]').click()
    await page.locator('button[title="Next"]').click()

    // Click Today button
    await page.getByRole('button', { name: 'Today' }).click()

    // Should show current month
    const currentDate = new Date()
    const monthYear = currentDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    })

    await expect(page.locator('h2').filter({ hasText: monthYear })).toBeVisible()
  })

  test('should display weekday headers in month view', async ({ page }) => {
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    for (const day of weekdays) {
      await expect(page.getByText(day).first()).toBeVisible()
    }
  })

  test('should highlight today in the calendar', async ({ page }) => {
    // Today should have a blue background indicator
    const today = new Date().getDate().toString()
    const todayCell = page.locator('.bg-blue-600').first()
    await expect(todayCell).toBeVisible()
  })
})
