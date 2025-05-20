<script setup lang="ts">
import BlurPageBeforeLogin from "~/components/blurPageBeforeLogin.vue";
const { t } = useI18n();
const { data: favData, error, pending } = useFetch("/api/user/fav", {});
</script>
<template>
  <BlurPageBeforeLogin>
    <div>
      <div v-for="items in favData.items">
        {{ items }}
      </div>
    </div>
  </BlurPageBeforeLogin>
</template>
