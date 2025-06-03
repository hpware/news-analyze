<script setup lang="ts">
import { BadgeCheckIcon, OctagonAlertIcon } from "lucide-vue-next";
import { Input } from "~/components/ui/input";
const { t, locale } = useI18n();
const user = ref();
onMounted(async () => {
  const req = await fetch("/api/user/validateUserToken");
  const res = await req.json();
  user.value = res;
});

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
  } catch (e) {}
};

const checkValidApiKey = () => {
  const apiKey = customApiKey.value;
  if (!apiKey) {
    isCorrect.value = false;
    return;
  }
  isCorrect.value = groqApiKeyRegex.test(apiKey);
};
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
  const req = await fetch("/api/user/delete", {
    method: "DELETE",
  });
};
</script>
<template>
  <div class="justify-center align-center text-center">
    <div class="">Greetings, {{ user }}</div>
    <div class="flex flex-row text-center align-center justify-center">
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
        class="p-1 text-sm bg-gray-400/60 rounded"
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
            <DialogDescription
              >Are you sure you want to logout?
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
      <h3 class="text-red-600">{{ t("settings.dangerzone") }}</h3>
      <div class="bg-gray-200/70 p-2 m-2 w-full rounded">
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
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
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
      {{ t("app.settings") }} v0.0.2
    </div>
  </div>
</template>
