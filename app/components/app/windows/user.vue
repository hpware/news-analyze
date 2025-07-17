<script setup lamng="ts">
// Great, there are now no errors ig
const emit = defineEmits(["windowopener", "error", "loadValue"]);
import sha512 from "crypto-js/sha512";
import Input from "~/components/ui/input/Input.vue";
const userAccount = ref("");
const userPassword = ref("");
const error = ref(false);
const errormsg = ref("");
const success = ref(false);
const submitUserPassword = async () => {
  error.value = false;
  errormsg.value = "";
  // Encrypt password during transit
  const password = sha512(userPassword.value).toString();

  // Send data.
  const sendData = await fetch("/api/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: userAccount.value,
      password: password,
    }),
  });
  const res = await sendData.json();

  if (!res.error) {
    error.value = false;
    success.value = true;
    console.log(res);
    userAccount.value = "";
  } else {
    error.value = true;
    errormsg.value = res.error;
  }
  userPassword.value = "";
};
</script>
<template>
  <div class="">
    <form
      class="flex flex-col items-center justify-center h-full"
      @submit.prevent="submitUserPassword"
      v-if="!success"
    >
      <span class="text-2xl text-bold mb-0">Login / Register</span>
      <span class="mb-4 text-sm mt-0"
        >We will create a account for you if you don't have one.</span
      >
      <div class="">
        <Input
          type="text"
          placeholder="Username"
          class="mb-2 p-2 border rounded"
          v-model="userAccount"
          required
        />
        <Input
          type="password"
          placeholder="Password"
          class="p-2 border rounded mb-2"
          v-model="userPassword"
          required
        />
      </div>
      <span v-if="error" class="text-red-600 text-xs m-2"
        >Error: {{ errormsg }}</span
      >
      <button class="bg-black text-white p-2 rounded transition duration-200">
        Log In
      </button>
    </form>
    <div v-else>Hi! ${user}</div>
  </div>
</template>
