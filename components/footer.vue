<script setup lang="ts">
const localeLink = useLocalePath();
</script>
<template>
  <div
    class="flex flex-col justify-center align-center text-center absolute inset-x-0"
  >
    <span class="text-sm m-4 mb-0 text-center align-center justify-center"
      >{{ new Date().getFullYear() }} &copy; yh</span
    >
    <span class="text-xs mt-0 m-2 text-center align-center justify-center">
      Inspired by Ground.News
    </span>
  </div>
</template>
