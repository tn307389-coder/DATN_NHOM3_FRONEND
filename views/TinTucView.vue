<template>
  <div class="site">

    <section class="section reveal">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Tin Tức</span>
          <h2>Tin tức & Thông báo</h2>
          <p> DriveHub.</p>
        </div>

        <div v-if="loading" class="text-center text-muted py-5">Xin cảm ơn...</div>

        <div v-else-if="!news.length" class="text-center text-muted py-5">
          Nhóm#3 xin lỗi, hiện tại chưa có tin tức nào.
        </div>

        <!-- Chi tiáº¿t bĂ i viáº¿t -->
        <div v-else-if="selected" class="news-detail">
          <button class="btn btn-link px-0 mb-3" @click="selected = null">
            &larr; Quay láº¡i danh sĂ¡ch
          </button>
          <h1 class="mb-2">{{ selected.tieude }}</h1>
          <div class="news-date mb-3">
            <i class="bi bi-calendar3"></i>
            {{ formatDate(selected.ngaydang) }}
            <span v-if="selected.tacgia">  {{ selected.tacgia }}</span>
          </div>
          <img
            v-if="selected.hinhanh"
            :src="selected.hinhanh"
            alt=""
            class="news-detail-img"
          />
          <div class="news-detail-content">{{ selected.noidung }}</div>
        </div>

        <!-- Danh sĂ¡ch -->
        <div v-else class="news-grid">
          <div
            v-for="item in news"
            :key="item.id"
            class="news-card"
            @click="selected = item"
          >
            <img
              v-if="item.hinhanh"
              :src="item.hinhanh"
              alt=""
              class="news-thumb"
            />
            <div class="news-body">
              <div class="news-date">
                <i class="bi bi-calendar3"></i> {{ formatDate(item.ngaydang) }}
              </div>
              <h4>{{ item.tieude }}</h4>
              <p>{{ item.motangan }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <SiteFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import SiteFooter from "../components/site/SiteFooter.vue";
import api from "../services/api";

const news = ref([]);
const selected = ref(null);
const loading = ref(true);

const formatDate = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  if (isNaN(dt)) return String(d);
  return dt.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

onMounted(async () => {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
  try {
    const res = await api.get("/tin-tuc");
    news.value = res.data || [];
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>
