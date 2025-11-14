// services/api.js - VERIFY THIS CONFIGURATION
import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

// Habits API
export const habitsAPI = {
  createHabit: (habitData) => api.post('/habits/add', habitData),
  getAllHabits: () => api.get('/habits'),
  getHabitBySlug: (slug) => api.get(`/habits/${slug}`),
  updateHabit: (id, habitData) => api.put(`/habits/${id}`, habitData),
  deleteHabit: (id) => api.delete(`/habits/${id}`)
}

// Entries API - CRITICAL: Make sure this matches your backend
export const entriesAPI = {
  createEntry: (entryData) => api.post('/entries/add', entryData),
  getAllEntries: () => api.get('/entries/all'), // ← This should be '/entries/all'
  getEntriesByHabit: (habitId) => api.get(`/entries/${habitId}`),
  deleteEntry: (id) => api.delete(`/entries/${id}`)
}

// Auth API
export const authAPI = {
  googleAuth: () => window.location.href = 'http://localhost:5000/auth/google',
  logout: () => api.get('/logout')
}

export default api