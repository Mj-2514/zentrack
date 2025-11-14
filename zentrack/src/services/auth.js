import { ref } from 'vue'

const user = ref(null)
const isAuthenticated = ref(false)

export const useAuth = () => {
  const checkAuth = async () => {
    try {
      const response = await fetch('https://zentrack.onrender.com/auth/status', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        isAuthenticated.value = data.isAuthenticated
        user.value = data.user
      } else {
        isAuthenticated.value = false
        user.value = null
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      isAuthenticated.value = false
      user.value = null
    }
  }

  const loginWithGoogle = () => {
    // Open Google OAuth in the same window
    window.location.href = 'https://zentrack.onrender.com/auth/google'
  }

  const logout = async () => {
    try {
      const response = await fetch('https://zentrack.onrender.com/logout', {
        credentials: 'include'
      })
      
      if (response.ok) {
        user.value = null
        isAuthenticated.value = false
        // Redirect to home page after logout
        window.location.href = '/'
      }
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // Check if we're returning from OAuth callback
  const checkOAuthCallback = () => {
    const urlParams = new URLSearchParams(window.location.search)
    if (window.location.pathname === '/dashboard' && urlParams.get('oauth_success')) {
      // We've been redirected back from successful OAuth
      checkAuth()
      // Clean up URL
      window.history.replaceState({}, '', '/dashboard')
    }
  }

  return {
    user,
    isAuthenticated,
    checkAuth,
    loginWithGoogle,
    logout,
    checkOAuthCallback
  }
}