import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for sessions
})

// Habits API
export const habitsAPI = {
  // Create habit
  createHabit: (habitData) => api.post('/habits/add', habitData),
  
  // Get all habits
  getAllHabits: () => api.get('/habits'),
  
  // Get habit by slug
  getHabitBySlug: (slug) => api.get(`/habits/${slug}`),
  
  // Update habit
  updateHabit: (id, habitData) => api.put(`/habits/${id}`, habitData),
  
  // Delete habit
  deleteHabit: (id) => api.delete(`/habits/${id}`)
}

// Entries API
export const entriesAPI = {
  // Create entry
  createEntry: (entryData) => api.post('/entries', entryData),
  
  // Get entries by habit
  getEntriesByHabit: (habitId) => api.get(`/entries/${habitId}`)
}

// Auth API
export const authAPI = {
  // Google OAuth
  googleAuth: () => window.location.href = 'http://localhost:5000/auth/google',
  
  // Logout
  logout: () => api.get('/logout')
}

export default api