<script setup lang="ts">
import noImageLogo from "~/public/geterrorassets/noImageLogo.svg";
const { t, locale } = useI18n();

const emit = defineEmits(["windowopener", "loadValue"]);

const openNewWindow = (itemId: string) => {
  emit("windowopener", "aboutNewsOrg");
  emit("loadValue", itemId);
};

const {
  data: source,
  pending,
  error,
} = await useFetch("/api/getData/fetchSources", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: {
    lang: locale,
  },
});

async function getImageSource(image: string) {
  console.log(image);
  if (!image || image === "#") {
    return noImageLogo;
  }
  try {
    const checkImgWorks = await fetch(image, {
      method: "GET",
    });
    if (checkImgWorks.status === 200) {
      return image;
    } else {
      return noImageLogo;
    }
  } catch (error) {
    return noImageLogo;
  }
}
const imageUrls = ref<{ [key: string]: string }>({});

// Load image sources when component mounts
onMounted(async () => {
  if (source.value?.data) {
    for (const item of source.value.data) {
      imageUrls.value[item.id] = await getImageSource(item.logo);
    }
  }
});
</script>
<template>
  <div class="flex flex-row flexw-wrap justify-center gap-2">
    <div
      class="flex flex-col group bg-gray-900/30 rounded-xl p-3 transition-all duration-500 shadow-lg hover:translate-y-[-2px] ransition-all duration-700"
      v-for="item in source?.data"
      :key="item.id"
    >
      <button @click="openNewWindow(item.id)">
        <img
          :src="imageUrls[item.id] || noImageLogo"
          alt="Organization Logo"
          class="w-16 h-16 rounded-xl"
        />
        <h1>{{ item.title }}</h1>
        <span>{{ item.description }}</span>
      </button>
    </div>
  </div>
</template>
