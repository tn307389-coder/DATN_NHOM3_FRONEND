<template>
  <section class="partners reveal">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Đối tác</span>
        <h2>Đơn vị đồng hành</h2>
      </div>
      <div class="partners-grid">
        <div class="partner-item" v-for="(p, i) in partners" :key="i">
          <i :class="p.icon"></i>
          <span>{{ p.name }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const partners = [
  { icon: "bi bi-building", name: "Sở GTVT TP.HCM" },
  { icon: "bi bi-bank", name: "Ngân hàng Vietcombank" },
  { icon: "bi bi-car-front", name: "Toyota Việt Nam" },
  { icon: "bi bi-shield-check", name: "Bảo hiểm PVI" },
  { icon: "bi bi-mortarboard", name: "Trường ĐH GTVT" },
];
</script>
