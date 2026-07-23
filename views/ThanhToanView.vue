<template>
  <div>
    <div class="row g-3 mb-4">
      <div class="col-md-3 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#0d6efd,#0a58ca)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-receipt fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ rows.length }}</h3><small class="opacity-75">Tổng GD</small></div>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#198754,#146c43)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-check-circle fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ filterCount('Đã thanh toán') }}</h3><small class="opacity-75">Đã TT</small></div>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#dc3545,#b82d3f)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-x-circle fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ filterCount('Chưa thanh toán') }}</h3><small class="opacity-75">Chưa TT</small></div>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#ffc107,#e0a800)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-cash-stack fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ totalAmount }}</h3><small class="opacity-75">Tổng tiền</small></div>
          </div>
        </div>
      </div>
    </div>

    <SimpleTablePage
      title="Quản lý thanh toán"
      subtitle="Danh sách thanh toán học phí của học viên"
      search-placeholder="Tìm kiếm thanh toán..."
      endpoint="/thanh-toan"
      id-key="matt"
      :columns="columns"
      :rows="rows"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    >
      <template #cell-trangthai="{ value }">
        <span class="badge rounded-pill px-3 py-2" :class="trangThaiBadge(value)">{{ value }}</span>
      </template>
      <template #cell-phuongthuc="{ value }">
        <span class="badge rounded-pill px-3 py-2 bg-opacity-10" :class="value === 'Chuyển khoản' ? 'bg-primary text-primary' : value === 'Tiền mặt' ? 'bg-success text-success' : 'bg-info text-info'">{{ value }}</span>
      </template>
      <template #cell-sotien="{ value }">
        {{ value ? Number(value).toLocaleString('vi-VN') + '₫' : '' }}
      </template>
      <template #cell-ngaythanhtoan="{ value }">
        {{ formatDate(value) }}
      </template>
      <template #empty-state>
        <i class="bi bi-receipt display-1 text-muted"></i>
        <p class="text-muted mt-2 mb-0">Chưa có giao dịch nào</p>
        <button class="btn btn-primary mt-3 rounded-pill" @click="openAdd"><i class="bi bi-plus-lg me-1"></i> Thêm giao dịch đầu tiên</button>
      </template>
    </SimpleTablePage>

    <div class="modal fade" id="thanhToanModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 shadow rounded-4 overflow-hidden">
          <div class="modal-header border-bottom-0 pb-0" :class="isEdit ? 'bg-warning-subtle' : 'bg-primary-subtle'">
            <h5 class="modal-title fw-bold">
              <i :class="isEdit ? 'bi bi-pencil-square text-warning' : 'bi bi-plus-circle text-primary'" class="me-2"></i>
              {{ isEdit ? 'Sửa thanh toán' : 'Thêm thanh toán' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-person me-1"></i>Học viên <span class="text-danger">*</span></label>
                <select v-model="form.mahv" class="form-select" :class="errors.mahv ? 'is-invalid' : ''">
                  <option value="">-- Chọn học viên --</option>
                  <option v-for="hv in hocVienList" :key="hv.mahv" :value="hv.mahv">{{ hv.hoten }} - {{ maskCccd(hv.cccd) }}</option>
                </select>
                <div v-if="errors.mahv" class="invalid-feedback">{{ errors.mahv }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-book me-1"></i>Đăng ký KH <span class="text-danger">*</span></label>
                <select v-model="form.madk" class="form-select" :class="errors.madk ? 'is-invalid' : ''">
                  <option value="">-- Chọn ĐK khóa học --</option>
                  <option v-for="dk in dangKyList" :key="dk.madk" :value="dk.madk">{{ dk.hocVien?.hoten }} - {{ dk.khoaHoc?.tenkhoahoc }}</option>
                </select>
                <div v-if="errors.madk" class="invalid-feedback">{{ errors.madk }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-calendar me-1"></i>Ngày TT <span class="text-danger">*</span></label>
                <input v-model="form.ngaythanhtoan" type="date" class="form-control" :class="errors.ngaythanhtoan ? 'is-invalid' : ''" />
                <div v-if="errors.ngaythanhtoan" class="invalid-feedback">{{ errors.ngaythanhtoan }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-cash me-1"></i>Số tiền <span class="text-danger">*</span></label>
                <input v-model="form.sotien" type="number" class="form-control" placeholder="Nhập số tiền" :class="errors.sotien ? 'is-invalid' : ''" />
                <div v-if="errors.sotien" class="invalid-feedback">{{ errors.sotien }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-credit-card me-1"></i>Phương thức <span class="text-danger">*</span></label>
                <select v-model="form.phuongthuc" class="form-select" :class="errors.phuongthuc ? 'is-invalid' : ''">
                <option value="">-- Chọn PT --</option>
                <option v-for="item in ptThanhToanOptions" :key="item.ma" :value="item.ma">{{ item.ten }}</option>
                </select>
                <div v-if="errors.phuongthuc" class="invalid-feedback">{{ errors.phuongthuc }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-flag me-1"></i>Trạng thái <span class="text-danger">*</span></label>
                <select v-model="form.trangthai" class="form-select" :class="errors.trangthai ? 'is-invalid' : ''">
                <option value="">-- Chọn TT --</option>
                <option v-for="item in trangThaiTtOptions" :key="item.ma" :value="item.ma">{{ item.ten }}</option>
                </select>
                <div v-if="errors.trangthai" class="invalid-feedback">{{ errors.trangthai }}</div>
              </div>
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
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { Modal } from "bootstrap";
import api from "../services/api";
import SimpleTablePage from "../components/common/SimpleTablePage.vue";
import { getAll, createData, updateData } from "../services/crudService";

const columns = [
  { key: "matt", label: "Mã TT" },
  { key: "hocvien", label: "Học viên" },
  { key: "khoahoc", label: "Khóa học" },
  { key: "ngaythanhtoan", label: "Ngày TT" },
  { key: "sotien", label: "Số tiền" },
  { key: "phuongthuc", label: "PT" },
  { key: "trangthai", label: "Trạng thái" },
];

const ptThanhToanOptions = ref([]);
const trangThaiTtOptions = ref([]);

const rows = ref([]);
const hocVienList = ref([]);
const dangKyList = ref([]);
const isEdit = ref(false);
const saving = ref(false);

const form = ref({ matt: null, mahv: "", madk: "", ngaythanhtoan: "", sotien: "", phuongthuc: "", trangthai: "" });
const errors = ref({});

const filterCount = (s) => rows.value.filter((r) => r.trangthai === s).length;

const totalAmount = computed(() => {
  const total = rows.value.reduce((sum, r) => sum + (Number(r.sotien) || 0), 0);
  return total.toLocaleString("vi-VN") + "₫";
});

const formatDate = (d) => {
  if (!d) return "";
  return new Date(d + "T00:00:00").toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const maskCccd = (cccd) => {
  if (!cccd) return "";
  if (cccd.length <= 4) return "****";
  return cccd.slice(0, 2) + "****" + cccd.slice(-2);
};

const trangThaiBadge = (t) => {
  const map = { "Đã thanh toán": "bg-success bg-opacity-10 text-success", "Chưa thanh toán": "bg-danger bg-opacity-10 text-danger", "Thanh toán một phần": "bg-warning bg-opacity-10 text-warning" };
  return map[t] || "bg-secondary bg-opacity-10 text-secondary";
};

const loadData = async () => {
  try {
    const res = await getAll("/thanh-toan");
    rows.value = (res.data || []).map((item) => ({
      matt: item.matt, hocvien: item.hocVien?.hoten || "", khoahoc: item.dangKyKhoaHoc?.khoaHoc?.tenkhoahoc || "",
      ngaythanhtoan: item.ngaythanhtoan, sotien: item.sotien, phuongthuc: item.phuongthuc, trangthai: item.trangthai,
      mahv: item.hocVien?.mahv || "", madk: item.dangKyKhoaHoc?.madk || "",
    }));
  } catch (e) { console.log(e); window.$toast?.add("Không thể tải dữ liệu thanh toán", "error"); }
};

const loadHocVien = async () => { try { hocVienList.value = (await getAll("/hoc-vien")).data || []; } catch (e) { console.log(e); } };
const loadDangKy = async () => { try { dangKyList.value = (await getAll("/dang-ky-khoa-hoc")).data || []; } catch (e) { console.log(e); } };

const resetForm = () => { form.value = { matt: null, mahv: "", madk: "", ngaythanhtoan: "", sotien: "", phuongthuc: "", trangthai: "" }; errors.value = {}; };

const validate = () => {
  const e = {};
  if (!form.value.mahv) e.mahv = "Chưa chọn học viên";
  if (!form.value.madk) e.madk = "Chưa chọn ĐK khóa học";
  if (!form.value.ngaythanhtoan) e.ngaythanhtoan = "Chưa chọn ngày";
  if (!form.value.sotien || Number(form.value.sotien) <= 0) e.sotien = "Số tiền phải lớn hơn 0";
  if (!form.value.phuongthuc) e.phuongthuc = "Chưa chọn phương thức";
  if (!form.value.trangthai) e.trangthai = "Chưa chọn trạng thái";
  errors.value = e;
  return Object.keys(e).length === 0;
};

const openModal = () => Modal.getOrCreateInstance(document.getElementById("thanhToanModal")).show();
const closeModal = () => Modal.getOrCreateInstance(document.getElementById("thanhToanModal")).hide();

const openAdd = () => { isEdit.value = false; resetForm(); openModal(); };
const openEdit = (row) => {
  isEdit.value = true;
  form.value = { matt: row.matt, mahv: row.mahv, madk: row.madk, ngaythanhtoan: row.ngaythanhtoan, sotien: row.sotien, phuongthuc: row.phuongthuc, trangthai: row.trangthai };
  errors.value = {};
  openModal();
};

const saveData = async () => {
  if (!validate()) return;
  saving.value = true;
  try {
    const data = {
      matt: form.value.matt, hocVien: { mahv: Number(form.value.mahv) }, dangKyKhoaHoc: { madk: Number(form.value.madk) },
      ngaythanhtoan: form.value.ngaythanhtoan, sotien: Number(form.value.sotien), phuongthuc: form.value.phuongthuc, trangthai: form.value.trangthai,
    };
    if (isEdit.value) { await updateData("/thanh-toan", form.value.matt, data); window.$toast?.add("Cập nhật thành công", "success"); }
    else { await createData("/thanh-toan", data); window.$toast?.add("Thêm thanh toán thành công", "success"); }
    closeModal(); await loadData();
  } catch (e) { console.log(e); window.$toast?.add("Lưu thất bại", "error"); }
  finally { saving.value = false; }
};

onMounted(async () => {
  await Promise.all([loadHocVien(), loadDangKy(), loadDanhMuc()]);
  await loadData();
});
</script>

<style scoped>
.card { transition: transform 0.2s, box-shadow 0.2s; }
.card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important; }
</style>
