<script setup lang="ts">
const { t } = useI18n();
</script>
<template>
  <div class="gap-2 flex flex-row">
    <!--版權資訊-->
    <span class="text-sm">1.0.0</span>
    <span class="text-sm">|</span>
    <span class="text-sm">MIT {{ t("app.license") }}</span>
    <span class="text-sm">|</span>
    <span class="text-sm">{{ new Date().getFullYear() }} &copy yh</span>
  </div>
</template>
