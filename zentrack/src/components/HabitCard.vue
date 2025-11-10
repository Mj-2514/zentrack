<template>
  <div
    @click="$router.push(`/habits/${habit.slug}`)"
    class="cursor-pointer p-6 bg-white shadow-md rounded-xl border hover:shadow-lg transition duration-300"
  >
    <h2 class="text-2xl font-semibold text-gray-800 mb-2">{{ habit.title }}</h2>
    <p class="text-gray-500 mb-1"><span class="font-medium">Category:</span> {{ habit.category }}</p>
    <p class="text-gray-500"><span class="font-medium">Goal:</span> {{ habit.goal }}</p>
  </div>
</template>

<script setup>
defineProps({
  habit: {
    type: Object,
    required: true
  }
})
</script>
