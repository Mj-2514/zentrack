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
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'ZenTrack - Build Better Habits, Transform Your Life',
      description:
        'Track your daily habits, set goals, and build lasting routines with ZenTrack — the ultimate habit tracker for productivity and personal growth.',
      keywords:
        'habit tracker, daily habits app, build discipline, productivity tools, habit journal, self improvement, routine tracker',
    },
  },
  {
    path: '/habits',
    name: 'Habits',
    component: Habits,
    meta: {
      title: 'My Habits - ZenTrack',
      description:
        'View and manage all your daily habits. Create, edit, or delete habits effortlessly with ZenTrack.',
    },
  },
  {
    path: '/add-habit',
    name: 'AddHabit',
    component: HabitCard,
    meta: {
      title: 'Add Habit - ZenTrack',
      description:
        'Add a new habit and start your journey toward consistency and self-mastery.',
    },
  },
  {
    path: '/entries',
    name: 'Entries',
    component: Entries,
    meta: {
      title: 'Habit Entries - ZenTrack',
      description:
        'View all your logged habit entries, track your mood, and visualize progress over time.',
    },
  },
  { path: '/habits/:slug', component: HabitDetail },
  {
    path: '/add-entry',
    name: 'AddEntry',
    component: EntryForm,
    meta: {
      title: 'Add Daily Entry - ZenTrack',
      description:
        'Record your daily progress, mood, and reflections — one day at a time.',
    },
  },
  {
    path: '/habit/:slug',
    name: 'HabitDetail',
    component: HabitDetail,
    meta: {
      title: 'Habit Details - ZenTrack',
      description:
        'Dive deep into your habit’s progress and see how far you’ve come with ZenTrack.',
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// SEO handling + authentication guard
router.beforeEach((to, from, next) => {
  // Title
  if (to.meta.title) document.title = to.meta.title

  // Meta description
  const metaDescription = document.querySelector('meta[name="description"]')
  if (to.meta.description && metaDescription)
    metaDescription.setAttribute('content', to.meta.description)

  // Default keywords
  const metaKeywords = document.querySelector('meta[name="keywords"]')
  if (to.meta.keywords && metaKeywords)
    metaKeywords.setAttribute('content', to.meta.keywords)

  next()
})

export default router
