<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { habitsAPI } from '../services/api.js'
import EntryForm from '../components/EntryForm.vue'
import Entries from './Entries.vue'

const habit = ref(null)
const route = useRoute()

onMounted(async () => {
  const res = await habitsAPI.getHabitBySlug(route.params.slug)
  habit.value = res.data
})

// for editing
const isEditing = ref(false)
const editedHabit = ref({})

const startEdit = () => {
  editedHabit.value = { ...habit.value }
  isEditing.value = true
}

const saveEdit = async () => {
  await habitsAPI.updateHabit(habit.value._id, editedHabit.value)
  habit.value = { ...editedHabit.value }
  isEditing.value = false
}
</script>

<template>
  <div class="p-8 max-w-4xl mx-auto">
    <div class="bg-white shadow-md rounded-xl p-8 border mb-6">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ habit?.title }}</h1>
      <p class="text-gray-600 mb-1"><span class="font-medium">Category:</span> {{ habit?.category }}</p>
      <p class="text-gray-600"><span class="font-medium">Goal:</span> {{ habit?.goal }}</p>

      <button @click="startEdit" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        Edit Habit
      </button>
    </div>

    <EntryForm v-if="habit && habit._id" :habitId="habit._id" />
    

    <!-- Edit modal -->
    <div v-if="isEditing" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 class="text-xl font-semibold mb-4">Edit Habit</h2>

        <input v-model="editedHabit.title" class="w-full mb-3 border p-2 rounded" />
        <input v-model="editedHabit.category" class="w-full mb-3 border p-2 rounded" />
        <input v-model="editedHabit.goal" class="w-full mb-3 border p-2 rounded" />

        <div class="flex justify-end gap-3 mt-4">
          <button @click="isEditing = false" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
          <button @click="saveEdit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>
