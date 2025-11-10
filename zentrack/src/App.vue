<template>
  <div id="app">
    <Navbar />
    <Home />
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Home from './pages/Home.vue'
import { useAuth } from './services/auth.js'

const router = useRouter()
const { checkAuth, checkOAuthCallback } = useAuth()

onMounted(async () => {
  // Check for OAuth callback first
  checkOAuthCallback()
  // Then check general auth status
  await checkAuth()
})
</script>

<style scoped>
#app {
  min-height: 100vh;
  min-width: 100vw;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
}

.main-content {
  padding-top: 4rem; /* For fixed navbar */
}
</style>

<style>
/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
  color: #f8fafc;
  line-height: 1.6;
  min-height: 100vh;
  overflow-x: hidden;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #06b6d4, #8b5cf6);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #0891b2, #7c3aed);
}

/* Selection */
::selection {
  background: rgba(6, 182, 212, 0.3);
  color: #f8fafc;
}

/* Focus states */
button:focus,
input:focus,
textarea:focus,
select:focus {
  outline: 2px solid #06b6d4;
  outline-offset: 2px;
}
</style>