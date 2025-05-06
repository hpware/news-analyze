<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/dist/ScrambleTextPlugin';
gsap.registerPlugin(ScrambleTextPlugin) 

const { t, locale, locales } = useI18n();
const switchLocalePath = useSwitchLocalePath()

const dropdownOpen = ref(false);
const title = ref(null);

const availableLocales = computed(() => {
  return locales.value.filter(i => i.code !== locale.value)
})

const toggleDropdown = () => {
    dropdownOpen.value = !dropdownOpen.value;
}

const runAnimation = () => {
    gsap.to(title.value, {
  duration: 1, 
  scrambleText: "BlindSpec",
});
}
</script>
<template>
    <div class="fixed top-0 left-0 w-full bg-[#81611a] h-[60px] flex align-center flex-row text-white pl-4 pt-2 gap-x-5 justify-between">
        <div class="text-3xl text-bold">
            <!--Use mouseenter instead of hover-->
            <a href="/" @mouseenter="runAnimation" ref="title">
                BlindSpec
            </a>
        </div>
        <div class="text-[0.9em] text-center align-center">
            <a href="/" class="hover:text-blue-500 cursor-pointer transiton-all duration-100">{{ t("nav.home") }}</a>
            &nbsp;
            <a href="/dailybriefing" class="hover:text-blue-500 cursor-pointer transiton-all duration-100">{{ t("nav.dailybriefing") }}</a>
        </div>
        <div class="relative">
            <button @click="toggleDropdown" 
                    class="flex items-center space-x-2 px-4 py-2 rounded hover:bg-gray-900 transition-all duration-100">
                <span>{{ locale }}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M19 9l-7 7-7-7"/>
                </svg>
            </button>
            
            <div v-if="dropdownOpen" 
                 class="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                <a v-for="loc in availableLocales" 
                   :key="loc.code"
                   :href="switchLocalePath(loc.code)"
                   class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    {{ loc.name || loc.code }}
                </a>
            </div>
        </div>
    </div>
</template>