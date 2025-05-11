<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  title: string
  initialX?: number
  initialY?: number
  width?: string
  height?: string
}>()

const emit = defineEmits(['close'])

const isDragging = ref(false)
const position = ref({
  x: props.initialX || 100,
  y: props.initialY || 100
})
const offset = ref({ x: 0, y: 0 })

const startDrag = (e: MouseEvent) => {
  isDragging.value = true
  offset.value = {
    x: e.clientX - position.value.x,
    y: e.clientY - position.value.y
  }
}

const doDrag = (e: MouseEvent) => {
  if (isDragging.value) {
    position.value = {
      x: e.clientX - offset.value.x,
      y: e.clientY - offset.value.y
    }
  }
}

const stopDrag = () => {
  isDragging.value = false
}

onMounted(() => {
  document.addEventListener('mousemove', doDrag)
  document.addEventListener('mouseup', stopDrag)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', doDrag)
  document.removeEventListener('mouseup', stopDrag)
})
</script>

<template>
  <div
    :style="{
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: props.width || '400px',
      height: props.height || '300px'
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