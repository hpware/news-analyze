<script setup lang="ts">
import { BadgeCheckIcon, OctagonAlertIcon } from "lucide-vue-next";
import { Input } from "~/components/ui/input";
const { t, locale } = useI18n();
const user = ref();
onMounted(async () => {
  const req = await fetch("/api/user/validateUserToken");
  const res = await req.json();
  user.value = res;
});

const logoutAction = () => {};
const groqApiKeyRegex = /^gsk_[a-zA-Z0-9]{52}$/;
const customApiKey = ref();
const isCorrect = ref(false);
const submitCustomApiKey = async () => {
  if (!isCorrect.value) {
    checkValidApiKey();
    if (!isCorrect.value) {
      return;
    }
  }
  const apiKey = customApiKey.value;
  try {
    const sendApi = await fetch("/api/ai/loadCustomGroqApi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        apiKey: apiKey,
      }),
    });
    const data = await sendApi.json();
    if (data.error) {
    }
  } catch (e) {}
};

const checkValidApiKey = () => {
  const apiKey = customApiKey.value;
  if (!apiKey) {
    isCorrect.value = false;
    return;
  }
  isCorrect.value = groqApiKeyRegex.test(apiKey);
};
</script>
<template>
  <div class="justify-center align-center text-center">
    <div class="">Greetings, {{ user }}</div>
    <div class="flex flex-row text-center align-center justify-center">
      <span class="text-md p-1 text-nowrap">Your Groq API:&nbsp;</span>
      <Input
        type="text"
        class="h-6 m-1 py-3 rounded"
        v-model="customApiKey"
        placeholder="gsk_..."
        v-on:mouseover="checkValidApiKey"
        v-on:keypress="checkValidApiKey"
        v-on:mouseleave="checkValidApiKey"
      />
      <!--If it is a valid api key or not.-->
      <BadgeCheckIcon
        v-if="isCorrect"
        class="w-8 h-8 p-1/2 mr-1 text-green-700"
      />
      <OctagonAlertIcon
        v-if="!isCorrect"
        class="w-8 h-8 p-1/2 mr-1 text-red-700"
      />
      <button
        class="p-1 text-sm bg-gray-400/60 rounded"
        @click="submitCustomApiKey"
      >
        Submit
      </button>
    </div>
    <div class="bg-gray-200/70 p-2 m-2 w-full">
      <button @click="logoutAction">Logout</button>
    </div>
    <hr />
    <div class="justiy-center align-center text-center">Settings v0.0.1</div>
  </div>
</template>
