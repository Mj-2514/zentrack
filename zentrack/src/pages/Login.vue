<template>
  <div class="login-page">
    <!-- Background Elements -->
    <div class="background-elements">
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>
      <div class="floating-shape shape-4"></div>
    </div>

    <div class="login-container">
      <!-- Left Side - Brand/Info -->
      <div class="login-brand">
        <div class="brand-logo">
          <div class="logo-icon">Z</div>
          <div class="logo-glow"></div>
        </div>
        <h1 class="brand-title">ZenTrack</h1>
        <p class="brand-tagline">Build better habits, one day at a time</p>
        
        <div class="feature-list">
          <div class="feature-item">
            <div class="feature-icon">📊</div>
            <span>Track your progress</span>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🎯</div>
            <span>Set smart goals</span>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🤝</div>
            <span>Join our community</span>
          </div>
        </div>
      </div>

      <!-- Right Side - Login Form -->
      <div class="login-form-section">
        <div class="form-container">
          <div class="form-header">
            <h2 class="form-title">Welcome Back</h2>
            <p class="form-subtitle">Sign in to continue your habit journey</p>
          </div>

          <!-- Google Login Button -->
          <button @click="loginWithGoogle" class="google-login-btn">
            <svg class="google-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <!-- Divider -->
          <div class="divider">
            <span class="divider-line"></span>
            <span class="divider-text">or</span>
            <span class="divider-line"></span>
          </div>

          <!-- Email Login Form -->
          <form @submit.prevent="handleEmailLogin" class="email-form">
            <div class="form-group">
              <label for="email" class="form-label">Email Address</label>
              <input
                id="email"
                v-model="email"
                type="email"
                class="form-input"
                placeholder="Enter your email"
                required
              >
            </div>

            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <input
                id="password"
                v-model="password"
                type="password"
                class="form-input"
                placeholder="Enter your password"
                required
              >
            </div>

            <div class="form-options">
              <label class="checkbox-container">
                <input type="checkbox" v-model="rememberMe">
                <span class="checkmark"></span>
                Remember me
              </label>
              <a href="#" class="forgot-password">Forgot password?</a>
            </div>

            <button type="submit" class="login-btn" :disabled="loading">
              <span v-if="!loading">Sign In</span>
              <div v-else class="loading-spinner"></div>
            </button>
          </form>

          <!-- Sign Up Link -->
          <div class="signup-section">
            <p>Don't have an account? <router-link to="/register" class="signup-link">Sign up</router-link></p>
          </div>

          <!-- Back to Home -->
          <div class="back-home">
            <router-link to="/" class="back-link">
              <svg class="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              Back to home
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner-large"></div>
        <p>Signing you in...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../services/auth.js'

const router = useRouter()
const { loginWithGoogle } = useAuth()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)

const handleEmailLogin = async () => {
  // For now, we'll just redirect to Google OAuth
  // In a real app, you'd implement email/password auth
  loading.value = true
  setTimeout(() => {
    loginWithGoogle()
  }, 1000)
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
  position: relative;
  overflow: hidden;
  padding: 2rem 1rem;
}

/* Background Elements */
.background-elements {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.3;
  animation: float 8s ease-in-out infinite;
}

.shape-1 {
  width: 200px;
  height: 200px;
  background: #06b6d4;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 150px;
  height: 150px;
  background: #8b5cf6;
  top: 70%;
  right: 15%;
  animation-delay: 2s;
}

.shape-3 {
  width: 120px;
  height: 120px;
  background: #ec4899;
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

.shape-4 {
  width: 180px;
  height: 180px;
  background: #3b82f6;
  top: 30%;
  right: 25%;
  animation-delay: 6s;
}

/* Main Container */
.login-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1000px;
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 2rem;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.6s ease-out;
}

/* Brand Section */
.login-brand {
  padding: 3rem;
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(139, 92, 246, 0.1));
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.brand-logo {
  position: relative;
  margin-bottom: 1.5rem;
}

.logo-icon {
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.5rem;
  box-shadow: 0 10px 30px rgba(6, 182, 212, 0.3);
}

.logo-glow {
  position: absolute;
  inset: -0.5rem;
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  border-radius: 1.5rem;
  filter: blur(20px);
  opacity: 0.3;
  animation: pulse 2s ease-in-out infinite;
}

.brand-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #06b6d4, #8b5cf6);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.brand-tagline {
  color: #cbd5e1;
  margin-bottom: 2rem;
  font-size: 1.125rem;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 250px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #cbd5e1;
  font-size: 0.875rem;
}

.feature-icon {
  font-size: 1.25rem;
}

/* Form Section */
.login-form-section {
  padding: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-container {
  width: 100%;
  max-width: 350px;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-title {
  font-size: 2rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 0.5rem;
}

.form-subtitle {
  color: #cbd5e1;
  font-size: 0.875rem;
}

/* Google Login Button */
.google-login-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  color: #f8fafc;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(10px);
}

.google-login-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(6, 182, 212, 0.5);
  transform: translateY(-1px);
}

.google-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Divider */
.divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
}

.divider-text {
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Email Form */
.email-form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  color: #f8fafc;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 1rem;
  color: #f8fafc;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.form-input:focus {
  outline: none;
  border-color: #06b6d4;
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
}

.form-input::placeholder {
  color: #64748b;
}

/* Form Options */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #cbd5e1;
  font-size: 0.875rem;
  cursor: pointer;
}

.checkbox-container input {
  display: none;
}

.checkmark {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.25rem;
  position: relative;
  transition: all 0.3s ease;
}

.checkbox-container input:checked + .checkmark {
  background: #06b6d4;
  border-color: #06b6d4;
}

.checkbox-container input:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
}

.forgot-password {
  color: #06b6d4;
  font-size: 0.875rem;
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #0891b2;
}

/* Login Button */
.login-btn {
  width: 100%;
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 10px 25px rgba(6, 182, 212, 0.3);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Sign Up Section */
.signup-section {
  text-align: center;
  margin-bottom: 1.5rem;
}

.signup-section p {
  color: #cbd5e1;
  font-size: 0.875rem;
}

.signup-link {
  color: #06b6d4;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.signup-link:hover {
  color: #0891b2;
}

/* Back to Home */
.back-home {
  text-align: center;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.875rem;
  text-decoration: none;
  transition: color 0.3s ease;
}

.back-link:hover {
  color: #cbd5e1;
}

.back-icon {
  width: 1rem;
  height: 1rem;
}

/* Loading States */
.loading-spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-content {
  text-align: center;
  color: #f8fafc;
}

.loading-spinner-large {
  width: 3rem;
  height: 3rem;
  border: 3px solid transparent;
  border-top: 3px solid #06b6d4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

/* Animations */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .login-container {
    grid-template-columns: 1fr;
    max-width: 400px;
  }
  
  .login-brand {
    padding: 2rem;
    display: none; /* Hide brand section on mobile for simplicity */
  }
  
  .login-form-section {
    padding: 2rem;
  }
  
  .form-title {
    font-size: 1.75rem;
  }
}

@media (max-width: 480px) {
  .login-page {
    padding: 1rem;
  }
  
  .login-form-section {
    padding: 1.5rem;
  }
  
  .form-options {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>