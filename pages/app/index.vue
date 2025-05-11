<script setup lang="ts">
definePageMeta({
  layout: false,
});
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
gsap.registerPlugin(TextPlugin);

// Import Windows
import SignIn from "~/components/app/windows/login.vue";

// Icons
import { ComputerDesktopIcon, UserIcon } from "@heroicons/vue/24/outline";

// i18n
const { t, locale, locales } = useI18n();
const localePath = useLocalePath();
// Router
const router = useRouter();
// values
const popMessage = ref(null);
const menuOpen = ref(false);
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
  const loginWindow = document.createElement("div");
  loginWindow.className = "login-window";
  document.body.appendChild(loginWindow);
  const app = createApp(SignIn);
  app.component("SignIn", SignIn);
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
        document.body.removeChild(loginWindow);
      },
    });
  }, 5000);
}
// menu
const menuItems = [
  { name: "Hot News", action: () => router.push(localePath("/app/hotnews")) },
  { name: "News", action: () => router.push(localePath("/app/news")) },
  { name: "Sources", action: () => router.push(localePath("/sources")) },
  { type: "separator" },
  { name: 'About This Website', action: () => console.log('About') },
  { name: 'Settings', action: () => router.push('/settings') },
  { type: 'separator' },
  { name: 'Leave', action: () => router.push(localePath('/')) },
]
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!(e.target as HTMLElement).closest('.menu-container')) {
      menuOpen.value = false
    }
  })
})
</script>
<template>
  <div
    class="absolute inset-x-0 flex flex-row px-2 py-1 bg-white dark:bg-gray-900 justify-between align-center text-center z-50"
  >
    <div class="flex flex-row g-2 text-gray-400 dark:text-gray-500 z-100">
      <button @click="toggleMenu" class="w-8 h-8 text-gray-400 dark:text-gray-500 hover:text-blue-500 transition-all duration-100 flex flex-row">
        <ComputerDesktopIcon/>
      </button>
      <span class="ml-1 mr-2 text-[20px]">|</span>
    </div>
    <div class="text-gray-400">{{ currentDate }}</div>
  </div>
  <div class="w-full h-[2.5em]"></div>
  <div
    class="flex flex-col justify-center align-center text-center absolute w-full h-screen inset-x-0 inset-y-0"
    id="desktop"
  >

  </div>
  <div
    class="absolute w-[calc(100% - 5px)] inset-x-0 bottom-0 mx-[1.5px] p-3 justify-between align-center flex flex-row"
  >
    <div class="">
      Lang: <span class="text-sm">{{ locale }}</span>
    </div>
    <div class="gap-2 flex flex-row">
      <span class="text-sm">1.0.0</span>
      <span class="text-sm">|</span>
      <span class="text-sm">MIT License</span>
      <span class="text-sm">|</span>
      <span class="text-sm">{{ new Date().getFullYear() }} &copy yh</span>
    </div>
    <div class="">
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
