<script setup lang="ts">
// Imports
const { t, locale } = useI18n();
// Values
const allowed = ref(false);
const error = ref(false);
const errorMsg = ref("");
const emit = defineEmits(["windowopener", "error", "loadValue"]);

/**
 *   return {
   userAccount: fetchViaSQL[0].username,
   firstName: fetchViaSQL[0].firstName,
   requested_action: "CONTINUE",
   current_spot: "KEEP_LOGIN",
   email: fetchViaSQL[0].email,
   avatarURL: fetchViaSQL[0].avatarurl,
 };
 */
try {
  // 喔 我沒有加 await :( 難怪有問題
  const { data, error: sendError } = await useFetch(
    "/api/user/validateUserToken",
  );
  if (sendError.value) {
    error.value = true;
  }
  if (data.requested_action === "LOGOUT_USER") {
    logoutUser();
  }
  if (data.requested_action === "CONTINUE") {
    if (data.userAccount && data.userAccount.length !== 0) {
      allowed.value = true;
    } else {
      allowed.value = false;
    }
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
      <button>Update</button>
    </div>
  </div>
  <slot></slot>
</template>
