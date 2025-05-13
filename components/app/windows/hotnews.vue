<script setup lang="ts">
import DraggableWindow from "~/components/DraggableWindow.vue";
const ffeed = ref();
const ass = ["健康2.0", "中天", "TVBS", "香港01", "ETtoday"];
import Button from "~/components/ui/button/Button.vue";
const pending = ref();

try {
  const { data, pending } = await useFetch("/api/rss/google");
  ffeed.value = data.value;
} catch (error) {
  console.error("Error:", error);
}
</script>
<template>
  <div v-if="!ffeed">
    Loading...
  </div>
  <div
    v-for="item in ffeed"
    class="justify-center align-center text-center p-4 border border-black rounded-lg m-4"
  >
    <span class="text-xl text-bold text-gray-900"
      >{{ item.title }}
      <!--<span
        v-if="ass.some((app) => item.title.includes(app))"
        class="text-red-500 text-sm"
      >
        &nbsp;- 疑似來自有中資背景公司
      </span>-->
    </span>
    <h4 class="text-gray-500 text-sm">
      {{ new Date(item.date).toLocaleString() }}
    </h4>
    <div class="flex justify-center gap-2 mt-1">
      <NuxtLink :to="item.link" target="_blank">
        <Button>文章</Button>
      </NuxtLink>
      <NuxtLink>
        <Button>關於媒體</Button>
      </NuxtLink>
    </div>
    <br />
    類似新聞:
    <div v-for="itit in item.content">
      <ul v-for="ititit in itit">
        <li v-if="ititit.content?.[0].content[0] !== item.title">
          &nbsp; -
          <a :href="ititit.content?.[0].attributes?.href" target="_blank">{{
            ititit.content?.[0].content[0]
          }}</a>
          -
          <a :href="'/find/newsOrg?name=' + ititit.content?.[2].content[0]">{{
            ititit.content?.[2].content[0]
          }}</a>
          <!--<span
            v-if="
              ass.some((app) => ititit.content?.[2].content[0].includes(app))
            "
            class="text-red-500 text-sm"
          >
            &nbsp;- 疑似來自有中資背景公司
          </span>-->
        </li>
      </ul>
    </div>
  </div>
</template>
