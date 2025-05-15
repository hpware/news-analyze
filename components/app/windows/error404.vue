<script setup lang="ts">
// Great, there are now no errors ig
const emit = defineEmits(["windowopener", "error", "loadValue"]);
const props = defineProps<{
  values?: string;
}>();
</script>
<template>
  <div class="justify-center align-center text-center flex flex-col">
    <span class="text-7xl m-4 m-1 mb-0 text-center align-center justify-center"
      >404</span
    >
    <span class="text-2xl text-center align-center justify-center"
      >User interface Not Found</span
    >
  </div>
</template>
