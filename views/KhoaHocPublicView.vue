<template>
  <div class="site">
    <KhoaHocSection />
    <BangGiaSection />
    <CtaSection />
    <SiteFooter />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import SiteFooter from "../components/site/SiteFooter.vue";
import KhoaHocSection from "../components/site/KhoaHocSection.vue";
import BangGiaSection from "../components/site/BangGiaSection.vue";
import CtaSection from "../components/site/CtaSection.vue";
import { useSite } from "../composables/useSite";

const { loadKhoaHocPublic } = useSite();

onMounted(() => {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
  loadKhoaHocPublic();
});
</script>
