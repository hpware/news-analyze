<script setup lang="ts">
const user = ref();
const userToken = localStorage.getItem("token");
const { t, locale } = useI18n();
onMounted(async () => {
  const req = await fetch("/api/user/validateUserToken", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: userToken,
      lang: locale,
      page: "settings",
    }),
  });
  const res = req.json();
  user.value = res;
});

const logoutAction = () => {};
</script>
<template>
  <div class="justify-center align-center text-center">
    <div class="">Greetings, {{ user }}</div>
    <div class="bg-gray-200/70 p-2 m-2 w-full">
      <button @click="logoutAction">Logout</button>
    </div>
    <hr />
    <div class="justiy-center align-center text-center">Settings v0.0.1</div>
  </div>
</template>
