<script setup lang="ts">
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
const messageIndex = ref();
const aiGenerating = ref(false);
const messages = ref<any[]>([]);
const newsId = ref("");
const isStreaming = ref(false);
const streamingMessage = ref("");
const messagesContainer = ref(null);

// Great, there are now no errors ig
const emit = defineEmits(["windowopener", "error", "loadValue"]);
const props = defineProps<{
  values?: string;
}>();

const sendChatData = async (event?: KeyboardEvent) => {
  if (event?.shiftKey) return;
  if (inputMessage.value === "") return;
  const userMessage = inputMessage.value;
  inputMessage.value = "";
  aiGenerating.value = true;
  await sendMessage(userMessage);
};

const stopChatGenerate = () => {
  aiGenerating.value = false;
};

const chatUuid = ref("");

onMounted(() => {
  chatUuid.value = uuidv4();
});

onMounted(async () => {
  /*const {
    data: getData,
    pending,
    error,
  } = useFetch(`/api/ai/chat/${chatId.value}`);*/
});

const sendMessage = async (newMessage: any) => {
  if (!newMessage.trim() || !newsId.value.trim() || isStreaming.value) {
    return;
  }
  messages.value.push({
    index: messageIndex.value,
    id: uuidv4(),
    message: newMessage,
    user: true,
    timestamp: new Date(),
  });
  messageIndex.value += 1;

  try {
    isStreaming.value = true;
    streamingMessage.value = "";

    const response = await fetch(`/api/ai/chat/${chatUuid.value}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: newMessage,
        newsid: newsId.value,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        streamingMessage.value += chunk;
        await scrollToBottom();
      }
    }

    // Add the complete assistant message
    if (streamingMessage.value) {
      messages.value.push({
        role: "assistant",
        content: streamingMessage.value,
        timestamp: new Date(),
      });
    }
  } catch (error) {
    console.error("Error sending message:", error);
    messages.value.push({
      role: "assistant",
      content: "Sorry, there was an error processing your message.",
      timestamp: new Date(),
    });
  } finally {
    isStreaming.value = false;
    streamingMessage.value = "";
    await scrollToBottom();
  }
};

const formatMessage = (content: any) => {
  // Simple markdown-like formatting
  return content
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br>");
};
const formatTime = (timestamp: any) => {
  return new Intl.DateTimeFormat("zh-TW", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);
};
</script>
<template>
  <blurPageBeforeLogin>
    <div class="flex flex-col h-[100%] w-full">
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
            class="max-w-[80%] p-3 bg-gray-300/70 rounded-xl"
          >
            <div v-if="message.user" class="flex flex-row gap-2">
              <User class="w-5 h-5" />{{ message.message }}
            </div>
            <div v-else class="flex flex-row gap-2">
              <BotMessageSquare class="w-5 h-5" />{{ message.message }}
            </div>
          </div>
          <div v-if="isStreaming" class="">
            <div></div>
          </div>
        </div>
        <div class="h-[75px]"></div>
        <div
          class="space-x-2 absolute bottom-2 inset-x-4 border-t p-2 min-h-0 border rounded-xl gray-500/80 backdrop-blur-sm"
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
