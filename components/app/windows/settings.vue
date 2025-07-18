<script setup lang="ts">
import { BadgeCheckIcon, OctagonAlertIcon } from "lucide-vue-next";
import sha512 from "crypto-js/sha512";
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
const isLoggedIn = ref(false);
const useremail = ref();
const sendSuccess = ref(false);
const userData = ref({
  userAccount: "",
  firstName: "",
  requested_action: "",
  email: "",
  avatarURL: "",
});
const enteruseremail = ref();
onMounted(async () => {
  await validateUserInfo();
});

const validateUserInfo = async () => {
  const req = await fetch("/api/user/validateUserToken");
  const res = await req.json();
  if (res.current_spot === "LOGOUT") {
    isLoggedIn.value = false;
    return;
  }
  user.value = res.firstName;
  userData.value = res;
  useremail.value = res.email;
  isLoggedIn.value = true;
};

const intervalTime = 1000 * 60 * 2; // Validate user Info for every ten min while the admin page is opened.
setInterval(async () => {
  await validateUserInfo();
}, intervalTime);

const emit = defineEmits(["windowopener"]);

const logoutAction = async () => {
  // I reget rolling my own auth :(
  const req = await fetch("/api/user/logout");
  const res = await req.json();
  console.log(res);
  await validateUserInfo();
  showLogoutDialog.value = false;
};

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
  try {
    const req = await fetch("/api/user/submitGroqKey", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        value: customApiKey.value,
      }),
    });

    const response = await req.json();
    if (response.error) {
      console.error("Error updating user data:", response.error);
    }
    sendSuccessSystem();
  } catch (error) {
    console.error("Failed to submit change:", error);
  }
};

const sendSuccessSystem = () => {
  sendSuccess.value = true;
  setTimeout(() => {
    sendSuccess.value = false;
  }, 3000);
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
  showDeleteDialog.value = false;
  await deleteAccount();
  await validateUserInfo();
};

const deleteAccount = async () => {
  const req = await fetch("/api/user/sendUserChanges", {
    method: "DELETE",
  });
  const res = await req.json();
  sendSuccessSystem();
  console.log(res);
};

const submitChangeAction = async (action: string) => {
  //const allowedColumns = ["firstname", "email"];
  const actions = [
    { name: "NAME", SQLSystem: "firstname", sendValue: enterFirstName.value },
    { name: "USER_EMAIL", SQLSystem: "email", sendValue: enteruseremail.value },
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
        action: actionMatch.SQLSystem,
        value: actionMatch.sendValue,
        jsonValue: "",
      }),
    });

    const response = await req.json();
    if (response.error) {
      console.error("Error updating user data:", response.error);
      return;
    }
    sendSuccessSystem();
    await validateUserInfo();
  } catch (error) {
    console.error("Failed to submit change:", error);
  }
};

// Login function
const userAccount = ref("");
const userPassword = ref("");
const error = ref(false);
const errormsg = ref("");
const success = ref(false);
const submitUserPassword = async () => {
  error.value = false;
  errormsg.value = "";
  // Encrypt password during transit
  const password = sha512(userPassword.value).toString();

  // Send data.
  const sendData = await fetch("/api/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: userAccount.value,
      password: password,
    }),
  });
  const res = await sendData.json();

  if (!res.error) {
    error.value = false;
    success.value = true;
    console.log(res);
    userAccount.value = "";
    sendSuccessSystem();
    await validateUserInfo();
  } else {
    error.value = true;
    errormsg.value = res.error;
  }
  userPassword.value = "";
};
</script>
<template>
  <form
    class="flex flex-col items-center justify-center h-full align-center text-center absloute inset-0 p-1 bg-gray-200/50 backdrop-blur-sm text-black w-full absolute align-middle z-[20]"
    @submit.prevent="submitUserPassword"
    v-if="!isLoggedIn"
  >
    <span class="text-2xl text-bold mb-0">{{ t("settings.login") }}</span>
    <span class="mb-4 text-sm mt-0"> {{ t("settings.loginmessage") }}</span>
    <div class="">
      <Input
        type="text"
        :placeholder="t('settings.placeholder.user')"
        class="mb-2 p-2 border rounded"
        v-model="userAccount"
        required
      />
      <Input
        type="password"
        :placeholder="t('settings.placeholder.password')"
        class="p-2 border rounded mb-2"
        v-model="userPassword"
        required
      />
    </div>
    <span v-if="error" class="text-red-600 text-xs m-2"
      >Error: {{ errormsg }}</span
    >
    <button class="bg-black text-white p-2 rounded transition duration-200">
      {{ t("settings.loginButton") }}
    </button>
  </form>
  <div
    v-if="sendSuccess"
    class="flex flex-col items-center justify-center h-full align-center text-center absloute inset-0 p-1 bg-gray-200/50 backdrop-blur-sm text-black w-full absolute align-middle z-[20]"
  >
    <BadgeCheckIcon class="w-12 h-12 p-1/2 m-1 text-blue-600" />
    Success!
  </div>
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
            <Button @click="logoutAction" variant="destructive">
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
    <div class="justiy-center align-center text-center">
      {{ t("app.settings") }} v0.0.3 || Version: {{ getVersionTag() }}
    </div>
  </div>
</template>
