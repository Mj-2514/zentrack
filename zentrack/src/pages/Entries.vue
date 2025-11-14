<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 p-6">
    <div class="max-w-4xl mx-auto space-y-6">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 bg-gray-800 rounded-xl">
        <div>
          <h1 class="text-3xl font-bold text-white">Daily Entries</h1>
          <p class="text-gray-300 mt-2">Track your daily progress and reflections</p>
        </div>
        <button 
          @click="showEntryForm = true"
          class="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25"
        >
          + New Entry
        </button>
      </div>

      <!-- Date Selector -->
      <div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <button 
            @click="previousDay"
            class="p-3 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg transition-colors"
          >
            ←
          </button>
          
          <div class="text-center">
            <h3 class="text-xl font-semibold text-white">{{ formattedDate }}</h3>
            <p class="text-gray-400">{{ formattedDay }}</p>
          </div>
          
          <button 
            @click="nextDay"
            class="p-3 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg transition-colors"
          >
            →
          </button>
        </div>
      </div>

      <!-- Create Entry Form -->
      <div v-if="showEntryForm" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-700">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-white">New Entry for {{ formattedDate }}</h2>
            <button 
              @click="showEntryForm = false"
              class="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              ×
            </button>
          </div>

          <form @submit.prevent="createEntry" class="space-y-4">
            <!-- Habit Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-200 mb-2">Select Habit *</label>
              <select
                v-model="newEntry.habitId"
                class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
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

            <!-- Reflection -->
            <div>
              <label class="block text-sm font-medium text-gray-200 mb-2">Reflection</label>
              <textarea
                v-model="newEntry.reflection"
                rows="4"
                class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                placeholder="How did it go today? Any thoughts or observations..."
              ></textarea>
            </div>

            <!-- Mood Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-200 mb-3">Mood</label>
              <div class="grid grid-cols-5 gap-2">
                <label 
                  v-for="mood in moodOptions" 
                  :key="mood.value"
                  class="flex flex-col items-center p-3 bg-gray-700 border-2 border-gray-600 rounded-lg cursor-pointer transition-all hover:bg-gray-600"
                  :class="{
                    'border-cyan-500 bg-cyan-500/10': newEntry.mood === mood.value
                  }"
                >
                  <input 
                    type="radio" 
                    v-model="newEntry.mood" 
                    :value="mood.value"
                    class="hidden"
                  >
                  <span class="text-2xl mb-1">{{ mood.emoji }}</span>
                  <span class="text-xs text-gray-300 text-center">{{ mood.label }}</span>
                </label>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex gap-3 pt-4">
              <button 
                type="submit"
                :disabled="loading"
                class="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ loading ? 'Creating...' : 'Save Entry' }}
              </button>
              <button 
                type="button"
                @click="showEntryForm = false"
                class="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors border border-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p class="text-gray-400">Loading entries...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredEntries.length === 0" class="text-center py-16 bg-gray-800/50 rounded-2xl border border-gray-700">
        <div class="text-6xl mb-4">📝</div>
        <h3 class="text-xl font-semibold text-white mb-2">No entries for {{ formattedDate }}</h3>
        <p class="text-gray-400 mb-6">Start tracking your progress by creating your first entry!</p>
        <button 
          @click="showEntryForm = true"
          class="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25"
        >
          Create First Entry
        </button>
      </div>

      <!-- Entries List -->
      <div v-else class="space-y-4">
        <div
          v-for="entry in filteredEntries"
          :key="entry._id"
          class="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 transition-all hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10"
        >
          <!-- Entry Header -->
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
            <h3 class="text-lg font-semibold text-white">{{ getHabitName(entry.habitId) }}</h3>
            <div class="flex items-center gap-3">
              <span class="text-sm text-gray-400">{{ formatTime(entry.date) }}</span>
              <span v-if="entry.mood" class="text-xl">
                {{ getMoodEmoji(entry.mood) }}
              </span>
            </div>
          </div>
          
          <!-- Entry Content -->
          <div class="mb-4">
            <p v-if="entry.reflection" class="text-gray-300 leading-relaxed">{{ entry.reflection }}</p>
            <p v-else class="text-gray-500 italic">No reflection added</p>
          </div>

          <!-- Entry Actions -->
          <div class="flex justify-end gap-2">
            <button 
              @click="editEntry(entry)"
              class="px-4 py-2 text-sm text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 rounded-lg transition-colors"
            >
              Edit
            </button>
            <button 
              @click="deleteEntry(entry._id)"
              class="px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Daily Summary -->
      <div v-if="filteredEntries.length > 0" class="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h3 class="text-lg font-semibold text-white text-center mb-6">Daily Summary</h3>
        <div class="grid grid-cols-3 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-white mb-1">{{ filteredEntries.length }}</div>
            <div class="text-xs text-gray-400 uppercase tracking-wider">Entries</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-white mb-1">{{ moodSummary.average || 'N/A' }}</div>
            <div class="text-xs text-gray-400 uppercase tracking-wider">Avg Mood</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-white mb-1">{{ completionRate }}%</div>
            <div class="text-xs text-gray-400 uppercase tracking-wider">Completion</div>
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

