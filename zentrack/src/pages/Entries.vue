<template>
  <div class="entries-page">
    <div class="entries-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">Daily Entries</h1>
          <p class="page-subtitle">Track your daily progress and reflections</p>
        </div>
        <button @click="showEntryForm = true" class="create-entry-btn">
          + New Entry
        </button>
      </div>

      <!-- Date Selector -->
      <div class="date-section">
        <div class="date-navigation">
          <button @click="previousDay" class="date-nav-btn">←</button>
          <div class="current-date">
            <h3>{{ formattedDate }}</h3>
            <p>{{ formattedDay }}</p>
          </div>
          <button @click="nextDay" class="date-nav-btn">→</button>
        </div>
      </div>

      <!-- Create Entry Form -->
      <div v-if="showEntryForm" class="create-form-section">
        <div class="form-container">
          <div class="form-header">
            <h2>New Entry for {{ formattedDate }}</h2>
            <button @click="showEntryForm = false" class="close-btn">×</button>
          </div>
          <form @submit.prevent="createEntry" class="entry-form">
            <div class="form-group">
              <label for="entry-habit" class="form-label">Select Habit *</label>
              <select
                id="entry-habit"
                v-model="newEntry.habitId"
                class="form-input"
                required
              >
                <option value="">Choose a habit</option>
                <option 
                  v-for="habit in habits" 
                  :key="habit._id" 
                  :value="habit._id"
                >
                  {{ habit.title }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="entry-reflection" class="form-label">Reflection</label>
              <textarea
                id="entry-reflection"
                v-model="newEntry.reflection"
                rows="4"
                class="form-input"
                placeholder="How did it go today? Any thoughts or observations..."
              ></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Mood</label>
              <div class="mood-options">
                <label 
                  v-for="mood in moodOptions" 
                  :key="mood.value"
                  class="mood-option"
                  :class="{ selected: newEntry.mood === mood.value }"
                >
                  <input 
                    type="radio" 
                    v-model="newEntry.mood" 
                    :value="mood.value"
                    class="mood-input"
                  >
                  <span class="mood-emoji">{{ mood.emoji }}</span>
                  <span class="mood-label">{{ mood.label }}</span>
                </label>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="submit-btn" :disabled="loading">
                {{ loading ? 'Creating...' : 'Save Entry' }}
              </button>
              <button type="button" @click="showEntryForm = false" class="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Entries List -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading entries...</p>
      </div>

      <div v-else-if="entries.length === 0" class="empty-state">
        <div class="empty-icon">📝</div>
        <h3>No entries for {{ formattedDate }}</h3>
        <p>Start tracking your progress by creating your first entry!</p>
        <button @click="showEntryForm = true" class="empty-action">
          Create First Entry
        </button>
      </div>

      <div v-else class="entries-list">
        <div
          v-for="entry in entries"
          :key="entry._id"
          class="entry-card"
        >
          <div class="entry-header">
            <h3 class="habit-name">{{ getHabitName(entry.habitId) }}</h3>
            <div class="entry-meta">
              <span class="entry-time">{{ formatTime(entry.date) }}</span>
              <span class="entry-mood" v-if="entry.mood">
                {{ getMoodEmoji(entry.mood) }}
              </span>
            </div>
          </div>
          
          <div class="entry-content">
            <p class="entry-reflection" v-if="entry.reflection">{{ entry.reflection }}</p>
            <p v-else class="no-reflection">No reflection added</p>
          </div>

          <div class="entry-actions">
            <button @click="editEntry(entry)" class="action-btn edit">Edit</button>
            <button @click="deleteEntry(entry._id)" class="action-btn delete">Delete</button>
          </div>
        </div>
      </div>

      <!-- Daily Summary -->
      <div v-if="entries.length > 0" class="summary-section">
        <h3 class="summary-title">Daily Summary</h3>
        <div class="summary-stats">
          <div class="summary-stat">
            <span class="stat-value">{{ entries.length }}</span>
            <span class="stat-label">Entries</span>
          </div>
          <div class="summary-stat">
            <span class="stat-value">{{ moodSummary.average || 'N/A' }}</span>
            <span class="stat-label">Avg Mood</span>
          </div>
          <div class="summary-stat">
            <span class="stat-value">{{ completionRate }}%</span>
            <span class="stat-label">Completion</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { entriesAPI, habitsAPI } from '../services/api.js'

const entries = ref([])
const habits = ref([])
const loading = ref(false)
const showEntryForm = ref(false)
const selectedDate = ref(new Date())

const newEntry = ref({
  habitId: '',
  reflection: '',
  mood: ''
})

const moodOptions = [
  { value: 'excellent', emoji: '😊', label: 'Excellent' },
  { value: 'good', emoji: '🙂', label: 'Good' },
  { value: 'neutral', emoji: '😐', label: 'Neutral' },
  { value: 'poor', emoji: '😔', label: 'Poor' },
  { value: 'terrible', emoji: '😞', label: 'Terrible' }
]

// Computed properties
const formattedDate = computed(() => {
  return selectedDate.value.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  })
})

const formattedDay = computed(() => {
  return selectedDate.value.toLocaleDateString('en-US', { 
    weekday: 'long' 
  })
})

const moodSummary = computed(() => {
  const moodEntries = entries.value.filter(entry => entry.mood)
  if (moodEntries.length === 0) return { average: null }
  
  const moodValues = {
    'terrible': 1,
    'poor': 2,
    'neutral': 3,
    'good': 4,
    'excellent': 5
  }
  
  const average = moodEntries.reduce((sum, entry) => {
    return sum + moodValues[entry.mood]
  }, 0) / moodEntries.length
  
  return { average: average.toFixed(1) }
})

