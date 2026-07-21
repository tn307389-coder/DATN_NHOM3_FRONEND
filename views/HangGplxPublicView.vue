<template>
  <div class="site">
    <HangGplxSection />
    <CtaSection />
    <SiteFooter />
    <SiteLoginModal />
    <SiteRegisterModal />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import SiteFooter from "../components/site/SiteFooter.vue";
import SiteLoginModal from "../components/site/SiteLoginModal.vue";
import SiteRegisterModal from "../components/site/SiteRegisterModal.vue";
import HangGplxSection from "../components/site/HangGplxSection.vue";
import CtaSection from "../components/site/CtaSection.vue";

onMounted(() => {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
});
</script>
