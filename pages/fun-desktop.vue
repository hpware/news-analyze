<script setup lang="ts">
// Make the Desktop funner // TODO
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

// Import plugins
import { v4 as uuidv4 } from "uuid";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
gsap.registerPlugin(TextPlugin);

// Import Windows
import LoginWindow from "~/components/app/windows/login.vue";
import HotNewsWindow from "~/components/app/windows/hotnews.vue";
import SourcesWindow from "~/components/app/windows/sources.vue";
import AboutWindow from "~/components/app/windows/about.vue";
import ChatbotWindow from "~/components/app/windows/chatbot.vue";
import AboutNewsOrgWindow from "~/components/app/windows/aboutNewsOrg.vue";
import TTYWindow from "~/components/app/windows/tty.vue";
import FavStaredWindow from "~/components/app/windows/fav.vue";
import Error404Window from "~/components/app/windows/error404.vue";
import NewsViewWindow from "~/components/app/windows/newsView.vue";

// Import Icons
import {
  ComputerDesktopIcon,
  UserIcon,
  LanguageIcon,
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
  { name: t("app.login"), windowName: "login" },
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
    name: "login",
    id: "2",
    title: t("app.login"),
    component: LoginWindow,
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
    component: Error404Window,
  },
  {
    name: "news",
    id: "6",
    title: t("app.news"),
    component: Error404Window,
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
    name: "error404",
    id: "9",
    title: t("app.error404"),
    component: Error404Window,
  },
  {
    name: "aboutNewsOrg",
    id: "10",
    title: t("app.aboutNewsOrg"),
    component: AboutNewsOrgWindow,
  },
  {
    name: "tty",
    id: "11",
    title: t("app.terminal"),
    component: TTYWindow,
    black: true,
  },
  {
    name: "newsView",
    id: "12",
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
    if (confirm("Are you sure?")) {
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
  console.log(windowName);
};

// menus
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};
// Lang Menu
const toggleLangMenu = () => {
  langMenuOpen.value = !langMenuOpen.value;
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

const findAndOpenWindow = (windowName: string) => {
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
      title: app.title,
      width: app.width || "600px",
      height: app.height || "400px",
      black: app.black || false,
    });
    currentOpenAppId.value++;
    // Add to navbar
    const windowNameVal2 =
      globalWindowVal.value.get(windowName).windowCount === 1
        ? windowName
        : windowName +
          "(" +
          globalWindowVal.value.get(windowName).windowCount +
          ")";
    currentNavBar.value.push({
      name: windowNameVal2,
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

const maxWindow = (windowUUId: string) => {
  const windowIndex = activeWindows.value.findIndex(
    (window) => window.absoluteId === windowUUId,
  );
  console.log(windowIndex);
};

const toggleMinWindow = (windowUUId: string) => {
  const windowIndex = "";
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
});

onMounted(() => {
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
        class="w-3/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-[#2a7b9b] then-[#8d57c7] to-[#ed4242]"
      />
      <br />
      <span class="text-xl text-bold mt-3 text-sky-200">{{
        t("app.launchtext")
      }}</span>
    </div>
  </div>
</template>
