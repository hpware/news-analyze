<script setup lang="ts">
// No layout
definePageMeta({
  layout: false,
});

// interfaces
interface currentNavBarInterface {
  name: string;
  icon: string;
  action: any;
  flash: boolean;
  windowAssociated: string;
  minimized: boolean;
}

interface associAppWindowInterface {
  name: string;
  id: string;
  absoluteId: string;
  title: string;
  component: any;
  width: string;
  height: string;
  black: boolean;
}

interface minAppWindowInterface {
  name: string;
  id: string;
  absoluteId: string;
  title: string;
  component: any;
  width: string;
  height: string;
  black: boolean;
  lastpositionw: string;
  lastpositionh: string;
}

// Import plugins
import { v4 as uuidv4 } from "uuid";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
gsap.registerPlugin(TextPlugin);

// Import Windows
import UserWindow from "~/components/app/windows/user.vue";
import HotNewsWindow from "~/components/app/windows/hotnews.vue";
import SourcesWindow from "~/components/app/windows/sources.vue";
import AboutWindow from "~/components/app/windows/about.vue";
import ChatbotWindow from "~/components/app/windows/chatbot.vue";
import AboutNewsOrgWindow from "~/components/app/windows/aboutNewsOrg.vue";
import TTYWindow from "~/components/app/windows/tty.vue";
import FavStaredWindow from "~/components/app/windows/fav.vue";
import NewsWindow from "~/components/app/windows/news.vue";
import NewsViewWindow from "~/components/app/windows/newsView.vue";
import SettingsWindow from "~/components/app/windows/settings.vue";

// Import Icons
import {
  ComputerDesktopIcon,
  ChevronRightIcon,
} from "@heroicons/vue/24/outline";

// i18n
const { t, locale, locales } = useI18n();
const switchLocalePath = useSwitchLocalePath();
const localePath = useLocalePath();

// Router
const router = useRouter();
const route = useRoute();

// values
const popMessage = ref(null);
const menuOpen = ref(false);
const langMenuOpen = ref(false);
const lang = ref(locale.value);
const alertOpen = ref(false);
const currentNavBar = ref<currentNavBarInterface[]>([]);
const bootingAnimation = ref(true);
const activeWindows = ref<associAppWindowInterface[]>([]);
const hiddenWindows = ref<minAppWindowInterface[]>([]);
const openApp = ref();
const openAppId = ref();
const openAppNameQuery = ref();
const currentOpenAppId = ref(0);
const progress = ref(0);
const titleAppName = ref("Desktop");
const openingAppViaAnApp = ref(false);
const passedValues = ref();
const globalWindowVal = ref(new Map());
const changeLangAnimation = ref(false);
const openArticlesArray = ref<any[]>([]);
const openArticlesId = ref(0);
const storeStaticArticleId = ref(0);

// Key Data
const menuItems = [
  { name: t("app.hotnews"), windowName: "hotnews" },
  { name: t("app.news"), windowName: "news" },
  { name: t("app.sources"), windowName: "sources" },
  { name: t("app.starred"), windowName: "starred" },
  { name: t("app.chatbot"), windowName: "chatbot" },
  { name: t("app.about"), windowName: "about" },
  { name: t("app.terminal"), windowName: "tty" },
  { name: t("app.settings"), windowName: "settings" },
  { name: t("app.login"), windowName: "user" },
  { name: t("app.leave"), windowName: "leave" },
];

const associAppWindow = [
  {
    name: "hotnews",
    id: "1",
    title: t("app.hotnews"),
    component: HotNewsWindow,
    width: "700px",
    height: "500px",
  },
  {
    name: "user",
    id: "2",
    title: t("app.login"),
    component: UserWindow,
  },
  {
    name: "sources",
    id: "3",
    title: t("app.sources"),
    component: SourcesWindow,
    width: "700px",
    height: "500px",
  },
  {
    name: "about",
    id: "4",
    title: t("app.about"),
    component: AboutWindow,
  },
  {
    name: "settings",
    id: "5",
    title: t("app.settings"),
    component: SettingsWindow,
  },
  {
    name: "news",
    id: "6",
    title: t("app.news"),
    component: NewsWindow,
    width: "800px",
    height: "600px",
  },
  {
    name: "starred",
    id: "7",
    title: t("app.starred"),
    component: FavStaredWindow,
  },
  {
    name: "chatbot",
    id: "8",
    title: t("app.chatbot"),
    component: ChatbotWindow,
    width: "400px",
    height: "600px",
  },
  {
    name: "aboutNewsOrg",
    id: "9",
    title: t("app.aboutNewsOrg"),
    component: AboutNewsOrgWindow,
  },
  {
    name: "tty",
    id: "10",
    title: t("app.terminal"),
    component: TTYWindow,
    black: true,
  },
  {
    name: "newsView",
    id: "11",
    title: t("app.newsview"),
    component: NewsViewWindow,
  },
];

