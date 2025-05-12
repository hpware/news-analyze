<script setup lang="ts">
const { t, locale } = useI18n();

const { data: source, pending, error } = await useFetch("/api/getData/fetchSources", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: {
        lang: locale,
    },
});
</script>
<template>
    <div >
        <div v-for="item in source.data" :key="item.id">
            <h1>{{ item.title }}</h1>
            <span>{{ item.description }}</span>
            <a :href="item.url">{{ item.url }}</a>
        </div>
    </div>
</template>