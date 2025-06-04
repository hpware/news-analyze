<script setup lang="ts">
import { GlobeAltIcon } from "@heroicons/vue/24/outline";
import { Facebook } from "lucide-vue-next";
import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/dist/ScrambleTextPlugin";
gsap.registerPlugin(ScrambleTextPlugin);
const loading = ref(true);
const { t, locale } = useI18n();

const emit = defineEmits(["windowopener", "error", "loadValue"]);

const props = defineProps({
  values: {
    type: String,
    required: true,
  },
});

const staticProps = props;

const {
  data: fetchNewsOrgInfo,
  pending,
  error,
} = useFetch(`/api/publishers/lt/${staticProps.values}`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: {
    lang: locale,
    requestPage: props.values,
  },
});

const orgNameAnimation = ref(null);

watch(
  () => fetchNewsOrgInfo.value,
  (newValue) => {
    if (newValue?.title) {
      nextTick(() => {
        gsap.to(orgNameAnimation.value, {
          duration: 1,
          scrambleText: newValue.title,
          ease: "none",
        });
      });
    }
  },
  { immediate: true },
);
</script>
<template>
  <div>
    <div class="text-center align-center justify-center">
      <div
        class="flex flex-row bg-gray-300/70 rounded-3xl p-3 gap-3 m-3 scale-5"
      >
        <div class="flex flex-col gap-3 text-left w-full">
          <h1
            v-if="pending"
            class="h-12 bg-gray-200 animate-pulse rounded m-2 w-3/4 mx-auto"
          ></h1>
          <h1
            v-else
            class="text-4xl font-bold m-2 text-center"
            ref="orgNameAnimation"
          >
            {{ fetchNewsOrgInfo?.title }}
          </h1>

          <div v-if="pending" class="flex flex-col gap-2 m-1 mt-5">
            <div class="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
            <div class="h-4 bg-gray-200 animate-pulse rounded w-5/6"></div>
            <div class="h-4 bg-gray-200 animate-pulse rounded w-4/6"></div>
          </div>
          <span v-else class="text-ms m-1 mt-5 text-left text-wrap">
            {{ fetchNewsOrgInfo?.description }}
          </span>
        </div>
      </div>

      <div class="space-y-3">
        <template v-if="pending">
          <div
            v-for="item in 5"
            :key="item"
            class="p-3 bg-gray-300/70 rounded m-1 animate-pulse h-8"
          ></div>
        </template>
        <template v-else>
          <div
            v-for="item in fetchNewsOrgInfo?.articles"
            class="p-1 bg-gray-300/70 rounded m-1"
          >
            <div class="flex flex-col">
              <span class="title text-bold">{{ item.title }}</span>
              <span class="date text-xs">{{ item.date }}</span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
