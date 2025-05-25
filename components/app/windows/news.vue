<script setup lang="ts">
//const { data: tabs, error: tabserror } = await useFetch("/api/cached/tabs");

const tabs = [
  {
    text: "國內",
    url: "domestic",
    default: true,
  },
  {
    text: "國外",
    url: "global",
    default: false,
  },
];

const primary = ref<string>(
  tabs.find((tab) => tab.default === true).url || "domestic",
);
const contentArray = ref([]);
const errorr = ref(false);
const switchTabs = ref(false);

const updateContent = async (url: string, tabAction: boolean) => {
  if (tabAction === true) {
    primary.value = url;
    switchTabs.value = true;
  }
  console.log(url.trim());
  try {
    const req = await fetch(`/api/home/lt?query=${url.trim()}`);
    const data = await req.json();
    console.log(data);
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
  if (defaultAction === true) {
    const item = tabs.find((tab) => tab.url === url);
    if (item.default === true) {
      return "text-sky-600 text-bold";
    }
  }
  if (defaultAction === false) {
  }
  return "text-black";
};

const openNews = (url: string) => {
  console.log(url);
};

onMounted(async () => {
  await updateContent(primary.value, false);
});
</script>
<template>
  <div class="justify-center align-center text-center">
    <!--Tabs-->
    <div
      class="sticky inset-x-0 top-0 bg-gray-300/90 backdrop-blur-xl border shadow-lg rounded-xl p-1 m-1 mt-0 justify-center align-center text-center"
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
    <div v-if="switchTabs">Loading...</div>
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
            <h1 class="text-2xl text-bold">{{ item.title }}</h1>
            <p>{{ item.shortDescription }}</p>
          </div>
        </button>
      </div>
    </div>
    </Transition>
  </div>
</template>
