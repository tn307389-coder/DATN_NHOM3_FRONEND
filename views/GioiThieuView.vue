<template>
  <div class="site">
    <GioiThieuSection />
    <TaiSaoChonSection />
    <CtaSection />
    <SiteFooter />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import SiteFooter from "../components/site/SiteFooter.vue";
import GioiThieuSection from "../components/site/GioiThieuSection.vue";
import TaiSaoChonSection from "../components/site/TaiSaoChonSection.vue";
import CtaSection from "../components/site/CtaSection.vue";

onMounted(() => {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
});
</script>
