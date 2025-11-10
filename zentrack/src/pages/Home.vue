<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-background">
        <div class="floating-orb orb-1"></div>
        <div class="floating-orb orb-2"></div>
        <div class="floating-orb orb-3"></div>
      </div>
      
      <div class="hero-content">
        <!-- Animated Logo -->
        <div class="hero-logo">
          <div class="logo-container">
            <div class="logo-main">Z</div>
            <div class="logo-glow"></div>
          </div>
        </div>

        <!-- Main Heading -->
        <h1 class="hero-title">
          Transform Your
          <span class="gradient-text">Daily Rituals</span>
        </h1>

        <!-- Subtitle -->
        <p class="hero-subtitle">
          Build <span class="highlight-cyan">life-changing habits</span> with beautiful tracking, 
          <span class="highlight-purple">insightful analytics</span>, and a 
          <span class="highlight-pink">supportive community</span>.
        </p>

        <!-- CTA Buttons -->
        <div class="hero-actions">
          <button @click="startJourney" class="cta-primary">
            <span>Start Your Journey</span>
            <svg class="cta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </button>

          <button v-if="!isAuthenticated" @click="loginWithGoogle" class="cta-secondary">
            <svg class="google-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        <!-- Stats -->
        <div class="hero-stats">
          <div v-for="stat in stats" :key="stat.label" class="stat-item">
            <div class="stat-number">{{ stat.number }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <div class="scroll-indicator">
        <div class="scroll-arrow"></div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            Why <span class="gradient-text">ZenTrack</span>?
          </h2>
          <p class="section-subtitle">
            We've reimagined habit tracking with a focus on what actually works for long-term success.
          </p>
        </div>

        <div class="features-grid">
          <div
            v-for="(feature, index) in features"
            :key="feature.title"
            class="feature-card"
            :style="`animation-delay: ${index * 200}ms`"
          >
            <div class="feature-icon">
              <span class="feature-emoji">{{ feature.emoji }}</span>
              <div class="feature-glow"></div>
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-card">
          <h2 class="cta-title">
            Ready to Build Better <span class="gradient-text">Habits</span>?
          </h2>
          <p class="cta-subtitle">
            Join thousands of users who have transformed their lives one habit at a time.
          </p>
          <button @click="getStarted" class="cta-success">
            Start Free Today
          </button>
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
  {
    emoji: '📊',
    title: 'Visual Progress',
    description: 'Beautiful charts and graphs that make tracking your habits actually enjoyable and motivating.'
  },
  {
    emoji: '🎯',
    title: 'Smart Goals',
    description: 'Set achievable milestones with our AI-powered goal recommendations based on your progress.'
  },
  {
    emoji: '🤝',
    title: 'Community Support',
    description: 'Join accountability groups and share your journey with like-minded habit builders.'
  },
  {
    emoji: '📱',
    title: 'Mobile First',
    description: 'Track your habits on the go with our beautifully designed mobile-responsive interface.'
  },
  {
    emoji: '🔒',
    title: 'Privacy Focused',
    description: 'Your data stays yours. We never sell your information and use end-to-end encryption.'
  },
  {
    emoji: '⚡',
    title: 'Lightning Fast',
    description: 'Instant updates and smooth animations that make habit tracking feel effortless.'
  }
]

const startJourney = () => {
  if (isAuthenticated.value) {
    router.push('/habits')
  } else {
    router.push('/login')
  }
}

const getStarted = () => {
  if (isAuthenticated.value) {
    router.push('/habits')
  } else {
    loginWithGoogle()
  }
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 2rem 1rem;
}

.hero-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.floating-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.5;
  animation: float 6s ease-in-out infinite;
}

.orb-1 {
  width: 300px;
  height: 300px;
  background: #06b6d4;
  top: 20%;
  left: 20%;
  animation-delay: 0s;
}

.orb-2 {
  width: 250px;
  height: 250px;
  background: #8b5cf6;
  top: 60%;
  right: 20%;
  animation-delay: 2s;
}

.orb-3 {
  width: 200px;
  height: 200px;
  background: #ec4899;
  bottom: 20%;
  left: 50%;
  animation-delay: 4s;
}

.hero-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.hero-logo {
  margin-bottom: 2rem;
}

.logo-container {
  position: relative;
  display: inline-block;
}

