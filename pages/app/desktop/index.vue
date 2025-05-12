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
}

interface associAppWindowInterface {
  name: string;
  id: string;
  title: string;
  component: any;
}

// Import plugins
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { createApp } from "vue";
gsap.registerPlugin(TextPlugin);

// Import Windows
import LoginWindow from "~/components/app/windows/login.vue";
import HotNewsWindow from "~/components/app/windows/hotnews.vue";
import SourcesWindow from "~/components/app/windows/sources.vue";
import AboutWindow from "~/components/app/windows/about.vue";
import Error404Window from "~/components/app/windows/error404.vue";

// Import Shadcn/UI components
import AlertComponent from "~/components/ui/alert/Alert.vue";
import ButtonComponent from "~/components/ui/button/Button.vue";
import DialogComponent from "~/components/ui/dialog/Dialog.vue";
import ProgressComponent from "~/components/ui/progress/Progress.vue";
import HoverCardComponent from "~/components/ui/hover-card/HoverCard.vue";

// Icons
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
const bypassBoot = ref(false);
const activeWindows = ref<associAppWindowInterface>([]);
const openApp = ref();
const openAppId = ref();
const openAppNameQuery = ref();
const currentOpenAppId = ref(0);
const progress = ref(0);


// Key Data
const menuItems = [
  { name: t("app.hotnews"), windowName: "hotnews" },
  { name: t("app.news"), windowName: "news" },
  { name: t("app.sources"), windowName: "sources" },
  { name: t("app.starred"), windowName: "starred" },
  { name: t("app.about"), windowName: "about" },
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
  { name: "login", id: "2", title: t("app.login"), component: LoginWindow },
  {
    name: "sources",
    id: "3",
    title: t("app.sources"),
    component: SourcesWindow,
  },
  { name: "about", id: "4", title: t("app.about"), component: AboutWindow },
  {
    name: "settings",
    id: "5",
    title: t("app.settings"),
    component: Error404Window,
  },
  { name: "news", id: "6", title: t("app.news"), component: Error404Window },
  {
    name: "starred",
    id: "7",
    title: t("app.starred"),
    component: Error404Window,
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
const openWindow = (windowName?: string) => {
  if (windowName === "leave") {
    router.push(localePath("/home"));
  } else {
    if (windowName) findAndOpenWindow(windowName);
  }
  console.log(windowName);
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

    activeWindows.value.push({
      id: currentOpenAppId.value,
      component: windowComponent,
      name: windowName,
      title: app.title,
      width: app.width || "400px",
      height: app.height || "300px",
    });
    currentOpenAppId.value++;
  }
};

const closeWindow = (windowId: string) => {
  activeWindows.value = activeWindows.value.filter(
    (window) => window.id !== windowId,
  );
  console.log("activeWindows.value", activeWindows.value);
};

const topWindow = (windowId: string) => {
  const windowIndex = activeWindows.value.findIndex(
    (window) => window.id === windowId,
  );
  if (windowIndex !== -1) {
    const [window] = activeWindows.value.splice(windowIndex, 1);
    activeWindows.value.push(window);
  }
};

// Title
useSeoMeta({
  title: "hi" + " - Desktop",
});

// Booting animation
onMounted(() => {
  // booting animation bypass
const bootingHeaderParams = route.query.bypass;
if (bootingHeaderParams) {
  bypassBoot.value = true;
  console.log("Bypass booting animation");
}
  if (!bypassBoot.value) {
    gsap.to(popMessage.value, {
      duration: 0.5,
      text: t("app.booting"),
      ease: "none",
    });
    setTimeout(() => {
      bootingAnimation.value = false;
    }, 2000);
  } else {
    bootingAnimation.value = false;
  }
})

watchEffect((cleanupFn) => {
  const timer = setTimeout(() => progress.value = 100, 500)
  cleanupFn(() => clearTimeout(timer))
})
</script>
<template>
  <div v-if="bootingAnimation">
    <div class="flex flex-col justify-center align-center text-center absolute w-full h-screen inset-0 ">
      <Progress v-model="progress" class="w-3/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <br/>
      <span class="text-xl text-bold mt-3"
        >Launching your fancy desktop...</span>
    </div>
  </div>
  <div
    class="absolute inset-x-0 flex flex-row px-2 py-1 bg-[#7D7C7C]/70 text-white justify-between align-center text-center z-50"
    v-else
  >
    <!--Menu container-->
    <div class="flex flex-row g-2 text-gray-400 text-white z-9999">
      <button
        @click="toggleMenu"
        class="w-8 h-8 text-white hover:text-blue-500 transition-all duration-100 flex flex-row"
      >
        <ComputerDesktopIcon />
      </button>
      <span class="ml-1 mr-2 text-[20px]">|</span>
      <!--navbar icons for min and max application window-->
      <button
        class="flex flex-row items-center gap-x-2 text-gray-400 hover:text-gray-600 transition-all duration-100"
      ></button>
      <div
        v-for="item in currentNavBar"
        :key="item.name"
        class="flex flex-row items-center gap-x-2 hover:bg-gray-100 transition-all duration-100 px-4 py-2 cursor-pointer"
      >
        <button
          @click="unMinWindow(item.windowAssociated)"
          class="flex flex-row items-center gap-x-2 text-gray-400 hover:text-gray-600 transition-all duration-100"
        >
          <span>{{ item.name }}</span>
          <span
            v-if="item.flash"
            class="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"
          ></span>
          <span v-if="item.icon" :class="item.icon"> </span>
        </button>
      </div>
    </div>
    <div class="flex flex-row gap-5">
                <button
        class="p-1 hover:text-blue-200 transition-all duration-100 hover:bg-gray-500 rounded"
        @click="toggleLangMenu"
      >
       {{ t("localeflag") }}
      </button>
    <div class="text-center align-middle justify-center text-white">
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
      class="m-2 p-2 bg-gray-800 shadow-lg w-fit rounded-[10px] v-9998"
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
        @close="closeWindow(window.id)"
        @min="unMinWindow(window.id)"
        :width="window.width"
        :height="window.height"
        @clicked="topWindow(window.id)"
      >
        <Suspense>
          <Component
            :is="window.component"
            @error="console.error('Error:', $event)"
          />
        </Suspense>
      </DraggableWindow>
    </div>
  </Transition>
</template>
