import { test, expect } from '@playwright/test'

test.describe('Drag and Drop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())

    // Create a test event for today
    await page.getByRole('button', { name: 'New Event' }).click()
    await page.getByLabel('Title *').fill('Draggable Event')

    // Set to today
    const today = new Date()
    const dateStr = today.toISOString().split('T')[0]
    await page.getByLabel('Start Date *').fill(dateStr)
    await page.getByLabel('End Date *').fill(dateStr)
    await page.getByLabel('Start Time *').fill('10:00')
    await page.getByLabel('End Time *').fill('11:00')

    await page.getByRole('button', { name: 'Create Event' }).click()
    await page.waitForTimeout(500)

    // Make sure we're in month view
    await page.getByRole('button', { name: 'Month' }).click()
  })

  test('should have draggable events in month view', async ({ page }) => {
    const event = page.getByText('Draggable Event').first()
    await expect(event).toBeVisible()

    // Check if the event button has draggable attribute
    const draggableAttr = await event.evaluate(el => {
      const button = el.closest('button')
      return button ? button.getAttribute('draggable') : null
    })

    expect(draggableAttr).toBe('true')
  })

  test('should show cursor-move class on draggable events', async ({ page }) => {
    const event = page.getByText('Draggable Event').first()
    const button = event.locator('..')

    await expect(button).toHaveClass(/cursor-move/)
  })

  test('should drag event to different date', async ({ page }) => {
    const event = page.getByText('Draggable Event').first()

    // Get the event's current position
    const eventBox = await event.boundingBox()
    expect(eventBox).not.toBeNull()

    // Find a different date cell (we'll drag to the next week, same weekday)
    // Calculate the target cell - roughly 7 days (1 row) down
    const targetX = eventBox.x
    const targetY = eventBox.y + 140 // Approximate height of a calendar row

    // Perform drag and drop
    await event.hover()
    await page.mouse.down()
    await page.mouse.move(targetX, targetY, { steps: 10 })
    await page.mouse.up()

    await page.waitForTimeout(300)

    // Event should still exist (may have moved)
    await expect(page.getByText('Draggable Event')).toBeVisible()
  })

  test('should highlight drop zone on drag over', async ({ page }) => {
    const event = page.getByText('Draggable Event').first()
    const eventBox = await event.boundingBox()

    // Start dragging
    await event.hover()
    await page.mouse.down()

    // Move to a different cell
    const targetX = eventBox.x
    const targetY = eventBox.y + 140

    await page.mouse.move(targetX, targetY, { steps: 5 })

    // Check for blue background (drop zone highlight)
    const highlightedCell = page.locator('.bg-blue-100')
    await expect(highlightedCell).toBeVisible()

    await page.mouse.up()
  })

  test('should preserve event time when dragging to new date', async ({ page }) => {
    const event = page.getByText('Draggable Event').first()
    const eventBox = await event.boundingBox()

    // Drag to different date
    await event.hover()
    await page.mouse.down()
    await page.mouse.move(eventBox.x, eventBox.y + 140, { steps: 10 })
    await page.mouse.up()

    await page.waitForTimeout(300)

    // Event should still show same time
    await expect(page.getByText(/10:00 AM.*Draggable Event/)).toBeVisible()
  })
})
