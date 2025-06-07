<script setup lang="ts">
// FOR THIS MODULE DO NOT USE THE ?APPNAME URL TYPE, IT WILL FALL AT ALL TIMES, I HAVE NO CLUE WHY IS BEHAVIOR HAPPENING RN?
import { SparklesIcon, UserIcon, NewspaperIcon } from "lucide-vue-next";
import translate from "translate";

interface translateInterfaceText {
  translateText: string;
}
const translateItem: Record<string, translateInterfaceText> = {};

const props = defineProps<{
  values?: string;
  applyForTranslation: Boolean;
  windowTranslateState: Boolean;
}>();

const { applyForTranslation, windowTranslateState } = props;

const slug = props.values; // Make the props.values static to the window NOT the entire thing and no arrays.

const { data, error, pending } = useFetch(`/api/news/get/lt/${slug.trim()}`);
console.log(data.value);
console.log(error.value);
const activateAiSummary = ref(false);
const isGenerating = ref(false);
const summaryText = ref("");
const { locale } = useI18n();
const likeart = ref([]);
// Translating logic
const translateText = ref(false);
const translatedBefore = ref(false);
watch(
  () => props.applyForTranslation,
  (value) => {
    if (value === true) {
      translateText.value = true;
      if (!data.value) {
        return;
      }
      if (translatedBefore.value === true) {
        return;
      }
      startTranslating(data.value.title);
      startTranslating(data.value.origin);
      startTranslating(data.value.author);
      for (const paragraph of data.value.paragraph) {
        startTranslating(paragraph);
      }
      // NOT retranslating AGAIN when disabling the feat
      translatedBefore.value = true;
    } else {
      translateText.value = false;
    }
  },
); // Translate when requested?

const startTranslating = async (text: string) => {
  translateItem[text] = {
    translateText: await translate(text, { from: "zh", to: "en" }),
  };
};

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
        <h2 class="text-3xl text-bold">
          {{
            translateText ? translateItem[data.title].translateText : data.title
          }}
        </h2>
        <span
          class="text-lg text-bold flex flex-row justify-center text-center align-center"
          ><NewspaperIcon class="w-7 h-7 p-1" />{{
            translateText
              ? translateItem[data.origin].translateText
              : data.origin
          }}
          • <UserIcon class="w-7 h-7 p-1" />{{
            translateText
              ? translateItem[data.author].translateText
              : data.author
          }}</span
        >
      </div>
      <div class="p-4 w-full h-fit pt-0 mt-0">
        <img v-if="data.images[0]" :src="data.images[0]" class="rounded" />
      </div>
      <div class="text-center" v-for="item in data.paragraph">
        {{ translateText ? translateItem[item]?.translateText : item }}
      </div>
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
        <div v-else>
          <div v-if="!summaryText">Loading...</div>
          <div v-else>{{ summaryText }}</div>
        </div>
      </div>
      <div class="flex flex-col bg-gray-500">
        <!--Similar articles-->
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
