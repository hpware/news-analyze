<script setup lang="ts">
interface prevCommandsInterface {
  id: number;
  displaycontent: string;
  userinput: boolean;
  error: boolean;
}

const router = useRouter();
const localePath = useLocalePath();
const commandInputBox = ref();
const inputRef = ref<HTMLInputElement | null>(null);
const prevCommandsId = ref(0);
const prevCommands = ref<prevCommandsInterface[]>([]);
const { t } = useI18n();

const printData = (content: any, userinput?: boolean, error?: boolean) => {
  prevCommands.value.push({
    id: prevCommandsId,
    displaycontent: content,
    userinput: userinput ? userinput : false,
    error: error ? error : false,
  });
  prevCommandsId.value++;
};

const displayHelp = () => {
  const helpContent =
    "Here are the commands for the Terminal \n\n execute [app]: This command opens an application in the [app] slot. \n article [id]: This command will open a LINE Today article in a window. \n about: This displays the about text window \n clear/clean: Wipe the terminal log. \n help: This help text system :D";
  printData(helpContent);
};

// Great, there are now no errors ig
const emit = defineEmits([
  "windowopener",
  "error",
  "loadValue",
  "openArticles",
]);
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
    if (targetPath === "newsView") {
      return;
    }
    openNewWindow(targetPath);
    printData(`Running ${targetPath}...`);
  } else {
    printData(`${executeMatch} ia not an application.`, false, true);
  }
};

const printAbout = () => {
  const aboutMessage =
    "This platform is made by Howard :) \n You can learn more about me here: https://yuanhau.com/ \n And this website is also open source \n The Github repo is here: https://github.com/hpware/news-analyze";
  printData(aboutMessage);
};

const cleanTTY = () => {
  prevCommands.value = [];
};

const openArticle = (inputContent: string) => {
  const match = inputContent.match(/^article\s+[a-zA-Z0-9]{7}$/);
  if (match) {
    const articleId = match[0].trim();
    emit("openArticles", articleId);
    printData(`Opening article ${articleId}...`);
  } else {
    printData(
      "Invalid article ID format. Please use 'openarticle' followed by a 7-character alphanumeric ID.",
      false,
      true,
    );
  }
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
  {
    command: "help",
    run: displayHelp,
  },
  {
    command: "article",
    run: openArticle,
  },
  {
    command: "關於",
    run: printAbout,
  },
  {
    command: "清掉",
    run: cleanTTY,
  },
  {
    command: "幫助",
    run: displayHelp,
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
