<template>
  <div v-if="loading" class="news-grid">
    <div class="news-card skeleton" v-for="i in 3" :key="i">
      <div class="skeleton-thumb"></div>
      <div class="news-body">
        <div class="skeleton-text" style="width:60%;height:14px"></div>
        <div class="skeleton-text" style="width:100%;height:16px;margin-top:6px"></div>
        <div class="skeleton-text short" style="margin-top:6px"></div>
      </div>
    </div>
  </div>
  <div v-else-if="!articles.length" class="text-center py-5">
    <i class="bi bi-newspaper display-4 text-muted"></i>
    <p class="text-muted mt-2 mb-0">Chưa có tin tức nào</p>
  </div>
  <div v-else class="news-grid">
    <div v-for="item in articles" :key="item.id" class="news-card" @click="$emit('select', item)">
      <img v-if="item.hinhanh" :src="item.hinhanh" alt="" class="news-thumb" />
      <div class="news-body">
        <div class="news-date"><i class="bi bi-calendar3"></i> {{ formatDate(item.ngaydang) }}</div>
        <h4>{{ item.tieude }}</h4>
        <p>{{ item.motangan }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  articles: { type: Array, default: () => [] },
  loading: { type: Boolean, default: true },
});
const emit = defineEmits(["select"]);

const articles = computed(() => props.articles);
const loading = computed(() => props.loading);

const formatDate = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  if (isNaN(dt)) return String(d);
  return dt.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};
</script>