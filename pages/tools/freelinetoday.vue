<script setup lang="ts">
const errore = ref(false);
const route = useRoute();
const article = route.query.article;
const buildUrl = "/api/news/get/lt/" + article;
if (!article) {
  errore.value = true;
}
const { data, error, pending } = await useFetch(buildUrl);
</script>
<template>
  <div class="justify-center align-center text-center flex flex-col">
    <h2 class="text-3xl text-bold">{{ data.title }}</h2>
    <span class="text-lg text-bold"
      >origin: {{ data.origin }} • author: {{ data.author }}</span
    >
    <div class="test-center" v-for="item in data.paragraph">{{ item }}</div>
  </div>
</template>
