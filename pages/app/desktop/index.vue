<script setup lang="ts">
import DraggableWindow from "~/components/DraggableWindow.vue";
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
  <DraggableWindow title="Title">Hi This is a window</DraggableWindow> 
</template>