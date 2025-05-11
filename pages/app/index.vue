<script setup lang="ts">
definePageMeta({
  layout: false,
});
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
gsap.registerPlugin(TextPlugin);
const { t } = useI18n();
const localePath = useLocalePath();
const router = useRouter();
const popMessage = ref(null);
const currentDate = ref(
  new Date().toLocaleDateString("zh-TW", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }),
);

onMounted(() => {
  setInterval(() => {
    currentDate.value = new Date().toLocaleDateString("zh-TW", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }, 1000);
});

import { ComputerDesktopIcon } from "@heroicons/vue/24/outline";
</script>
<template>
  <div
    class="absolute inset-x-0 flex flex-row px-2 py-1 bg-white dark:bg-gray-900 justify-between align-center text-center z-index-[999999]"
  >
    <div class="flex flex-row g-2 text-gray-400 dark:text-gray-500">
      <button @click="" class="w-8 h-8 text-gray-400 dark:text-gray-500">
        <ComputerDesktopIcon class="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </button>
      <span class="ml-1 mr-2 text-[20px]">|</span>
    </div>
    <div class="text-gray-400">{{ currentDate }}</div>
  </div>
  <div class="w-full h-[2.5em]"></div>
  <div
    class="flex flex-col justify-center align-center text-center absolute w-full h-screen inset-x-0 inset-y-0"
  >
    <div class="z-index-[9]"></div>
  </div>
  <div
    class="absolute w-[calc(100% - 5px)] inset-x-0 bottom-0 mx-[1.5px] p-3 z-index-[999999] justify-between align-center flex flex-row"
  >
    <div class="">
      Lang: <span class="text-sm">{{ $i18n.locale }}</span>
    </div>
    <div class="">
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  </div>
</template>
