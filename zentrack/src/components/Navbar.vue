<template>
  <nav class="navbar">
    <div class="navbar-content">
      <!-- Logo -->
      <router-link to="/" class="navbar-brand">
        <div class="navbar-logo">Z</div>
        <span class="navbar-title">ZenTrack</span>
      </router-link>

      <!-- Navigation -->
      <div class="navbar-nav">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link v-if="isAuthenticated" to="/habits" class="nav-link">Habits</router-link>
        <router-link v-if="isAuthenticated" to="/entries" class="nav-link">Entries</router-link>
        <router-link v-if="isAuthenticated" to="/dashboard" class="nav-link">Dashboard</router-link>
      </div>

      <!-- Auth Section -->
      <div class="navbar-auth">
        <template v-if="isAuthenticated && user">
          <div class="user-section">
            <div class="user-info">
              <img
                v-if="user.avatar"
                :src="user.avatar"
                :alt="user.name"
                class="user-avatar"
              />
              <span class="user-name">{{ user.name }}</span>
            </div>
            <button @click="logout" class="logout-btn">Logout</button>
          </div>
        </template>

        <template v-else>
          <button @click="loginWithGoogle" class="google-login-btn">
            <svg class="google-icon" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Login with Google
          </button>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuth } from '../services/auth.js'
const { user, isAuthenticated, loginWithGoogle, logout } = useAuth()
</script>

<style scoped>
/* Navbar container */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Inner layout */
.navbar-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  max-width: 1200px;
  width: 100%;
  padding: 0 1.25rem;
}

/* Branding */
.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}

.navbar-logo {
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.125rem;
}

.navbar-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #f8fafc;
}

/* Navigation links */
.navbar-nav {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.nav-link {
  padding: 0.5rem 1rem;
  color: #cbd5e1;
  text-decoration: none;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
  font-weight: 500;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #f8fafc;
  background: rgba(255, 255, 255, 0.1);
}

/* Auth section */
.navbar-auth {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* User info */
.user-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.5rem 0.75rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.user-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 2px solid rgba(6, 182, 212, 0.5);
}

.user-name {
  color: #f8fafc;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Buttons */
.logout-btn {
  background: rgba(239, 68, 68, 0.1);
  color: #fca5a5;
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.5);
}

.google-login-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: #f8fafc;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.google-login-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(6, 182, 212, 0.5);
}

.google-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Mobile view */
@media (max-width: 768px) {
  .navbar-content {
    padding: 0 0.75rem;
  }

  .navbar-nav {
    gap: 0.25rem;
  }

  .nav-link {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }

  .user-name {
    display: none;
  }
}
</style>
