<script setup lang="ts">
const loading = ref(true);
const route = useRoute();
const slug = route.params.slug;
const { t, locale } = useI18n(); 

definePageMeta({
  layout: "newsorg",
});

const { data: fetchNewsOrgInfo, pending, error } = useFetch("/api/getData/fetchNewsOrgInfo", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: {
    lang: locale,
    requestPage: slug,
  },
});

watchEffect(() => {
  loading.value = pending.value;
});
useSeoMeta({
  title: fetchNewsOrgInfo.value?.title,
});

// Import Icons
import { GlobeAltIcon } from "@heroicons/vue/24/outline";
</script>
<template>
  <div>
    <div class="text-center align-center justify-center">
      <div class="flex flex-row bg-[#AAACAAFF] rounded-3xl p-3 gap-3 m-3">
        <NuxtImg :src="fetchNewsOrgInfo?.logoUrl" class="w-48 h-48 rounded-[10px]"/>
        <div class="flex flex-col gap-3 text-left">
          <h1 class="text-4xl font-bold m-3 text-left">{{ fetchNewsOrgInfo?.title }}</h1>
          <span class="text-ms m-1 mt-5 text-left text-wrap">{{ fetchNewsOrgInfo?.description }}</span>
        </div>
      </div>

        <div class="gap-[3px] flex flex-row text-center align-center justify-center">
          <a :href="fetchNewsOrgInfo?.website" target="_blank" class="text-blue-200 hover:text-blue-300 transiton-all duration-100 flex flex-row"><GlobeAltIcon class="w-6 h-6" />網站</a>
        </div> 
    </div>
    </div>
</template>