.logo-main {
  width: 5rem;
  height: 5rem;
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  border-radius: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 2rem;
  box-shadow: 0 10px 30px rgba(6, 182, 212, 0.3);
  animation: float 6s ease-in-out infinite;
}

.logo-glow {
  position: absolute;
  inset: -0.5rem;
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  border-radius: 2rem;
  filter: blur(20px);
  opacity: 0.3;
  animation: pulse 2s ease-in-out infinite;
}

.hero-title {
  font-size: 3.75rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 1.5rem;
  line-height: 1.1;
}

.gradient-text {
  background: linear-gradient(135deg, #06b6d4, #8b5cf6, #ec4899);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}

.hero-subtitle {
  font-size: 1.5rem;
  color: #cbd5e1;
  margin-bottom: 3rem;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.highlight-cyan { color: #06b6d4; font-weight: 600; }
.highlight-purple { color: #8b5cf6; font-weight: 600; }
.highlight-pink { color: #ec4899; font-weight: 600; }

.hero-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  align-items: center;
  margin-bottom: 4rem;
  flex-wrap: wrap;
}

.cta-primary {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  color: white;
  border: none;
  padding: 1.25rem 3rem;
  border-radius: 1rem;
  font-weight: 700;
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(6, 182, 212, 0.3);
  position: relative;
  overflow: hidden;
}

.cta-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(6, 182, 212, 0.4);
}

.cta-primary::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #0891b2, #2563eb);
  border-radius: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cta-primary:hover::before {
  opacity: 1;
}

.cta-primary span,
.cta-primary .cta-icon {
  position: relative;
  z-index: 1;
}

.cta-icon {
  width: 1.25rem;
  height: 1.25rem;
  transition: transform 0.3s ease;
}

.cta-primary:hover .cta-icon {
  transform: translateX(4px);
}

.cta-secondary {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  color: #f8fafc;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1.25rem 2rem;
  border-radius: 1rem;
  font-weight: 600;
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.cta-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(6, 182, 212, 0.5);
  transform: translateY(-1px);
}

.google-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  max-width: 500px;
  margin: 0 auto;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, #06b6d4, #8b5cf6);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  animation: bounce 2s infinite;
}

.scroll-arrow {
  width: 1.5rem;
  height: 2.5rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 1rem;
  position: relative;
}

.scroll-arrow::before {
  content: '';
  position: absolute;
  top: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 0.5rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 1px;
}

/* Features Section */
.features-section {
  padding: 5rem 1rem;
  position: relative;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: 3rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.25rem;
  color: #cbd5e1;
  max-width: 600px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  padding: 2rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  animation: fadeIn 0.6s ease-out both;
  position: relative;
  overflow: hidden;
}

.feature-card:hover {
  border-color: #06b6d4;
  transform: translateY(-0.5rem);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.feature-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(139, 92, 246, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.feature-card:hover::before {
  opacity: 1;
}

.feature-icon {
  position: relative;
  margin-bottom: 1.5rem;
}

.feature-emoji {
  font-size: 2rem;
  display: block;
}

.feature-glow {
  position: absolute;
  inset: -0.5rem;
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  border-radius: 1rem;
  filter: blur(15px);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.feature-card:hover .feature-glow {
  opacity: 0.3;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 1rem;
  position: relative;
}

.feature-description {
  color: #cbd5e1;
  line-height: 1.6;
  position: relative;
}

/* CTA Section */
.cta-section {
  padding: 5rem 1rem;
}

.cta-card {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(139, 92, 246, 0.1));
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 2rem;
  padding: 4rem 2rem;
  text-align: center;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 1rem;
}

.cta-subtitle {
  font-size: 1.25rem;
  color: #cbd5e1;
  margin-bottom: 2rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.cta-success {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  padding: 1rem 3rem;
  border-radius: 1rem;
  font-weight: 700;
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
}

.cta-success:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(16, 185, 129, 0.4);
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

@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(-50%, 0, 0);
  }
  40%, 43% {
    transform: translate3d(-50%, -8px, 0);
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

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.25rem;
  }
  
  .hero-actions {
    flex-direction: column;
  }
  
  .cta-primary,
  .cta-secondary {
    width: 100%;
    justify-content: center;
  }
  
  .hero-stats {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .cta-title {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1.125rem;
  }
  
  .feature-card {
    padding: 1.5rem;
  }
}
</style>