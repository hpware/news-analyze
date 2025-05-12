<script setup lang="ts">
const error = useError();
const { t } = useI18n();
</script> 
<template>
    <NuxtLayout>
        <div class="flex flex-col justify-center align-center text-center absolute inset-0 h-screen">
            <span class="text-7xl m-4 m-1 mb-0 text-center align-center justify-center">{{ error.statusCode }}</span>
            <span class="text-2xl text-center align-center justify-center">{{ error.statusMessage }}</span>
        </div>
        <div class="h-screen"></div>
    </NuxtLayout>
</template>