<script setup lang="ts">
const { t } = useI18n();
</script>
<template>
  <div class="justify-center align-center text-center">
    <h1 class="text-2xl text-bold">{{ t("pages.tos.title") }}</h1>
    <p>{{ t("pages.tos.content") }}</p>
  </div>
</template>
