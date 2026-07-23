<template>
  <div>
    <!-- STAT CARDS -->
    <div class="row g-3 mb-4">
      <div class="col-md-3 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#0d6efd,#0a58ca)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-folder fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ rows.length }}</h3><small class="opacity-75">Tổng hồ sơ</small></div>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#198754,#146c43)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-check-circle fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ filterCount('Đã duyệt') }}</h3><small class="opacity-75">Đã duyệt</small></div>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#ffc107,#e0a800)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-clock fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ filterCount('Đang xử lý') }}</h3><small class="opacity-75">Đang xử lý</small></div>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#dc3545,#b82d3f)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-x-circle fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ filterCount('Từ chối') }}</h3><small class="opacity-75">Từ chối</small></div>
          </div>
        </div>
      </div>
    </div>

    <!-- FILTER TABS -->
    <div class="d-flex flex-wrap gap-1 mb-3">
      <button v-for="t in statusTabs" :key="t.key" class="btn btn-sm rounded-pill px-3" :class="filterTab === t.key ? 'btn-primary' : 'btn-outline-primary'" @click="filterTab = t.key">{{ t.label }}</button>
    </div>

    <SimpleTablePage
      title="Quản lý hồ sơ học viên"
      subtitle="Danh sách hồ sơ đăng ký của học viên"
      search-placeholder="Tìm kiếm hồ sơ..."
      endpoint="/ho-so-hoc-vien"
      id-key="mahs"
      :columns="columns"
      :rows="filteredRows"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    >
      <template #cell-tinhtrang="{ value }">
        <span class="badge rounded-pill px-3 py-2" :class="statusBadgeClass(value)">{{ value }}</span>
      </template>
      <template #cell-ngaydangky="{ value }">
        {{ value ? formatDate(value) : '' }}
      </template>
      <template #extra-actions="{ row }">
        <button class="btn btn-sm btn-outline-info rounded-circle me-1" title="Xem hồ sơ" @click="openDetail(row)">
          <i class="bi bi-eye"></i>
        </button>
      </template>
      <template #empty-state>
        <i class="bi bi-folder display-1 text-muted"></i>
        <p class="text-muted mt-2 mb-0">Chưa có hồ sơ nào</p>
        <button v-if="!readOnly" class="btn btn-primary mt-3 rounded-pill" @click="openAdd">
          <i class="bi bi-plus-lg me-1"></i> Thêm hồ sơ đầu tiên
        </button>
      </template>
    </SimpleTablePage>

    <!-- MODAL THÊM/SỬA -->
    <div class="modal fade" id="hoSoHocVienModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow rounded-4 overflow-hidden">
          <div class="modal-header border-bottom-0 pb-0" :class="isEdit ? 'bg-warning-subtle' : 'bg-primary-subtle'">
            <h5 class="modal-title fw-bold">
              <i :class="isEdit ? 'bi bi-pencil-square text-warning' : 'bi bi-plus-circle text-primary'" class="me-2"></i>
              {{ isEdit ? 'Sửa hồ sơ' : 'Thêm hồ sơ' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <div class="mb-3">
              <label class="form-label fw-semibold small"><i class="bi bi-person me-1"></i>Học viên <span class="text-danger">*</span></label>
              <select v-model="form.mahv" class="form-select" :class="errors.mahv ? 'is-invalid' : ''">
                <option value="">-- Chọn học viên --</option>
                <option v-for="hv in hocVienList" :key="hv.mahv" :value="hv.mahv">{{ hv.hoten }} - {{ maskCccd(hv.cccd) }}</option>
              </select>
              <div v-if="errors.mahv" class="invalid-feedback">{{ errors.mahv }}</div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold small"><i class="bi bi-calendar me-1"></i>Ngày đăng ký <span class="text-danger">*</span></label>
              <input v-model="form.ngaydangky" type="date" class="form-control" :class="errors.ngaydangky ? 'is-invalid' : ''" />
              <div v-if="errors.ngaydangky" class="invalid-feedback">{{ errors.ngaydangky }}</div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold small"><i class="bi bi-tag me-1"></i>Tình trạng <span class="text-danger">*</span></label>
              <select v-model="form.tinhtrang" class="form-select" :class="errors.tinhtrang ? 'is-invalid' : ''">
                <option value="">-- Chọn tình trạng --</option>
                <option value="Đang xử lý">Đang xử lý</option>
                <option value="Đã duyệt">Đã duyệt</option>
                <option value="Bổ sung hồ sơ">Bổ sung hồ sơ</option>
                <option value="Từ chối">Từ chối</option>
              </select>
              <div v-if="errors.tinhtrang" class="invalid-feedback">{{ errors.tinhtrang }}</div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold small"><i class="bi bi-chat me-1"></i>Ghi chú <span class="text-danger">*</span></label>
              <textarea v-model="form.ghichu" class="form-control" rows="3" placeholder="Nhập ghi chú" :class="errors.ghichu ? 'is-invalid' : ''"></textarea>
              <div v-if="errors.ghichu" class="invalid-feedback">{{ errors.ghichu }}</div>
            </div>
          </div>
          <div class="modal-footer border-top-0 pt-0 px-4 pb-4">
            <button class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Hủy</button>
            <button class="btn rounded-pill px-4" :class="isEdit ? 'btn-warning' : 'btn-primary'" @click="saveData" :disabled="saving">
              <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
              <i v-else :class="isEdit ? 'bi bi-check-lg' : 'bi bi-plus-lg'" class="me-1"></i>
              {{ isEdit ? 'Cập nhật' : 'Thêm mới' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL XEM HỒ SƠ -->
    <div class="modal fade" id="hoSoDetailModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 shadow rounded-4 overflow-hidden" v-if="detail">
          <div class="modal-header border-bottom-0" style="background:linear-gradient(135deg,#0d6efd,#2563eb);color:#fff">
            <div>
              <h5 class="mb-0 fw-bold">PHIẾU HỒ SƠ ĐĂNG KÝ HỌC VIÊN</h5>
              <small class="opacity-75">Mã hồ sơ: {{ detail.mahs }}</small>
            </div>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <div class="row g-4">
              <div class="col-md-4 text-center">
                <div class="border-2 border-dashed rounded-3 p-3 bg-light" style="border-color:#cbd5e1">
                  <img v-if="detail.anhCanhCuoc" :src="photoUrl(detail.anhCanhCuoc)" alt="Ảnh căn cước" class="img-fluid rounded" style="max-height:200px;width:100%;object-fit:cover" />
                  <div v-else class="py-4 text-muted">
                    <i class="bi bi-person-fill d-block fs-1 mb-1"></i>
                    <small>Chưa có ảnh</small>
                  </div>
                </div>
                <div class="mt-2">
                  <span class="badge rounded-pill px-3 py-2" :class="statusBadgeClass(detail.tinhtrang)">{{ detail.tinhtrang || 'Chưa cập nhật' }}</span>
                </div>
              </div>
              <div class="col-md-8">
                <div class="fw-bold text-primary border-bottom pb-2 mb-3" style="border-color:#e5e7eb"><i class="bi bi-person me-1"></i>I. Thông tin học viên</div>
                <table class="table table-sm mb-3" style="border-collapse:separate;border-spacing:0 4px">
                  <tbody>
                    <tr><td class="text-muted fw-semibold border-0 ps-0" style="width:130px"><i class="bi bi-person me-1"></i>Họ và tên</td><td class="border-0">{{ detail.hocVien?.hoten || '—' }}</td></tr>
                    <tr><td class="text-muted fw-semibold border-0 ps-0"><i class="bi bi-calendar me-1"></i>Ngày sinh</td><td class="border-0">{{ detail.hocVien?.ngaysinh || '—' }}</td></tr>
                    <tr><td class="text-muted fw-semibold border-0 ps-0"><i class="bi bi-gender-ambiguous me-1"></i>Giới tính</td><td class="border-0">{{ detail.hocVien?.gioitinh || '—' }}</td></tr>
                    <tr><td class="text-muted fw-semibold border-0 ps-0"><i class="bi bi-card-text me-1"></i>CCCD</td><td class="border-0">{{ maskCccd(detail.hocVien?.cccd) || '—' }}</td></tr>
                    <tr><td class="text-muted fw-semibold border-0 ps-0"><i class="bi bi-telephone me-1"></i>Số điện thoại</td><td class="border-0">{{ detail.hocVien?.sodienthoai || '—' }}</td></tr>
                    <tr><td class="text-muted fw-semibold border-0 ps-0"><i class="bi bi-envelope me-1"></i>Email</td><td class="border-0">{{ detail.hocVien?.email || '—' }}</td></tr>
                    <tr><td class="text-muted fw-semibold border-0 ps-0"><i class="bi bi-geo-alt me-1"></i>Địa chỉ</td><td class="border-0">{{ detail.hocVien?.diachi || '—' }}</td></tr>
                  </tbody>
                </table>
                <div class="fw-bold text-primary border-bottom pb-2 mb-3" style="border-color:#e5e7eb"><i class="bi bi-folder me-1"></i>II. Thông tin hồ sơ</div>
                <table class="table table-sm" style="border-collapse:separate;border-spacing:0 4px">
                  <tbody>
                    <tr><td class="text-muted fw-semibold border-0 ps-0" style="width:130px"><i class="bi bi-calendar-check me-1"></i>Ngày đăng ký</td><td class="border-0">{{ detail.ngaydangky || '—' }}</td></tr>
                    <tr><td class="text-muted fw-semibold border-0 ps-0"><i class="bi bi-tag me-1"></i>Tình trạng</td><td class="border-0">{{ detail.tinhtrang || '—' }}</td></tr>
                    <tr><td class="text-muted fw-semibold border-0 ps-0"><i class="bi bi-chat me-1"></i>Ghi chú</td><td class="border-0">{{ detail.ghichu || '—' }}</td></tr>
                    <tr v-if="detail.fileHoSo">
                      <td class="text-muted fw-semibold border-0 ps-0"><i class="bi bi-paperclip me-1"></i>File</td>
                      <td class="border-0"><a :href="photoUrl(detail.fileHoSo)" target="_blank" class="btn btn-sm btn-outline-primary rounded-pill"><i class="bi bi-download me-1"></i>Tải xuống</a></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="modal-footer border-top-0 px-4 pb-4">
            <button class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Đóng</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, onMounted, ref } from "vue";
import { Modal } from "bootstrap";
import SimpleTablePage from "../components/common/SimpleTablePage.vue";
import { getAll, createData, updateData } from "../services/crudService";

const readOnly = inject("readOnly", ref(false));

const columns = [
  { key: "mahs", label: "Mã hồ sơ" },
  { key: "hocvien", label: "Học viên" },
  { key: "cccd", label: "CCCD" },
  { key: "ngaydangky", label: "Ngày đăng ký" },
  { key: "tinhtrang", label: "Tình trạng" },
  { key: "ghichu", label: "Ghi chú" },
];

const rows = ref([]);
const hocVienList = ref([]);
const isEdit = ref(false);
const saving = ref(false);
const detail = ref(null);
const filterTab = ref("all");

const form = ref({ mahs: null, mahv: "", ngaydangky: "", tinhtrang: "", ghichu: "" });
const errors = ref({});

const statusTabs = [
  { key: "all", label: "Tất cả" },
  { key: "Đã duyệt", label: "Đã duyệt" },
  { key: "Đang xử lý", label: "Đang xử lý" },
  { key: "Bổ sung hồ sơ", label: "Bổ sung" },
  { key: "Từ chối", label: "Từ chối" },
];

const filteredRows = computed(() => {
  if (filterTab.value === "all") return rows.value;
  return rows.value.filter((r) => r.tinhtrang === filterTab.value);
});

const filterCount = (status) => rows.value.filter((r) => r.tinhtrang === status).length;

const formatDate = (d) => {
  if (!d) return "";
  return new Date(d + "T00:00:00").toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const maskCccd = (cccd) => {
  if (!cccd) return "";
  if (cccd.length <= 4) return "****";
  return cccd.slice(0, 2) + "****" + cccd.slice(-2);
};

const statusBadgeClass = (t) => {
  const map = { "Đã duyệt": "bg-success bg-opacity-10 text-success", "Từ chối": "bg-danger bg-opacity-10 text-danger", "Bổ sung hồ sơ": "bg-warning bg-opacity-10 text-warning", "Đang xử lý": "bg-info bg-opacity-10 text-info" };
  return map[t] || "bg-secondary bg-opacity-10 text-secondary";
};

const loadData = async () => {
  try {
    const res = await getAll("/ho-so-hoc-vien");
    rows.value = (res.data || []).map((item) => ({
      ...item, hocvien: item.hocVien?.hoten || "", cccd: maskCccd(item.hocVien?.cccd) || "", mahv: item.hocVien?.mahv || "",
    }));
  } catch (e) {
    console.log(e);
    window.$toast?.add("Không thể tải dữ liệu hồ sơ", "error");
  }
};

const loadHocVien = async () => {
  try {
    const res = await getAll("/hoc-vien");
    hocVienList.value = res.data;
  } catch (e) {
    console.log(e);
    window.$toast?.add("Không thể tải dữ liệu học viên", "error");
  }
};

const resetForm = () => {
  form.value = { mahs: null, mahv: "", ngaydangky: "", tinhtrang: "", ghichu: "" };
  errors.value = {};
};

const validate = () => {
  const errs = {};
  if (!form.value.mahv) errs.mahv = "Chưa chọn học viên";
  if (!form.value.ngaydangky) errs.ngaydangky = "Chưa chọn ngày đăng ký";
  if (!form.value.tinhtrang) errs.tinhtrang = "Chưa chọn tình trạng";
  if (!form.value.ghichu?.trim()) errs.ghichu = "Ghi chú không được để trống";
  errors.value = errs;
  return Object.keys(errs).length === 0;
};

const openModal = () => Modal.getOrCreateInstance(document.getElementById("hoSoHocVienModal")).show();
const closeModal = () => Modal.getOrCreateInstance(document.getElementById("hoSoHocVienModal")).hide();

const openAdd = () => {
  isEdit.value = false;
  resetForm();
  openModal();
};

const openEdit = (row) => {
  isEdit.value = true;
  form.value = { mahs: row.mahs, mahv: row.mahv, ngaydangky: row.ngaydangky, tinhtrang: row.tinhtrang, ghichu: row.ghichu };
  errors.value = {};
  openModal();
};

const openDetail = (row) => {
  detail.value = row;
  Modal.getOrCreateInstance(document.getElementById("hoSoDetailModal")).show();
};

const photoUrl = (file) => file ? `http://localhost:8080/api/files/${encodeURIComponent(file)}` : "";

const saveData = async () => {
  if (!validate()) return;
  saving.value = true;
  try {
    const data = { mahs: form.value.mahs, hocVien: { mahv: Number(form.value.mahv) }, ngaydangky: form.value.ngaydangky, tinhtrang: form.value.tinhtrang, ghichu: form.value.ghichu };
    if (isEdit.value) {
      await updateData("/ho-so-hoc-vien", form.value.mahs, data);
      window.$toast?.add("Cập nhật thành công", "success");
    } else {
      await createData("/ho-so-hoc-vien", data);
      window.$toast?.add("Thêm hồ sơ thành công", "success");
    }
    closeModal();
    await loadData();
  } catch (e) {
    console.log(e);
    window.$toast?.add("Lưu thất bại", "error");
  } finally {
    saving.value = false;
  }
};

onMounted(async () => {
  await loadHocVien();
  await loadData();
});
</script>

<style scoped>
.card { transition: transform 0.2s, box-shadow 0.2s; }
.card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important; }
</style>
