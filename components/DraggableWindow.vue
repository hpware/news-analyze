<script setup lang="ts">
// Check if the env is in development
/*const addForceRefreshButtonInWindow = ref(false);
const nuxtdeven1v = process.env.NUXT_DEV_ENV?.toLowerCase() === "true";
onMounted(() => {
  addForceRefreshButtonInWindow.value = nuxtdeven1v || false;
});
const forceRefresh = () => {
  window.location.reload();
  };*/

import { useThrottleFn } from "@vueuse/core";
import {
  XIcon,
  MinusIcon,
  RefreshCcwDotIcon,
  LanguagesIcon,
} from "lucide-vue-next";

const props = defineProps<{
  title: string;
  initialX?: number;
  initialY?: number;
  width?: string;
  height?: string;
  black?: boolean | false;
  windowTranslateState: boolean | false;
  notLoggedInState: boolean | false;
}>();

const emit = defineEmits(["close", "min", "restore", "translate"]);
const titleOrg = computed(() => props.title);
const titleMaxRegexDetection = /[a-zA-Z0-9]{,10}/;
const title = ref("Draggable Window");
onMounted(() => {
  if (!titleMaxRegexDetection.test(titleOrg.value)) {
    console.log("Max Detected!!");
  } else {
  }
  title.value = titleOrg.value;
});

const isDragging = ref(false);
const position = ref({
  x:
    props.initialX ||
    Math.floor(window.innerWidth / 2 - parseInt(props.width || "600") / 2),
  y:
    props.initialY ||
    Math.floor(window.innerHeight / 2 - parseInt(props.height || "400") / 2),
});

const offset = ref({ x: 0, y: 0 });

const doDrag = useThrottleFn((e: MouseEvent) => {
  if (!isDragging.value) return;

  requestAnimationFrame(() => {
    position.value = {
      x: Math.max(
        0,
        Math.min(window.innerWidth - 400, e.clientX - offset.value.x),
      ),
      y: Math.max(
        0,
        Math.min(window.innerHeight - 300, e.clientY - offset.value.y),
      ),
    };
  });
}, 16);

const startDrag = (e: MouseEvent) => {
  isDragging.value = true;
  offset.value = {
    x: e.clientX - position.value.x,
    y: e.clientY - position.value.y,
  };
  document.addEventListener("mousemove", doDrag);
  document.addEventListener("mouseup", stopDrag);
};

const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener("mousemove", doDrag);
  document.removeEventListener("mouseup", stopDrag);
};
</script>

<template>
  <div
    :style="{
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: props.width || '400px',
      height: props.height || '300px',
    }"
    class="fixed rounded-xl overflow-hidden flex flex-col shadow-lg shadow-xl/30"
    :class="
      props.black
        ? 'bg-black text-white border border-white border-t-0'
        : 'bg-white text-black'
    "
  >
    <div
      @mousedown="startDrag"
      class="bg-gray-700 p-2 cursor-move flex justify-between items-center flex-shrink-0 text-white z-[50] selection:opacity-0"
    >
      <h3
        class="font-semibold text-white selection:opactiy-0 selection:bg-gray-700"
      >
        {{ title }}
      </h3>
      <div class="flex flex-row gap-1">
        <!--<button
          @click="forceRefresh"
          class="p-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition duration-200"
          v-if="addForceRefreshButtonInWindow"
        >
          <RefreshCcwDotIcon />
          </button>-->
        <button
          @click="emit('translate')"
          class="p-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition duration-200"
          v-if="props.windowTranslateState"
        >
          <LanguagesIcon />
        </button>
        <!-- TODO !!!-->
        <!--<button
          @click="emit('min')"
          class="p-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition duration-200"
        >
          <MinusIcon />
          </button>-->
        <button
          @click="emit('close')"
          class="p-1 rounded bg-red-500 text-white hover:bg-red-600 transition duration-200"
        >
          <XIcon />
        </button>
      </div>
    </div>
    <div class="p-4 text-black overflow-y-auto flex-grow">
      <slot></slot>
    </div>
  </div>
</template>
