<template>
  <div>
    <div class="row g-3 mb-4">
      <div class="col-md-3 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#0d6efd,#0a58ca)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-tools fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ list.length }}</h3><small class="opacity-75">Tổng bảo trì</small></div>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#198754,#146c43)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-check-circle fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ filterCount('HOAN_THANH') }}</h3><small class="opacity-75">Hoàn thành</small></div>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#ffc107,#e0a800)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-clock fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ filterCount('DANG_XU_LY') }}</h3><small class="opacity-75">Đang XL</small></div>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#0dcaf0,#0aa2c0)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-calendar-check fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ filterCount('HEN_THOI_GIAN') }}</h3><small class="opacity-75">Hẹn giờ</small></div>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div class="card-body p-4">
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
          <div class="input-group" style="max-width:320px">
            <span class="input-group-text bg-white border-end-0"><i class="bi bi-search text-muted"></i></span>
            <input v-model="search" class="form-control border-start-0 ps-0" placeholder="Tìm biển số..." />
          </div>
          <button class="btn btn-primary rounded-pill px-3" @click="addBaoTri"><i class="bi bi-plus-lg me-1"></i> Thêm bảo trì</button>
        </div>

        <div v-if="loading" class="text-center py-4"><div class="spinner-border text-primary"></div></div>

        <div v-else-if="filteredList.length === 0" class="text-center text-muted py-5">
          <i class="bi bi-tools display-3 d-block mb-2"></i>
          <p class="mb-0">Chưa có lịch sử bảo trì nào</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead style="background:linear-gradient(135deg,#e8f0fe,#d2e3fc)">
              <tr>
                <th class="fw-semibold">STT</th>
                <th class="fw-semibold">Biển số</th>
                <th class="fw-semibold">Loại BT</th>
                <th class="fw-semibold">Ngày</th>
                <th class="fw-semibold">CP</th>
                <th class="fw-semibold">Trạng thái</th>
                <th class="fw-semibold">Next</th>
                <th class="fw-semibold">GC</th>
                <th class="fw-semibold text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in filteredList" :key="item.id">
                <td>{{ i + 1 }}</td>
                <td class="fw-medium">{{ item.xe?.bienso }}</td>
                <td><span class="badge rounded-pill px-3 py-2" :class="loaiBtBadge(item.loaiBaoTri)">{{ item.loaiBaoTri }}</span></td>
                <td>{{ formatDate(item.ngayBaoTri) }}</td>
                <td>{{ item.chiPhi ? item.chiPhi.toLocaleString('vi-VN') + '₫' : '—' }}</td>
                <td><span class="badge rounded-pill px-3 py-2" :class="trangThaiBadge(item.trangThai)">{{ item.trangThai }}</span></td>
                <td>{{ formatDate(item.ngayBaoTriTiepTheo) }}</td>
                <td><small class="text-muted">{{ item.moTa && item.moTa.length > 40 ? item.moTa.slice(0,40) + '...' : item.moTa || '—' }}</small></td>
                <td class="text-center text-nowrap">
                  <button class="btn btn-sm btn-outline-warning rounded-circle me-1" @click="editItem(item)"><i class="bi bi-pencil"></i></button>
                  <button class="btn btn-sm btn-outline-danger rounded-circle" @click="deleteItem(item.id)"><i class="bi bi-trash"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="modal fade" id="baoTriModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 shadow rounded-4 overflow-hidden">
          <div class="modal-header border-bottom-0 pb-0" :class="isEdit ? 'bg-warning-subtle' : 'bg-primary-subtle'">
            <h5 class="modal-title fw-bold">
              <i :class="isEdit ? 'bi bi-pencil-square text-warning' : 'bi bi-plus-circle text-primary'" class="me-2"></i>
              {{ isEdit ? 'Cập nhật bảo trì' : 'Thêm bảo trì mới' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <form @submit.prevent="save">
            <div class="modal-body p-4">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-semibold small"><i class="bi bi-truck me-1"></i>Xe <span class="text-danger">*</span></label>
                  <select v-model="form.maxe" class="form-select" :class="errors.maxe ? 'is-invalid' : ''">
                    <option :value="null">-- Chọn xe --</option>
                    <option v-for="x in xeVehicles" :key="x.maxe" :value="x.maxe">{{ x.bienso }} - {{ x.loaixe }}</option>
                  </select>
                  <div v-if="errors.maxe" class="invalid-feedback">{{ errors.maxe }}</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold small"><i class="bi bi-gear me-1"></i>Loại bảo trì <span class="text-danger">*</span></label>
                  <select v-model="form.loaiBaoTri" class="form-select" :class="errors.loaiBaoTri ? 'is-invalid' : ''">
                    <option value="">-- Chọn --</option>
                    <option value="BAO_DUONG">Bảo dưỡng</option>
                    <option value="THAY_NHOT">Thay nhớt</option>
                    <option value="THAY_LOC">Thay lọc</option>
                    <option value="DANG_KIEM">Đăng kiểm</option>
                    <option value="SUA_CHUA">Sửa chữa</option>
                  </select>
                  <div v-if="errors.loaiBaoTri" class="invalid-feedback">{{ errors.loaiBaoTri }}</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold small"><i class="bi bi-calendar me-1"></i>Ngày bảo trì <span class="text-danger">*</span></label>
                  <input v-model="form.ngayBaoTri" type="date" class="form-control" :class="errors.ngayBaoTri ? 'is-invalid' : ''" />
                  <div v-if="errors.ngayBaoTri" class="invalid-feedback">{{ errors.ngayBaoTri }}</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold small"><i class="bi bi-speedometer me-1"></i>Số km</label>
                  <input v-model="form.soKmHienTai" type="number" class="form-control" placeholder="KM hiện tại" />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold small"><i class="bi bi-cash me-1"></i>Chi phí</label>
                  <input v-model="form.chiPhi" type="number" step="1000" class="form-control" placeholder="Nhập chi phí" />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold small"><i class="bi bi-building me-1"></i>Đơn vị BT</label>
                  <input v-model="form.donViBaoTri" class="form-control" placeholder="Đơn vị bảo trì" />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold small"><i class="bi bi-flag me-1"></i>Trạng thái</label>
                  <select v-model="form.trangThai" class="form-select">
                    <option value="HOAN_THANH">Hoàn thành</option>
                    <option value="DANG_XU_LY">Đang xử lý</option>
                    <option value="HEN_THOI_GIAN">Hẹn thời gian</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold small"><i class="bi bi-calendar-check me-1"></i>Next</label>
                  <input v-model="form.ngayBaoTriTiepTheo" type="date" class="form-control" />
                </div>
                <div class="col-12">
                  <label class="form-label fw-semibold small"><i class="bi bi-chat me-1"></i>Mô tả</label>
                  <textarea v-model="form.moTa" class="form-control" rows="3" placeholder="Nhập mô tả"></textarea>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold small"><i class="bi bi-person me-1"></i>Người tạo</label>
                  <input v-model="form.nguoiTao" class="form-control" placeholder="Người tạo" />
                </div>
              </div>
            </div>
            <div class="modal-footer border-top-0 pt-0 px-4 pb-4">
              <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Hủy</button>
              <button type="submit" class="btn rounded-pill px-4" :class="isEdit ? 'btn-warning' : 'btn-primary'" :disabled="saving">
                <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
                <i v-else :class="isEdit ? 'bi bi-check-lg' : 'bi bi-plus-lg'" class="me-1"></i>
                {{ isEdit ? 'Cập nhật' : 'Thêm mới' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { Modal } from "bootstrap";
import { getAll, createData, updateData, deleteData } from "../services/crudService";

const route = useRoute();
const list = ref([]);
const xeVehicles = ref([]);
const loading = ref(false);
const isEdit = ref(false);
const saving = ref(false);
const search = ref("");
const filterMaxe = ref(route.query.maxe || null);
const errors = ref({});

const form = ref({ maxe: null, loaiBaoTri: "", ngayBaoTri: "", soKmHienTai: null, chiPhi: null, donViBaoTri: "", trangThai: "HOAN_THANH", ngayBaoTriTiepTheo: null, moTa: "", nguoiTao: "" });

const filteredList = computed(() => {
  if (!search.value) return list.value;
  const kw = search.value.toLowerCase();
  return list.value.filter((item) => item.xe?.bienso?.toLowerCase().includes(kw));
});

const filterCount = (s) => list.value.filter((r) => r.trangThai === s).length;

const formatDate = (d) => {
  if (!d) return "—";
  const parts = d.split("-");
  return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : d;
};

const trangThaiBadge = (s) => {
  const map = { HOAN_THANH: "bg-success bg-opacity-10 text-success", DANG_XU_LY: "bg-warning bg-opacity-10 text-warning", HEN_THOI_GIAN: "bg-info bg-opacity-10 text-info" };
  return map[s] || "bg-secondary bg-opacity-10 text-secondary";
};

const loaiBtBadge = (s) => {
  const map = { BAO_DUONG: "bg-primary bg-opacity-10 text-primary", THAY_NHOT: "bg-success bg-opacity-10 text-success", THAY_LOC: "bg-info bg-opacity-10 text-info", DANG_KIEM: "bg-warning bg-opacity-10 text-warning", SUA_CHUA: "bg-danger bg-opacity-10 text-danger" };
  return map[s] || "bg-secondary bg-opacity-10 text-secondary";
};

const loadData = async () => {
  loading.value = true;
  try { list.value = (await getAll("/lich-su-bao-tri-xe")).data || []; }
  catch (e) { console.error(e); window.$toast?.add("Không thể tải dữ liệu", "error"); }
  finally { loading.value = false; }
};

const loadXe = async () => {
  try {
    xeVehicles.value = (await getAll("/xe")).data || [];
    if (filterMaxe.value) form.value.maxe = Number(filterMaxe.value);
  } catch (e) { console.error(e); }
};

const resetForm = () => {
  form.value = { maxe: null, loaiBaoTri: "", ngayBaoTri: "", soKmHienTai: null, chiPhi: null, donViBaoTri: "", trangThai: "HOAN_THANH", ngayBaoTriTiepTheo: null, moTa: "", nguoiTao: "" };
  errors.value = {};
};

const validate = () => {
  const e = {};
  if (!form.value.maxe) e.maxe = "Chưa chọn xe";
  if (!form.value.loaiBaoTri) e.loaiBaoTri = "Chưa chọn loại BT";
  if (!form.value.ngayBaoTri) e.ngayBaoTri = "Chưa chọn ngày";
  errors.value = e;
  return Object.keys(e).length === 0;
};

let modalInstance = null;
const openModal = () => {
  if (!modalInstance) modalInstance = new Modal(document.getElementById("baoTriModal"));
  modalInstance.show();
};
const closeModal = () => { modalInstance?.hide(); resetForm(); };

const addBaoTri = () => { isEdit.value = false; resetForm(); if (filterMaxe.value) form.value.maxe = Number(filterMaxe.value); openModal(); };

const editItem = (item) => {
  isEdit.value = true;
  form.value = {
    id: item.id, maxe: item.xe?.maxe, loaiBaoTri: item.loaiBaoTri, ngayBaoTri: item.ngayBaoTri,
    soKmHienTai: item.soKmHienTai, chiPhi: item.chiPhi, donViBaoTri: item.donViBaoTri,
    trangThai: item.trangThai, ngayBaoTriTiepTheo: item.ngayBaoTriTiepTheo, moTa: item.moTa, nguoiTao: item.nguoiTao,
  };
  errors.value = {};
  openModal();
};

const save = async () => {
  if (!validate()) return;
  saving.value = true;
  try {
    const data = {
      maxe: form.value.maxe, loaiBaoTri: form.value.loaiBaoTri, ngayBaoTri: form.value.ngayBaoTri,
      soKmHienTai: form.value.soKmHienTai || null, chiPhi: form.value.chiPhi || null,
      donViBaoTri: form.value.donViBaoTri || "", trangThai: form.value.trangThai,
      ngayBaoTriTiepTheo: form.value.ngayBaoTriTiepTheo || null, moTa: form.value.moTa || "", nguoiTao: form.value.nguoiTao || "",
    };
    if (isEdit.value) { await updateData("/lich-su-bao-tri-xe", form.value.id, data); window.$toast?.add("Cập nhật thành công", "success"); }
    else { await createData("/lich-su-bao-tri-xe", data); window.$toast?.add("Thêm bảo trì thành công", "success"); }
    closeModal(); await loadData();
  } catch (e) { console.error(e); window.$toast?.add("Lưu thất bại", "error"); }
  finally { saving.value = false; }
};

const deleteItem = async (id) => {
  if (!confirm("Bạn có chắc muốn xóa?")) return;
  try { await deleteData("/lich-su-bao-tri-xe", id); window.$toast?.add("Xóa thành công", "success"); await loadData(); }
  catch (e) { console.error(e); window.$toast?.add("Xóa thất bại", "error"); }
};

onMounted(() => { loadData(); loadXe(); });
</script>

<style scoped>
.card { transition: transform 0.2s, box-shadow 0.2s; }
.card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important; }
</style>
