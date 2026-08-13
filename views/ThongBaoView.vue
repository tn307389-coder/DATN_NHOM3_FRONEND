<template>
  <div>
    <div class="row g-3 mb-4">
      <div class="col-md-4 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#0d6efd,#0a58ca)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-bell fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ filterCount.all }}</h3><small class="opacity-75">Tổng TB</small></div>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#198754,#146c43)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-mortarboard fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ filterCount.hocVien }}</h3><small class="opacity-75">HV</small></div>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#ffc107,#e0a800)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-person-workspace fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ filterCount.giaoVien }}</h3><small class="opacity-75">GV</small></div>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-between align-items-center mb-3">
      <div class="text-muted small">
        <i class="bi bi-envelope-paper me-1"></i> Gửi email thông báo kỳ đóng học phần đến học viên
      </div>
      <button class="btn btn-primary rounded-pill px-3" @click="openEmailModal">
        <i class="bi bi-envelope-arrow-up me-1"></i> Gửi email kỳ đóng học phần
      </button>
    </div>

    <SimpleTablePage
      title="Quản lý thông báo"
      subtitle="Thông báo gửi đến học viên và giáo viên"
      search-placeholder="Tìm kiếm thông báo..."
      endpoint="/thong-bao"
      id-key="matb"
      :columns="columns"
      :rows="rows"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    >
      <template #cell-doituong="{ value }">
        <span class="badge rounded-pill px-3 py-2" :class="doiTuongBadge(value)">{{ value }}</span>
      </template>
      <template #cell-ngaytao="{ value }">
        {{ formatDateTime(value) }}
      </template>
      <template #cell-tieude="{ value }">
        {{ value && value.length > 60 ? value.slice(0,60) + '...' : value || '' }}
      </template>
      <template #empty-state>
        <i class="bi bi-bell display-1 text-muted"></i>
        <p class="text-muted mt-2 mb-0">Chưa có thông báo nào</p>
        <button class="btn btn-primary mt-3 rounded-pill" @click="openAdd"><i class="bi bi-plus-lg me-1"></i> Thêm TB đầu tiên</button>
      </template>
    </SimpleTablePage>

    <div class="modal fade" id="thongBaoModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow rounded-4 overflow-hidden">
          <div class="modal-header border-bottom-0 pb-0" :class="isEdit ? 'bg-warning-subtle' : 'bg-primary-subtle'">
            <h5 class="modal-title fw-bold">
              <i :class="isEdit ? 'bi bi-pencil-square text-warning' : 'bi bi-plus-circle text-primary'" class="me-2"></i>
              {{ isEdit ? 'Sửa thông báo' : 'Thêm thông báo' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <div class="mb-3">
              <label class="form-label fw-semibold small"><i class="bi bi-heading me-1"></i>Tiêu đề <span class="text-danger">*</span></label>
              <input v-model="form.tieude" class="form-control" placeholder="Nhập tiêu đề" :class="errors.tieude ? 'is-invalid' : ''" />
              <div v-if="errors.tieude" class="invalid-feedback">{{ errors.tieude }}</div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold small"><i class="bi bi-chat-dots me-1"></i>Nội dung <span class="text-danger">*</span></label>
              <textarea v-model="form.noidung" class="form-control" rows="5" placeholder="Nhập nội dung" :class="errors.noidung ? 'is-invalid' : ''"></textarea>
              <div v-if="errors.noidung" class="invalid-feedback">{{ errors.noidung }}</div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold small"><i class="bi bi-people me-1"></i>Đối tượng <span class="text-danger">*</span></label>
              <select v-model="form.doituong" class="form-select" :class="errors.doituong ? 'is-invalid' : ''">
                <option value="">-- Chọn --</option>
                <option value="Học viên">Học viên</option>
                <option value="Giáo viên">Giáo viên</option>
                <option value="Tất cả">Tất cả</option>
              </select>
              <div v-if="errors.doituong" class="invalid-feedback">{{ errors.doituong }}</div>
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

    <!-- Modal gửi email kỳ đóng học phần -->
    <div class="modal fade" id="emailModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0 shadow rounded-4 overflow-hidden">
          <div class="modal-header border-bottom-0 pb-0 bg-primary-subtle">
            <h5 class="modal-title fw-bold"><i class="bi bi-envelope-arrow-up text-primary me-2"></i>Gửi email kỳ đóng học phần</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-mortarboard me-1"></i>Khóa học</label>
                <select v-model="emailForm.makh" class="form-select" @change="previewEmail">
                  <option value="">-- Tất cả khóa học --</option>
                  <option v-for="kh in khoaHocList" :key="kh.makh" :value="kh.makh">{{ kh.tenkhoahoc }} [{{ kh.hangBang }}]</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-calendar-event me-1"></i>Hạn chốt</label>
                <input v-model="emailForm.hanChot" type="date" class="form-control" />
              </div>
              <div class="col-12">
                <label class="form-label fw-semibold small"><i class="bi bi-chat-dots me-1"></i>Nội dung (tùy chọn)</label>
                <textarea v-model="emailForm.noiDung" class="form-control" rows="4" placeholder="Nhập nội dung bổ sung..."></textarea>
              </div>
            </div>

            <div class="d-flex align-items-center gap-2 mt-3">
              <button class="btn btn-outline-primary btn-sm rounded-pill px-3" @click="previewEmail" :disabled="previewing">
                <span v-if="previewing" class="spinner-border spinner-border-sm"></span>
                <i v-else class="bi bi-eye me-1"></i>Xem trước người nhận
              </button>
              <span v-if="recipients.length > 0" class="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2">
                <i class="bi bi-people me-1"></i>{{ recipients.length }} học viên
              </span>
            </div>

            <div v-if="recipients.length > 0" class="recipient-box mt-3 p-3 rounded-3">
              <div class="small text-muted mb-2"><i class="bi bi-envelope me-1"></i>Danh sách Gmail nhận thông báo:</div>
              <div class="recipient-scroll">
                <div v-for="r in recipients" :key="r.email" class="recipient-row d-flex justify-content-between py-1 border-bottom">
                  <span class="small fw-semibold">{{ r.hoten }}</span>
                  <span class="small text-primary">{{ r.email }}</span>
                </div>
              </div>
            </div>

            <div v-if="emailError" class="alert alert-danger py-2 small mt-3 mb-0">{{ emailError }}</div>
            <div v-if="emailResult" class="alert alert-success py-2 small mt-3 mb-0">
              <i class="bi bi-check-circle me-1"></i>Đã gửi <strong>{{ emailResult.sent }}</strong> email
              <span v-if="emailResult.failedCount > 0">, thất bại <strong class="text-danger">{{ emailResult.failedCount }}</strong></span>
            </div>
          </div>
          <div class="modal-footer border-top-0 pt-0 px-4 pb-4">
            <button class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Đóng</button>
            <button class="btn btn-primary rounded-pill px-4" @click="sendEmail" :disabled="sending || recipients.length === 0">
              <span v-if="sending" class="spinner-border spinner-border-sm me-1"></span>
              <i v-else class="bi bi-send me-1"></i>Gửi email
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { Modal } from "bootstrap";
import SimpleTablePage from "../components/common/SimpleTablePage.vue";
import { getAll, createData, updateData } from "../services/crudService";
import { useSite } from "../composables/useSite";

const { khoaHocList, loadKhoaHocPublic, xemTruocNguoiNhan, guiThongBaoKyDong } = useSite();

const rows = ref([]);
const isEdit = ref(false);
const saving = ref(false);

const emailForm = ref({ makh: "", hanChot: "", noiDung: "" });
const recipients = ref([]);
const previewing = ref(false);
const sending = ref(false);
const emailError = ref("");
const emailResult = ref(null);

const form = ref({ matb: null, tieude: "", noidung: "", doituong: "" });
const errors = ref({});

const columns = [
  { key: "matb", label: "Mã" },
  { key: "tieude", label: "Tiêu đề" },
  { key: "doituong", label: "Đối tượng" },
  { key: "ngaytao", label: "Ngày tạo" },
];

const formatDateTime = (d) => {
  if (!d) return "";
  const date = new Date(d);
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

const filterCount = computed(() => ({
  all: rows.value.length,
  hocVien: rows.value.filter((r) => r.doituong === 'Học viên').length,
  giaoVien: rows.value.filter((r) => r.doituong === 'Giáo viên').length,
}));

const doiTuongBadge = (t) => {
  const map = { "Tất cả": "bg-primary bg-opacity-10 text-primary", "Học viên": "bg-success bg-opacity-10 text-success", "Giáo viên": "bg-warning bg-opacity-10 text-warning" };
  return map[t] || "bg-secondary bg-opacity-10 text-secondary";
};

const loadData = async () => {
  try { rows.value = (await getAll("/thong-bao")).data || []; }
  catch (e) { console.log(e); window.$toast?.add("Không thể tải dữ liệu", "error"); }
};

const resetForm = () => { form.value = { matb: null, tieude: "", noidung: "", doituong: "" }; errors.value = {}; };

const validate = () => {
  const e = {};
  if (!form.value.tieude?.trim()) e.tieude = "Tiêu đề không được để trống";
  if (!form.value.noidung?.trim()) e.noidung = "Nội dung không được để trống";
  if (!form.value.doituong) e.doituong = "Chưa chọn đối tượng";
  errors.value = e;
  return Object.keys(e).length === 0;
};

const openModal = () => Modal.getOrCreateInstance(document.getElementById("thongBaoModal")).show();
const closeModal = () => Modal.getOrCreateInstance(document.getElementById("thongBaoModal")).hide();

const openAdd = () => { isEdit.value = false; resetForm(); openModal(); };
const openEdit = (row) => { isEdit.value = true; form.value = { ...row, noidung: row.noidung || "" }; errors.value = {}; openModal(); };

const saveData = async () => {
  if (!validate()) return;
  saving.value = true;
  try {
    const data = { matb: form.value.matb, tieude: form.value.tieude, noidung: form.value.noidung, doituong: form.value.doituong };
    if (isEdit.value) { await updateData("/thong-bao", form.value.matb, data); window.$toast?.add("Cập nhật thành công", "success"); }
    else { await createData("/thong-bao", data); window.$toast?.add("Thêm thông báo thành công", "success"); }
    closeModal(); await loadData();
  } catch (e) { console.log(e); window.$toast?.add("Lưu thất bại", "error"); }
  finally { saving.value = false; }
};

const openEmailModal = () => {
  emailForm.value = { makh: "", hanChot: "", noiDung: "" };
  recipients.value = [];
  emailError.value = "";
  emailResult.value = null;
  if (!khoaHocList.value.length) loadKhoaHocPublic();
  Modal.getOrCreateInstance(document.getElementById("emailModal")).show();
};

const previewEmail = async () => {
  previewing.value = true;
  emailError.value = "";
  emailResult.value = null;
  try {
    const res = await xemTruocNguoiNhan(emailForm.value.makh || null);
    if (res.success) {
      recipients.value = res.recipients || [];
      if (!recipients.value.length) emailError.value = "Không có học viên nào nhận thông báo";
    } else {
      emailError.value = res.message || "Không thể tải danh sách người nhận";
      recipients.value = [];
    }
  } catch (e) {
    emailError.value = "Không thể tải danh sách người nhận";
    recipients.value = [];
  } finally {
    previewing.value = false;
  }
};

const sendEmail = async () => {
  sending.value = true;
  emailError.value = "";
  emailResult.value = null;
  try {
    const res = await guiThongBaoKyDong({
      makh: emailForm.value.makh || null,
      hanChot: emailForm.value.hanChot || "",
      noiDung: emailForm.value.noiDung || "",
    });
    if (res.success) {
      emailResult.value = res;
    } else {
      emailError.value = res.message || "Gửi email thất bại";
    }
  } catch (e) {
    emailError.value = "Gửi email thất bại";
  } finally {
    sending.value = false;
  }
};

onMounted(() => { loadData(); loadKhoaHocPublic(); });
</script>

<style scoped>
.card { transition: transform 0.2s, box-shadow 0.2s; }
.card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important; }
.recipient-box { background: #f8fafc; border: 1px solid #e2e8f0; }
.recipient-scroll { max-height: 200px; overflow-y: auto; }
</style>