// Date
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

// functions
onMounted(() => {
  associAppWindow.forEach((window) => {
    globalWindowVal.value.set(window.name, {
      id: window.id,
      title: window.title,
      windowCount: 1,
    });
  });
});

const openWindow = (windowName?: string) => {
  if (windowName === "leave") {
    if (confirm(t("app.areyousure"))) {
      router.push(localePath("/home"));
    } else {
      return;
    }
  } else {
    if (windowName) findAndOpenWindow(windowName);
  }
  menuOpen.value = false;
};

const unMinWindow = (windowName?: string) => {
  hiddenWindows.value = hiddenWindows.value.filter(
    (window) => window.name !== windowName,
  );
  console.log(windowName);
};

// menus
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

// ?openapp= component
onMounted(async () => {
  openApp.value = route.query.openapp;
  openAppId.value = route.query.id;
  if (openApp.value) {
    // DO NOT REMOVE THIS FUNCTION!! IT WILL ABSOLUTELY 100% FAIL!
    if (openApp.value === "newsView") {
      return;
    }
    openWindow(openApp.value);
  }
});

const navBarDisplayText = (text: string) => {
  if (!text) {
    return;
  }
  const trimSpaces = text.trim();
  const regex = /.{0,7}/;
  console.log("asdasda");
  if (trimSpaces.length <= 7) {
    return text;
  }
  const maxStay = text.match(regex);
  const filterToMax7Chars = maxStay[0] + "...";
  return filterToMax7Chars;
};

const findAndOpenWindow = (windowName: string, windowTitle?: string) => {
  const app = associAppWindow.find((app) => app.name === windowName);

  // Prevent dual logins
  if (
    windowName === "login" &&
    activeWindows.value.some((window) => window.name === "login")
  ) {
    return;
  }

  // Prevent dual about
  if (
    windowName === "about" &&
    activeWindows.value.some((window) => window.name === "about")
  ) {
    return;
  }

  if (app) {
    // Use shallowRef for better performance with components
    const windowComponent = shallowRef(app.component);
    titleAppName.value = app.title;
    const abosluteId = uuidv4();
    activeWindows.value.push({
      id: currentOpenAppId.value,
      absoluteId: abosluteId,
      component: windowComponent,
      name: windowName,
      title: windowTitle || app.title,
      width: app.width || "600px",
      height: app.height || "400px",
      black: app.black || false,
    });
    currentOpenAppId.value++;
    // Add to navbar
    const windowNameVal2 =
      globalWindowVal.value.get(windowName).windowCount === 1
        ? navBarDisplayText(app.title)
        : navBarDisplayText(app.title) +
          "(" +
          globalWindowVal.value.get(windowName).windowCount +
          ")";
    currentNavBar.value.push({
      name: navBarDisplayText(windowTitle) || windowNameVal2,
      icon: "anything",
      action: "idk",
      flash: true,
      windowAssociated: abosluteId,
      minimized: false,
    });
    globalWindowVal.value.get(windowName).windowCount++;
  }
};

const obtainTopWindowPosition = (windowId: string) => {
  if (!openingAppViaAnApp.value) {
    const windowIndex = activeWindows.value.findIndex(
      (window) => window.id === windowId,
    );
    if (windowIndex !== -1) {
      const [window] = activeWindows.value.splice(windowIndex, 1);
      titleAppName.value = window.title;
      activeWindows.value.push(window);
    }
  }
};

