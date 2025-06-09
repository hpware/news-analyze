<script setup lang="ts">
import { BadgeCheckIcon, OctagonAlertIcon } from "lucide-vue-next";
import { Input } from "~/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import getVersionTag from "~/versionTag";
import { Button } from "@/components/ui/button";
const { t, locale } = useI18n();
const user = ref("");
const enterFirstName = ref();
const useremail = ref();
const userData = ref({
  userAccount: "",
  firstName: "",
  requested_action: "",
  email: "",
  avatarURL: "",
});
const enteruseremail = ref();
onMounted(async () => {
  const req = await fetch("/api/user/validateUserToken");
  const res = await req.json();
  user.value = res.firstName;
  userData.value = res;
  useremail.value = res.email;
});
const setFirstName = async () => {
  const staticFirstName = "";
};

const emit = defineEmits(["windowopener"]);

const logoutAction = () => {};

const groqApiKeyRegex = /^gsk_[a-zA-Z0-9]{52}$/;
const customApiKey = ref();
const isCorrect = ref(false);
const submitCustomApiKey = async () => {
  if (!isCorrect.value) {
    checkValidApiKey();
    if (!isCorrect.value) {
      return;
    }
  }
};

const checkValidApiKey = () => {
  const apiKey = customApiKey.value;
  if (!apiKey) {
    isCorrect.value = false;
    return;
  }
  isCorrect.value = groqApiKeyRegex.test(apiKey);
};

const showDeleteDialog = ref(false);
const showLogoutDialog = ref(false);
const confirmDelete = async () => {
  await deleteAccount();
  showDeleteDialog.value = false;
};

