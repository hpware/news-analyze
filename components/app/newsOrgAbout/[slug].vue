<script setup lang="ts">
import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/dist/ScrambleTextPlugin";
gsap.registerPlugin(ScrambleTextPlugin);
const loading = ref(true);
const route = useRoute();
const slug = route.params.slug;
const { t, locale } = useI18n();

definePageMeta({
  layout: "newsorg",
});

const {
  data: fetchNewsOrgInfo,
  pending,
  error,
} = useFetch("/api/getData/fetchNewsOrgInfo", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: {
    lang: locale,
    requestPage: slug,
  },
});

const {
  data: fetchOtherData,
  pending: fetchOtherDataPending,
  error: fetchOtherDataError,
} = useFetch("/api/getData/fetchSidebarData", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: {
    lang: locale,
  },
});

watchEffect(() => {
  loading.value = pending.value;
});
useSeoMeta({
  title: fetchNewsOrgInfo.value?.title,
});

const orgNameAnimation = ref(null);

onMounted(() => {
  gsap.to(orgNameAnimation.value, {
    duration: 1,
    scrambleText: fetchNewsOrgInfo.value?.title,
  });
});

// Import Icons
import { GlobeAltIcon } from "@heroicons/vue/24/outline";
</script>
<template>
  <div class="flex flex-row flex-wrap w-full mt-2">
    <div class="text-center align-center justify-center w-[70%]">
      <div
        class="flex flex-row bg-[#AAACAA61] rounded-3xl p-3 gap-3 m-3 scale-5"
      >
        <NuxtImg
          :src="fetchNewsOrgInfo?.logoUrl"
          class="w-48 h-48 rounded-[10px]"
        />
        <div class="flex flex-col gap-3 text-left">
          <h1 class="text-4xl font-bold m-3 text-left" ref="orgNameAnimation">
            {{ fetchNewsOrgInfo?.title }}
          </h1>
          <span class="text-ms m-1 mt-5 text-left text-wrap">{{
            fetchNewsOrgInfo?.description
          }}</span>
        </div>
      </div>

      <div
        class="gap-[3px] flex flex-row text-center align-center justify-center"
      >
        <a
          :href="fetchNewsOrgInfo?.website"
          target="_blank"
          class="text-blue-200 hover:text-blue-300 transiton-all duration-100 flex flex-row"
          ><GlobeAltIcon class="w-6 h-6" />網站</a
        >
      </div>
    </div>
    <div
      class="flex flex-col gap-3 text-left justify-right align-right bg-[#AAACAA61] w-[28%] rounded-3xl p-3 mt-3 h-screen"
    >
      <h3 class="text-2xl mt-2s">其他媒體</h3>
      <hr />
      <div v-for="data in fetchOtherData" :key="data.id" class="flex flex-col">
        <NuxtImg :src="data.image"></NuxtImg>
        <div class="flex flex-row">
          <h1 class="text-xl text-bold">{{ data.title }}</h1>
          <span class="text-ms ml-2 align-center justify-center text-center">
            (
            <span>{{ data.lean }}</span>
            -
            <span
              >文章分數:
              <span>{{ data.score }}</span>
            </span>
            )
          </span>
        </div>
      </div>
      <NuxtLink class="justify-center align-center text-center">
        <button
          class="bg-red-500 text-black p-2 rounded-full justify-center align-center"
        >
          <span>查看更多</span>
        </button>
      </NuxtLink>
    </div>
  </div>
</template>
