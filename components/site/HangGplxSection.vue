<template>
  <section id="hang-gplx" class="section alt reveal">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Các hạng đào tạo</span>
        <h2>Hạng giấy phép lái xe</h2>
        <p>Đa dạng hạng bằng phù hợp với nhu cầu của từng học viên.</p>
      </div>

      <div class="cards-grid license-grid">
        <div v-if="loading" class="license-card" v-for="i in 6" :key="i">
          <div class="lc-badge skeleton"></div>
          <h4 class="skeleton-text"></h4>
          <p class="skeleton-text short"></p>
        </div>
        <div v-else-if="!hangGPLXList.length" class="license-card">
          <div class="lc-badge">—</div>
          <h4>Chưa có hạng GPLX</h4>
          <p>Dữ liệu đang được cập nhật.</p>
        </div>
        <div v-else class="license-card" v-for="hg in hangGPLXList" :key="hg.id">
          <div class="lc-badge">{{ hg.maHang }}</div>
          <h4>{{ hg.tenHang }}</h4>
          <p>{{ hg.moTa }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../../services/api";

const hangGPLXList = ref([]);
const loading = ref(true);

const loadHangGPLX = async () => {
  try {
    const res = await api.get("/hang-gplx");
    hangGPLXList.value = res.data;
  } catch (e) {
    console.error("Failed to load HangGPLX:", e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadHangGPLX();
});
</script>