const confirmLogout = async () => {
  showLogoutDialog.value = false;
};
const deleteAccount = async () => {
  const req = await fetch("/api/user/action", {
    method: "DELETE",
  });
};
const apiKey = customApiKey.value;
try {
  const sendApi = await fetch("/api/ai/loadCustomGroqApi", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      apiKey: apiKey,
    }),
  });
  const data = await sendApi.json();
  if (data.error) {
  }
} catch (e) {
  console.log(e);
}
const submitChangeAction = async (action: string) => {
  const actions = [
    { name: "NAME", sendValue: enterFirstName.value },
    { name: "USER_EMAIL", sendValue: enteruseremail.value },
  ];

  const actionMatch = actions.find((a) => a.name === action);
  if (!actionMatch) {
    console.error("Invalid action type");
    return;
  }
  try {
    const req = await fetch("/api/user/sendUserChanges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: actionMatch.name,
        value: actionMatch.sendValue,
      }),
    });

    const response = await req.json();
    if (response.error) {
      console.error("Error updating user data:", response.error);
    }
  } catch (error) {
    console.error("Failed to submit change:", error);
  }
};
</script>
<template>
  <div class="justify-center align-center text-center">
    <h1 class="text-3xl text-bold p-2">
      {{ t("settings.greet")
      }}{{ user || userData.userAccount || t("settings.defaultname") }}
    </h1>
    <div class="flex flex-row text-center align-center justify-center p-1">
      <span class="text-md p-1 text-nowrap">Change your name:&nbsp;</span>
      <Input
        type="text"
        class="h-6 m-1 py-3 rounded"
        v-model="enterFirstName"
        placeholder="Ex: Howard ..."
      />
      <!--If it is a valid api key or not.-->
      <BadgeCheckIcon
        v-if="enterFirstName"
        class="w-8 h-8 p-1/2 mr-1 text-green-700"
      />
      <OctagonAlertIcon
        v-if="!enterFirstName"
        class="w-8 h-8 p-1/2 mr-1 text-red-700"
      />
      <button
        class="p-1 text-sm bg-gray-400/60 rounded text-nowrap"
        @click="submitChangeAction('NAME')"
        :disabled="!enterFirstName"
      >
        {{ t("settings.submit") }}
      </button>
    </div>
    <div class="flex flex-row text-center align-center justify-center p-1">
      <span class="text-md p-1 text-nowrap">Current email:&nbsp;</span>
      <span>{{ useremail || "Oh, It's empty." }}</span>
    </div>
    <div class="flex flex-row text-center align-center justify-center p-1">
      <span class="text-md p-1 text-nowrap">Change your email:&nbsp;</span>
      <Input
        type="text"
        class="h-6 m-1 py-3 rounded"
        v-model="enteruseremail"
        placeholder="Ex: example@gmail.com"
      />
      <!--If it is a valid api key or not.-->
      <BadgeCheckIcon
        v-if="enteruseremail"
        class="w-8 h-8 p-1/2 mr-1 text-green-700"
      />
      <OctagonAlertIcon
        v-if="!enteruseremail"
        class="w-8 h-8 p-1/2 mr-1 text-red-700"
      />
      <button
        class="p-1 text-sm bg-gray-400/60 rounded text-nowrap"
        @click="submitChangeAction('USER_EMAIL')"
        :disabled="!enteruseremail"
      >
        {{ t("settings.submit") }}
      </button>
    </div>
    <div class="flex flex-row text-center align-center justify-center p-1">
      <span class="text-md p-1 text-nowrap"
        >{{ t("settings.yourgroqapi") }}:&nbsp;</span
      >
      <Input
        type="text"
        class="h-6 m-1 py-3 rounded"
        v-model="customApiKey"
        placeholder="gsk_..."
        v-on:mouseover="checkValidApiKey"
        v-on:keypress="checkValidApiKey"
        v-on:mouseleave="checkValidApiKey"
      />
      <!--If it is a valid api key or not.-->
      <BadgeCheckIcon
        v-if="isCorrect"
        class="w-8 h-8 p-1/2 mr-1 text-green-700"
      />
      <OctagonAlertIcon
        v-if="!isCorrect"
        class="w-8 h-8 p-1/2 mr-1 text-red-700"
      />
      <button
        class="p-1 text-sm bg-gray-400/60 rounded text-nowrap"
        @click="submitCustomApiKey"
      >
        {{ t("settings.submit") }}
      </button>
    </div>
    <div class="bg-gray-200/70 p-2 m-2 w-full">
      <Dialog v-model:open="showLogoutDialog">
        <DialogTrigger asChild>
          <Button variant="outline">{{ t("settings.logout") }}</Button>
        </DialogTrigger>
        <DialogContent class="!border-0 !bg-black !rounded">
          <DialogHeader>
            <DialogTitle>{{ t("settings.logout") }}</DialogTitle>
            <DialogDescription>
              {{ t("popuptext.logout") }}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button @click="showLogoutDialog = false" variant="outline">
              {{ t("popup.cancel") }}
            </Button>
            <Button @click="confirmLogout" variant="destructive">
              {{ t("popup.confirm") }}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

    <div>
      <div class="p-2 m-2 w-full rounded">
        <h3 class="text-red-600">{{ t("settings.dangerzone") }}</h3>
        <div class="pt-1 pb-0"></div>
        <Dialog v-model:open="showDeleteDialog">
          <DialogTrigger asChild>
            <Button variant="destructive">
              {{ t("settings.deleteaccount") }}
            </Button>
          </DialogTrigger>
          <DialogContent class="!border-0 !bg-black !rounded">
            <DialogHeader>
              <DialogTitle>{{ t("settings.deleteaccount") }}</DialogTitle>
              <DialogDescription>
                {{ t("popuptext.delete") }}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button @click="showDeleteDialog = false" variant="outline">
                {{ t("popup.cancel") }}
              </Button>
              <Button @click="confirmDelete" variant="destructive">
                {{ t("settings.deleteaccount") }}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
    <hr />
    <div
      class="flex flex-row gap-2 m-1 p-2 justify-center align-center text-center"
    >
      <button
        class="bg-sky-400 p-1 rounded hover:bg-sky-600 transition-all duration-200 w-32"
        @click="() => emit('windowopener', 'privacypolicy')"
      >
        Privacy Policy
      </button>
      <button
        class="bg-sky-400 p-1 rounded hover:bg-sky-600 transition-all duration-200 w-32"
        @click="() => emit('windowopener', 'tos')"
      >
        TOS
      </button>
    </div>
    <hr />
    <div class="justiy-center align-center text-center">
      {{ t("app.settings") }} v0.0.3 || Version: {{ getVersionTag() }}
    </div>
  </div>
</template>