const completionRate = computed(() => {
  const totalHabits = habits.value.length
  if (totalHabits === 0) return 0
  return Math.round((entries.value.length / totalHabits) * 100)
})

// Methods
const loadEntries = async () => {
  loading.value = true
  try {
    // In a real app, you'd filter by date
    const response = await entriesAPI.getEntriesByHabit('all') // You might need to adjust this
    entries.value = response.data
  } catch (error) {
    console.error('Failed to load entries:', error)
  } finally {
    loading.value = false
  }
}

const loadHabits = async () => {
  try {
    const response = await habitsAPI.getAllHabits()
    habits.value = response.data
  } catch (error) {
    console.error('Failed to load habits:', error)
  }
}

const createEntry = async () => {
  try {
    const entryData = {
      ...newEntry.value,
      date: selectedDate.value.toISOString()
    }
    const response = await entriesAPI.createEntry(entryData)
    entries.value.push(response.data)
    newEntry.value = { habitId: '', reflection: '', mood: '' }
    showEntryForm.value = false
  } catch (error) {
    console.error('Failed to create entry:', error)
    alert('Failed to create entry')
  }
}

const editEntry = (entry) => {
  // Implement edit functionality
  console.log('Edit entry:', entry)
}

const deleteEntry = async (entryId) => {
  if (!confirm('Are you sure you want to delete this entry?')) return
  
  try {
    await entriesAPI.deleteEntry(entryId) // You might need to add this to your API
    entries.value = entries.value.filter(entry => entry._id !== entryId)
  } catch (error) {
    console.error('Failed to delete entry:', error)
    alert('Failed to delete entry')
  }
}

const getHabitName = (habitId) => {
  const habit = habits.value.find(h => h._id === habitId)
  return habit ? habit.title : 'Unknown Habit'
}

const getMoodEmoji = (mood) => {
  const moodOption = moodOptions.find(m => m.value === mood)
  return moodOption ? moodOption.emoji : '❓'
}

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const previousDay = () => {
  selectedDate.value = new Date(selectedDate.value.setDate(selectedDate.value.getDate() - 1))
  loadEntries()
}

const nextDay = () => {
  selectedDate.value = new Date(selectedDate.value.setDate(selectedDate.value.getDate() + 1))
  loadEntries()
}

onMounted(() => {
  loadHabits()
  loadEntries()
})
</script>

<style scoped>
.entries-page {
  min-height: 100vh;
  padding: 2rem 1rem;
}

.entries-container {
  max-width: 800px;
  margin: 0 auto;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: #cbd5e1;
  font-size: 1.125rem;
}

.create-entry-btn {
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.create-entry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(6, 182, 212, 0.3);
}

/* Date Section */
.date-section {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.date-navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.date-nav-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #f8fafc;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.75rem;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.date-nav-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.current-date {
  text-align: center;
}

.current-date h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 0.25rem;
}

.current-date p {
  color: #64748b;
  font-size: 0.875rem;
}

/* Create Form */
.create-form-section {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  padding: 2rem;
  margin-bottom: 2rem;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.form-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #f8fafc;
}

.close-btn {
  background: none;
  border: none;
  color: #64748b;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #f8fafc;
}

.entry-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  color: #f8fafc;
  font-size: 0.875rem;
  font-weight: 500;
}

.form-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 1rem;
  color: #f8fafc;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.form-input:focus {
  outline: none;
  border-color: #06b6d4;
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
}

/* Mood Options */
.mood-options {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.mood-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  min-width: 80px;
}

.mood-option:hover {
  background: rgba(255, 255, 255, 0.1);
}

.mood-option.selected {
  border-color: #06b6d4;
  background: rgba(6, 182, 212, 0.1);
}

.mood-input {
  display: none;
}

.mood-emoji {
  font-size: 1.5rem;
}

.mood-label {
  font-size: 0.75rem;
  color: #cbd5e1;
  text-align: center;
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.submit-btn {
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(6, 182, 212, 0.3);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.cancel-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #f8fafc;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Entries List */
.entries-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.entry-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.entry-card:hover {
  border-color: #06b6d4;
  transform: translateY(-2px);
}

.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.habit-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #f8fafc;
  margin: 0;
}

.entry-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.entry-time {
  color: #64748b;
  font-size: 0.875rem;
}

.entry-mood {
  font-size: 1.125rem;
}

.entry-content {
  margin-bottom: 1rem;
}

.entry-reflection {
  color: #cbd5e1;
  line-height: 1.5;
  margin: 0;
}

.no-reflection {
  color: #64748b;
  font-style: italic;
  margin: 0;
}

.entry-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.action-btn {
  background: none;
  border: none;
  color: #64748b;
  font-size: 0.75rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.action-btn.edit:hover {
  background: rgba(6, 182, 212, 0.1);
  color: #06b6d4;
}

.action-btn.delete:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

/* Summary Section */
.summary-section {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
}

.summary-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #f8fafc;
  margin-bottom: 1rem;
  text-align: center;
}

.summary-stats {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
}

.summary-stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Loading and Empty States */
.loading-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #64748b;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid transparent;
  border-top: 3px solid #06b6d4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #64748b;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #f8fafc;
  margin-bottom: 0.5rem;
}

.empty-state p {
  margin-bottom: 1.5rem;
}

.empty-action {
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.empty-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(6, 182, 212, 0.3);
}

/* Animations */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .create-entry-btn {
    align-self: stretch;
  }
  
  .mood-options {
    flex-direction: column;
  }
  
  .mood-option {
    flex-direction: row;
    justify-content: flex-start;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .entry-header {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .entry-meta {
    align-self: flex-end;
  }
  
  .summary-stats {
    flex-direction: column;
    gap: 1.5rem;
  }
}
</style>