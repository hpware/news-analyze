<script setup lang="ts">
// FOR THIS MODULE DO NOT USE THE ?APPNAME URL TYPE, IT WILL FALL AT ALL TIMES, I HAVE NO CLUE WHY IS BEHAVIOR HAPPENING RN?
const { data, error, pending } = await useFetch("/api/news/get/lt/kEJjxKw"); //demo URL
console.log(data.value);
console.log(error.value);
const activateAiSummary = ref(false);
</script>
<template>
  <div class="justify-center align-center text-center flex flex-col">
    <h2 class="text-3xl text-bold">{{ data.title }}</h2>
    <span class="text-lg text-bold"
      >origin: {{ data.origin }} • author: {{ data.author }}</span
    >
    <div class="test-center" v-for="item in data.paragraph">{{ item }}</div>
    <div class="flex flex-col">
      <span>AI Summary: </span>
      <button v-if="!activateAiSummary">Activate AI summary</button>
      <div v-else>{{  }}</div>
    </div>
  </div>
</template>
