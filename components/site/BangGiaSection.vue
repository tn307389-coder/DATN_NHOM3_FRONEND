<template>
  <section id="bang-gia" class="section reveal">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Học phí</span>
        <h2>Bảng giá khóa học lái xe</h2>
        <p>Cam kết trọn gói, không phát sinh chi phí ẩn trong quá trình học.</p>
      </div>

      <div v-if="loading" class="pricing-grid">
        <div class="price-card skeleton" v-for="i in 4" :key="i">
          <div class="price-head">
            <div class="skeleton-text" style="width:40px;height:20px;border-radius:4px"></div>
            <div class="skeleton-text" style="width:120px;height:22px;margin-top:8px"></div>
            <div class="skeleton-text short" style="margin-top:4px"></div>
          </div>
          <div class="price-body">
            <div class="skeleton-text" style="width:80px;height:32px"></div>
            <div class="skeleton-text short" style="margin-top:8px"></div>
            <div v-for="j in 4" :key="j" class="skeleton-text" style="width:100%;height:16px;margin-top:6px"></div>
            <div class="skeleton-text" style="width:100%;height:44px;margin-top:16px;border-radius:12px"></div>
          </div>
        </div>
      </div>

      <div v-else-if="!courses.length" class="text-center py-5">
        <p class="text-muted">Chưa có thông tin giá khóa học.</p>
      </div>

      <div v-else class="pricing-grid">
        <div v-for="(kh, idx) in courses" :key="kh.makh" class="price-card" :class="{ featured: idx === 1 }">
          <div class="price-head">
            <span class="price-tag" :class="{ hot: idx === 1 }">{{ kh.hangBang }}</span>
            <h3>{{ kh.tenkhoahoc }}</h3>
            <p class="price-sub">{{ kh.tencth }}</p>
          </div>
          <div class="price-body">
            <div class="price-row">
              <span class="price-now">{{ formatMoney(kh.hocPhi) }}</span>
            </div>
            <p class="price-note">Trọn gói, không phát sinh</p>
            <ul class="price-feats">
              <li><i class="bi bi-check-circle-fill"></i> Lý thuyết + thực hành trọn gói</li>
              <li><i class="bi bi-check-circle-fill"></i> Xe đời mới, bảo hiểm full</li>
              <li><i class="bi bi-check-circle-fill"></i> Thi thử lý thuyết online</li>
              <li><i class="bi bi-check-circle-fill"></i> Hỗ trợ thi & cấp bằng</li>
            </ul>
            <button class="btn-price" @click="openRegister()">ĐĂNG KÝ</button>
          </div>
        </div>
      </div>

      <p class="price-offer">🎁 Ưu đãi thêm khi đăng ký nhóm từ 2 người trở lên</p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../../services/api";
import { useSite } from "../../composables/useSite";

const { openRegister } = useSite();
const courses = ref([]);
const loading = ref(true);

const formatMoney = (n) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n || 0);
};

const loadCourses = async () => {
  try {
    const res = await api.get("/khoa-hoc");
    courses.value = res.data || [];
  } catch (e) {
    console.error("Failed to load courses:", e);
  } finally {
    loading.value = false;
  }
};

onMounted(loadCourses);
</script>