// Filter entries by selected date
const filteredEntries = computed(() => {
  const selectedDateStr = selectedDate.value.toDateString()
  return entries.value.filter(entry => {
    const entryDate = new Date(entry.date).toDateString()
    return entryDate === selectedDateStr
  })
})

const moodSummary = computed(() => {
  const moodEntries = filteredEntries.value.filter(entry => entry.mood)
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
  return Math.round((filteredEntries.value.length / totalHabits) * 100)
})

// Methods
const loadEntries = async () => {
  loading.value = true
  console.log("🔄 Fetching entries...")

  try {
    const response = await entriesAPI.getAllEntries()
    console.log("✅ API Response:", response)

    if (Array.isArray(response.data)) {
      entries.value = response.data
      console.log("📋 All entries fetched:", entries.value)
      console.log("📅 Filtered entries for today:", filteredEntries.value)
    } else {
      console.warn("⚠️ Unexpected data format:", response.data)
    }

  } catch (error) {
    console.error("❌ Failed to load entries:", error)
    if (error.response) {
      console.error("🚨 Server responded with:", error.response.status, error.response.data)
    } else if (error.request) {
      console.error("📡 No response received:", error.request)
    } else {
      console.error("💥 Request setup error:", error.message)
    }

  } finally {
    loading.value = false
    console.log("✅ Fetch complete")
  }
}

const loadHabits = async () => {
  try {
    const response = await habitsAPI.getAllHabits()
    habits.value = response.data
    console.log("📊 Habits loaded:", habits.value.length)
  } catch (error) {
    console.error('Failed to load habits:', error)
  }
}

const createEntry = async () => {
  try {
    loading.value = true
    const entryData = {
      ...newEntry.value,
      date: selectedDate.value.toISOString()
    }
    
    console.log("📝 Creating entry:", entryData)
    const response = await entriesAPI.createEntry(entryData)
    
    // Add the new entry to our local state
    entries.value.push(response.data)
    
    // Reset form
    newEntry.value = { habitId: '', reflection: '', mood: '' }
    showEntryForm.value = false
    
    console.log("✅ Entry created successfully:", response.data)
    
  } catch (error) {
    console.error('❌ Failed to create entry:', error)
    alert('Failed to create entry. Please try again.')
  } finally {
    loading.value = false
  }
}

const editEntry = (entry) => {
  // Implement edit functionality
  console.log('Edit entry:', entry)
  // For now, just pre-fill the form for editing
  newEntry.value = {
    habitId: entry.habitId,
    reflection: entry.reflection,
    mood: entry.mood
  }
  showEntryForm.value = true
}

const deleteEntry = async (entryId) => {
  if (!confirm('Are you sure you want to delete this entry?')) return
  
  try {
    console.log("🗑️ Deleting entry:", entryId)
    
    // First, check if we have the delete method in our API
    if (entriesAPI.deleteEntry) {
      await entriesAPI.deleteEntry(entryId)
    } else {
      // If delete method doesn't exist, use a workaround
      console.warn("Delete method not available in API")
      // You'll need to implement the delete endpoint in your backend
      throw new Error("Delete endpoint not implemented")
    }
    
    // Remove from local state
    entries.value = entries.value.filter(entry => entry._id !== entryId)
    console.log("✅ Entry deleted successfully")
    
  } catch (error) {
    console.error('❌ Failed to delete entry:', error)
    alert('Failed to delete entry. The delete endpoint might not be implemented yet.')
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
  const newDate = new Date(selectedDate.value)
  newDate.setDate(newDate.getDate() - 1)
  selectedDate.value = newDate
  console.log("⬅️ Previous day:", formattedDate.value)
}

const nextDay = () => {
  const newDate = new Date(selectedDate.value)
  newDate.setDate(newDate.getDate() + 1)
  selectedDate.value = newDate
  console.log("➡️ Next day:", formattedDate.value)
}

// Watch for date changes to update the UI
onMounted(() => {
  loadHabits()
  loadEntries()
})
</script>