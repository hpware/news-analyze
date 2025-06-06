<script setup lang="ts">
import copyrightInfo from "~/components/app/info/copyright.vue";
// Great, there are now no errors ig
const emit = defineEmits(["windowopener", "error", "loadValue"]);
const props = defineProps<{
  values?: string;
}>();
const { t } = useI18n();
</script>
<template>
  <div class="justify-center align-center text-center flex flex-col">
    <div class="flex flex-col">
      <span class="text-xl">{{ t("about.why") }}</span>
      <span>{{ t("about.bulletpoints.1") }}</span>
      <span>{{ t("about.bulletpoints.2") }}</span>
      <span
        >3.
        <span class="line-through">{{
          t("about.bulletpoints.3half")
        }}</span></span
      >
    </div>
    <hr />
    <div class="flex flex-col">
      <span class="text-xl">{{ t("about.aboutDev.title") }}</span>
      <span class="text-center align-center justify-center">{{
        t("about.aboutDev.dev")
      }}</span>
      <span class="text-center align-center justify-center"
        >{{ t("about.aboutDev.contactEmailStarter")
        }}<a href="mailto:public+newscompareauthor@yuanhau.com"
          >public@yuanhau.com</a
        ></span
      >
    </div>
    <hr />
    <div class="flex flex-col">
      <span class="text-xl">{{ t("about.copyrigthtInfo") }}</span>
      <copyrightInfo class="justify-center align-center text-center" />
    </div>
  </div>
</template>
