<script setup lang="ts">
// Imports
import LoginWindow from "~/components/app/windows/login.vue";
import HotNewsWindow from "~/components/app/windows/hotnews.vue";

definePageMeta({
  layout: "macui",
});
// Router
const router = useRouter();
const route = useRoute();

// ?opemapp= component
const openApp = ref(false);
const openAppId = ref();
watch(() => route.query.openapp, (newVal) => {
  if (newVal) {
    openApp.value = true;
    openAppId.value = newVal;
    // Remove query parameter without page reload
    router.replace({ 
      path: route.path,
      query: {},
    });
  }
});
</script>
<template>
  <div>
    <LoginWindow data-app-id="login" />
    <HotNewsWindow data-app-id="hotnews" />
  </div>
</template>