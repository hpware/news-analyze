<script setup lang="ts">
const loading = ref(true);
const route = useRoute();
const slug = route.params.slug;
const { t, locale } = useI18n(); 

definePageMeta({
  layout: "newsorg",
});

const { data: fetchNewsOrgInfo, pending, error } = useFetch("/api/getData/fetchNewsOrgInfo", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: {
    lang: locale,
    requestPage: slug,
  },
});

watchEffect(() => {
  loading.value = pending.value;
});
</script>
<template>
    <div class="">
        {{ slug }}
        <br/>
        {{ fetchNewsOrgInfo }}
        <br/>
        {{ loading }}
    </div>    <div class="">
        {{ slug }}
        <br/>
        {{ fetchNewsOrgInfo }}
        <br/>
        {{ loading }}
    </div>    <div class="">
        {{ slug }}
        <br/>
        {{ fetchNewsOrgInfo }}
        <br/>
        {{ loading }}
    </div>    <div class="">
        {{ slug }}
        <br/>
        {{ fetchNewsOrgInfo }}
        <br/>
        {{ loading }}
    </div>    <div class="">
        {{ slug }}
        <br/>
        {{ fetchNewsOrgInfo }}
        <br/>
        {{ loading }}
    </div>    <div class="">
        {{ slug }}
        <br/>
        {{ fetchNewsOrgInfo }}
        <br/>
        {{ loading }}
    </div>    <div class="">
        {{ slug }}
        <br/>
        {{ fetchNewsOrgInfo }}
        <br/>
        {{ loading }}
    </div>    <div class="">
        {{ slug }}
        <br/>
        {{ fetchNewsOrgInfo }}
        <br/>
        {{ loading }}
    </div>    <div class="">
        {{ slug }}
        <br/>
        {{ fetchNewsOrgInfo }}
        <br/>
        {{ loading }}
    </div>    <div class="">
        {{ slug }}
        <br/>
        {{ fetchNewsOrgInfo }}
        <br/>
        {{ loading }}
    </div>    <div class="">
        {{ slug }}
        <br/>
        {{ fetchNewsOrgInfo }}
        <br/>
        {{ loading }}
    </div>    <div class="">
        {{ slug }}
        <br/>
        {{ fetchNewsOrgInfo }}
        <br/>
        {{ loading }}
    </div>    <div class="">
        {{ slug }}
        <br/>
        {{ fetchNewsOrgInfo }}
        <br/>
        {{ loading }}
    </div>    <div class="">
        {{ slug }}
        <br/>
        {{ fetchNewsOrgInfo }}
        <br/>
        {{ loading }}
    </div>    <div class="">
        {{ slug }}
        <br/>
        {{ fetchNewsOrgInfo }}
        <br/>
        {{ loading }}
    </div>    <div class="">
        {{ slug }}
        <br/>
        {{ fetchNewsOrgInfo }}
        <br/>
        {{ loading }}
    </div>    <div class="">
        {{ slug }}
        <br/>
        {{ fetchNewsOrgInfo }}
        <br/>
        {{ loading }}
    </div>    <div class="">
        {{ slug }}
        <br/>
        {{ fetchNewsOrgInfo }}
        <br/>
        {{ loading }}
    </div>    <div class="">
        {{ slug }}
        <br/>
        {{ fetchNewsOrgInfo }}
        <br/>
        {{ loading }}
    </div>    <div class="">
        {{ slug }}
        <br/>
        {{ fetchNewsOrgInfo }}
        <br/>
        {{ loading }}
    </div>    <div class="">
        {{ slug }}
        <br/>
        {{ fetchNewsOrgInfo }}
        <br/>
        {{ loading }}
    </div>
</template>