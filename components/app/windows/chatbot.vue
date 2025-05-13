<script setup lang="ts">
const { t } = useI18n();
const cookie = useCookie("lastChatId");
const lastChatId = cookie.value;
onMounted(() => {
  console.log(lastChatId);
  if (lastChatId) {
  }
});
</script>
<template>
  <div class="justify-center align-center text-center flex flex-col">Hi</div>
</template>
