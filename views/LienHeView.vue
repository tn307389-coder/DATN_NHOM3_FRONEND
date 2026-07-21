<template>
  <div class="site">
    <LienHeSection />
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
import LienHeSection from "../components/site/LienHeSection.vue";

onMounted(() => {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
});
</script>
