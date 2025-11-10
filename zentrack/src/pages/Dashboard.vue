<template>
  <div class="dashboard-page">
    <div class="dashboard-container">
      <!-- Welcome Section -->
      <div class="welcome-section">
        <div class="welcome-content">
          <h1 class="welcome-title">
            Welcome back, <span class="user-name">{{ user?.name }}</span>! 👋
          </h1>
          <p class="welcome-subtitle">Your habit journey continues here. Let's make today count!</p>
        </div>
        <div class="welcome-actions">
          <router-link to="/habits" class="action-btn primary">
            View My Habits
          </router-link>
          <router-link to="/habits?new=true" class="action-btn secondary">
            + New Habit
          </router-link>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-info">
            <div class="stat-number">{{ stats.activeHabits }}</div>
            <div class="stat-label">Active Habits</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🔥</div>
          <div class="stat-info">
            <div class="stat-number">{{ stats.currentStreak }} days</div>
            <div class="stat-label">Current Streak</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-info">
            <div class="stat-number">{{ stats.completionRate }}%</div>
            <div class="stat-label">Completion Rate</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🎯</div>
          <div class="stat-info">
            <div class="stat-number">{{ stats.goalsAchieved }}</div>
            <div class="stat-label">Goals Achieved</div>
          </div>
        </div>
      </div>

      <!-- Today's Habits -->
      <div class="today-section">
        <div class="section-header">
          <h2 class="section-title">Today's Habits</h2>
          <p class="section-subtitle">{{ currentDate }}</p>
        </div>
        
        <div v-if="todayHabits.length > 0" class="habits-list">
          <div 
            v-for="habit in todayHabits" 
            :key="habit._id" 
            class="habit-item"
            :class="{ completed: habit.completedToday }"
          >
            <div class="habit-info">
              <h3 class="habit-name">{{ habit.title }}</h3>
              <p class="habit-category">{{ habit.category }}</p>
            </div>
            <div class="habit-actions">
              <button 
                @click="toggleHabitCompletion(habit._id)"
                class="completion-btn"
                :class="{ completed: habit.completedToday }"
              >
                {{ habit.completedToday ? '✅' : '⚪' }}
              </button>
            </div>
          </div>
        </div>
        
        <div v-else class="empty-state">
          <div class="empty-icon">📝</div>
          <h3>No habits for today</h3>
          <p>Create your first habit to start tracking your progress!</p>
          <router-link to="/habits?new=true" class="empty-action">
            Create Your First Habit
          </router-link>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="activity-section">
        <h2 class="section-title">Recent Activity</h2>
        <div v-if="recentActivity.length > 0" class="activity-list">
          <div 
            v-for="activity in recentActivity" 
            :key="activity._id" 
            class="activity-item"
          >
            <div class="activity-icon">
              <span v-html="getActivityIcon(activity.type)"></span>
            </div>
            <div class="activity-content">
              <p class="activity-text">{{ activity.text }}</p>
              <span class="activity-time">{{ formatTime(activity.timestamp) }}</span>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          <div class="empty-icon">📊</div>
          <h3>No activity yet</h3>
          <p>Your recent activity will appear here as you track your habits.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '../services/auth.js'

const { user } = useAuth()

// Stats data
const stats = ref({
  activeHabits: 0,
  currentStreak: 0,
  completionRate: 0,
  goalsAchieved: 0
})

// Today's habits
const todayHabits = ref([])

// Recent activity
const recentActivity = ref([])

// Current date
const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
})

// Methods
const toggleHabitCompletion = (habitId) => {
  const habit = todayHabits.value.find(h => h._id === habitId)
  if (habit) {
    habit.completedToday = !habit.completedToday
    // Here you would call your API to update the habit completion
  }
}

const getActivityIcon = (type) => {
  const icons = {
    habit_created: '📝',
    habit_completed: '✅',
    streak_achieved: '🔥',
    goal_achieved: '🎯'
  }
  return icons[type] || '📊'
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// Load data on mount
onMounted(async () => {
  // Simulate loading data
  setTimeout(() => {
    stats.value = {
      activeHabits: 3,
      currentStreak: 7,
      completionRate: 85,
      goalsAchieved: 2
    }
    
    todayHabits.value = [
      {
        _id: '1',
        title: 'Morning Meditation',
        category: 'Mindfulness',
        completedToday: true
      },
      {
        _id: '2',
        title: 'Exercise',
        category: 'Health',
        completedToday: false
      },
      {
        _id: '3',
        title: 'Read 30 minutes',
        category: 'Learning',
        completedToday: false
      }
    ]
    
    recentActivity.value = [
      {
        _id: '1',
        type: 'habit_completed',
        text: 'Completed Morning Meditation',
        timestamp: new Date().setHours(8, 30)
      },
      {
        _id: '2',
        type: 'habit_created',
        text: 'Started tracking "Read 30 minutes"',
        timestamp: new Date().setHours(7, 0)
      }
    ]
  }, 500)
})
</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  padding: 2rem 1rem;
}

.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Welcome Section */
.welcome-section {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  padding: 2rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.welcome-title {
  font-size: 2rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 0.5rem;
}

.user-name {
  background: linear-gradient(135deg, #06b6d4, #8b5cf6);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.welcome-subtitle {
  color: #cbd5e1;
  font-size: 1.125rem;
}

.welcome-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.action-btn.primary {
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  color: white;
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(6, 182, 212, 0.3);
}

.action-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #f8fafc;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.action-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.stat-card:hover {
  border-color: #06b6d4;
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 2rem;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 0.25rem;
}

.stat-label {
  color: #cbd5e1;
  font-size: 0.875rem;
}

/* Today's Habits */
.today-section {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  padding: 2rem;
  margin-bottom: 2rem;
}

.section-header {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 0.5rem;
}

.section-subtitle {
  color: #64748b;
  font-size: 0.875rem;
}

.habits-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.habit-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  transition: all 0.3s ease;
}

.habit-item:hover {
  border-color: rgba(6, 182, 212, 0.3);
}

.habit-item.completed {
  border-color: rgba(34, 197, 94, 0.3);
  background: rgba(34, 197, 94, 0.05);
}

.habit-info {
  flex: 1;
}

.habit-name {
  font-size: 1rem;
  font-weight: 600;
  color: #f8fafc;
  margin-bottom: 0.25rem;
}

.habit-category {
  color: #64748b;
  font-size: 0.875rem;
}

.completion-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s ease;
  padding: 0.5rem;
  border-radius: 0.5rem;
}

.completion-btn:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.1);
}

/* Activity Section */
.activity-section {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  padding: 2rem;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
}

.activity-icon {
  font-size: 1.25rem;
}

.activity-content {
  flex: 1;
}

.activity-text {
  color: #f8fafc;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.activity-time {
  color: #64748b;
  font-size: 0.75rem;
}

/* Empty States */
.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: #64748b;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.25rem;
  color: #f8fafc;
  margin-bottom: 0.5rem;
}

.empty-state p {
  margin-bottom: 1.5rem;
}

.empty-action {
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.empty-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(6, 182, 212, 0.3);
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .welcome-section {
    flex-direction: column;
    text-align: center;
  }
  
  .welcome-actions {
    justify-content: center;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .habit-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .habit-actions {
    align-self: flex-end;
  }
}
</style>