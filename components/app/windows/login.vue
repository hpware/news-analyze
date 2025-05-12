<script setup lamng="ts">
import sha512 from "crypto-js/sha512";
const userAccount = ref("");
const userPassword = ref("");
const submitUserPassword = async () => {
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
    })
    const res = await sendData.json();

    if (res.status === "ok") {
        // Store the token in local storage
        localStorage.setItem("token", res.token);
        // Redirect to the home page
        window.location.href = "/";
        success.value = true;
    } else {
        alert("Login failed");
        error.value = true;
    }
    // Clear the input fields
    userAccount.value = "";
    userPassword.value = "";
}
</script>
<template>
  <div class="flex flex-col items-center justify-center h-full">
    <form
      class="flex flex-col items-center justify-center h-full"
      @submit.prevent="submitUserPassword"
      v-if="!success"
    >
      <div class="text-xl mb-4 text-bold">Login / Register</div>

      <input
        type="text"
        placeholder="Username"
        class="mb-2 p-2 border rounded"
        v-model="userAccount"
      />
      <input
        type="password"
        placeholder="Password"
        class="p-2 border rounded mb-2"
        v-model="userPassword"
      />
      <button class="bg-black text-white p-2 rounded transition duration-200">
        Log In
      </button>
    </form>
    <div v-else></div>
  </div>
</template>
