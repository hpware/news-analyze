<script setup lang="ts">
import BlurPageBeforeLogin from "~/components/blurPageBeforeLogin.vue";
const { t } = useI18n();
const { data: favData, error, pending } = useFetch("/api/user/fav", {});
const openApp = (link: string) => {
  console.log(link);
};
</script>
<template>
  <BlurPageBeforeLogin>
    <div
      class="justify-center text-center align-center flex flex-row flex-wrap"
    >
      <div v-for="items in favData.items">
        <div
          @click="openApp(items.article_link)"
          class="cursor-pointer p-4 bg-gray-300/80 rounded-xl backdrop-blur-sm hover:-translate-y-2 transition-all duration-200"
        >
          <h1 class="text-2xl text-bold">{{ items.name }}</h1>
          <div class="flex flex-row gap-2 text-center">
            <span>Date:</span>
            <span>{{ items.favTime }}</span>
          </div>
        </div>
      </div>
    </div>
  </BlurPageBeforeLogin>
</template>
