<template>
  <div class="w-full min-h-screen flex items-center justify-center text-center">
    <div
      class="border border-white w-[40%] p-16 justify-center align-center text-center rounded-md backdrop-blur-sm bg-gray-900"
    >
      <h1 class="text-2xl">Login / Register</h1>
      <h4 class="text-sm">via OAuth Providers</h4>
      <div class="m-4 flex flex-col gap-2">
        <a href="/api/auth/google">
          <button
            class="gap-3 px-10 justify-between align-center text-center bg-gray-500 hover:bg-gray-700 p-2 rounded-md transition-all duration-150"
          >
            <i class="bi bi-google"></i>&nbsp;&nbsp;<span>Google</span>
          </button>
        </a>
        <a href="/api/auth/github">
          <button
            class="gap-3 px-10 bg-gray-500 hover:bg-gray-700 p-2 rounded-md transition-all duration-150"
          >
            <i class="bi bi-github"></i>&nbsp;&nbsp;<span>Github</span>
          </button>
        </a>
        <a href="/api/auth/discord">
          <button
            class="gap-3 px-10 bg-gray-500 hover:bg-gray-700 p-2 rounded-md transition-all duration-150"
          >
            <i class="bi bi-discord"></i>&nbsp;&nbsp;<span>Discord</span>
          </button>
        </a>
      </div>
    </div>
  </div>
</template>
<style scoped>
@keyframes animateLoginLoad {
  0% {
    transform: translateY(-5%);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
