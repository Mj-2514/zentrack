<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 p-6">
    <div class="max-w-6xl mx-auto space-y-8">

      <!-- Welcome Section -->
      <div v-if="user" class="bg-gray-800 rounded-xl p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold">
            Welcome back, 
            <span class="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">{{ user.name }}</span>! 👋
          </h1>
          <p class="text-gray-300 mt-1">Your habit journey continues here. Let's make today count!</p>
        </div>
        <div class="flex gap-3 flex-wrap">
          <router-link to="/habits" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition">View My Habits</router-link>
          <router-link to="/habits?new=true" class="border border-gray-400 hover:bg-gray-700 px-4 py-2 rounded-lg font-semibold transition">+ New Habit</router-link>
        </div>
      </div>

      <!-- Stats -->
      <div v-if="stats" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-gray-800 p-4 rounded-lg flex items-center gap-3">
          <div class="text-2xl">📊</div>
          <div>
            <div class="text-lg font-bold">{{ stats.activeHabits }}</div>
            <div class="text-gray-400 text-sm">Active Habits</div>
          </div>
        </div>
        <div class="bg-gray-800 p-4 rounded-lg flex items-center gap-3">
          <div class="text-2xl">🔥</div>
          <div>
            <div class="text-lg font-bold">{{ stats.currentStreak }} days</div>
            <div class="text-gray-400 text-sm">Current Streak</div>
          </div>
        </div>
        <div class="bg-gray-800 p-4 rounded-lg flex items-center gap-3">
          <div class="text-2xl">✅</div>
          <div>
            <div class="text-lg font-bold">{{ stats.completionRate }}%</div>
            <div class="text-gray-400 text-sm">Completion Rate</div>
          </div>
        </div>
        <div class="bg-gray-800 p-4 rounded-lg flex items-center gap-3">
          <div class="text-2xl">🎯</div>
          <div>
            <div class="text-lg font-bold">{{ stats.goalsAchieved }}</div>
            <div class="text-gray-400 text-sm">Goals Achieved</div>
          </div>
        </div>
      </div>

      <!-- Today's Habits -->
      <div>
        <div class="flex justify-between items-center mb-3">
          <h2 class="text-xl font-semibold">Today's Habits</h2>
          <p class="text-gray-400">{{ currentDate }}</p>
        </div>

        <div v-if="todayHabits.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div v-for="habit in todayHabits" :key="habit._id" class="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
            <div>
              <h3 class="font-semibold">{{ habit.title }}</h3>
              <p class="text-gray-400 text-sm">{{ habit.category }}</p>
            </div>
            <button @click="toggleHabitCompletion(habit)"
              class="text-2xl p-2 rounded-full border border-gray-600 hover:bg-gray-700 transition"
              :class="{ 'bg-green-600': habit.completedToday }">
              {{ habit.completedToday ? '✅' : '⚪' }}
            </button>
          </div>
        </div>

        <div v-else class="text-center text-gray-400 py-10">
          <div class="text-4xl mb-2">📝</div>
          <p>No habits for today</p>
          <router-link to="/habits?new=true" class="mt-2 inline-block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition">Create Your First Habit</router-link>
        </div>
      </div>

      <!-- Recent Activity -->
      <div>
        <h2 class="text-xl font-semibold mb-3">Recent Activity</h2>
        <div v-if="recentActivity.length" class="space-y-3">
          <div v-for="activity in recentActivity" :key="activity._id" class="bg-gray-800 p-3 rounded-lg flex items-center gap-3">
            <div class="text-2xl">{{ getActivityIcon(activity.type) }}</div>
            <div class="flex-1">
              <p>{{ activity.text }}</p>
              <p class="text-gray-400 text-sm">{{ formatTime(activity.date) }}</p>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-400 py-10">
          <div class="text-4xl mb-2">📊</div>
          <p>No activity yet</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useAuth } from '../services/auth.js'
import { habitsAPI, entriesAPI } from '../services/api.js'

const { user } = useAuth()

const habits = ref([])
const todayHabits = ref([])
const allEntries = ref([])
const recentActivity = ref([])
const stats = ref({
  activeHabits: 0,
  currentStreak: 0,
  completionRate: 0,
  goalsAchieved: 0
})
const loading = ref(false)

const currentDate = computed(() =>
  new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
)

