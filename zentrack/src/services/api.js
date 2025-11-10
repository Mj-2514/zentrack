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

// Entries API - UPDATED to match backend routes
export const entriesAPI = {
  // Create entry
  createEntry: (entryData) => api.post('/entries/add', entryData),
  
  // Get all entries for logged-in user - FIXED: using '/all' endpoint
  getAllEntries: () => api.get('/entries/all'),
  
  // Get entries by habit
  getEntriesByHabit: (habitId) => api.get(`/entries/${habitId}`),
  
  // Optional: Delete entry if needed
  deleteEntry: (id) => api.delete(`/entries/${id}`)
}

// Auth API
export const authAPI = {
  // Google OAuth
  googleAuth: () => window.location.href = 'http://localhost:5000/auth/google',
  
  // Logout
  logout: () => api.get('/logout')
}

export default api