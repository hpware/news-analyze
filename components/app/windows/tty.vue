<script setup lang="ts">
const commandInputBox = ref();
</script>
<template>
  <div class="text-white">
    <div class="flex flex-row">
      <span class="mx-1">></span
      ><input
        v-model="commandInputBox"
        type="text"
        class="border-none bg-black outline-0 w-full text-wrap"
        @keyup.enter="console.log(commandInputBox)"
      />
    </div>
  </div>
</template>
