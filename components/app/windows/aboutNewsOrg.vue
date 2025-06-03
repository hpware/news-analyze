<script setup lang="ts">
import { GlobeAltIcon } from "@heroicons/vue/24/outline";
import { Facebook } from "lucide-vue-next";
import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/dist/ScrambleTextPlugin";
gsap.registerPlugin(ScrambleTextPlugin);
const loading = ref(true);
const { t, locale } = useI18n();
// Great, there are now no errors ig
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
        class="flex flex-row bg-[#AAACAAFF] rounded-3xl p-3 gap-3 m-3 scale-5"
      >
        <img
          :src="fetchNewsOrgInfo?.logoUrl"
          class="w-48 h-48 rounded-l-3xl object-cover p-0 m-0"
          draggable="false"
        />
        <div class="flex flex-col gap-3 text-left">
          <h1 class="text-4xl font-bold m-3 text-left" ref="orgNameAnimation">
            {{ fetchNewsOrgInfo?.title }}
          </h1>
          <span class="text-ms m-1 mt-5 text-left text-wrap">{{
            fetchNewsOrgInfo?.description
          }}</span>
          <div
            class="gap-[3px] flex flex-row text-center align-center justify-center"
          >
            <a
              :href="fetchNewsOrgInfo?.website"
              target="_blank"
              v-if="fetchNewsOrgInfo?.website"
              class="text-gray-800 hover:text-gray-500 transiton-all duration-150 flex flex-row"
              ><GlobeAltIcon class="w-6 h-6" />網站</a
            >
            <a
              :href="fetchNewsOrgInfo?.facebook"
              target="_blank"
              v-if="fetchNewsOrgInfo?.facebook"
              class="text-gray-800 hover:text-gray-500 transiton-all duration-150 flex flex-row"
              ><Facebook class="w-6 h-6" />Facebook
            </a>
          </div>
        </div>
      </div>
      <div>
        <div v-for="item in fetchNewsOrgInfo?.articles">
          {{ item.title }}
        </div>
      </div>
    </div>
  </div>
</template>
