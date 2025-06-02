<script setup lang="ts">
import { ScanEyeIcon, RefreshCcwIcon } from "lucide-vue-next";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AhoCorasick } from "@monyone/aho-corasick";

async function CheckKidUnfriendlyContent(title: string, words: any[]) {
  try {
    const ac = new AhoCorasick(words);
    const kidfriendly = ac.hasKeywordInText(title);
    return kidfriendly;
  } catch (e) {
    console.log(e);
  }
}

const emit = defineEmits([
  "openArticles",
  "openNewsSourcePage",
  "windowopener",
]);

const openNewWindow = (itemId: string) => {
  emit("windowopener", "aboutNewsOrg");
};

const contentArray = ref([]);
const errorr = ref(false);
const switchTabs = ref(false);
const tabs = ref([]);
const primary = ref<string>("top"); // Hard code value fn
const canNotLoadTabUI = ref(false);
const isDataCached = ref(false);
const pullTabsData = async () => {
  try {
    const req = await fetch("/api/tabs");
    const data = await req.json();
    if (data.error) {
      canNotLoadTabUI.value = true;
      return;
    }
    return data.data;
  } catch (e) {
    canNotLoadTabUI.value = true;
    return;
  }
};

const updateContent = async (url: string, tabAction: boolean) => {
  if (tabAction === true) {
    primary.value = url;
    switchTabs.value = true;
  }
  try {
    const req = await fetch(`/api/home/lt?query=${url.trim()}`);
    const data = await req.json();
    if (data) {
      contentArray.value = [...data.uuidData, ...(data.nuuiddata?.items || [])];
      switchTabs.value = false;
      isDataCached.value = data.cached || false;
    }
  } catch (e) {
    console.log(e);
    errorr.value = true;
  }

  return;
};

const isPrimary = (url: string, defaultAction: boolean) => {
  if (primary.value === url) {
    return true;
  }
  return false;
};

onMounted(async () => {
  tabs.value = await pullTabsData();
  primary.value =
    tabs.value.find((tab) => tab.default === true)?.url || "domestic";
  await updateContent(primary.value, false);
});
const checkResults = ref(new Map());
var words = <any[]>[];
const pullWord = async () => {
  if (words.length === 0) {
    const req = await fetch("/api/contentcheck/kidunfriendlycontent");
    const res = await req.json();
    words = res.words;
    return res.words;
  }
  return pullWord;
};
const checks = async (title: string) => {
  const wordss = await pullWord();
  const result = await CheckKidUnfriendlyContent(title, wordss);
  checkResults.value.set(title, result);
  console.log(title);
  return result;
};
const getCheckResult = (title: string) => {
  return checkResults.value.get(title);
};
watch(
  contentArray,
  async (newContent) => {
    for (const item of newContent) {
      if (item.title && !switchTabs.value && item.contentType === "GENERAL") {
        checks(item.title);
      }
    }
  },
  { immediate: true },
);

const tf = (text: string) => {
  const words = text.toLowerCase().match(/[\u4e00-\u9fff]|[a-zA-Z0-9]+/g) || [];

  const freqMap = new Map();

  for (const word of words) {
    if (word.trim()) {
      freqMap.set(word, (freqMap.get(word) || 0) + 1);
    }
  }

  const tfVector = <any>{};
  for (const [term, count] of freqMap) {
    tfVector[term] = count / words.length;
  }

  return tfVector;
};

const jaccardSimilarity = (v1: any, v2: any) => {
  const k1 = new Set(Object.keys(v1));
  const k2 = new Set(Object.keys(v2));
  const intersection = new Set([...k1].filter((x) => k2.has(x)));
  const union = new Set([...k1, ...k2]);
  return intersection.size / union.size;
};

const findRel = async (title: string) => {
  const req = await fetch("/api/sort");
};