const fetchDashboard = async () => {
  if (!user.value) return
  
  loading.value = true
  try {
    // Fetch all habits for the user
    const habitsRes = await habitsAPI.getAllHabits()
    habits.value = habitsRes.data || []

    // Filter today's habits for current user
    todayHabits.value = habits.value.filter(h => h.userId === user.value.id)

    // Try to fetch entries - handle 404 gracefully
    let entriesData = []
    try {
      const entriesRes = await entriesAPI.getAllEntries()
      entriesData = entriesRes.data || []
    } catch (entriesError) {
      console.warn('Entries endpoint not available, using empty data:', entriesError.message)
      entriesData = []
    }

    allEntries.value = entriesData

    // Mark today's habits as completed if they have entries for today
    const today = new Date().toDateString()
    todayHabits.value.forEach(habit => {
      habit.completedToday = allEntries.value.some(entry => 
        entry.habitId === habit._id && 
        new Date(entry.date).toDateString() === today
      )
    })

    // Generate recent activity from entries
    recentActivity.value = allEntries.value
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map(entry => ({
        ...entry,
        text: `Completed "${getHabitTitle(entry.habitId)}"`,
        type: 'habit_completed'
      }))

    // If no entries, create some sample recent activity from habits
    if (recentActivity.value.length === 0 && habits.value.length > 0) {
      recentActivity.value = habits.value.slice(0, 3).map(habit => ({
        _id: `habit-${habit._id}`,
        text: `Created "${habit.title}"`,
        type: 'habit_created',
        date: habit.createdAt || new Date().toISOString()
      }))
    }

    // Compute stats
    stats.value.activeHabits = todayHabits.value.length
    stats.value.currentStreak = computeCurrentStreak(allEntries.value)
    stats.value.completionRate = computeCompletionRate(allEntries.value, habits.value)
    stats.value.goalsAchieved = computeGoalsAchieved(habits.value, allEntries.value)

  } catch (err) {
    console.error('Dashboard fetch error:', err)
  } finally {
    loading.value = false
  }
}

// Helper function to get habit title by ID
const getHabitTitle = (habitId) => {
  const habit = habits.value.find(h => h._id === habitId)
  return habit ? habit.title : 'Unknown Habit'
}

// Improved helper functions to compute stats
const computeCurrentStreak = (entries) => {
  if (!entries.length) return 0
  
  const uniqueDays = [...new Set(entries.map(e => new Date(e.date).toDateString()))]
    .sort((a, b) => new Date(b) - new Date(a))
  
  let streak = 0
  const today = new Date()
  
  for (let i = 0; i < uniqueDays.length; i++) {
    const day = new Date(uniqueDays[i])
    const expectedDate = new Date(today)
    expectedDate.setDate(today.getDate() - i)
    
    if (day.toDateString() === expectedDate.toDateString()) {
      streak++
    } else {
      break
    }
  }
  
  return streak
}

const computeCompletionRate = (entries, habits) => {
  if (!habits.length) return 0
  
  const totalPossibleCompletions = habits.length
  const actualCompletions = entries.length
  
  return Math.round((actualCompletions / totalPossibleCompletions) * 100)
}

const computeGoalsAchieved = (habits, entries) => {
  const completedHabitIds = [...new Set(entries.map(e => e.habitId))]
  return completedHabitIds.length
}

// Watch for user changes and also mount
onMounted(() => {
  if (user.value) {
    fetchDashboard()
  }
})

watch(user, (val) => {
  if (val) fetchDashboard()
})

const toggleHabitCompletion = async (habit) => {
  try {
    const today = new Date().toISOString().split('T')[0]
    
    // Check if habit is already completed today
    if (habit.completedToday) {
      // If already completed, we can't undo without a proper entries API
      console.log('Habit already completed today')
      return
    }

    // Create new entry
    await entriesAPI.createEntry({
      habitId: habit._id,
      date: new Date().toISOString(),
      completed: true
    })
    
    // Update local state
    habit.completedToday = true
    
    // Refresh dashboard data
    await fetchDashboard()
  } catch (err) {
    console.error('Toggle habit completion error:', err)
  }
}

const getActivityIcon = (type) => ({
  habit_created: '📝',
  habit_completed: '✅',
  streak_achieved: '🔥',
  goal_achieved: '🎯'
}[type] || '📊')

const formatTime = (ts) => {
  if (!ts) return ''
  return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}
</script>