const closeWindow = (windowId: string, windowAID: string) => {
  activeWindows.value = activeWindows.value.filter(
    (window) => window.id !== windowId,
  );
  currentNavBar.value = currentNavBar.value.filter(
    (window) => window.windowAssociated !== windowAID,
  );
  console.log("activeWindows.value", activeWindows.value);
};

const openNewWindowViaApp = (windowId: string) => {
  openingAppViaAnApp.value = true;
  findAndOpenWindow(windowId);
  setTimeout(() => {
    openingAppViaAnApp.value = false;
  }, 1000);
};

const toggleMinWindow = (windowUUId: string) => {
  const windowInfo = currentNavBar.value.find(
    (item) => item.windowAssociated === windowUUId,
  );
  const activeWindow = activeWindows.value.find(
    (window) => window.absoluteId === windowUUId,
  );
  // Add logic to store hidden windows.
  if (windowInfo && activeWindow) {
    hiddenWindows.value.push({
      id: activeWindow.id,
      absoluteId: activeWindow.absoluteId,
      component: activeWindow.component,
      name: activeWindow.name,
      title: activeWindow.title,
      width: activeWindow.width,
      height: activeWindow.height,
      black: activeWindow.black || false,
      lastpositionw: "",
      lastpositionh: "",
    });
    //activeWindows.value = activeWindows.value.filter(window => window.absoluteId !== windowUUId);
  }
  console.log(hiddenWindows.value);
};

// Title
useSeoMeta({
  title: "Desktop",
});

watchEffect(() => {
  useSeoMeta({
    title: titleAppName.value + " - Desktop",
  });
});
// Booting animation
onMounted(() => {
  const changeLang = route.query.changelang;
  if (changeLang) {
    bootingAnimation.value = false;
    changeLangAnimation.value = true;
  }
  setTimeout(() => {
    changeLangAnimation.value = false;
  }, 4000);
});

onMounted(() => {
  // booting animation bypass
  const bootingHeaderParams = route.query.bypass;
  if (bootingHeaderParams) {
    bootingAnimation.value = false;
  }
  if (bootingAnimation.value) {
    gsap.to(popMessage.value, {
      duration: 0.5,
      text: t("app.booting"),
      ease: "none",
    });
  }
  setTimeout(() => {
    bootingAnimation.value = false;
  }, 2000);
});

// Loading Effect.
watchEffect((cleanupFn) => {
  const tier = setTimeout(() => (progress.value = 10), Math.random() * 50);
  const timer = setTimeout(() => (progress.value = 30), Math.random() * 100);
  const timmer = setTimeout(() => (progress.value = 70), Math.random() * 150);
  const timmmer = setTimeout(() => (progress.value = 100), 1800);
  cleanupFn(() => clearTimeout(tier));
  cleanupFn(() => clearTimeout(timer));
  cleanupFn(() => clearTimeout(timmer));
  cleanupFn(() => clearTimeout(timmmer));
});

const openArticles = async (slug: string, titleName?: string) => {
  openingAppViaAnApp.value = true;
  passedValues.value = slug;
  var titleNameFinal = "";
  if (titleName) {
    titleNameFinal = titleName + "  " + t("app.newsview");
  } else {
    titleNameFinal = t("app.newsview");
  }
  console.log(titleName);
  findAndOpenWindow("newsView", titleName);
  console.log("t2: " + titleName);
  setTimeout(() => {
    openingAppViaAnApp.value = false;
    passedValues.value = null;
    console.log("wiping values");
  }, 1000);
};

