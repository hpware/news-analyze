<script setup lang="ts">
definePageMeta({
  layout: false,
});
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { createApp } from "vue";
gsap.registerPlugin(TextPlugin);

// Import Windows
import SignIn from "~/components/app/windows/login.vue";

// Icons
import { ComputerDesktopIcon, UserIcon, LanguageIcon, ChevronRightIcon} from "@heroicons/vue/24/outline";

// i18n
const { t, locale, locales } = useI18n();
const switchLocalePath = useSwitchLocalePath();
const localePath = useLocalePath();
// Router
const router = useRouter();
// values
const popMessage = ref(null);
const menuOpen = ref(false);
const langMenuOpen = ref(false);
const lang = ref(locale.value);
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
const showLogin = () => {
  const desktopEl = document.getElementById('desktop');
  if (!desktopEl) return;
  
  const loginWindow = document.createElement("div");
  loginWindow.className = "login-window absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2";
  desktopEl.appendChild(loginWindow);
  const app = createApp(SignIn);
  app.mount(loginWindow);
  
  setTimeout(() => {
    gsap.fromTo(
      loginWindow,
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 0.5 },
    );
  }, 100);
  
  setTimeout(() => {
    gsap.to(loginWindow, {
      opacity: 0,
      scale: 0.5,
      duration: 0.5,
      onComplete: () => {
        desktopEl.removeChild(loginWindow);
      },
    });
  }, 5000);
}
const openWindow = (windowName?: string) => {
  console.log(windowName);
}
// menus
const menuItems = [
  { name: "Hot News", windowName: "hotnews"} ,
  { name: "News", windowName: "news"},
  { name: "Sources", windowName: "sources"},
  { name: 'About This Website', },
  { name: 'Settings', windowName: "settings"},
  { name: 'Leave', windowName: "leave"},
]
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}
// Lang Menu
const toggleLangMenu = () => {
  langMenuOpen.value = !langMenuOpen.value
}
</script>
<template>
  <div
    class="absolute inset-x-0 flex flex-row px-2 py-1 bg-white dark:bg-gray-900 justify-between align-center text-center z-50"
  >
    <div class="flex flex-row g-2 text-gray-400 dark:text-gray-500">
      <button @click="toggleMenu" class="w-8 h-8 text-gray-400 dark:text-gray-500 hover:text-blue-500 transition-all duration-100 flex flex-row">
        <ComputerDesktopIcon/>
      </button>
      <span class="ml-1 mr-2 text-[20px]">|</span>
    </div>
    <div class="text-gray-400">{{ currentDate }}</div>
  </div>
  <div class="w-full h-[2.5em]"></div>
  <div class="m-2 p-2 bg-gray-800 shadow-lg w-fit rounded-[10px]" v-if="menuOpen">
    <div v-for="item in menuItems" :key="item.name" class="">
      <button @click="openWindow(item.windowName)" class="flex flex-row items-center gap-x-2 text-gray-400 hover:text-gray-600 transition-all duration-100">
        <span>{{ item.name }}</span>
        <ChevronRightIcon class="w-4 h-4 justify-center align-center" />
      </button>
    </div>
  </div>
  <div
    class="flex flex-col justify-center align-center text-center absolute w-full h-screen inset-x-0 inset-y-0 z-[-1]"
    id="desktop"
  >

  </div>
  <div
    class="absolute w-[calc(100% - 5px)] inset-x-0 bottom-0 mx-[1.5px] p-3 justify-between align-center flex flex-row"
  >
    <div class="">
      <!--Lang-->
      <span>Lang: </span>
      <span class="text-lg">{{ t("localeflag") }}</span>&nbsp;
      <button class="w-4 h-4 hover:text-blue-200 transition-all duration-100" @click="toggleLangMenu">
        <LanguageIcon />
      </button>
    </div>
    <div class="gap-2 flex flex-row">
      <!--版權資訊-->
      <span class="text-sm">1.0.0</span>
      <span class="text-sm">|</span>
      <span class="text-sm">MIT License</span>
      <span class="text-sm">|</span>
      <span class="text-sm">{{ new Date().getFullYear() }} &copy yh</span>
    </div>
    <div class="">
      <!--Clerk-->
      <SignedOut>
        <SignInButton>
          <button @click="showLogin" class="w-8 h-8 text-gray-400 dark:text-gray-500 flex flex-row">
          <UserIcon class="w-8 h-8 text-gray-400 dark:text-gray-500 hover:text-blue-500 transition-all duration-100" />
        </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  </div>
</template>
