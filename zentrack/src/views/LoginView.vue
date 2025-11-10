<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-6">
    <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-10">
      <h2 class="text-4xl font-bold mb-6 text-center text-brand">Welcome Back</h2>

      <!-- Login Form -->
      <form class="space-y-4">
        <input
          type="email"
          placeholder="Email"
          class="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand"
        />
        <input
          type="password"
          placeholder="Password"
          class="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand"
        />
        <button
          type="submit"
          class="w-full bg-brand text-white py-4 rounded-xl text-lg font-semibold hover:bg-brand-dark transition-transform transform hover:-translate-y-1"
        >
          Login
        </button>
      </form>

      <div class="text-center my-6 text-gray-500">OR</div>

      <!-- Google OAuth -->
      <a
        href="http://localhost:5000/auth/google"
        class="flex items-center justify-center border-2 border-gray-300 rounded-xl py-3 hover:bg-gray-100 transition"
      >
        <img src="/google-icon.svg" alt="Google" class="w-6 h-6 mr-3" />
        Continue with Google
      </a>
    </div>
  </div>
</template>
