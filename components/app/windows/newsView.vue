<script setup lang="ts">
const slug = "kEJjxKw"
// FOR THIS MODULE DO NOT USE THE ?APPNAME URL TYPE, IT WILL FALL AT ALL TIMES, I HAVE NO CLUE WHY IS BEHAVIOR HAPPENING RN?
const { data, error, pending } = useFetch(`/api/news/get/lt/${slug.trim()}`); //demo URL
console.log(data.value);
console.log(error.value);
const activateAiSummary = ref(false);
const isGenerating = ref(false);
const summaryText = ref("");
const { locale } = useI18n();
const aiSummary = async () => {
  activateAiSummary.value = true;
  isGenerating.value = true;
  try {
    const req = await fetch(`/api/ai/summarize/${slug}?lang=${locale}`);
    const reader = req.body?.getReader();
    const decoder = new TextDecoder();
    while (reader) {
      const { value, done } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      summaryText.value += chunk;
    }
  } catch (e) {
    console.error(e);
  } finally {
    isGenerating.value = false;
  }
}
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
      <button v-if="!activateAiSummary" @click="aiSummary" class="bg-sky-600">Activate AI summary</button>
      <div v-else>{{summaryText}}</div>
    </div>
  </div>
</template>
