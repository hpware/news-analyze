<script setup lang="ts">
// Imports
const { t, locale } = useI18n();
// Values
const allowed = ref(false);
const error = ref(false);
const errorMsg = ref("");
const emit = defineEmits(["windowopener", "error", "loadValue"]);

try {
  // 喔 我沒有加 await :( 難怪有問題
  const token = localStorage.getItem("token");
  const { data, error: sendError } = await useFetch(
    "/api/user/validateUserToken",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        lang: locale,
        page: "a_window_application_using_blurPageBeforeLogin_component",
      }),
    },
  );
  if (sendError.value) {
    error.value = true;
  }
  if (true) {
    allowed.value = true;
  } else {
    allowed.value = false;
  }
} catch (e) {
  error.value = true;
  errorMsg.value = e.message;
}
</script>
<template>
  <div
    class="flex flex-col bg-gray-200/50 text-black w-full h-full absolute inset-0 justify-center align-middle text-center z-[20] backdrop-blur-sm"
    v-if="!allowed || error"
  >
    <div v-if="!allowed && !error" class="m-2">
      {{ t("error") }}
    </div>
    <div v-if="error" class="m-2">
      <span>{{ errorMsg ? errorMsg : "" }} {{ t("systemerror") }}</span>
    </div>
  </div>
  <slot></slot>
</template>
