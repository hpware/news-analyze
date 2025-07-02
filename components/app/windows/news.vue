<script setup lang="ts">
// forgot to import t 💀
const { t } = useI18n();

// Vars for translating stuff
interface translateInterfaceText {
  translateText: string;
}
const translateItem: Record<string, translateInterfaceText> = {};

const translateLoading = ref(false);
const displayTranslateContent = ref(false);
const traslateFailed = ref(false);
const translatedBefore = ref(false);

// Imports
import { ScanEyeIcon, RefreshCcwIcon } from "lucide-vue-next";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AhoCorasick } from "@monyone/aho-corasick";
import translate from "translate";

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

const props = defineProps<{
  applyForTranslation: Boolean;
  windowTranslateState: Boolean;
}>();

const openNewWindow = (itemId: string) => {
  emit("windowopener", "aboutNewsOrg");
};

const contentArray = ref([]);
const errorr = ref(false);
const switchTabs = ref(false);
const tabs = ref([]);
const primary = ref<string>("domestic"); // Hard code default value as top is just pure garbage.
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
  contentArray.value = [];
  if (tabAction === true) {
    primary.value = url;
    switchTabs.value = true;
  }
  try {
    const req = await fetch(`/api/home/lt?query=${url.trim()}`);
    const data = await req.json();
    if (data) {
      // Made by coderabbit: https://github.com/hpware/news-analyze/pull/6#discussion_r2144713017
      const coolArray = [
        ...(data.uuidData ?? []),
        ...(data.nuuiddata?.items ?? []),
      ];
      contentArray.value =
        coolArray.sort(
          (title1, title2) => title2.publishTimeUnix - title1.publishTimeUnix,
        ) || [];
      switchTabs.value = false;
      isDataCached.value = data.cached || false;
      displayTranslateContent.value = false;
      translatedBefore.value = false;
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

/*
const findRel =
async (title: string) => {
  const req = await fetch("/api/sort");
};*/

// Check words
const checkIfEmptyArray = [];
const useArgFindRel = (title, newsOrg) => {
  const targetVector = tf(title);
  const similarities = [];

  for (const item of contentArray.value) {
    if (
      item.title !== title &&
      item.contentType === "GENERAL" &&
      item.publisher !== newsOrg
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

const openPublisher = (slug: string, title: string) => {
  emit("openNewsSourcePage", slug, title);
};
const isLoading = computed(() => contentArray.value.length === 0);
const shouldHideItem = (item) => {
  return (
    item.contentType !== "GENERAL" ||
    item.publisher?.toLowerCase().includes("line")
  );
};

// Translate (Selective content)
const startTranslating = async (text: string) => {
  try {
    translateItem[text] = {
      translateText: await translate(text, { from: "zh", to: "en" }),
    };
    console.log(translateItem[text]);
  } catch (error) {
    console.error("Translation failed:", error);
    traslateFailed.value = true;
    translateItem[text] = { translateText: text }; // fallback
  }
};
watch(
  () => props.applyForTranslation,
  (value) => {
    if (value === true || translatedBefore.value === false) {
      if (translatedBefore.value === true) {
        displayTranslateContent.value = true;
        return;
      }
      translateFunction();
      // NOT retranslating AGAIN when disabling the feat
      translatedBefore.value = true;
    } else {
      displayTranslateContent.value = false;
    }
  },
);
const translateFunction = () => {
  if (canNotLoadTabUI.value) {
    return;
  }
  translateLoading.value = true;
  // Translate tabs
  for (const tab of tabs.value) {
    startTranslating(tab.text);
  }
  // Translate news titles & news org
  for (const articleBlock of contentArray.value) {
    startTranslating(articleBlock.title);
    startTranslating(articleBlock.publisher);
  }
  setTimeout(() => {
    displayTranslateContent.value = true;
    translateLoading.value = false;
  }, 3000);
};
</script>
<template>
  <div v-if="translateLoading">
    <div
      class="flex flex-col bg-gray-200/50 text-black w-full h-full absolute inset-0 justify-center align-middle text-center z-[20] backdrop-blur-sm"
    >
      <!--Spinner from  https://flowbite.com/docs/components/spinner/-->
      <div role="status" class="justify-center self-center text-center">
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
  </div>
  <div class="justify-center align-center text-center">
    <!--Tabs-->
    <div
      class="sticky inset-x-0 top-0 bg-gray-300/90 backdrop-blur-xl border shadow-lg rounded-xl p-1 m-1 mt-0 justify-center align-center text-center z-[50] overflow-x-auto scrollbar-xl min-w-min whitespace-nowrap px-2"
    >
      <div class="gap-2 flex flex-row justify-center align-center text-center">
        <!-- Tabs Loading State -->
        <template v-if="canNotLoadTabUI">
          <div
            v-for="n in 5"
            :key="n"
            class="h-8 w-20 bg-gray-400/50 animate-pulse rounded mx-1"
          ></div>
        </template>

        <!-- Actual Tabs -->
        <template v-else>
          <button
            v-for="item in tabs"
            @click="updateContent(item.url, true)"
            :class="
              isPrimary(item.url, true)
                ? 'text-sky-600 text-bold'
                : 'text-black'
            "
            class="disabled:cursor-not-allowed"
            :disabled="isPrimary(item.url, true) || switchTabs"
          >
            <span>{{
              displayTranslateContent
                ? translateItem[item.text].translateText
                : item.text
            }}</span>
          </button>
        </template>
        <button v-if="canNotLoadTabUI"><RefreshCcwIcon /></button>
      </div>
    </div>
    <!-- Content Area -->
    <div>
      <!-- Loading State -->
      <template v-if="isLoading">
        <div v-for="n in 7" :key="n" class="p-2 bg-gray-200 rounded m-1">
          <!-- Title Skeleton -->
          <div
            class="h-8 bg-gray-300 animate-pulse rounded-lg w-3/4 mx-auto mb-2"
          ></div>

          <!-- Publisher and Date Skeleton -->
          <div class="flex items-center justify-center gap-2 mb-2">
            <div class="h-4 w-24 bg-gray-300 animate-pulse rounded"></div>
            <div class="h-4 w-4 animate-pulse">--</div>
            <div class="h-4 w-32 bg-gray-300 animate-pulse rounded"></div>
          </div>

          <!-- Action Button Skeleton -->
          <div class="flex justify-center mb-2">
            <div class="h-8 w-24 bg-gray-300 animate-pulse rounded"></div>
          </div>

          <!-- Similar Articles Skeleton -->
          <div class="mt-4">
            <div
              class="h-6 w-20 bg-gray-300 animate-pulse rounded mb-2 mx-auto"
            ></div>
            <div class="space-y-2">
              <div
                v-for="i in 2"
                :key="i"
                class="p-2 bg-gray-300 animate-pulse rounded"
              >
                <div
                  class="h-4 w-3/4 bg-gray-400/50 animate-pulse rounded mb-1"
                ></div>
                <div
                  class="h-3 w-1/2 bg-gray-400/50 animate-pulse rounded"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Actual Content -->
      <template v-else>
        <div
          v-for="item in contentArray"
          :key="item.id"
          :class="shouldHideItem(item) && 'hidden'"
        >
          <div class="p-2 bg-gray-200 rounded m-1">
            <h1
              class="text-2xl text-bold"
              :class="getCheckResult(item.title) ? 'text-red-600' : ''"
            >
              {{
                displayTranslateContent
                  ? translateItem[item.title].translateText
                  : item.title
              }}
            </h1>
            <p class="m-0 text-gray-600">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <button
                      @click="openPublisher(item.publisherId, item.publisher)"
                    >
                      {{
                        displayTranslateContent
                          ? translateItem[item.publisher].translateText
                          : item.publisher
                      }}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent class="rounded">
                    {{ t("news.articleopenpart1") }}({{
                      displayTranslateContent
                        ? translateItem[item.publisher].translateText
                        : item.publisher
                    }}){{ t("news.articleopenpart2") }}
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
                      <ScanEyeIcon class="w-6 h-6 p-1" /><span>{{
                        t("news.open")
                      }}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent class="rounded">
                    {{ t("news.opennewwindow") }}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div>
              <div>
                <h3 class="text-lg">{{ t("news.similararticles") }}</h3>
                <div class="space-y-2">
                  <div
                    v-for="similar in useArgFindRel(item.title, item.publisher)"
                    :key="similar.item.id"
                    class="p-2 bg-gray-100 rounded text-sm cursor-pointer hover:bg-gray-200"
                    @click="openNews(similar.item.url.hash, item.title)"
                  >
                    <div class="font-medium">{{ similar.title }}</div>
                    <div class="text-gray-500 text-xs">
                      {{ t("news.similarity") }}:
                      {{ (similar.similarity * 100).toFixed(1) }}% |
                      {{
                        displayTranslateContent
                          ? translateItem[similar.item.publisher].translateText
                          : similar.item.publisher
                      }}
                    </div>
                  </div>
                </div>
                <div
                  v-if="checkIfEmpty(item.title)"
                  class="text-gray-500 text-sm"
                >
                  {{ t("news.nosimilararticles") }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
