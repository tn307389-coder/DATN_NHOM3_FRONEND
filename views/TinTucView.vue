<template>
  <div class="site">
    <section class="section reveal">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Tin Tức</span>
          <h2>Tin tức & Thông báo</h2>
          <p>Cập nhật tin tức mới nhất từ DriveHub</p>
        </div>

        <div v-if="selectedArticle" class="mb-4">
          <TinTucDetail :article="selectedArticle" @back="selectedArticle = null" />
        </div>

        <TinTucList v-else :articles="articles" :loading="loading" @select="selectedArticle = $event" />
      </div>
    </section>

    <SiteFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import SiteFooter from "../components/site/SiteFooter.vue";
import TinTucList from "../components/site/TinTucList.vue";
import TinTucDetail from "../components/site/TinTucDetail.vue";
import api from "../services/api";

const articles = ref([]);
const selectedArticle = ref(null);
const loading = ref(true);

onMounted(async () => {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
  try {
    const res = await api.get("/tin-tuc");
    articles.value = res.data || [];
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>