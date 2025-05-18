<script setup lang="ts">
import BlurPageBeforeLogin from "~/components/blurPageBeforeLogin.vue";
const { t } = useI18n();
const { data: favData, error, pending } = useFetch("/api/user/fav", {});
</script>
<template>
  <BlurPageBeforeLogin>
    <div>{{ favData }}</div>
    <!--Testing only!!!-->
  </BlurPageBeforeLogin>
</template>
