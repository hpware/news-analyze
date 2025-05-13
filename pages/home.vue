<script setup lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
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

const defaultValue = "item-1";

const accordionItems = [
  {
    value: "item-1",
    title: "Is it accessible?",
    content: "Yes. It adheres to the WAI-ARIA design pattern.",
  },
  {
    value: "item-2",
    title: "Is it unstyled?",
    content:
      "Yes. It's unstyled by default, giving you freedom over the look and feel.",
  },
  {
    value: "item-3",
    title: "Can it be animated?",
    content: "Yes! You can use the transition prop to configure the animation.",
  },
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
        <NuxtLink :to="localePath('/app/desktop/?')">
          <button
            class="m-4 mr-1 ml-1 bg-[#8C9393] text-white p-3 rounded-[10px] bg-gradient-to-l from-sky-500 to-purple-600 transition-all duration-150 hover:transform hover:scale-105 hover:shadow-lg"
          >
            <span>{{ t("home.startusing") }}</span>
          </button>
        </NuxtLink>
        <NuxtLink to="#learnmore">
          <button
            class="m-4 ml-1 mr-1 bg-[#8C9393] text-white p-3 rounded-[10px] bg-gray-700 transition-all duration-150 hover:transform hover:scale-105 hover:shadow-lg"
          >
            <span>{{ t("home.learnmore") }}</span>
          </button>
        </NuxtLink>
      </div>
    </div>
    <div class="h-screen"></div>
    <div id="learnmore"></div>
    <div class="flex flex-row flex-wrap justify-center gap-x-10 gap-y-3">
      <div
        class="flex flex-col justify-center items-center align-middle bg-[#C9C9C9]/60 rounded-xl shadow-lg p-5 m-5 w-[300px] h-[200px]"
      >
        <h1 class="text-8xl mt-0">🤔</h1>
        <h2 class="text-xl font-bold">Why?</h2>
        <span class="text-sm">{{ t("home.whydes") }}</span>
      </div>
      <div
        class="flex flex-col justify-center items-center align-middle bg-[#C9C9C9]/60 rounded-xl shadow-lg p-5 m-5 w-[300px] h-[200px]"
      >
        <h1 class="text-8xl mt-0">🧐</h1>
        <h2 class="text-xl font-bold">How?</h2>
        <span class="text-sm">{{ t("home.howdes") }}</span>
      </div>
    </div>
    <br />
    <div class="justify-center align-center text-center w-full flex">
      <div
        class="bg-[#C9C9C9]/60 rounded-xl shadow-lg p-4 m-4 w-1/2 align-center justify-center text-center"
      >
        <span class="text-2xl font-bold">Q/A</span>
        <Accordion
          type="single"
          class="align-center justify-center m-auto"
          collapsible
          :default-value="defaultValue"
        >
          <AccordionItem
            v-for="item in accordionItems"
            :key="item.value"
            :value="item.value"
          >
            <AccordionTrigger>{{ item.title }}</AccordionTrigger>
            <AccordionContent>
              {{ item.content }}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  </div>
</template>
