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
    <div class="text-center align-center justify-center">
        <h1>{{ fetchNewsOrgInfo?.title }}</h1>
        <h2>{{ fetchNewsOrgInfo?.description }}</h2>
        <div class="gap-[3px] flex flex-row text-center align-center justify-center">
          <a :href="fetchNewsOrgInfo?.website" target="_blank" class="text-blue-900 hover:text-blue-800 transiton-all duration-100 flex flex-row"><GlobeAltIcon class="w-6 h-6" />網站</a>
        </div>
    </div>
    <!--<div v-if="loading">
        <div class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen flex flex-col justify-center items-center bg-[#DEDEDE73]">
            <div class="text-center">
                <svg class="animate-spin h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
            <span class="text-m .animate__animated .animate__fadeOut">{{ t("loading") }}</span>
         </div>
    </div>-->
</template>