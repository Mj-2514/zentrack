import { createRouter, createWebHistory } from 'vue-router'

// Pages
import Home from '../pages/Home.vue'
import Dashboard from '../pages/Dashboard.vue'
import Habits from '../pages/Habits.vue'
import Entries from '../pages/Entries.vue'
import HabitDetail from '../pages/HabitDetail.vue'

// Components (Forms)
import HabitCard from '../components/HabitCard.vue'
import EntryForm from '../components/EntryForm.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'ZenTrack - Build Better Habits, Transform Your Life',
      description: 'Track your daily habits, set goals, and build lasting routines with ZenTrack — the ultimate habit tracker for productivity and personal growth.',
      keywords: 'habit tracker, daily habits app, build discipline, productivity tools, habit journal, self improvement, routine tracker',
      image: '/zentrack-cover.png',
      canonical: 'https://yourdomain.com/'
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      title: 'Dashboard - ZenTrack',
      description: 'Your personal productivity dashboard — insights, stats, and progress.',
      canonical: 'https://yourdomain.com/dashboard'
    }
  },
  {
    path: '/habits',
    name: 'Habits',
    component: Habits,
    meta: {
      title: 'My Habits - ZenTrack',
      description: 'View and manage all your daily habits.',
      canonical: 'https://yourdomain.com/habits'
    }
  },
  {
    path: '/add-habit',
    name: 'AddHabit',
    component: HabitCard,
    meta: {
      title: 'Add Habit - ZenTrack',
      description: 'Add a new habit and start your journey toward self-mastery.',
      canonical: 'https://yourdomain.com/add-habit'
    }
  },
  {
    path: '/entries',
    name: 'Entries',
    component: Entries,
    meta: {
      title: 'Habit Entries - ZenTrack',
      description: 'Track your mood and progress with daily entries.',
      canonical: 'https://yourdomain.com/entries'
    }
  },
  {
    path: '/habit/:slug',
    name: 'HabitDetail',
    component: HabitDetail,
    meta: {
      title: 'Habit Details - ZenTrack',
      description: 'Dive deep into your habit’s progress.',
      canonical: 'https://yourdomain.com/habit'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Utility to update or create meta tags
function setMeta(name, content, attr = 'name') {
  let tag = document.querySelector(`meta[${attr}="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function setCanonical(url) {
  let link = document.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', url)
}

router.beforeEach((to, from, next) => {
  const meta = to.meta || {}

  // Title
  document.title = meta.title || 'ZenTrack'

  // Main meta
  if (meta.description) setMeta('description', meta.description)
  if (meta.keywords) setMeta('keywords', meta.keywords)

  // Canonical
  if (meta.canonical) setCanonical(meta.canonical)

  // Open Graph
  setMeta('og:title', meta.title || 'ZenTrack', 'property')
  setMeta('og:description', meta.description || '', 'property')
  setMeta('og:type', 'website', 'property')
  setMeta('og:url', meta.canonical || window.location.href, 'property')
  setMeta('og:image', meta.image || '/default-og.png', 'property')

  // Twitter Card
  setMeta('twitter:card', 'summary_large_image')
  setMeta('twitter:title', meta.title || 'ZenTrack')
  setMeta('twitter:description', meta.description || '')
  setMeta('twitter:image', meta.image || '/default-og.png')

  next()
})

export default router
