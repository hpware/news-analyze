<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug;
const {
  data: fetchNewsArticle,
  pending,
  error,
} = await useFetch(`/api/objectstorage/files/${slug}`, {
  method: "GET",
});
</script>
<template>
  <div class="">
    <div class="content"></div>
  </div>
</template>
