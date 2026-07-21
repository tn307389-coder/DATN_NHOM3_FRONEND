<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-3">
        <div class="card shadow-sm mb-4">
          <div class="card-body text-center">
            <div class="profile-avatar-wrap mx-auto mb-3">
              <img v-if="profile.anh" :src="avatarSrc" alt="Avatar" class="profile-avatar-img" />
              <span v-else class="profile-avatar">{{ initials }}</span>
            </div>
            <h5 class="fw-bold mb-1">{{ profile.hoten || "Người dùng" }}</h5>
            <span class="badge mb-2" :class="isGv ? 'bg-success' : 'bg-primary'">
              {{ isGv ? "Giáo viên" : "Học viên" }}
            </span>
            <p class="text-muted small mb-0">{{ profile.email }}</p>
            <p class="text-muted small">{{ profile.sodienthoai }}</p>
          </div>
          <div class="list-group list-group-flush">
            <button class="list-group-item list-group-item-action" :class="{ active: tab === 'khoa-hoc' }" @click="tab = 'khoa-hoc'" v-if="!isGv">
              <i class="bi bi-book"></i> Khóa học đã đăng ký
            </button>
            <button class="list-group-item list-group-item-action" :class="{ active: tab === 'lich-hoc' }" @click="tab = 'lich-hoc'">
              <i class="bi bi-calendar-event"></i> {{ isGv ? 'Lịch dạy' : 'Lịch học' }}
            </button>
            <button class="list-group-item list-group-item-action" :class="{ active: tab === 'lich-thi' }" @click="tab = 'lich-thi'" v-if="!isGv">
              <i class="bi bi-clipboard-check"></i> Lịch thi
            </button>
          </div>
        </div>
      </div>

      <div class="col-md-9">
        <div class="card shadow-sm">
          <div class="card-body">
            <!-- Tab Khóa học (chỉ HV) -->
            <div v-if="tab === 'khoa-hoc' && !isGv">
              <h5 class="mb-3">Khóa học đã đăng ký</h5>
              <div v-if="loading" class="text-center py-4"><div class="spinner-border text-primary"></div></div>
              <div v-else-if="khoaHocs.length === 0" class="alert alert-secondary">Bạn chưa đăng ký khóa học nào.</div>
              <table v-else class="table table-hover align-middle">
                <thead class="table-light">
                  <tr>
                    <th>STT</th>
                    <th>Tên khóa học</th>
                    <th>Ngày đăng ký</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in khoaHocs" :key="item.madk">
                    <td>{{ i + 1 }}</td>
                    <td>{{ item.tenKhoaHoc }}</td>
                    <td>{{ formatDate(item.ngaydangky) }}</td>
                    <td><span class="badge" :class="trangThaiBadge(item.trangthai)">{{ item.trangthai }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Tab Lịch học / Lịch dạy -->
            <div v-if="tab === 'lich-hoc'">
              <h5 class="mb-3">{{ isGv ? 'Lịch dạy của tôi' : 'Lịch học của tôi' }}</h5>
              <div class="d-flex gap-2 mb-3">
                <input type="date" v-model="tuNgay" class="form-control form-control-sm" style="max-width: 180px" />
                <input type="date" v-model="denNgay" class="form-control form-control-sm" style="max-width: 180px" />
                <button class="btn btn-sm btn-primary" @click="loadLichHoc"><i class="bi bi-search"></i> Lọc</button>
                <button class="btn btn-sm btn-outline-secondary" @click="resetFilter"><i class="bi bi-x-circle"></i> Xóa lọc</button>
              </div>
              <div v-if="loading" class="text-center py-4"><div class="spinner-border text-primary"></div></div>
              <div v-else-if="lichHocs.length === 0" class="alert alert-secondary">Không có lịch {{ isGv ? 'dạy' : 'học' }} nào.</div>
              <div v-else class="table-responsive">
                <table class="table table-hover align-middle">
                  <thead class="table-light">
                    <tr>
                      <th>STT</th>
                      <th>Ngày học</th>
                      <th>Ca học</th>
                      <th>Môn học</th>
                      <th>Lớp</th>
                      <th>Phòng</th>
                      <th>Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, i) in lichHocs" :key="item.malich">
                      <td>{{ i + 1 }}</td>
                      <td><strong>{{ formatDate(item.ngayhoc) }}</strong></td>
                      <td>
                        {{ item.tencahoc }}<br/>
                        <small class="text-muted">{{ item.giolhlucbatdau }} - {{ item.giolhlucketthuc }}</small>
                      </td>
                      <td>{{ item.tenmonhoc }}</td>
                      <td><span class="badge bg-info text-dark">{{ item.tenlop }}</span></td>
                      <td>{{ item.tenphong }}</td>
                      <td><small>{{ item.ghichu || '—' }}</small></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-if="lichHocs.length > 0" class="text-muted mt-2">
                Hiển thị {{ lichHocs.length }} lịch {{ isGv ? 'dạy' : 'học' }}
              </div>
            </div>

            <!-- Tab Lịch thi (chỉ HV) -->
            <div v-if="tab === 'lich-thi' && !isGv">
              <h5 class="mb-3">Lịch thi của tôi</h5>
              <div v-if="loading" class="text-center py-4"><div class="spinner-border text-primary"></div></div>
              <div v-else-if="lichThis.length === 0" class="alert alert-secondary">Không có lịch thi nào.</div>
              <table v-else class="table table-hover align-middle">
                <thead class="table-light">
                  <tr>
                    <th>STT</th>
                    <th>Ngày thi</th>
                    <th>Ca thi</th>
                    <th>Phòng thi</th>
                    <th>Địa điểm</th>
                    <th>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in lichThis" :key="item.malichthi">
                    <td>{{ i + 1 }}</td>
                    <td><strong>{{ formatDate(item.ngaythi) }}</strong></td>
                    <td>
                      {{ item.tencathi }}<br/>
                      <small class="text-muted">{{ item.giobatdau }} - {{ item.gioketthuc }}</small>
                    </td>
                    <td>{{ item.tenphongthi }}</td>
                    <td>{{ item.diadiem || '—' }}</td>
                    <td><small>{{ item.ghichu || '—' }}</small></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import api from "../services/api";

