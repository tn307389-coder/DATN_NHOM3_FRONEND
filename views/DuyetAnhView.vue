<template>
  <div>
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
      <div>
        <h2 class="fw-bold mb-1">Duyệt ảnh đại diện</h2>
        <p class="text-muted mb-0">Danh sách ảnh học viên/GV chờ duyệt</p>
      </div>
      <button class="btn btn-outline-primary rounded-pill px-3" @click="loadData" :disabled="loading">
        <i class="bi bi-arrow-clockwise me-1" :class="{ 'spin': loading }"></i> Làm mới
      </button>
    </div>

    <div class="row g-3 mb-4">
      <div class="col-md-3 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#0d6efd,#0a58ca)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-images fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ tongAnh }}</h3><small class="opacity-75">Tổng ảnh</small></div>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#ffc107,#e0a800)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-clock fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ choDuyetCount }}</h3><small class="opacity-75">Chờ duyệt</small></div>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#198754,#146c43)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-check-circle fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ daDuyetCount }}</h3><small class="opacity-75">Đã duyệt</small></div>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#dc3545,#b82d3f)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-x-circle fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ tuChoiCount }}</h3><small class="opacity-75">Từ chối</small></div>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm rounded-4">
      <div class="card-body p-4">
        <div v-if="loading" class="row g-3">
          <div v-for="i in 6" :key="i" class="col-md-4">
            <div class="card border-0" style="background:#f0f0f0;animation:pulse 1.5s infinite;border-radius:12px">
              <div style="height:200px;border-radius:12px 12px 0 0;background:#ddd"></div>
              <div class="p-3"><div style="height:16px;width:60%;background:#ddd;border-radius:8px"></div></div>
            </div>
          </div>
        </div>

        <template v-else>
          <div v-if="rows.length === 0" class="text-center text-muted py-5">
            <i class="bi bi-inbox display-3 d-block mb-2"></i>
            <p class="mb-0">Không có ảnh chờ duyệt</p>
          </div>

          <div v-else class="row g-3">
            <div v-for="item in rows" :key="item.id" class="col-md-4 col-lg-3">
              <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                <div class="position-relative overflow-hidden" style="cursor:pointer" @click="openPreview(item)">
                  <img :src="item.url" class="w-100" style="height:200px;object-fit:cover;transition:transform 0.3s;background:#f1f5f9" @mouseenter="$event.target.style.transform='scale(1.05)'" @mouseleave="$event.target.style.transform='scale(1)'" />
                  <span class="position-absolute top-0 end-0 m-2 badge rounded-pill px-3 py-2" :class="statusBadge(item.trangthai)">
                    {{ statusText(item.trangthai) }}
                  </span>
                </div>
                <div class="card-body p-3">
                  <div class="d-flex align-items-center gap-2 mb-1">
                    <i class="bi bi-person-circle text-muted"></i>
                    <span class="fw-semibold small">{{ userName(item.taiKhoan?.matk) || 'TK #' + item.taiKhoan?.matk }}</span>
                  </div>
                  <div class="d-flex gap-2 mt-2">
                    <button v-if="item.trangthai === 'CHO_DUYET'" class="btn btn-sm btn-success rounded-pill flex-fill px-3" @click="duyet(item.id)">
                      <i class="bi bi-check-lg me-1"></i>Duyệt
                    </button>
                    <button v-if="item.trangthai === 'CHO_DUYET'" class="btn btn-sm btn-outline-danger rounded-pill flex-fill px-3" @click="tuChoi(item.id)">
                      <i class="bi bi-x-lg me-1"></i>Từ chối
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div class="modal fade" id="previewModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 shadow rounded-4 overflow-hidden" v-if="previewItem">
          <div class="modal-header border-bottom-0" style="background:linear-gradient(135deg,#0d6efd,#2563eb);color:#fff">
            <h5 class="modal-title fw-bold"><i class="bi bi-eye me-2"></i>Xem ảnh</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-0 bg-dark text-center">
            <img :src="previewItem.url" class="img-fluid w-100" style="max-height:70vh;object-fit:contain" />
          </div>
          <div class="modal-footer justify-content-between border-top-0 px-4 py-3">
            <span class="text-muted small">{{ userName(previewItem.taiKhoan?.matk) || 'TK #' + previewItem.taiKhoan?.matk }}</span>
            <span class="badge rounded-pill px-3 py-2" :class="statusBadge(previewItem.trangthai)">{{ statusText(previewItem.trangthai) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { Modal } from "bootstrap";
import api from "../services/api";

const rows = ref([]);
const loading = ref(false);
const userMap = ref({});
const previewItem = ref(null);

const tongAnh = computed(() => rows.value.length);
const choDuyetCount = computed(() => rows.value.filter((r) => r.trangthai === 'CHO_DUYET').length);
const daDuyetCount = computed(() => rows.value.filter((r) => r.trangthai === 'DA_DUYET').length);
const tuChoiCount = computed(() => rows.value.filter((r) => r.trangthai === 'TU_CHOI').length);

const statusText = (t) => t === "CHO_DUYET" ? "Chờ duyệt" : t === "DA_DUYET" ? "Đã duyệt" : "Từ chối";
const statusBadge = (t) => t === "CHO_DUYET" ? "bg-warning bg-opacity-10 text-warning" : t === "DA_DUYET" ? "bg-success bg-opacity-10 text-success" : "bg-danger bg-opacity-10 text-danger";

const userName = (matk) => userMap.value[matk] || "";

const loadUsers = async () => {
  try {
    const res = await api.get("/tai-khoan");
    const map = {};
    (res.data || []).forEach((u) => { map[u.matk] = u.hoten || u.tendangnhap; });
    userMap.value = map;
  } catch (e) { console.error(e); }
};

const loadData = async () => {
  loading.value = true;
  try {
    const res = await api.get("/anh-cho-duyet");
    rows.value = res.data || [];
  } catch (e) { console.error(e); window.$toast?.add("Không tải được danh sách ảnh", "error"); }
  finally { loading.value = false; }
};

const duyet = async (id) => {
  try { await api.put(`/anh-cho-duyet/${id}/duyet`); window.$toast?.add("Đã duyệt ảnh", "success"); await loadData(); }
  catch (e) { console.error(e); window.$toast?.add("Duyệt thất bại", "error"); }
};

const tuChoi = async (id) => {
  try { await api.put(`/anh-cho-duyet/${id}/tu-choi`); window.$toast?.add("Đã từ chối ảnh", "success"); await loadData(); }
  catch (e) { console.error(e); window.$toast?.add("Từ chối thất bại", "error"); }
};

const openPreview = (item) => {
  previewItem.value = item;
  Modal.getOrCreateInstance(document.getElementById("previewModal")).show();
};

onMounted(async () => {
  await loadUsers();
  await loadData();
});
</script>

<style scoped>
.card { transition: transform 0.2s, box-shadow 0.2s; }
.card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
</style>
