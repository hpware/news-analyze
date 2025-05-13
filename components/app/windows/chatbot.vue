<script setup lang="ts">
import { History, Plus } from "lucide-vue-next";
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
  <div class="justify-center align-center text-center flex flex-col">
    <div class="flex flex-row justify-between">
      <div>Chat Name</div>
      <div class="flex flex-row justify-center align-center text-center">
        <div
          class="flex flex-row justify-center align-center text-center gap-2"
        >
          <button class="p-2 rounded-lg hover:bg-gray-300">
            <History class="h-4 w-4" />
          </button>
          <button class="p-2 rounded-lg hover:bg-gray-300">
            <Plus class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
    <hr />
  </div>
</template>
