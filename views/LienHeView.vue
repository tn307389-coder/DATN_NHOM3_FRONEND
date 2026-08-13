<template>
  <div class="site">
    <LienHeSection />
    <CtaSection />
    <SiteFooter />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import SiteFooter from "../components/site/SiteFooter.vue";
import LienHeSection from "../components/site/LienHeSection.vue";
import CtaSection from "../components/site/CtaSection.vue";

onMounted(() => {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
});
</script>
