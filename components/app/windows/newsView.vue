<script setup lang="ts">
const { data, error, pending } = useFetch("/api/get/lt/kEJjxKw"); //demo URL
</script>
<template>
  <div class="justify-center align-center text-center flex flex-col">
    <h2 class="text-3xl text-bold">{{ data.title }}</h2>
    <span class="text-lg text-bold"
      >origin: {{ data.origin }} • author: {{ data.author }}</span
    >
  </div>
</template>
