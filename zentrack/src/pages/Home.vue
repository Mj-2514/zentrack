<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-slate-100 font-sans">
    <!-- Hero Section -->
    <section class="relative flex flex-col items-center justify-center text-center px-4 py-20 overflow-hidden min-h-screen">
      <!-- Floating Gradient Orbs -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute w-72 h-72 bg-cyan-500/40 rounded-full blur-3xl top-1/4 left-1/5 animate-pulse"></div>
        <div class="absolute w-64 h-64 bg-violet-500/40 rounded-full blur-3xl top-1/2 right-1/5 animate-pulse delay-200"></div>
        <div class="absolute w-56 h-56 bg-pink-500/40 rounded-full blur-3xl bottom-1/5 left-1/2 animate-pulse delay-500"></div>
      </div>

      <!-- Logo -->
      <div class="relative mb-8">
        <div class="relative flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-2xl animate-bounce">
          <span class="text-3xl font-extrabold">Z</span>
        </div>
        <div class="absolute inset-0 rounded-2xl blur-3xl bg-cyan-500/30 animate-pulse"></div>
      </div>

      <!-- Heading -->
      <h1 class="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
        Transform Your <span class="bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">Daily Rituals</span>
      </h1>

      <p class="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10">
        Build <span class="text-cyan-400 font-semibold">life-changing habits</span> with
        <span class="text-violet-400 font-semibold">insightful analytics</span> and a
        <span class="text-pink-400 font-semibold">supportive community</span>.
      </p>

      <!-- CTA Buttons -->
      <div class="flex flex-wrap justify-center gap-4 mb-16">
        <button
          @click="startJourney"
          class="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-lg shadow-lg hover:shadow-cyan-500/40 transition transform hover:-translate-y-1 flex items-center gap-2"
        >
          <span>Start Your Journey</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>

        <button
          v-if="!isAuthenticated"
          @click="loginWithGoogle"
          class="px-8 py-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md text-white font-medium hover:bg-white/20 transition flex items-center gap-3"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center max-w-2xl mx-auto">
        <div v-for="stat in stats" :key="stat.label">
          <div class="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
            {{ stat.number }}
          </div>
          <div class="uppercase text-xs tracking-wider text-slate-400">{{ stat.label }}</div>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <div class="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div class="w-6 h-10 border-2 border-white/30 rounded-lg flex items-start justify-center">
          <div class="w-1 h-3 bg-white/50 mt-2 rounded-sm"></div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-24 px-6 bg-slate-950/50 backdrop-blur-md">
      <div class="max-w-6xl mx-auto text-center">
        <h2 class="text-4xl font-extrabold mb-4">
          Why <span class="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">ZenTrack</span>?
        </h2>
        <p class="text-slate-400 max-w-xl mx-auto mb-12">
          We’ve reimagined habit tracking with a focus on what actually drives long-term consistency.
        </p>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20 transition"
          >
            <div class="text-3xl mb-3">{{ feature.emoji }}</div>
            <h3 class="text-xl font-semibold mb-2">{{ feature.title }}</h3>
            <p class="text-slate-400">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '../services/auth.js'

const router = useRouter()
const { isAuthenticated, loginWithGoogle } = useAuth()

const stats = [
  { number: '10K+', label: 'Active Users' },
  { number: '500K+', label: 'Habits Tracked' },
  { number: '2M+', label: 'Entries Logged' },
  { number: '98%', label: 'Success Rate' }
]

const features = [
  { emoji: '📊', title: 'Visual Progress', description: 'Beautiful charts and graphs that make tracking habits enjoyable and motivating.' },
  { emoji: '🎯', title: 'Smart Goals', description: 'Set milestones with our AI-powered goal recommendations based on your progress.' },
  { emoji: '🤝', title: 'Community Support', description: 'Join accountability groups and share your progress with like-minded achievers.' },
  { emoji: '📱', title: 'Mobile Friendly', description: 'Track habits on the go with a responsive, modern interface.' },
  { emoji: '🔒', title: 'Privacy Focused', description: 'Your data stays private — we never sell or share your information.' },
  { emoji: '⚡', title: 'Lightning Fast', description: 'Instant updates and smooth animations for effortless habit tracking.' }
]

const startJourney = () => {
  if (isAuthenticated.value) router.push('/habits')
  else router.push('/login')
}
</script>
