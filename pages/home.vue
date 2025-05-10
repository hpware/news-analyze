<script setup lang="ts">
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
gsap.registerPlugin(TextPlugin);
const { t } = useI18n();
const localePath = useLocalePath();
const router = useRouter();

const popMessage = ref(null);
const isAnimating = ref(false);
const messages = [
  t("home.moving.newsPlatform"),
  t("home.moving.miniWikipedia"),
  t("home.moving.newsComparePlatform"),
  "BlindSpec",
];

onMounted(() => {
  const tl = gsap.timeline({ repeat: -1 });
  messages.forEach((message) => {
    tl.to(popMessage.value, {
      duration: 0.5,
      text: message,
      ease: "none.",
    }).to(popMessage.value, {
      duration: 2,
      text: message,
      ease: "none.",
    });

    for (let i = message.length; i >= 0; i--) {
      tl.to(popMessage.value, {
        duration: 0.06,
        text: message.substring(0, i),
        ease: "none",
      });
    }
  });
});
</script>
<template>
  <div>
    <div
      class="content flex flex-col justify-center align-center text-center absolute w-full h-screen inset-x-0 inset-y-0"
    >
      <span class="text-3xl">
        <span
          class="bg-gradient-to-b from-[#eee] to-[#333] bg-clip-text text-transparent"
          >{{ t("home.nonMoving") }}</span
        >
        <span
          ref="popMessage"
          class="bg-gradient-to-r from-[#2a7b9b] then-[#8d57c7] to-[#ed4242] bg-clip-text text-transparent"
        ></span
      ></span>
      <div class="flex flex-row justify-center align-center gap-0s">
        <NuxtLink :to="localePath('/app/')">
        <button
          class="m-4 mr-1 ml-1 bg-[#8C9393] text-white p-3 rounded-full bg-gradient-to-l from-sky-500 to-purple-600 transition-all duration-150 hover:transform hover:scale-105 hover:shadow-lg"
        >
          <span>{{ t("home.startusing") }}</span>
        </button>
      </NuxtLink>
      <NuxtLink to="#learnmore">
        <button
          class="m-4 ml-1 mr-1 bg-[#8C9393] text-white p-3 rounded-full bg-gray-700 transition-all duration-150 hover:transform hover:scale-105 hover:shadow-lg"
        >
          <span>{{ t("home.learnmore") }}</span>
        </button>
      </NuxtLink>
      </div>
    </div>
    <div class="h-screen"></div>
    <div class="">
      <h1>Why?</h1>
      <span>台灣的新聞是要痲是來自中國控制的媒體，或是來自只想獲得點閱的記者。</span>
    </div>
  </div>
</template>
