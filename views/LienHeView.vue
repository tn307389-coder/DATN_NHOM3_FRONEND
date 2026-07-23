<template>
  <div class="site">
    <LienHeSection />
    <SiteFooter />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import SiteFooter from "../components/site/SiteFooter.vue";
import LienHeSection from "../components/site/LienHeSection.vue";

onMounted(() => {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
});
</script>