const tab = ref("lich-hoc");
const profile = ref({});
const khoaHocs = ref([]);
const lichHocs = ref([]);
const lichThis = ref([]);
const loading = ref(false);
const tuNgay = ref("");
const denNgay = ref("");

const isGv = computed(() => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}").maVaiTro === "GV";
  } catch { return false; }
});

const avatarSrc = computed(() => profile.value.anh || "");
const initials = computed(() => {
  const n = (profile.value.hoten || "").trim();
  if (!n) return "?";
  return n.split(/\s+/).slice(0, 2).map(w => w[0]).join("").toUpperCase();
});

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const trangThaiBadge = (s) => {
  const map = { DANG_MO: "bg-success", DA_DONG: "bg-secondary", CHO_DUYET: "bg-warning" };
  return map[s] || "bg-info";
};

const loadProfile = async () => {
  try {
    const res = isGv.value ? await api.get("/giao-vien/me") : await api.get("/hoc-vien/me");
    profile.value = res.data;
  } catch (e) {
    console.error(e);
  }
};

const loadKhoaHoc = async () => {
  loading.value = true;
  try {
    const res = await api.get("/hoc-vien/me/khoa-hoc-dang-ky");
    khoaHocs.value = res.data;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const loadLichHoc = async () => {
  loading.value = true;
  try {
    const params = {};
    if (tuNgay.value) params.tuNgay = tuNgay.value;
    if (denNgay.value) params.denNgay = denNgay.value;

    if (isGv.value) {
      const res = await api.get("/giao-vien/me/lich-day", { params });
      lichHocs.value = res.data;
    } else {
      const res = await api.get("/hoc-vien/me/lich-hoc", { params });
      lichHocs.value = res.data;
    }
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const loadLichThi = async () => {
  loading.value = true;
  try {
    const res = await api.get("/hoc-vien/me/lich-thi");
    lichThis.value = res.data;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const resetFilter = () => {
  tuNgay.value = "";
  denNgay.value = "";
  loadLichHoc();
};

watch(tab, (val) => {
  if (val === "lich-hoc") loadLichHoc();
  else if (val === "khoa-hoc") loadKhoaHoc();
  else if (val === "lich-thi") loadLichThi();
});

onMounted(async () => {
  await loadProfile();
  if (isGv.value) {
    tab.value = "lich-hoc";
    await loadLichHoc();
  } else {
    tab.value = "khoa-hoc";
    await loadKhoaHoc();
  }
});
</script>

<style scoped>
.profile-avatar-img, .profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  background: linear-gradient(135deg, #0d6efd, #2563eb);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 28px;
}
</style>