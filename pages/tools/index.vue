<script lang="ts" setup>
const localePath = useLocalePath();
// Import Icons
import { SearchXIcon, CircleSlash2Icon } from "lucide-vue-next";
const { t } = useI18n(); 
// Array
const tools = [
  {
    name: t("tools.name.checkweirdkeywords"),
    content: t("tools.content.checkweirdkeywords"),
    icon: SearchXIcon,
    go: localePath("/tools/checkweirdkeywords"),
  },
  {
    name: t("tools.name.noadlinetoday"),
    content: t("tools.content.noadlinetoday"),
    icon: CircleSlash2Icon,
    go: localePath("/tools/freelinetoday"),
  },
];
useSeoMeta({
  title: `${t("tools.title")}`
})
</script>
<template>
  <div
    class="justify-center align-center absolute inset-0 flex flex-col w-full h-screen"
  >
    <h1 class="text-5xl text-bold m-4 text-center">{{ t("tools.title") }}</h1>
    <div
      class="justify-center align-center gap-2 p-2 w-full flex flex-row flex-wrap relative"
    >
      <NuxtLink :to="item.go" v-for="item in tools">
        <div
          class="px-10 bg-gray-900/70 w-[300px] h-[200px] group rounded-xl shadow-lg hover:shadow-sky-700/90 hover:-translate-y-3 backdrop-blur-sm border border-gray-800 hover:border-gray-600/70 transition-all duration-700 justify-center align-middle flex flex-col"
        >
          <component
            :is="item.icon"
            class="w-8 h-8 text-white group-hover:text-sky-500 transition-colors duration-300"
          />
          <h3 class="text-xl font-bold">{{ item.name }}</h3>
          <p
            class="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 text-wrap"
          >
            {{ item.content }}
          </p>
        </div>
      </NuxtLink>
    </div>
  </div>
  <div class="h-screen"></div>
</template>
