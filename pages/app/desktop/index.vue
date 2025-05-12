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
const menuItems = [
  { name: "Hot News", windowName: "hotnews" },
  { name: "News", windowName: "news" },
  { name: "Sources", windowName: "sources" },
  { name: "About This Website", windowName: "about" },
  { name: "Settings", windowName: "settings" },
  { name: "Leave", windowName: "leave" },
];
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};
// Lang Menu
const toggleLangMenu = () => {
  langMenuOpen.value = !langMenuOpen.value;
};

// values
const activeWindows = ref<associAppWindowInterface>([]);

// ?opemapp= component
const openApp = ref(false);
const openAppId = ref();
const openAppNameQuery = ref();

onMounted(() => {
  openApp.value = route.query.openapp;
  openAppId.value = route.query.id;
  openAppNameQuery.value = route.query.name;
  if (openApp.value) {
    openWindow(openApp.value);
  }
})

const associAppWindow = [
  {
    name: "hotnews",
    id: "1",
    title: "Hot News",
    component: HotNewsWindow,
    width: "700px",
    height: "500px",
  },
  { name: "login", id: "2", title: t("app.login") , component: LoginWindow },
  { name: "sources", id: "3", title: t("app.sources"), component: SourcesWindow }
];

const currentOpenAppId = ref(0);

const findAndOpenWindow = (windowName: string) => {
  const app = associAppWindow.find((app) => app.name === windowName)
  
  // Prevent dual logins
  if (windowName === "login" && 
      activeWindows.value.some((window) => window.name === "login")) {
    return
  }

  if (app) {
    // Use shallowRef for better performance with components
    const windowComponent = shallowRef(app.component)
    
    activeWindows.value.push({
      id: currentOpenAppId.value,
      component: windowComponent,
      name: windowName,
      title: app.title,
      width: app.width || "400px",
      height: app.height || "300px",
    })
    currentOpenAppId.value++;
  }
}

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

useSeoMeta({
  title: "hi" + " - Desktop",
})
</script>
<template>
  <div
    class="absolute inset-x-0 flex flex-row px-2 py-1 bg-[#7D7C7C]/70 text-white justify-between align-center text-center z-50"
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
    <div class="text-center align-middle justify-center text-white">
      {{ currentDate }}
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
  <!--Footer-->
  <div
    class="absolute w-[calc(100% - 5px)] inset-x-0 bottom-0 mx-[1.5px] p-3 justify-between align-center flex flex-row z-0"
  >
    <div class="">
      <!--Lang-->
      <span>Lang: </span>
      <span class="text-lg">{{ t("localeflag") }}</span
      >&nbsp;
      <button
        class="w-4 h-4 hover:text-blue-200 transition-all duration-100"
        @click="toggleLangMenu"
      >
        <LanguageIcon />
      </button>
    </div>
    <div class="gap-2 flex flex-row">
      <!--版權資訊-->
      <span class="text-sm">1.0.0</span>
      <span class="text-sm">|</span>
      <span class="text-sm">MIT {{ t("app.license") }}</span>
      <span class="text-sm">|</span>
      <span class="text-sm">{{ new Date().getFullYear() }} &copy yh</span>
    </div>
    <div class="">
      <button
        @click="openWindow('login')"
        class="w-8 h-8 text-gray-400 flex flex-row"
      >
        <UserIcon
          class="w-8 h-8 text-gray-400 hover:text-blue-500 transition-all duration-100"
        />
      </button>
    </div>
  </div>
</template>