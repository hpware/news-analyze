<script lang="ts" setup>
const ffeed = ref();

try {
    const { data } = await useFetch('/api/rss/google')
    ffeed.value = data.value
  } catch (error) {
    console.error('Error:', error)
  }

</script>

<template>
    {{ ffeed }}
    <hr/>
    <div v-for="item in ffeed">
        <h2>{{ item.title }}</h2>
        <h4>{{ item.date }}</h4>
        類似項目:
        <div v-for="itit in item.content">
            {{ itit }}
        </div>
        <hr/>
    </div>
</template>