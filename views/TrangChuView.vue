<template>
  <div class="site">
    <HeroSection />
    <StatsSection />
    <GioiThieuSection />
    <HangGplxSection />
    <KhoaHocSection />
    <QuyTrinhSection />
    <TestimonialsSection />
    <DoiTacSection />
    <CtaSection />
    <LienHeSection />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import HeroSection from "../components/site/HeroSection.vue";
import StatsSection from "../components/site/StatsSection.vue";
import GioiThieuSection from "../components/site/GioiThieuSection.vue";
import HangGplxSection from "../components/site/HangGplxSection.vue";
import KhoaHocSection from "../components/site/KhoaHocSection.vue";
import QuyTrinhSection from "../components/site/QuyTrinhSection.vue";
import TestimonialsSection from "../components/site/TestimonialsSection.vue";
import DoiTacSection from "../components/site/DoiTacSection.vue";
import CtaSection from "../components/site/CtaSection.vue";
import LienHeSection from "../components/site/LienHeSection.vue";

onMounted(() => {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
});
</script>
