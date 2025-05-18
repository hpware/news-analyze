<script setup lang="ts">
interface chatInterface {
  index: number;
  id: string;
  message: string;
  user: boolean;
}

import {
  History,
  Plus,
  Send,
  Square,
  User,
  BotMessageSquare,
} from "lucide-vue-next";
import { Input } from "~/components/ui/input";
import blurPageBeforeLogin from "~/components/blurPageBeforeLogin.vue";
import { v4 as uuidv4 } from "uuid";
const { t } = useI18n();
const cookie = useCookie("lastChatId");
const cookieChatId = cookie.value;
const chatId = ref();
const inputMessage = ref();
const messages = ref<chatInterface[]>([]);
const messageIndex = ref();
const aiGenerating = ref(false);

// Great, there are now no errors ig
const emit = defineEmits(["windowopener", "error", "loadValue"]);
const props = defineProps<{
  values?: string;
}>();

const sendChatData = (event?: KeyboardEvent) => {
  if (event?.shiftKey) return;
  if (inputMessage.value === "") return;
  const userMessage = inputMessage.value;
  inputMessage.value = "";
  messages.value.push({
    index: messageIndex.value,
    id: uuidv4(),
    message: userMessage,
    user: true,
  });
  aiGenerating.value = true;
  setTimeout(() => {
    aiGenerating.value = false;
  }, 3000);
};

const stopChatGenerate = () => {
  aiGenerating.value = false;
};

/*onMounted(async () => {
  console.log(cookieChatId);
  if (cookieChatId) {
  } else {
    const { data: checkUserChatId } = await useFetch(
      "/api/ai/chat/actions/findUserChatId",
      {
        method: "POST",
        body: {
          userid: "393393",
        },
      },
    );
    cookieChatId.value = checkUserChatId.value;
  }
});*/
onMounted(async () => {
  /*const {
    data: getData,
    pending,
    error,
  } = useFetch(`/api/ai/chat/${chatId.value}`);*/
});
</script>
<template>
  <blurPageBeforeLogin>
    <div class="flex flex-col h-full">
      <div>
        <div
          class="justify-center align-center text-center flex flex-col sticky top-0 pt-2 min-h-0 border rounded-2xl gray-500/80 backdrop-blur-sm"
        >
          <div class="flex flex-row justify-between p-2">
            <h2 class="text-xl ml-4 text-bold">Chat Name</h2>
            <div class="flex flex-row justify-center align-center text-center">
              <div
                class="flex flex-row justify-center align-center text-center gap-2"
              >
                <button
                  class="p-2 rounded-xl hover:bg-gray-300 transition-all duration-400"
                >
                  <History class="h-4 w-4" />
                </button>
                <button
                  class="p-2 rounded-xl hover:bg-gray-300 transition-all duration-400"
                >
                  <Plus class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          ref="chatContainerRef"
          class="flex-1 overflow-y-auto p-4 space-y-4"
        >
          <div
            v-for="message in messages"
            class="max-w-[80%] rounded-lg p-3 bg-gray-300/70 rounded-xl"
          >
            <div v-if="message.user" class="flex flex-row gap-2">
              <User class="w-5 h-5" />{{ message.message }}
            </div>
            <div v-else class="flex flex-row gap-2">
              <BotMessageSquare class="w-5 h-5" />{{ message.message }}
            </div>
          </div>
        </div>
        <div
          class="space-x-2 sticky bottom-0 border-t p-2 min-h-0 border rounded-xl gray-500/80 backdrop-blur-sm"
        >
          <div class="text-black w-full flex flex-row">
            <Input
              class="flex-1 rounded-xl"
              placeholder="Type a message..."
              v-model="inputMessage"
              @keyup.enter="sendChatData($event)"
              :disabled="aiGenerating"
            />
            <button
              class="pl-2 pr-2 mr-1 ml-1 bg-black text-white rounded-full hover:bg-gray-700 hover:translate-y-[-4px] transition-all duration-300 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:bg-color-500"
              :disabled="!inputMessage?.trim()"
              @click="sendChatData()"
              v-if="!aiGenerating"
            >
              <Send class="w-5 h-5" />
            </button>
            <button
              class="pl-2 pr-2 mr-1 ml-1 bg-black text-white rounded-full hover:bg-gray-700 hover:translate-y-[-4px] transition-all duration-300 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:bg-color-500"
              @click="stopChatGenerate"
              v-else
            >
              <Square class="w-5 h-5" />
            </button>
          </div>
          <span class="text-xs text-center justify-center align-center w-full"
            >Note: AI might create imbalanced views.</span
          >
        </div>
      </div>
    </div>
  </blurPageBeforeLogin>
</template>
