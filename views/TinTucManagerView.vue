<template>
  <div>
    <SimpleTablePage
      title="Quản lý tin tức"
      subtitle="Viết bài, chỉnh sửa và đăng tin tức"
      search-placeholder="Tìm kiếm tin tức..."
      endpoint="/tin-tuc"
      id-key="id"
      :columns="columns"
      :rows="rows"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    >
      <template #cell-trangthai="{ value }">
        <span class="badge rounded-pill px-3 py-2" :class="value === 'ĐÃ ĐĂNG' ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'">{{ value }}</span>
      </template>
      <template #cell-ngaydang="{ value }">
        {{ formatDate(value) }}
      </template>
      <template #cell-tieude="{ value }">
        {{ value && value.length > 60 ? value.slice(0,60) + '...' : value || '' }}
      </template>
      <template #empty-state>
        <i class="bi bi-newspaper display-1 text-muted"></i>
        <p class="text-muted mt-2 mb-0">Chưa có tin tức nào</p>
        <button class="btn btn-primary mt-3 rounded-pill" @click="openAdd"><i class="bi bi-plus-lg me-1"></i> Viết bài đầu tiên</button>
      </template>
    </SimpleTablePage>

    <div class="modal fade" id="tinTucModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 shadow rounded-4 overflow-hidden">
          <div class="modal-header border-bottom-0 pb-0" :class="isEdit ? 'bg-warning-subtle' : 'bg-primary-subtle'">
            <h5 class="modal-title fw-bold">
              <i :class="isEdit ? 'bi bi-pencil-square text-warning' : 'bi bi-plus-circle text-primary'" class="me-2"></i>
              {{ isEdit ? 'Sửa bài viết' : 'Viết bài mới' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <div class="mb-3">
              <label class="form-label fw-semibold small"><i class="bi bi-heading me-1"></i>Tiêu đề <span class="text-danger">*</span></label>
              <input v-model="form.tieude" class="form-control" placeholder="Nhập tiêu đề bài viết" :class="errors.tieude ? 'is-invalid' : ''" />
              <div v-if="errors.tieude" class="invalid-feedback">{{ errors.tieude }}</div>
            </div>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-image me-1"></i>Hình ảnh</label>
                <div class="d-flex gap-2 mb-1">
                  <input v-model="form.hinhanh" class="form-control" placeholder="URL ảnh hoặc upload" />
                  <button class="btn btn-outline-primary flex-shrink-0" type="button" @click="$refs.fileInput.click()" :disabled="uploading">
                    <span v-if="uploading" class="spinner-border spinner-border-sm"></span>
                    <i v-else class="bi bi-upload"></i>
                  </button>
                </div>
                <input ref="fileInput" type="file" accept="image/*" class="d-none" @change="uploadImage" />
                <img v-if="form.hinhanh" :src="form.hinhanh.startsWith('http') ? form.hinhanh : 'http://localhost:8081' + form.hinhanh" class="mt-1 rounded" style="max-height:80px;object-fit:cover" />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-person me-1"></i>Tác giả</label>
                <input v-model="form.tacgia" class="form-control" placeholder="Tên tác giả" />
              </div>
            </div>
            <div class="mb-3 mt-3">
              <label class="form-label fw-semibold small"><i class="bi bi-paragraph me-1"></i>Mô tả ngắn</label>
              <textarea v-model="form.motangan" class="form-control" rows="2" placeholder="Mô tả ngắn (hiển thị ở danh sách)"></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold small"><i class="bi bi-file-text me-1"></i>Nội dung <span class="text-danger">*</span></label>
              <textarea v-model="form.noidung" class="form-control" rows="8" placeholder="Nội dung bài viết..." :class="errors.noidung ? 'is-invalid' : ''"></textarea>
              <div v-if="errors.noidung" class="invalid-feedback">{{ errors.noidung }}</div>
            </div>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-flag me-1"></i>Trạng thái</label>
                <select v-model="form.trangthai" class="form-select">
                  <option value="ĐÃ ĐĂNG">Đã đăng</option>
                  <option value="NHÁP">Nháp</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-calendar me-1"></i>Ngày đăng</label>
                <input v-model="form.ngaydang" type="date" class="form-control" />
              </div>
            </div>
          </div>
          <div class="modal-footer border-top-0 pt-0 px-4 pb-4">
            <button class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Hủy</button>
            <button class="btn rounded-pill px-4" :class="isEdit ? 'btn-warning' : 'btn-primary'" @click="saveData" :disabled="saving">
              <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
              <i v-else :class="isEdit ? 'bi bi-check-lg' : 'bi bi-plus-lg'" class="me-1"></i>
              {{ isEdit ? 'Cập nhật' : 'Đăng bài' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { Modal } from "bootstrap";
import SimpleTablePage from "../components/common/SimpleTablePage.vue";
import { getAll, createData, updateData } from "../services/crudService";
import api from "../services/api";

const columns = [
  { key: "id", label: "ID" },
  { key: "tieude", label: "Tiêu đề" },
  { key: "tacgia", label: "Tác giả" },
  { key: "ngaydang", label: "Ngày đăng" },
  { key: "trangthai", label: "Trạng thái" },
];

const rows = ref([]);
const isEdit = ref(false);
const saving = ref(false);

const form = ref({ id: null, tieude: "", hinhanh: "", motangan: "", noidung: "", tacgia: "", trangthai: "ĐÃ ĐĂNG", ngaydang: "" });
const errors = ref({});
const uploading = ref(false);
const fileInput = ref(null);

const formatDate = (d) => {
  if (!d) return "";
  const date = new Date(d);
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const uploadImage = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  uploading.value = true;
  try {
    const fd = new FormData();
    fd.append("file", file);
    const res = await api.post("/upload/tin-tuc", fd, { headers: { "Content-Type": "multipart/form-data" } });
    if (res.data.success) form.value.hinhanh = res.data.url;
    else window.$toast?.add("Upload thất bại", "error");
  } catch (err) { window.$toast?.add("Upload thất bại", "error"); }
  finally { uploading.value = false; e.target.value = ""; }
};

const loadData = async () => {
  try { rows.value = (await getAll("/tin-tuc")).data || []; }
  catch (e) { console.log(e); window.$toast?.add("Không thể tải dữ liệu", "error"); }
};

const resetForm = () => {
  form.value = { id: null, tieude: "", hinhanh: "", motangan: "", noidung: "", tacgia: "", trangthai: "ĐÃ ĐĂNG", ngaydang: "" };
  errors.value = {};
};

const validate = () => {
  const e = {};
  if (!form.value.tieude?.trim()) e.tieude = "Tiêu đề không được để trống";
  if (!form.value.noidung?.trim()) e.noidung = "Nội dung không được để trống";
  errors.value = e;
  return Object.keys(e).length === 0;
};

const openModal = () => Modal.getOrCreateInstance(document.getElementById("tinTucModal")).show();
const closeModal = () => Modal.getOrCreateInstance(document.getElementById("tinTucModal")).hide();

const openAdd = () => { isEdit.value = false; resetForm(); openModal(); };
const openEdit = (row) => {
  isEdit.value = true;
  form.value = {
    id: row.id, tieude: row.tieude, hinhanh: row.hinhanh || "", motangan: row.motangan || "",
    noidung: row.noidung || "", tacgia: row.tacgia || "", trangthai: row.trangthai || "ĐÃ ĐĂNG",
    ngaydang: row.ngaydang ? row.ngaydang.slice(0, 10) : "",
  };
  errors.value = {};
  openModal();
};

const saveData = async () => {
  if (!validate()) return;
  saving.value = true;
  try {
    const data = {
      tieude: form.value.tieude, hinhanh: form.value.hinhanh || null, motangan: form.value.motangan || null,
      noidung: form.value.noidung, tacgia: form.value.tacgia || null, trangthai: form.value.trangthai,
      ngaydang: form.value.ngaydang || null,
    };
    if (isEdit.value) { await updateData("/tin-tuc", form.value.id, data); window.$toast?.add("Cập nhật thành công", "success"); }
    else { await createData("/tin-tuc", data); window.$toast?.add("Đăng bài thành công", "success"); }
    closeModal(); await loadData();
  } catch (e) { console.log(e); window.$toast?.add("Lưu thất bại", "error"); }
  finally { saving.value = false; }
};

onMounted(loadData);
</script>
