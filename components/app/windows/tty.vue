<script setup lang="ts">
const commandInputBox = ref();
const inputRef = ref<HTMLInputElement | null>(null);
const prevCommands = ref([]);

// Great, there are now no errors ig
const emit = defineEmits(["windowopener", "error", "loadValue"]);
const props = defineProps<{
  values?: string;
}>();

const openNewWindow = (windowId: string) => {
  emit("windowopener", windowId);
};

const printAbout = () => {};

const focusInput = () => {
  inputRef.value?.focus();
};
onMounted(() => {
  focusInput();
});

const startScript = () => {
  console.log(commandInputBox.value);
  const firstWord = commandInputBox.value.replace(/\s+.*$/, "").trim();
  const app = commands.find((item) => item.command === firstWord);
  if (app) {
    app.run(commandInputBox.value);
  } else {
    console.error("Cannot find match");
  }
  commandInputBox.value = "";
};

const findExecutable = (inputContent: string) => {
  console.log(inputContent);
};

// scripts
const commands = [
  {
    command: "execute",
    run: findExecutable,
  },
  {
    command: "about",
    run: printAbout,
  },
];
</script>

<template>
  <div class="w-full h-full">
    <div class="text-white">
      <div v-for="i in prevCommands" :key="i.id"></div>
    </div>
    <div class="text-white" @click="focusInput">
      <div class="flex flex-row">
        <span class="mx-1">></span>
        <input
          ref="inputRef"
          v-model="commandInputBox"
          id="ttyinputbox"
          type="text"
          autocomplete="false"
          autocorrect="false"
          autocapitalize="false"
          class="border-none bg-black outline-none text-wrap select-none"
          @keyup.enter="startScript()"
        />
      </div>
    </div>
  </div>
</template>
