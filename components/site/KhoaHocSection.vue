<template>
  <section id="khoa-hoc" class="section reveal">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Chương trình học</span>
        <h2>Các khóa học lái xe</h2>
        <p>Lộ trình học bài bản từ lý thuyết đến thực hành.</p>
      </div>

      <div class="cards-grid course-grid">
        <div v-if="loading" class="course-card" v-for="i in 4" :key="i">
          <div class="course-top">
            <div class="course-ic skeleton"></div>
            <span class="course-tag skeleton-text"></span>
          </div>
          <h4 class="skeleton-text"></h4>
          <p class="skeleton-text short"></p>
          <div class="course-foot">
            <span class="course-meta skeleton-text"></span>
            <button class="btn-primary disabled" disabled>Đăng ký ngay</button>
          </div>
        </div>

        <div v-else-if="!khoaHocList.length" class="course-card">
          <div class="course-top">
            <div class="course-ic">📚</div>
            <span class="course-tag">--</span>
          </div>
          <h4>Chưa có khóa học</h4>
          <p>Dữ liệu đang được cập nhật.</p>
        </div>

        <div v-else class="course-card" v-for="kh in khoaHocList" :key="kh.makh">
          <div class="course-top">
            <div class="course-ic">{{ getIcon(kh.hangBang) }}</div>
            <span class="course-tag">{{ kh.hangBang }}</span>
          </div>
          <h4>{{ kh.tenkhoahoc }}</h4>
          <p>{{ kh.tencth }}</p>
          <ul>
            <li>Trạng thái: <strong>{{ kh.trangthai === 'OPEN' ? 'Đang mở' : 'Nghỉ' }}</strong></li>
            <li>Số học viên: {{ kh.soLuongHocVien }}</li>
          </ul>
          <div class="course-foot">
            <button class="btn-primary" @click="openRegister()">Đăng ký ngay</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useSite } from "../../composables/useSite";

const { khoaHocList, openRegister, loadKhoaHocPublic } = useSite();
const loading = ref(true);

const getIcon = (hang) => {
  const map = { A1: "🛵", A2: "🛵", B1: "🚗", B2: "🚘", "B2+": "🚘", C: "🚛", D: "🚐", E: "🚛", F: "🚛" };
  return map[hang] || "🚗";
};

onMounted(() => {
  loading.value = true;
  loadKhoaHocPublic().finally(() => { loading.value = false; });
});
</script>