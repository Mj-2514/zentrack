<template>
  <div class="habits-page">
    <div class="habits-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">My Habits</h1>
          <p class="page-subtitle">Track and manage your daily habits</p>
        </div>
        <button @click="showCreateForm = true" class="create-habit-btn">
          + New Habit
        </button>
      </div>

      <!-- Create Habit Form -->
      <div v-if="showCreateForm" class="create-form-section">
        <div class="form-container">
          <div class="form-header">
            <h2>Create New Habit</h2>
            <button @click="showCreateForm = false" class="close-btn">×</button>
          </div>
          <form @submit.prevent="createHabit" class="habit-form">
            <div class="form-group">
              <label for="habit-title" class="form-label">Habit Title *</label>
              <input
                id="habit-title"
                v-model="newHabit.title"
                type="text"
                class="form-input"
                placeholder="e.g., Morning Meditation"
                required
              >
            </div>

            <div class="form-group">
              <label for="habit-category" class="form-label">Category</label>
              <select
                id="habit-category"
                v-model="newHabit.category"
                class="form-input"
              >
                <option value="">Select a category</option>
                <option value="Health & Fitness">Health & Fitness</option>
                <option value="Mindfulness">Mindfulness</option>
                <option value="Learning">Learning</option>
                <option value="Productivity">Productivity</option>
                <option value="Relationships">Relationships</option>
                <option value="Financial">Financial</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div class="form-group">
              <label for="habit-goal" class="form-label">Goal Description</label>
              <textarea
                id="habit-goal"
                v-model="newHabit.goal"
                rows="3"
                class="form-input"
                placeholder="Describe what you want to achieve with this habit..."
              ></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Frequency</label>
              <div class="frequency-options">
                <label class="frequency-option">
                  <input type="radio" v-model="newHabit.frequency" value="daily">
                  <span class="radio-custom"></span>
                  Daily
                </label>
                <label class="frequency-option">
                  <input type="radio" v-model="newHabit.frequency" value="weekly">
                  <span class="radio-custom"></span>
                  Weekly
                </label>
                <label class="frequency-option">
                  <input type="radio" v-model="newHabit.frequency" value="custom">
                  <span class="radio-custom"></span>
                  Custom
                </label>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="submit-btn" :disabled="loading">
                {{ loading ? 'Creating...' : 'Create Habit' }}
              </button>
              <button type="button" @click="showCreateForm = false" class="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Habits Grid -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading your habits...</p>
      </div>

      <div v-else-if="habits.length === 0" class="empty-state">
        <div class="empty-icon">📝</div>
        <h3>No habits yet</h3>
        <p>Start building better habits by creating your first one!</p>
        <button @click="showCreateForm = true" class="empty-action">
          Create Your First Habit
        </button>
      </div>

      <div v-else class="habits-grid">
        <div
          v-for="habit in habits"
          :key="habit._id"
          class="habit-card"
        >
          <div class="habit-header">
            <h3 class="habit-title">{{ habit.title }}</h3>
            <div class="habit-actions">
              <button @click="editHabit(habit)" class="action-btn edit">Edit</button>
              <button @click="deleteHabit(habit._id)" class="action-btn delete">Delete</button>
            </div>
          </div>
          
          <div class="habit-content">
            <div class="habit-meta">
              <span class="habit-category" v-if="habit.category">{{ habit.category }}</span>
              <span class="habit-frequency">{{ habit.frequency || 'Daily' }}</span>
            </div>
            
            <p class="habit-goal" v-if="habit.goal">{{ habit.goal }}</p>
            
            <div class="habit-stats">
              <div class="stat">
                <span class="stat-value">{{ habit.currentStreak || 0 }}</span>
                <span class="stat-label">day streak</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ habit.completionRate || 0 }}%</span>
                <span class="stat-label">completion</span>
              </div>
            </div>
          </div>

          <div class="habit-footer">
            <router-link :to="`/habits/${habit.slug}`" class="view-details-btn">
              View Details & Entries
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { habitsAPI } from '../services/api.js'

const habits = ref([])
const loading = ref(false)
const showCreateForm = ref(false)
const newHabit = ref({
  title: '',
  category: '',
  goal: '',
  frequency: 'daily'
})

// Load habits
const loadHabits = async () => {
  loading.value = true
  try {
    const response = await habitsAPI.getAllHabits()
    habits.value = response.data
  } catch (error) {
    console.error('Failed to load habits:', error)
  } finally {
    loading.value = false
  }
}

// Create habit
const createHabit = async () => {
  try {
    const response = await habitsAPI.createHabit(newHabit.value)
    habits.value.push(response.data)
    newHabit.value = { title: '', category: '', goal: '', frequency: 'daily' }
    showCreateForm.value = false
  } catch (error) {
    console.error('Failed to create habit:', error)
    alert('Failed to create habit')
  }
}

// Edit habit
const editHabit = (habit) => {
  // Implement edit functionality
  
}

// Delete habit
const deleteHabit = async (habitId) => {
  if (!confirm('Are you sure you want to delete this habit?')) return
  
  try {
    await habitsAPI.deleteHabit(habitId)
    habits.value = habits.value.filter(habit => habit._id !== habitId)
  } catch (error) {
    console.error('Failed to delete habit:', error)
    alert('Failed to delete habit')
  }
}

onMounted(() => {
  loadHabits()
})
</script>

<style scoped>
.habits-page {
  min-height: 100vh;
  padding: 2rem 1rem;
}

.habits-container {
  max-width: 1200px;
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

.create-habit-btn {
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.create-habit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(6, 182, 212, 0.3);
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

.habit-form {
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

.form-input::placeholder {
  color: #64748b;
}

/* Frequency Options */
.frequency-options {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.frequency-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #cbd5e1;
  font-size: 0.875rem;
  cursor: pointer;
}

.frequency-option input {
  display: none;
}

.radio-custom {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  position: relative;
  transition: all 0.3s ease;
}

.frequency-option input:checked + .radio-custom {
  border-color: #06b6d4;
  background: #06b6d4;
}

.frequency-option input:checked + .radio-custom::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0.25rem;
  height: 0.25rem;
  background: white;
  border-radius: 50%;
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

/* Habits Grid */
.habits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.habit-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.habit-card:hover {
  border-color: #06b6d4;
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.habit-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.habit-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #f8fafc;
  margin: 0;
  flex: 1;
}

.habit-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: none;
  border: none;
  color: #64748b;
  font-size: 0.75rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
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

.habit-content {
  margin-bottom: 1.5rem;
}

.habit-meta {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.habit-category, .habit-frequency {
  background: rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.habit-goal {
  color: #cbd5e1;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.habit-stats {
  display: flex;
  gap: 1.5rem;
}

.stat {
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

.habit-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
}

.view-details-btn {
  display: block;
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  color: #f8fafc;
  text-decoration: none;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.view-details-btn:hover {
  background: rgba(255, 255, 255, 0.2);
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
  
  .create-habit-btn {
    align-self: stretch;
  }
  
  .habits-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .habit-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .habit-actions {
    align-self: flex-end;
  }
}
</style>