<template>
  <form @submit.prevent="submitEntry" class="bg-white shadow-md rounded-lg p-6 mt-6">
    <h3 class="text-lg font-semibold mb-4 text-gray-800">Add Daily Entry</h3>
    <textarea
      v-model="reflection"
      placeholder="Reflect on your progress..."
      class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none mb-4"
    ></textarea>

    <select
      v-model="mood"
      class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none mb-4"
    >
      <option value="">Select your mood</option>
      <option>Happy</option>
      <option>Motivated</option>
      <option>Neutral</option>
      <option>Sad</option>
    </select>

    <button
      type="submit"
      class="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
    >
      Save Entry
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { entriesAPI } from '../services/api.js'

const props = defineProps({
  habitId: { type: String, required: true }
})

const reflection = ref('')
const mood = ref('')

const submitEntry = async () => {
  if (!note.value || !progress.value) {
    alert('Please fill all fields')
    return
  }

  try {
    await entriesAPI.createEntry({
      habitId: habitId, // ← must match backend field
      note: note.value,
      progress: progress.value
    })

    note.value = ''
    progress.value = ''
    // Optionally emit event to refresh Entries list
  } catch (err) {
    console.error(err)
    alert('Error creating entry')
  }
}
</script>
