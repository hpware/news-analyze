<script setup lang="ts">
import CheckKidUnfriendlyContent from "~/components/checks/checkKidUnfriendlyContent";
const emit = defineEmits(["close", "min", "restore"]);
const staticid = computed(() => props.staticid);

const pullTabsData = async () => {
  const req = await fetch("/api/tabs");
  const data = await req.json();
  return data.data;
};
const contentArray = ref([]);
const errorr = ref(false);
const switchTabs = ref(false);
const tabs = ref([]);
const primary = ref<string>("domestic");

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
    }
  } catch (e) {
    errorr.value = true;
  }

  return;
};

const isPrimary = (url: string, defaultAction: boolean) => {
  if (primary.value === url) {
    return "text-sky-600 text-bold";
  }
  return "text-black";
};

const openNews = (url: string) => {
  console.log(url);
};

onMounted(async () => {
  tabs.value = await pullTabsData();
  primary.value =
    tabs.value.find((tab) => tab.default === true)?.url || "domestic";
  await updateContent(primary.value, false);
});
const checkResults = ref(new Map());
const checks = async (title: string) => {
  const result = await CheckKidUnfriendlyContent(title);
  checkResults.value.set(title, result);
  return result;
};
const getCheckResult = (title: string) => {
  return checkResults.value.get(title);
};
watch(
  contentArray,
  async (newContent) => {
    for (const item of newContent) {
      if (item.title) {
        await checks(item.title);
      }
    }
  },
  { immediate: true },
);
const findRel = (title: string) => {
  return tf(title);
}

const tf = (text: string) => {
  const words = text.toLowerCase().split('');
  // const words = text.toLowerCase().match(/[\u4e00-\u9fff]|[a-zA-Z0-9]+/g) || [];
  
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
}
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
          :class="isPrimary(item.url, true)"
          class=""
        >
          <span>{{ item.text }}</span>
        </button>
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
          <button @click="openNews(item.url.hash)">
            <div class="p-2 bg-gray-200 rounded m-1 p-1">
              <h1
                class="text-2xl text-bold"
                :class="getCheckResult(item.title) ? 'text-red-600' : ''"
              >
                {{ item.title }}
              </h1>
              <p class="m-0 text-gray-600">
                {{ item.publisher }} --
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
              <div>
                <h3 class="text-lg">類似文章</h3>
                <div>{{ findRel(item.title) }}</div>
                <!--<div v-for="item in findRel(item.title)">
                  {{ item }}
                </div>-->
              </div>
              <!--<p :class="getCheckResult(item.title) ? 'hidden' : ''">
                {{ item.shortDescription }}
              </p>-->
            </div>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>
