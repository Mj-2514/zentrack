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

      <!-- Entries Section -->
      <div>
        <div class="flex justify-between items-center mb-3">
          <h2 class="text-xl font-semibold">Recent Entries</h2>
          <p class="text-gray-400">{{ currentDate }}</p>
        </div>

        <!-- Use filteredUserEntries instead of allEntries -->
        <div v-if="filteredUserEntries.length" class="space-y-3">
          <div
            v-for="entry in filteredUserEntries.slice(0, 5)"
            :key="entry._id"
            class="bg-gray-800 p-4 rounded-lg flex justify-between items-center"
          >
            <div>
              <h3 class="font-semibold">
                {{ getHabitTitle(entry.habitId) }}
              </h3>
              <p class="text-gray-400 text-sm">
                {{ new Date(entry.date).toLocaleString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) }}
              </p>
            </div>
            <div class="text-green-500 text-2xl">✅</div>
          </div>
        </div>

        <div v-else class="text-center text-gray-400 py-10">
          <div class="text-4xl mb-2">📭</div>
          <p>No entries yet</p>
          <p class="text-sm mt-2">Total entries in system: {{ allEntries.length }}</p>
        </div>
      </div>

      <!-- Recent Activity -->
      <div>
        <h2 class="text-xl font-semibold mb-3">Recent Activity</h2>
        <div v-if="recentActivity.length" class="space-y-3">
          <div
            v-for="activity in recentActivity"
            :key="activity._id"
            class="bg-gray-800 p-3 rounded-lg flex items-center gap-3"
          >
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
const allEntries = ref([]) // This will store ALL entries from API
const userEntries = ref([]) // This will store filtered entries for current user
const recentActivity = ref([])
const stats = ref({
  activeHabits: 0,
  currentStreak: 0,
  completionRate: 0,
  goalsAchieved: 0
})
const loading = ref(false)

const currentDate = computed(() =>
  new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
)

// Filter entries for current user on frontend
const filteredUserEntries = computed(() => {
  if (!user.value || !allEntries.value.length) return []
  
  
  // Since your entries don't have userId, we'll use a different approach
  // Option 1: Show all entries (if that's acceptable)
  const entries = allEntries.value
  
  // Option 2: If you have another way to associate entries with users, filter here
  // For example, if entries are associated with habits that have userId:
  // const userHabitIds = habits.value.filter(h => h.userId === user.value.id).map(h => h._id)
  // const entries = allEntries.value.filter(entry => userHabitIds.includes(entry.habitId))
  
  
  return entries
})

// Fetch dashboard data
const fetchDashboard = async () => {
  if (!user.value) return
  loading.value = true

  try {
   
    const habitsRes = await habitsAPI.getAllHabits()
    habits.value = habitsRes.data || []


    // Fetch ALL entries (backend will return all since no userId filter works)
    
    const entriesRes = await entriesAPI.getAllEntries()

    
    allEntries.value = (entriesRes.data || []).sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    )
    


    // Use the filtered entries for stats and display
    const entriesToUse = filteredUserEntries.value
    
    // Compute stats using the filtered entries
    stats.value.activeHabits = habits.value.length
    stats.value.currentStreak = computeCurrentStreak(entriesToUse)
    stats.value.completionRate = computeCompletionRate(entriesToUse, habits.value)
    stats.value.goalsAchieved = computeGoalsAchieved(habits.value, entriesToUse)



    // Build recent activity from filtered entries
    recentActivity.value = entriesToUse.slice(0, 5).map(entry => ({
      ...entry,
      text: `Completed "${getHabitTitle(entry.habitId)}"`,
      type: 'habit_completed'
    }))


  } catch (err) {
    console.error('💥 Dashboard fetch error:', err)
  } finally {
    loading.value = false
  }
}

// Helper functions
const getHabitTitle = habitId => {
  const habit = habits.value.find(h => h._id === habitId)
  return habit ? habit.title : 'Unknown Habit'
}

const computeCurrentStreak = entries => {
  if (!entries.length) return 0
  const uniqueDays = [...new Set(entries.map(e => new Date(e.date).toDateString()))].sort(
    (a, b) => new Date(b) - new Date(a)
  )
  let streak = 0
  const today = new Date()
  for (let i = 0; i < uniqueDays.length; i++) {
    const day = new Date(uniqueDays[i])
    const expectedDate = new Date(today)
    expectedDate.setDate(today.getDate() - i)
    if (day.toDateString() === expectedDate.toDateString()) {
      streak++
    } else break
  }
  return streak
}

const computeCompletionRate = (entries, habits) => {
  if (!habits.length) return 0
  const totalPossible = habits.length
  const completions = entries.length
  return Math.round((completions / totalPossible) * 100)
}

const computeGoalsAchieved = (habits, entries) => {
  const completedHabitIds = [...new Set(entries.map(e => e.habitId))]
  return completedHabitIds.length
}

const getActivityIcon = type =>
  ({
    habit_created: '📝',
    habit_completed: '✅',
    streak_achieved: '🔥',
    goal_achieved: '🎯'
  }[type] || '📊')

const formatTime = ts =>
  ts
    ? new Date(ts).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    : ''

onMounted(() => {
  if (user.value) fetchDashboard()
})

watch(user, val => {
  if (val) fetchDashboard()
})
</script>