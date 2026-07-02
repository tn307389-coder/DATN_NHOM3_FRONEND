<template>
  <h2>Hồ sơ học viên</h2>
</template>
  <div class="container-fluid">
    <h2 class="mb-4">Quản lý hồ sơ học viên</h2>

    <div class="card shadow">
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-md-4">
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-search"></i></span>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm (mã hồ sơ, mã HV, tình trạng...)"
                v-model="searchQuery"
              />
            </div>
          </div>
          <div class="col-md-8 text-end">
            <button class="btn btn-primary" @click="openAddModal">
              <i class="bi bi-plus-lg"></i> Thêm hồ sơ
            </button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table table-bordered table-hover align-middle mb-0">
            <thead class="table-dark">
              <tr>
                <th>Mã hồ sơ</th>
                <th>Mã học viên</th>
                <th>Ngày đăng ký</th>
                <th>Tình trạng</th>
                <th>Ghi chú</th>
                <th style="width:120px">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredList.length === 0">
                <td colspan="6" class="text-center text-muted py-4">
                  Không có dữ liệu
                </td>
              </tr>
              <tr v-for="item in filteredList" :key="item.maHoSo">
                <td>{{ item.maHoSo }}</td>
                <td>{{ item.maHV }}</td>
                <td>{{ item.ngayDangKy }}</td>
                <td>
                  <span
                    class="badge"
                    :class="statusBadgeClass(item.tinhTrang)"
                  >
                    {{ item.tinhTrang }}
                  </span>
                </td>
                <td>{{ item.ghiChu }}</td>
                <td>
                  <button
                    class="btn btn-sm btn-warning me-1"
                    title="Sửa"
                    @click="openEditModal(item)"
                  >
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-danger"
                    title="Xóa"
                    @click="openDeleteModal(item)"
                  >
                    <i class="bi bi-trash3"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="showFormModal" class="modal d-block" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? 'Sửa hồ sơ' : 'Thêm hồ sơ' }}</h5>
            <button type="button" class="btn-close" @click="closeFormModal"></button>
          </div>
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Mã hồ sơ</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="form.maHoSo"
                  :disabled="isEditing"
                  required
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Mã học viên</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="form.maHV"
                  required
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Ngày đăng ký</label>
                <input
                  type="date"
                  class="form-control"
                  v-model="form.ngayDangKy"
                  required
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Tình trạng</label>
                <select class="form-select" v-model="form.tinhTrang">
                  <option value="">-- Chọn --</option>
                  <option value="Đang xử lý">Đang xử lý</option>
                  <option value="Đã duyệt">Đã duyệt</option>
                  <option value="Từ chối">Từ chối</option>
                  <option value="Hoàn thành">Hoàn thành</option>
                </select>
              </div>
              <div class="col-12">
                <label class="form-label">Ghi chú</label>
                <textarea
                  class="form-control"
                  rows="3"
                  v-model="form.ghiChu"
                ></textarea>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeFormModal">Hủy</button>
            <button type="button" class="btn btn-primary" @click="save">Lưu</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showFormModal" class="modal-backdrop fade show"></div>

    <div v-if="showDeleteModal" class="modal d-block" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Xác nhận xóa</h5>
            <button type="button" class="btn-close" @click="closeDeleteModal"></button>
          </div>
          <div class="modal-body">
            <p>Bạn có chắc chắn muốn xóa hồ sơ <strong>{{ deleteTarget?.maHoSo }}</strong>?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeDeleteModal">Hủy</button>
            <button type="button" class="btn btn-danger" @click="confirmDelete">Xóa</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showDeleteModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const searchQuery = ref("");
const showFormModal = ref(false);
const showDeleteModal = ref(false);
const isEditing = ref(false);
const deleteTarget = ref(null);
const editingIndex = ref(-1);

const form = ref({
  maHoSo: "",
  maHV: "",
  ngayDangKy: "",
  tinhTrang: "",
  ghiChu: "",
});

const data = ref([
  { maHoSo: "HS001", maHV: "HV001", ngayDangKy: "2026-01-10", tinhTrang: "Đang xử lý", ghiChu: "Chờ bổ sung CCCD" },
  { maHoSo: "HS002", maHV: "HV002", ngayDangKy: "2026-02-15", tinhTrang: "Đã duyệt", ghiChu: "" },
  { maHoSo: "HS003", maHV: "HV003", ngayDangKy: "2026-03-05", tinhTrang: "Hoàn thành", ghiChu: "Đã cấp GPLX" },
]);

const filteredList = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return data.value;
  return data.value.filter(
    (item) =>
      item.maHoSo.toLowerCase().includes(q) ||
      item.maHV.toLowerCase().includes(q) ||
      item.tinhTrang.toLowerCase().includes(q)
  );
});

function statusBadgeClass(tinhTrang) {
  switch (tinhTrang) {
    case "Đang xử lý": return "bg-warning text-dark";
    case "Đã duyệt": return "bg-success";
    case "Từ chối": return "bg-danger";
    case "Hoàn thành": return "bg-info text-dark";
    default: return "bg-secondary";
  }
}

function resetForm() {
  form.value = {
    maHoSo: "",
    maHV: "",
    ngayDangKy: "",
    tinhTrang: "",
    ghiChu: "",
  };
}

function openAddModal() {
  isEditing.value = false;
  editingIndex.value = -1;
  resetForm();
  showFormModal.value = true;
}

function openEditModal(item) {
  isEditing.value = true;
  editingIndex.value = data.value.findIndex((x) => x.maHoSo === item.maHoSo);
  form.value = { ...item };
  showFormModal.value = true;
}

function closeFormModal() {
  showFormModal.value = false;
}

function save() {
  if (isEditing.value) {
    data.value[editingIndex.value] = { ...form.value };
  } else {
    data.value.push({ ...form.value });
  }
  closeFormModal();
}

function openDeleteModal(item) {
  deleteTarget.value = item;
  showDeleteModal.value = true;
}

function closeDeleteModal() {
  deleteTarget.value = null;
  showDeleteModal.value = false;
}

function confirmDelete() {
  const idx = data.value.findIndex((x) => x.maHoSo === deleteTarget.value.maHoSo);
  if (idx !== -1) data.value.splice(idx, 1);
  closeDeleteModal();
}
</script>
