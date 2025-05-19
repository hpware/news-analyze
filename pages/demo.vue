<script setup lang="ts">
import CheckKidUnfriendlyContent from "~/components/checks/checkKidUnfriendlyContent";
const title = ref("");
const system = ref(false);
const checkTitle = () => {
  if (!title.value) return;
  system.value = CheckKidUnfriendlyContent(title.value);
}
</script>
<template>
<input type="text" v-model="title">
<button @click="checkTitle">
    <div>{{ system }}</div>
</template>
