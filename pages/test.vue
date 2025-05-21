<script setup lang="ts">
import CheckKidUnfriendlyContent from "~/components/checks/checkKidUnfriendlyContent";
const title = ref("");
const system = ref("");
const checkTitle = async () => {
  if (!title.value) return;
  system.value = await CheckKidUnfriendlyContent(title.value);
};
</script>
<template>
  <div
    class="flex flex-col absolute h-screen w-full inset-0 justify-center align-center text-center"
  >
    <h1 class="text-4xl m-2">標體？</h1>
    <div class="flex flex-row justify-center align-center gap-2">
      <input type="text" class="text-black rounded-xl p-2 w-[300px]" />
      <button @click="checkTitle" class="rounded-xl bg-sky-600 p-2">
        Find
      </button>
    </div>
    <div>{{ system }}</div>
  </div>
  <div class="h-screen"></div>
</template>