const openNewsSourcePage = async (slug: string) => {
  openingAppViaAnApp.value = true;
  passedValues.value = slug;
  const titleNameFinal = slug ? "關於" + slug : t("app.aboutNewsOrg");
  findAndOpenWindow("aboutNewsOrg", titleNameFinal);

  setTimeout(() => {
    openingAppViaAnApp.value = false;
    passedValues.value = null;
  }, 1000);
};
</script>
<template>
  <div v-if="changeLangAnimation">
    <div
      class="flex flex-col justify-center align-center text-center absolute w-full h-screen inset-0 overscroll-none bg-gray-600/50 z-[999999]"
    >
      <span>{{ t("app.changelangmessage") }}</span>
    </div>
  </div>
  <div v-if="bootingAnimation">
    <div
      class="flex flex-col justify-center align-center text-center absolute w-full h-screen inset-0 overscroll-none"
    >
      <Progress
        v-model="progress"
        class="w-3/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />
      <br />
      <span class="text-xl text-bold mt-3">{{ t("app.launchtext") }}</span>
    </div>
  </div>
  <div
    class="absolute inset-x-0 flex flex-row px-2 py-1 bg-[#7D7C7C]/70 text-white justify-between align-center text-center z-50 overscroll-none"
    v-else
  >
    <!--Menu container-->
    <div
      class="flex flex-row g-2 rounded-xl gray-500/80 backdrop-blur-sm z-9999 selection:opacity-0"
    >
      <button
        @click="toggleMenu"
        class="w-8 h-8 text-white hover:text-blue-500 transition-all duration-100 flex flex-row"
      >
        <ComputerDesktopIcon />
      </button>
      <!--DO NOT MODIFY THE CLASSES OF THIS |, THIS COULD WORK OR BRAKE I HAVE NO CLUE WHY DOES IT DO THAT, BUT DON'T DO IT.-->
      <span class="ml-1 mr-2 text-[20px]">|</span>
      <!--navbar icons for min and max application window-->
      <div
        class="overflow-hidden overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white flex-nowrap whitespace-nowrap min-w-0"
      >
        <div class="flex flex-row flex-shrink-0 min-w-0">
          <div
            v-for="item in currentNavBar"
            :key="item.name"
            class="flex flex-row items-center gap-x-2 hover:bg-gray-100 transition-all duration-150 px-4 py-1 cursor-pointer group rounded-xl"
          >
            <button
              @click="toggleMinWindow(item.windowAssociated)"
              class="flex flex-row items-center gap-x-2 text-gray-400 hover:text-gray-600 transition-all duration-100"
            >
              <span>{{ item.name }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-row gap-5">
      <NuxtLink :to="localePath('/desktop?changelang=1', t('nextlang'))">
        <button
          class="p-1 hover:text-blue-200 transition-all duration-100 hover:bg-gray-500 rounded selection:opacity-0"
        >
          {{ t("localeflag") }}
        </button>
      </NuxtLink>
      <div
        class="text-center align-middle justify-center text-white selection:opacity-0 hover:cursor-default"
      >
        {{ currentDate }}
      </div>
    </div>
  </div>
  <div class="w-full h-[2.5em]"></div>
  <!--Menu-->
  <Transition
    enter-active-class="animate__animated animate__fadeInDown animate_fast03"
    leave-active-class="animate__animated animate__fadeOutUp animate_fast03"
  >
    <div
      class="m-2 p-2 bg-gray-800 shadow-lg w-fit rounded-[10px] v-9998 selection:opacity-0"
      v-if="menuOpen"
    >
      <div v-for="item in menuItems" :key="item.name" class="">
        <button
          @click="openWindow(item.windowName)"
          class="flex flex-row items-center gap-x-2 text-gray-400 hover:text-gray-600 transition-all duration-100"
        >
          <span>{{ item.name }}</span>
          <ChevronRightIcon class="w-4 h-4 justify-center align-center" />
        </button>
      </div>
    </div>
  </Transition>
  <!--Main desktop contents-->
  <div
    class="flex flex-col justify-center align-center text-center absolute w-full h-screen inset-x-0 inset-y-0 z-[-10]"
    id="desktop"
  ></div>
  <Transition>
    <div>
      <DraggableWindow
        v-for="window in activeWindows"
        :key="window.id"
        :title="window.title"
        @close="closeWindow(window.id, window.absoluteId)"
        @min="unMinWindow(window.id)"
        :width="window.width"
        :height="window.height"
        @click="obtainTopWindowPosition(window.id)"
        :black="window.black"
      >
        <Suspense>
          <Component
            :is="window.component"
            @error="console.error('Error:', $event)"
            @windowopener="openNewWindowViaApp($event)"
            @loadValue=""
            @openArticles="openArticles"
            @openNewsSourcePage="openNewsSourcePage"
            :values="passedValues"
          />
        </Suspense>
      </DraggableWindow>
    </div>
  </Transition>
</template>
