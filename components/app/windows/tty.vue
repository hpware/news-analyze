<script setup lang="ts">
interface prevCommandsInterface {
  id: number;
  displaycontent: string;
  userinput: boolean;
  error: boolean;
}

const commandInputBox = ref();
const inputRef = ref<HTMLInputElement | null>(null);
const prevCommandsId = ref(0);
const prevCommands = ref<prevCommandsInterface[]>([]);

const printData = (content: any, userinput?: boolean, error?: boolean) => {
  prevCommands.value.push({
    id: prevCommandsId,
    displaycontent: content,
    userinput: userinput ? userinput : false,
    error: error ? error : false,
  });
  prevCommandsId.value++;
};

// Great, there are now no errors ig
const emit = defineEmits(["windowopener", "error", "loadValue"]);
const props = defineProps<{
  values?: string;
}>();

const openNewWindow = (windowId: string) => {
  emit("windowopener", windowId);
};

const focusInput = () => {
  inputRef.value?.focus();
};
onMounted(() => {
  focusInput();
});

const startScript = () => {
  printData(commandInputBox.value, true);
  if (commandInputBox.value) {
    console.log(commandInputBox.value);
    const firstWord = commandInputBox.value.replace(/\s+.*$/, "").trim();
    const app = commands.find((item) => item.command === firstWord);
    if (app) {
      app.run(commandInputBox.value);
    } else {
      printData(`${commandInputBox.value} does not exist.`, false, true);
    }
    commandInputBox.value = "";
  }
};

const findExecutable = (inputContent: string) => {
  const executeMatch = inputContent.match(/^execute\s+(.*)$/);
  if (executeMatch) {
    const targetPath = executeMatch[1].trim();
    console.log("Executing:", targetPath);
    openNewWindow(targetPath);
  } else {
    console.error("Invalid execute command format");
  }
};

const aboutMessage = "This is a about message \n Cool ig";

const printAbout = () => {
  printData(aboutMessage);
};

const cleanTTY = () => {
  prevCommands.value = [];
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
  {
    command: "clear",
    run: cleanTTY,
  },
  {
    command: "clean",
    run: cleanTTY,
  },
];
</script>

<template>
  <div class="w-full h-full">
    <div class="text-white flex flex-col">
      <div v-for="i in prevCommands" :key="i.id">
        <span v-if="i.userinput"
          ><span class="mx-1">></span><span>{{ i.displaycontent }}</span></span
        >
        <span
          v-else
          :class="i.error ? 'text-red-600' : 'text-white'"
          v-html="i.displaycontent.replace(/\n/g, '<br>')"
        ></span>
      </div>
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
