import { API_BASE_URL } from '../config.js'

class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }))
    throw new ApiError(error.detail || 'Request failed', response.status)
  }
  return response.json()
}

// Calendar API
export const calendarApi = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/api/calendars`)
    return handleResponse(response)
  },

  async get(id) {
    const response = await fetch(`${API_BASE_URL}/api/calendars/${id}`)
    return handleResponse(response)
  },

  async create(calendar) {
    const response = await fetch(`${API_BASE_URL}/api/calendars`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(calendar)
    })
    return handleResponse(response)
  },

  async update(id, calendar) {
    const response = await fetch(`${API_BASE_URL}/api/calendars/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(calendar)
    })
    return handleResponse(response)
  },

  async delete(id) {
    const response = await fetch(`${API_BASE_URL}/api/calendars/${id}`, {
      method: 'DELETE'
    })
    return handleResponse(response)
  }
}

// Event API
export const eventApi = {
  async getAll(params = {}) {
    const queryParams = new URLSearchParams()
    if (params.start_date) queryParams.append('start_date', params.start_date)
    if (params.end_date) queryParams.append('end_date', params.end_date)
    if (params.skip) queryParams.append('skip', params.skip)
    if (params.limit) queryParams.append('limit', params.limit)

    const url = `${API_BASE_URL}/api/events${queryParams.toString() ? '?' + queryParams.toString() : ''}`
    const response = await fetch(url)
    return handleResponse(response)
  },

  async get(id) {
    const response = await fetch(`${API_BASE_URL}/api/events/${id}`)
    return handleResponse(response)
  },

  async create(event) {
    const response = await fetch(`${API_BASE_URL}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    })
    return handleResponse(response)
  },

  async update(id, event) {
    const response = await fetch(`${API_BASE_URL}/api/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    })
    return handleResponse(response)
  },

  async delete(id) {
    const response = await fetch(`${API_BASE_URL}/api/events/${id}`, {
      method: 'DELETE'
    })
    return handleResponse(response)
  }
}
