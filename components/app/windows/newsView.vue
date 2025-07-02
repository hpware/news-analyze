<script setup lang="ts">
// FOR THIS MODULE DO NOT USE THE ?APPNAME URL TYPE, IT WILL FALL AT ALL TIMES, I HAVE NO CLUE WHY IS BEHAVIOR HAPPENING RN?
import {
  SparklesIcon,
  UserIcon,
  NewspaperIcon,
  StarIcon,
} from "lucide-vue-next";
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
const staredStatus = ref(false);
// Translating logic
const translateText = ref(false);
const translatedBefore = ref(false);
const traslateFailed = ref(false);
const displayTranslatedText = ref(false);
const loadingTranslations = ref(false);
watch(
  () => props.applyForTranslation,
  (value) => {
    if (value === true) {
      translateText.value = true;
      if (!data.value) {
        return;
      }
      if (translatedBefore.value === true) {
        displayTranslatedText.value = true;
        return;
      }
      loadingTranslations.value = true;
      startTranslating(data.value.title);
      startTranslating(data.value.origin);
      startTranslating(data.value.author);
      for (const paragraph of data.value.paragraph) {
        startTranslating(paragraph);
      }
      // NOT retranslating AGAIN when disabling the feat
      translatedBefore.value = true;
      setTimeout(() => {
        displayTranslatedText.value = true;
        loadingTranslations.value = false;
      }, 3000);
    } else {
      translateText.value = false;
      displayTranslatedText.value = false;
    }
  },
); // Translate when requested?

const startTranslating = async (text: string) => {
  try {
    console.log(text);
    translateItem[text] = {
      translateText: await translate(text, { from: "zh", to: "en" }),
    };
    console.log(translateItem[text]);
  } catch (error) {
    console.error("Translation failed:", error);
    traslateFailed.value = true;
    translateItem[text] = { translateText: text }; // fallback to original text
  }
};

const aiSummary = async () => {
  activateAiSummary.value = true;
  isGenerating.value = true;
  try {
    const req = await fetch(
      `/api/ai/summarize/${slug}?locale=${String(locale.value)}`,
    );
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

const starArticle = async () => {
  const buildUrl = `/user/${slug}/fav`;
  const req = await fetch(buildUrl);
  const res = await req.json();
  if (res.status === "success") {
    staredStatus.value = res.starred;
  }
};

onMounted(async () => {
  const req = await fetch(`/user/${slug}/star`);
  const res = await req.json();
  staredStatus.value = res;
});
</script>
<template>
  <div
    class="flex flex-col bg-gray-200/50 text-black w-full h-full absolute inset-0 justify-center align-middle text-center z-[20] backdrop-blur-sm"
    v-if="traslateFailed"
  >
    <div class="m-2 flex flex-col">
      <span
        >Translate Failed. <br />
        Oops, your translation failed.</span
      >
      <button></button>
    </div>
  </div>
  <div
    v-if="loadingTranslations"
    class="flex flex-col bg-gray-200/50 text-black w-full h-full fixed inset-0 justify-center align-middle text-center z-[20] backdrop-blur-sm"
  >
    <!--Spinner from  https://flowbite.com/docs/components/spinner/-->
    <div role="status">
      <svg
        aria-hidden="true"
        class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
    </div>
    <div>Translating...</div>
  </div>
  <div
    class="justify-center align-center text-center flex flex-col md:flex-row flex-wrap"
  >
    <div class="flex flex-col">
      <div class="group">
        <h2 class="text-3xl text-bold">
          {{
            displayTranslatedText
              ? translateItem[data.title].translateText
              : data.title
          }}
        </h2>
        <span
          class="text-lg text-bold flex flex-row justify-center text-center align-center"
          ><NewspaperIcon class="w-7 h-7 p-1" />{{
            displayTranslatedText
              ? translateItem[data.origin].translateText
              : data.origin
          }}
          • <UserIcon class="w-7 h-7 p-1" />{{
            displayTranslatedText
              ? translateItem[data.author].translateText
              : data.author
          }}</span
        >
      </div>
      <div class="p-4 w-full h-fit pt-0 mt-0">
        <img v-if="data.images[0]" :src="data.images[0]" class="rounded" />
      </div>
      <div class="text-center" v-for="item in data.paragraph">
        {{ displayTranslatedText ? translateItem[item]?.translateText : item }}
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
      <!--<div class="flex flex-col bg-gray-500">
        <!--Similar articles-->
      <!--<div class="flex flex-row" v-for="item in likeart">
          <img /><!--Image-->
      <!--<div class="flex flex-col">
            <h2>title</h2>
            <span>description</span>
          </div>
        </div>
      </div>-->
      <button
        @click="starArticle"
        :class="[
          'duration-300 transition-all',
          { 'fill-blue-500 text-blue-500': staredStatus },
        ]"
      >
        <StarIcon />
      </button>
    </div>
  </div>
</template>
