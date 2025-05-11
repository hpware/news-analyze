<script setup lang="ts">
import Navigation from "~/components/navigation.vue";
import Footer from "~/components/footer.vue";
</script>
<template>
  <nav>
    <Navigation />
  </nav>
  <main class="pt-[60px]">
    <slot />
  </main>
  <footer>
    <Footer />
  </footer>
</template>
