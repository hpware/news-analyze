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

const primary = ref(tabs.find((tab) => tab.default === true).url || "domestic");
const contentArray = ref([]);
const errorr = ref(false);

const updateContent = async (url: string) => {
  console.log(url.trim());
  try {
    const req = await fetch(`/api/home/lt?query=${url.trim()}`);
    const data = await req.json();
    console.log(data);
    if (data) {
      contentArray.value = [...data.uuidData, ...(data.nuuiddata?.items || [])];
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
onMounted(async () => {
  await updateContent(primary.value);
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
          @click="updateContent(item.url)"
          :class="isPrimary(item.url, true)"
          class=""
        >
          <span>{{ item.text }}</span>
        </button>
      </div>
    </div>
    <div
      v-for="item in contentArray"
      :key="item.id"
      :class="item.contentType !== 'GENERAL' && 'hidden'"
    >
      {{ item.title }}
    </div>
  </div>
</template>
