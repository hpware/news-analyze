<script setup lang="ts">
import { SparklesIcon, UserIcon, NewspaperIcon } from "lucide-vue-next";
const slug = "kEJjxKw";
// FOR THIS MODULE DO NOT USE THE ?APPNAME URL TYPE, IT WILL FALL AT ALL TIMES, I HAVE NO CLUE WHY IS BEHAVIOR HAPPENING RN?
const { data, error, pending } = useFetch(`/api/news/get/lt/${slug.trim()}`);
console.log(data.value);
console.log(error.value);
const activateAiSummary = ref(false);
const isGenerating = ref(false);
const summaryText = ref("");
const { locale } = useI18n();
const likeart = ref([]);
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
};
</script>
<template>
  <div
    class="justify-center align-center text-center flex flex-col md:flex-row flex-wrap"
  >
    <div class="flex flex-col">
      <div class="group">
        <h2 class="text-3xl text-bold">{{ data.title }}</h2>
        <span
          class="text-lg text-bold flex flex-row justify-center text-center align-center"
          ><NewspaperIcon class="w-7 h-7 p-1" />{{ data.origin }} •
          <UserIcon class="w-7 h-7 p-1" />{{ data.author }}</span
        >
      </div>
      <div class="p-4 w-full h-fit pt-0 mt-0">
        <img v-if="data.images[0]" :src="data.images[0]" class="rounded" />
      </div>
      <div class="text-center" v-for="item in data.paragraph">{{ item }}</div>
    </div>
    <div class="flex flex-col w-full justify-center align-center text-center">
      <div
        class="group bg-gray-100/70 shadow-lg backdrop-blur-sm p-2 m-2 rounded-xl w-1/2 justify-center align-center text-center"
      >
        <span>AI Summary: </span>
        <button
          v-if="!activateAiSummary"
          @click="aiSummary"
          class="bg-gray-200 align-middle justify-center text-center p-2 flex flex-row group-hover:bg-gray-300/90 rounded hover:bg-gray-500 transition-all duration-200"
        >
          <SparklesIcon
            class="w-4 h-4 align-middle justify-center text-center"
          />Activate
        </button>
        <div v-else>{{ summaryText }}</div>
      </div>
      <div class="flex flex-col bg-gray-500">
        <div class="flex flex-row" v-for="item in likeart">
          <img /><!--Image-->
          <div class="flex flex-col">
            <h2>title</h2>
            <span>description</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
