<script setup lang="ts">
const errore = ref(false);
const textinput = ref("");
const route = useRoute();
const router = useRouter();
const localePath = useLocalePath();
const article = route.query.article;
const buildUrl = "/api/news/get/lt/" + article;
if (!article) {
  errore.value = true;
}
const { data, error, pending } = await useFetch(buildUrl);
const submitTextInput = () => {
  const regexFilterOutUrl =
    /https:\/\/today\.line\.me\/tw\/v2\/article\/([^/\s]*)/;
  const matches = textinput.value.match(regexFilterOutUrl);
  const articleId = matches ? matches[1] : null;
  if (articleId) {
    window.location.href = localePath(
      `/tools/freelinetoday?article=${articleId}`,
    );
  }
};
</script>
<template>
  <div v-if="errore">
    <div
      class="absolute inset-0 flex flex-col justify-center align-center text-center w-full h-screen"
    >
      <h1 class="text-4xl mb-4">無法找到該文章</h1>
      <span>複製你的LINE Today 網址：</span>
      <div
        class="flex flex-row gap-2 w-full justify-center align-center text-center"
      >
        <input
          type="text"
          v-model="textinput"
          class="rounded-xl text-black"
        /><button @click="submitTextInput" class="p-2 bg-sky-600 rounded-xl">
          送出
        </button>
      </div>
    </div>
    <div class="h-screen"></div>
  </div>
  <div class="justify-center align-center text-center flex flex-col p-3">
    <h2 class="text-3xl text-bold">{{ data.title }}</h2>
    <span class="text-lg text-bold"
      >origin: {{ data.origin }} • author: {{ data.author }}</span
    >
    <div class="test-center" v-for="item in data.paragraph">{{ item }}</div>
  </div>
  <div class="min-h-10 sticky h-full"></div>
</template>
