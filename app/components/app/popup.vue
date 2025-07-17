<script setup lang="ts">
import { useThrottleFn } from "@vueuse/core";

const props = defineProps<{
  title: string;
}>();

const emit = defineEmits(["close"]);
const title = computed(() => props.title || "Popup Window");

const dragging = ref(false);
const position = ref({
  x: Math.floor(window.innerWidth / 2 - parseInt(props.width || "400") / 2),
  y: Math.floor(window.innerHeight / 2 - parseInt(props.height || "200") / 2),
});

const offset = ref({ x: 0, y: 0 });

const doDrag = useThrottleFn((e: MouseEvent) => {
  if (!dragging.value) return;
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
  dragging.value = true;
  offset.value = {
    x: e.clientX - position.value.x,
    y: e.clientY - position.value.y,
  };
  document.addEventListener("mousemove", doDrag);
  document.addEventListener("mouseup", stopDrag);
};

const stopDrag = () => {
  dragging.value = false;
  document.removeEventListener("mousemove", doDrag);
  document.removeEventListener("mouseup", stopDrag);
};
</script>
<template>
  <div class="flex flex-col rounded-xl gray-500/80 backdrop-blur-sm">
    <div
      class="flex flex-row absolute inset-x-0 top-0 h-8 bg-gray-600/80"
    ></div>
    <div class="">Yo a popup!</div>
    <button @click="">OK!</button>
  </div>
</template>
