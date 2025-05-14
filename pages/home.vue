<script setup lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import {
  ComputerDesktopIcon,
  CircleStackIcon,
  MagnifyingGlassIcon,
  ViewfinderCircleIcon,
  DocumentDuplicateIcon,
} from "@heroicons/vue/24/outline";
import { GithubIcon } from "lucide-vue-next";
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

const cards = [
  {
    icon: ViewfinderCircleIcon,
    title: t("home.cards.title.find"),
    description: t("home.cards.description.find"),
  },
  {
    icon: ComputerDesktopIcon,
    title: t("home.cards.title.interface"),
    description: t("home.cards.description.interface"),
  },
  {
    icon: DocumentDuplicateIcon,
    title: t("home.cards.title.documentation"),
    description: t("home.cards.description.documentation"),
  },
  {
    icon: GithubIcon,
    title: t("home.cards.title.opensource"),
    description: t("home.cards.description.opensource")
  }
];

const accordionItems = [
  {
    value: "i1",
    title: t("home.qanda.titles.whydes"),
    content: t("home.qanda.whydes"),
  },
  {
    value: "i2",
    title: t("home.qanda.titles.howdes"),
    content: t("home.qanda.howdes"),
  },
  {
    value: "i3",
    title: t("home.qanda.titles.supportedLocationNews"),
    content: t("home.qanda.supportedLocationNews"),
  },
  {
    value: "i4",
    title: t("home.qanda.titles.userData"),
    content: t("home.qanda.userData"),
  },
  {
    value: "i5",
    title: t("home.qanda.titles.mobileApp"),
    content: t("home.qanda.mobileApp"),
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
        <NuxtLink :to="localePath('/docs/gettingstarted')">
          <button
            class="m-4 ml-1 mr-1 bg-[#8C9393] text-white p-3 rounded-[10px] bg-gray-700 transition-all duration-150 hover:transform hover:scale-105 hover:shadow-lg"
          >
            <span>{{ t("home.documentation") }}</span>
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
    <div class="h-[100px]"></div>
    <div
      class="justify-center align-center gap-2 p-2 w-full flex flex-row flex-wrap relative"
      id="cards"
    >
      <div
        class="px-10 bg-gray-900/70 w-[300px] h-[200px] group rounded-xl shadow-lg hover:shadow-sky-600/90 backdrop-blur-sm border border-gray-800 hover:border-gray-600/70 transition-all duration-700 justify-center align-middle flex flex-col"
        v-for="item in cards"
        :key="item.title"
      >
        <component
          :is="item.icon"
          class="w-8 h-8 text-white group-hover:text-sky-500 transition-colors duration-300"
        />
        <h3 class="text-xl font-bold">{{ item.title }}</h3>
        <p
          class="text-gray-400 group-hover:text-gray-300 transition-colors duration-300"
        >
          {{ item.description }}
        </p>
      </div>
    </div>
    <br />
    <div class="justify-center align-center text-center w-full flex">
      <div
        class="bg-gray-900/60 rounded-xl shadow-lg p-8 border border-gray-800 hover:border-sky-700 m-4 w-full md:w-1/2 align-center justify-center text-center duration-700"
      >
        <span class="text-2xl font-bold">Q/A</span>
        <Accordion
          type="single"
          class="align-center justify-center m-auto"
          collapsible
        >
          <AccordionItem
            v-for="item in accordionItems"
            :key="item.value"
            :value="item.value"
          >
            <AccordionTrigger class="transition-all duration-100">{{
              item.title
            }}</AccordionTrigger>
            <AccordionContent>
              {{ item.content }}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  </div>
</template>