// Check words
const checkIfEmptyArray = [];
const useArgFindRel = (title, newsOrg) => {
  const targetVector = tf(title);
  const similarities = [];

  for (const item of contentArray.value) {
    if (
      item.title !== title &&
      item.contentType === "GENERAL" &&
      item.publisher === newsOrg
    ) {
      const itemVector = tf(item.title);
      const similarity = jaccardSimilarity(targetVector, itemVector);
      if (similarity > 0.1) {
        similarities.push({
          title: item.title,
          similarity: similarity,
          item: item,
        });
      }
    }
  }
  const idx = checkIfEmptyArray.findIndex((x) => x.title === title);
  if (idx !== -1) checkIfEmptyArray.splice(idx, 1);
  checkIfEmptyArray.push({
    title: title,
    contains: similarities.length === 0,
  });
  return similarities.sort((a, b) => b.similarity - a.similarity).slice(0, 3);
};

const checkIfEmpty = (item) => {
  const found = checkIfEmptyArray.find((key) => key.title === item);
  return found ? found.contains : false;
};

const openNews = (url: string, titleName: string) => {
  emit("openArticles", url, titleName);
};

const openPublisher = (text: string) => {
  emit("openNewsSourcePage", text);
};
</script>
<template>
  <div class="justify-center align-center text-center">
    <!--Tabs-->
    <div
      class="sticky inset-x-0 top-0 bg-gray-300/90 backdrop-blur-xl border shadow-lg rounded-xl p-1 m-1 mt-0 justify-center align-center text-center z-[50] overflow-x-auto scrollbar-xl min-w-min whitespace-nowrap px-2"
    >
      <div class="gap-2 flex flex-row justify-center align-center text-center">
        <button
          v-for="item in tabs"
          @click="updateContent(item.url, true)"
          :class="
            isPrimary(item.url, true) ? 'text-sky-600 text-bold' : 'text-black'
          "
          class="disabled:cursor-not-allowed"
          :disabled="isPrimary(item.url, true) || switchTabs"
        >
          <span>{{ item.text }}</span>
        </button>
        <button v-if="canNotLoadTabUI"><RefreshCcwIcon /></button>
      </div>
    </div>
    <Transition
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
    >
      <div v-if="switchTabs" class="absolute inset-x-0 top-12 p-2 m-12 z-[50]">
        Loading...
      </div>
    </Transition>
    <Transition
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
    >
      <div v-if="!switchTabs">
        <div
          v-for="item in contentArray"
          :key="item.id"
          :class="item.contentType !== 'GENERAL' && 'hidden'"
        >
          <div class="p-2 bg-gray-200 rounded m-1 p-1">
            <h1
              class="text-2xl text-bold"
              :class="getCheckResult(item.title) ? 'text-red-600' : ''"
            >
              {{ item.title }}
            </h1>
            <p class="m-0 text-gray-600">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <button @click="openPublisher(item.publisherId)">
                      {{ item.publisher }}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent class="rounded">
                    會打開關於媒體({{ item.publisher }})的視窗
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              --
              {{
                new Date(item.publishTimeUnix).toLocaleString("zh-TW", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
              }}
            </p>
            <div
              class="justify-center align-center text-center flex flex-row p-1"
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <button
                      @click="openNews(item.url.hash, item.title)"
                      class="flex flex-row p-1 bg-sky-300/50 hover:bg-sky-400/50 shadow-lg backdrop-blur-sm rounded transition-all duration-200"
                    >
                      <ScanEyeIcon class="w-6 h-6 p-1" /><span>觀看文章</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent class="rounded">
                    會打開新的視窗
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div>
              <div>
                <h3 class="text-lg">類似文章</h3>
                <div class="space-y-2">
                  <div
                    v-for="similar in useArgFindRel(item.title, item.publisher)"
                    :key="similar.item.id"
                    class="p-2 bg-gray-100 rounded text-sm cursor-pointer hover:bg-gray-200"
                    @click="openNews(similar.item.url.hash, item.title)"
                  >
                    <div class="font-medium">{{ similar.title }}</div>
                    <div class="text-gray-500 text-xs">
                      相似度: {{ (similar.similarity * 100).toFixed(1) }}% |
                      {{ similar.item.publisher }}
                    </div>
                  </div>
                </div>
                <div
                  v-if="checkIfEmpty(item.title)"
                  class="text-gray-500 text-sm"
                >
                  找不到類似文章
                </div>
              </div>
            </div>
            <!--<p :class="getCheckResult(item.title) ? 'hidden' : ''">
                {{ item.shortDescription }}
              </p>-->
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
