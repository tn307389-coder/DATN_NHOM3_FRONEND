<template>
  <div v-if="!article" class="text-center py-5">
    <i class="bi bi-file-earmark-x display-4 text-muted"></i>
    <p class="text-muted mt-2 mb-0">Không tìm thấy bài viết</p>
  </div>
  <div v-else class="news-detail">
    <button class="btn btn-link px-0 mb-3" @click="$emit('back')">
      <i class="bi bi-arrow-left me-1"></i> Quay lại danh sách
    </button>
    <h1 class="mb-2">{{ article.tieude }}</h1>
    <div class="news-date mb-3">
      <i class="bi bi-calendar3"></i> {{ formatDate(article.ngaydang) }}
      <span v-if="article.tacgia" style="margin-left:12px"> {{ article.tacgia }}</span>
    </div>
    <img v-if="article.hinhanh" :src="article.hinhanh" alt="" class="news-detail-img" />
    <div class="news-detail-content">{{ article.noidung }}</div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({ article: Object });
defineEmits(["back"]);

const formatDate = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  if (isNaN(dt)) return String(d);
  return dt.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};
</script>