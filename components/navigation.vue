<script setup lang="ts">
const { t, locale, locales } = useI18n();
const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();

const dropdownOpen = ref(false);
const title = ref(null);

const availableLocales = computed(() => {
  return locales.value.filter((i) => i.code !== locale.value);
});

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};
</script>
<template>
  <!--Spent too much time trying to set a Navbar....-->
  <div
    class="fixed top-0 inset-x-0 bg-[#81611a]/70 backdrop-blur-sm h-[55px] flex align-center items-center flex-row text-white pl-4 gap-x-5 justify-between z-50 rounded-3xl m-2"
  >
    <div class="text-3xl text-bold">
      <NuxtLink :to="localePath('home')" ref="title">BlindSpec</NuxtLink>
    </div>
    <div
      class="text-[0.9em] left-1/2 absolute transform -translate-x-1/2 space-x-4 items-center"
    >
      <NuxtLink
        :to="localePath('/home')"
        class="hover:text-blue-500 cursor-pointer transiton-all duration-100"
        >{{ t("nav.home") }}</NuxtLink
      >
      <NuxtLink
        :to="localePath('/home#learnmore')"
        class="hover:text-blue-500 cursor-pointer transiton-all duration-100"
        >{{ t("nav.learnmore") }}</NuxtLink
      >
    </div>
    <div class="flex flex-row align-center justify-center text-center">
      <button
        @click="toggleDropdown"
        class="flex items-center space-x-1 px-4 py-2 rounded hover:bg-gray-900 transition-all duration-100 mr-5"
      >
        <span>{{ locale }}</span>
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <Transition
        enter-active-class="animate__animated animate__fadeInDown animate_fastest"
        leave-active-class="animate__animated animate__fadeOutUp animate_fastest"
      >
        <div
          v-if="dropdownOpen"
          class="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1"
        >
          <a
            v-for="loc in availableLocales"
            :key="loc.code"
            :href="switchLocalePath(loc.code)"
            v-on:click="dropdownOpen = false"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-all duration-100"
          >
            {{ loc.name || loc.code }}
          </a>
        </div>
      </Transition>
    </div>
  </div>
</template>
