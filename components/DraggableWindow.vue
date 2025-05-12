<script setup lang="ts">
import { useThrottleFn } from '@vueuse/core'

const props = defineProps<{
  title: string;
  initialX?: number;
  initialY?: number;
  width?: string;
  height?: string;
}>();

const emit = defineEmits(["close"]);

const isDragging = ref(false);
const position = ref({
  x: props.initialX || Math.floor(window.innerWidth / 2 - (parseInt(props.width || '400') / 2)),
  y: props.initialY || Math.floor(window.innerHeight / 2 - (parseInt(props.height || '300') / 2)),
});

const offset = ref({ x: 0, y: 0 });

const doDrag = useThrottleFn((e: MouseEvent) => {
  if (!isDragging.value) return
  
  requestAnimationFrame(() => {
    position.value = {
      x: Math.max(0, Math.min(window.innerWidth - 400, e.clientX - offset.value.x)),
      y: Math.max(0, Math.min(window.innerHeight - 300, e.clientY - offset.value.y))
    }
  })
}, 16);


const startDrag = (e: MouseEvent) => {
  isDragging.value = true
  offset.value = {
    x: e.clientX - position.value.x,
    y: e.clientY - position.value.y
  }
  document.addEventListener('mousemove', doDrag)
  document.addEventListener('mouseup', stopDrag)
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', doDrag)
  document.removeEventListener('mouseup', stopDrag)
}
</script>

<template>
  <div
    :style="{
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: props.width || '400px',
      height: props.height || '300px',
    }"
    class="fixed bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden flex flex-col"
  >
    <div
      @mousedown="startDrag"
      class="bg-gray-700 p-2 cursor-move flex justify-between items-center flex-shrink-0"
    >
      <h3 class="font-semibold">{{ title }}</h3>
      <div class="flex flex-row gap-1">
        <button
          @click="emit('close')"
          class="p-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded"
        >
          ━
        </button>
        <button
          @click="emit('close')"
          class="p-1 rounded bg-red-500 text-white hover:bg-red-600 transition duration-200"
        >
          ✕
        </button>
      </div>
    </div>
    <div class="p-4 text-black overflow-y-auto flex-grow">
      <slot></slot>
    </div>
  </div>
</template>
