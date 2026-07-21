<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2>Duyệt ảnh đại diện</h2>
        <p class="text-muted mb-0">Danh sách ảnh học viên/GV chờ duyệt</p>
      </div>
      <button class="btn btn-outline-primary" @click="loadData">
        <i class="bi bi-arrow-clockwise"></i> Làm mới
      </button>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <div v-if="loading" class="text-center py-4 text-muted">
          <div class="spinner-border text-primary"></div>
        </div>

        <div v-else-if="rows.length === 0" class="text-center text-muted py-5">
          <i class="bi bi-inbox fs-1 d-block mb-2"></i>
          Không có ảnh chờ duyệt
        </div>

        <div v-else class="row g-3">
          <div v-for="item in rows" :key="item.id" class="col-md-4">
            <div class="card h-100">
              <img :src="item.url" class="card-img-top anh-preview" :alt="item.url" />
              <div class="card-body">
                <div class="mb-2">
                  <span class="badge" :class="badgeClass(item.trangthai)">
                    {{ statusText(item.trangthai) }}
                  </span>
                </div>
                <div class="small text-muted mb-2">Mã TK: {{ item.matk }}</div>
                <div class="d-flex gap-2">
                  <button
                    v-if="item.trangthai === 'CHO_DUYET'"
                    class="btn btn-sm btn-success flex-fill"
                    @click="duyet(item.id)"
                  >
                    <i class="bi bi-check-lg"></i> Duyệt
                  </button>
                  <button
                    v-if="item.trangthai === 'CHO_DUYET'"
                    class="btn btn-sm btn-outline-danger flex-fill"
                    @click="tuChoi(item.id)"
                  >
                    <i class="bi bi-x-lg"></i> Từ chối
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";

const rows = ref([]);
const loading = ref(false);

const loadData = async () => {
  loading.value = true;
  try {
    const res = await api.get("/anh-cho-duyet");
    rows.value = res.data;
  } catch (e) {
    console.error(e);
    alert("Không tải được danh sách ảnh");
  } finally {
    loading.value = false;
  }
};

const duyet = async (id) => {
  try {
    await api.put(`/anh-cho-duyet/${id}/duyet`);
    alert("Đã duyệt ảnh");
    await loadData();
  } catch (e) {
    console.error(e);
    alert("Duyệt thất bại");
  }
};

const tuChoi = async (id) => {
  try {
    await api.put(`/anh-cho-duyet/${id}/tu-choi`);
    alert("Đã từ chối ảnh");
    await loadData();
  } catch (e) {
    console.error(e);
    alert("Từ chối thất bại");
  }
};

const statusText = (t) =>
  t === "CHO_DUYET" ? "Chờ duyệt" : t === "DA_DUYET" ? "Đã duyệt" : "Từ chối";

const badgeClass = (t) =>
  t === "CHO_DUYET" ? "bg-warning text-dark" : t === "DA_DUYET" ? "bg-success" : "bg-danger";

onMounted(loadData);
</script>

<style scoped>
.anh-preview {
  height: 220px;
  object-fit: cover;
  background: #f1f5f9;
}
</style>
