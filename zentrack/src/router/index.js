// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Login from '../pages/Login.vue'
import Dashboard from '../pages/Dashboard.vue'
import Habits from '../pages/Habits.vue'
import Entries from '../pages/Entries.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'ZenTrack - Build Better Habits, Transform Your Life',
      description: 'Track your daily habits, set goals, and build lasting routines with ZenTrack. The beautiful habit tracking app that helps you transform your life one day at a time.',
      keywords: 'habit tracking, daily habits, goal setting, productivity, self-improvement'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: 'Login - ZenTrack',
      description: 'Sign in to your ZenTrack account to continue your habit-building journey and track your daily progress.',
      robots: 'noindex'
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      title: 'Dashboard - ZenTrack',
      description: 'Your personal habit tracking dashboard. View your progress, current streaks, and daily habits all in one place.',
      requiresAuth: true
    }
  },
  {
    path: '/habits',
    name: 'Habits',
    component: Habits,
    meta: {
      title: 'My Habits - ZenTrack',
      description: 'Manage and track all your daily habits. Create new habits, set goals, and monitor your progress with ZenTrack.',
      requiresAuth: true
    }
  },
  {
    path: '/entries',
    name: 'Entries',
    component: Entries,
    meta: {
      title: 'Daily Entries - ZenTrack',
      description: 'Log your daily habit entries, track your mood, and reflect on your progress. Build consistency with daily tracking.',
      requiresAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Update document title and meta tags on route change
router.beforeEach((to, from, next) => {
  // Update page title
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]')
  if (to.meta.description && metaDescription) {
    metaDescription.setAttribute('content', to.meta.description)
  }
  
  // Update robots meta tag if specified
  const metaRobots = document.querySelector('meta[name="robots"]')
  if (to.meta.robots && metaRobots) {
    metaRobots.setAttribute('content', to.meta.robots)
  } else if (metaRobots) {
    metaRobots.setAttribute('content', 'index, follow')
  }
  
  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    const { isAuthenticated } = require('../services/auth.js').useAuth()
    if (!isAuthenticated.value) {
      next('/login')
      return
    }
  }
  
  next()
})

export default router