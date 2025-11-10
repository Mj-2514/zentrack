<template>
  <div class="relative">
    <!-- Hero Section -->
    <section class="py-32 px-6 text-center">
      <h1 class="text-6xl md:text-7xl font-extrabold text-brand mb-6">
        Build Better Habits, Track Your Zen
      </h1>
      <p class="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto">
        Stay consistent, stay mindful — ZenTrack helps you form habits that stick and track your daily progress effortlessly.
      </p>
      <div class="flex flex-col sm:flex-row justify-center gap-4">
        <router-link
          to="/register"
          class="px-10 py-4 bg-brand text-white font-semibold rounded-full shadow-lg hover:bg-brand-dark transition transform hover:-translate-y-1"
        >
          Get Started
        </router-link>
        <router-link
          to="/login"
          class="px-10 py-4 border-2 border-brand text-brand font-semibold rounded-full shadow hover:bg-brand-light transition transform hover:-translate-y-1"
        >
          Login
        </router-link>
      </div>
    </section>

    <!-- Features / CTA sections go here -->
  </div>
</template>
