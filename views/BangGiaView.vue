<template>
  <div class="site">
    <BangGiaSection />
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
import BangGiaSection from "../components/site/BangGiaSection.vue";
import CtaSection from "../components/site/CtaSection.vue";
import { useSite } from "../composables/useSite";

const { loadKhoaHocPublic } = useSite();

onMounted(() => {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
  loadKhoaHocPublic();
});
</script>
