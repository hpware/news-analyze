<script setup lamng="ts">
const userAccount = ref("");
const userPassword = ref("");
const crypto = Crypto;
const submitUserPassword = async () => {
    // Encrypt password during transit
    const sha512Passwordify = crypto.createHash("sha512");
    sha512Passwordify.update(userPassword.value);
    const sha512Password = sha512Passwordify.digest("hex");

    // Log user & password
    console.log(userAccount.value);
    console.log(sha512Password);

    // Send data.
    const sendData = fetch("/api/user/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: userAccount.value,
            password: sha512Password,
        }),
    })
}
</script>
<template>
  <div class="flex flex-col items-center justify-center h-full">
    <div
      class="flex flex-col items-center justify-center h-full"
    >
      <div class="text-xl mb-4 text-bold">Login / Register</div>

      <input
        type="text"
        placeholder="Username"
        class="mb-2 p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        class="p-2 border rounded mb-2"
      />
      <button class="bg-black text-white p-2 rounded transition duration-200" @click="submitUserPassword">
        Log In
      </button>
    </div>
  </div>
</template>
