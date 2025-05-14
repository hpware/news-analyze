<script setup lang="ts">
import { HeartIcon } from 'lucide-vue-next';
const localeLink = useLocalePath();
</script>
<template>
  <div
    class="flex flex-col justify-center align-center text-center absolute inset-x-0"
  >
    <span class="text-sm text-center align-center justify-center flex flex-row group mb-0"><span>Made with  </span><HeartIcon class="w-5 h-5 mx-2 text-red-500 transition-all duration-300 group-hover:scale-125" /><span>  & <a href="https://github.com/hpware/news-analyze" class="hover:text-sky-500 transition-all duration-100">Open Source</a></span></span>
        <span class="text-sm m-4 mt-0 mb-0 text-center align-center justify-center"
      >2025 - {{ new Date().getFullYear() }} &copy; hpware</span
    >
    <span class="text-xs mt-0 m-2 text-center align-center justify-center">
      Optimized for Google Chrome
    </span>
  </div>
</template>
