<script setup lang="ts">
import { GlobeAltIcon } from "@heroicons/vue/24/outline";
import { Facebook } from "lucide-vue-next";
import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/dist/ScrambleTextPlugin";
gsap.registerPlugin(ScrambleTextPlugin);
const loading = ref(true);
const { t, locale } = useI18n();
import translate from "translate";

interface translateInterfaceText {
  translateText: string;
}
const translateItem: Record<string, translateInterfaceText> = {};

const emit = defineEmits([
  "windowopener",
  "error",
  "loadValue",
  "openArticles",
]);

const props = defineProps({
  values: {
    type: String,
    required: true,
  },
  applyForTranslation: Boolean,
});

const staticProps = props;

const {
  data: fetchNewsOrgInfo,
  pending,
  error,
} = useFetch(`/api/publishers/lt/${staticProps.values}`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: {
    lang: locale,
    requestPage: props.values,
  },
});

const orgNameAnimation = ref(null);

watch(
  () => fetchNewsOrgInfo.value,
  (newValue) => {
    if (newValue?.title) {
      nextTick(() => {
        gsap.to(orgNameAnimation.value, {
          duration: 1,
          scrambleText: newValue.title,
          ease: "none",
        });
      });
    }
  },
  { immediate: true },
);

const openNews = (url: string, titleName: string) => {
  emit("openArticles", url, titleName);
};

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

// Translating logic
const translateText = ref(false);
const translatedBefore = ref(false);
const traslateFailed = ref(false);
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
      startTranslating(fetchNewsOrgInfo.value?.title);
      startTranslating(fetchNewsOrgInfo.value?.origin);
      startTranslating(fetchNewsOrgInfo.value?.author);
      for (const articles of fetchNewsOrgInfo.value?.articles) {
        startTranslating(articles.title.replaceAll("獨家專欄》", ""));
        startTranslating(articles.date);
      }
      // NOT retranslating AGAIN when disabling the feat
      translatedBefore.value = true;
    } else {
      translateText.value = false;
    }
  },
); // Translate when requested?
</script>
<template>
  <div>
    <div class="text-center align-center justify-center">
      <div
        class="flex flex-row bg-gray-300/70 rounded-3xl p-3 gap-3 m-3 scale-5"
      >
        <div class="flex flex-col gap-3 text-left w-full">
          <h1
            v-if="pending"
            class="h-12 bg-gray-200 animate-pulse rounded m-2 w-3/4 mx-auto"
          ></h1>
          <h1
            v-else
            class="text-4xl font-bold m-2 text-center"
            ref="orgNameAnimation"
          >
            {{
              translateText
                ? translateItem[fetchNewsOrgInfo?.title]
                : fetchNewsOrgInfo?.title
            }}
          </h1>

          <div v-if="pending" class="flex flex-col gap-2 m-1 mt-5">
            <div class="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
            <div class="h-4 bg-gray-200 animate-pulse rounded w-5/6"></div>
            <div class="h-4 bg-gray-200 animate-pulse rounded w-4/6"></div>
          </div>
          <span v-else class="text-ms m-1 mt-5 text-left text-wrap">
            {{
              translateText
                ? translateItem[fetchNewsOrgInfo?.description]
                : fetchNewsOrgInfo?.description
            }}
          </span>
        </div>
      </div>

      <div class="space-y-3">
        <template v-if="pending">
          <div
            v-for="item in 5"
            :key="item"
            class="p-3 bg-gray-300/70 rounded m-1 animate-pulse h-8"
          ></div>
        </template>
        <template v-else>
          <hr />
          <h3 class="text-2xl text-bold">文章</h3>
          <button
            v-for="item in fetchNewsOrgInfo?.articles"
            @click="() => openNews(item.link, item.title)"
            class="p-1 bg-gray-300/70 rounded min-h-4 w-full"
          >
            <div>
              <div class="flex flex-col">
                <span class="title text-bold texxt-sm">{{
                  translateText
                    ? translateItem[item.title.replaceAll("獨家專欄》", "")]
                    : item.title.replaceAll("獨家專欄》", "")
                }}</span>
                <span class="date text-xs">{{
                  translateText ? translateItem[item.date] : item.date
                }}</span>
              </div>
            </div>
          </button>
        </template>
      </div>
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
