<script setup lang="ts">
import { History, Plus, Send } from "lucide-vue-next";
import { Input } from "~/components/ui/input";
const { t } = useI18n();
const cookie = useCookie("lastChatId");
const cookieChatId = cookie.value;
const chatId = ref();
const inputMessage = ref();
const messages = ref([]);
// Great, there are now no errors ig
const emit = defineEmits(["windowopener", "error", "loadValue"]);
const props = defineProps<{
  values?: string;
}>();
onMounted(async () => {
  console.log(cookieChatId);
  if (cookieChatId) {
  } else {
    const { data: checkUserChatId } = await useFetch(
      "/api/ai/chat/actions/findUserChatId",
    );
    cookieChatId.value = checkUserChatId.value;
  }
});
onMounted(async () => {
  const {
    data: getData,
    pending,
    error,
  } = useFetch(`/api/ai/chat/${chatId.value}`);
});
</script>
<template>
  <div class="flex flex-col h-full">
    <div>
      <div class="justify-center align-center text-center flex flex-col">
        <div class="flex flex-row justify-between">
          <h2 class="text-xl ml-4 text-bold">Chat Name</h2>
          <div class="flex flex-row justify-center align-center text-center">
            <div
              class="flex flex-row justify-center align-center text-center gap-2"
            >
              <button
                class="p-2 rounded-t-xl hover:bg-gray-300 transition-all duration-400"
              >
                <History class="h-4 w-4" />
              </button>
              <button
                class="p-2 rounded-t-xl hover:bg-gray-300 transition-all duration-400"
              >
                <Plus class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        <hr />
      </div>
      <div ref="chatContainerRef" class="flex-1 overflow-y-auto p-4 space-y-4">
        <div
          v-for="message in messages"
          class="max-w-[80%] rounded-lg p-3"
        ></div>
      </div>

      <div class="text-black w-full flex flex-row space-x-2">
        <Input
          class="flex-1 rounded-xl"
          placeholder="Type a message..."
          v-model="inputMessage"
        />
        <button
          class="pl-2 pr-2 mr-1 ml-1 bg-black text-white rounded-full hover:bg-gray-700 hover:translate-y-[-4px] transition-all duration-300 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:bg-color-500"
          :disabled="!inputMessage?.trim()"
        >
          <Send class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>
