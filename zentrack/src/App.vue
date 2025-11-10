<template>
  <div class="min-h-screen min-w-full bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-900 text-slate-100 font-sans">
    <!-- Navbar -->
    <Navbar />

    <!-- Page Content -->
    <main class="pt-16 px-4">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Navbar from './components/Navbar.vue'
import { useAuth } from './services/auth.js'

const { checkAuth, checkOAuthCallback } = useAuth()

onMounted(async () => {
  checkOAuthCallback()
  await checkAuth()
})
</script>
