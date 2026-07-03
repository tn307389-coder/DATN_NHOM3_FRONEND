<template>
  <div class="container-fluid">
    <h2 class="mb-4">Quản lý xe tập lái</h2>

    <div class="card shadow">
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-md-4">
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-search"></i></span>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm (mã xe, biển số, hãng xe...)"
                v-model="searchQuery"
              />
            </div>
          </div>
          <div class="col-md-8 text-end">
            <button class="btn btn-primary" @click="openAddModal">
              <i class="bi bi-plus-lg"></i> Thêm xe
            </button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table table-bordered table-hover align-middle mb-0">
            <thead class="table-dark">
              <tr>
                <th>Mã xe</th>
                <th>Biển số xe</th>
                <th>Hãng xe</th>
                <th>Năm SX</th>
                <th>Trạng thái</th>
                <th>Ghi chú</th>
                <th style="width:120px">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredList.length === 0">
                <td colspan="7" class="text-center text-muted py-4">
                  Không có dữ liệu
                </td>
              </tr>
              <tr v-for="item in filteredList" :key="item.maXe">
                <td>{{ item.maXe }}</td>
                <td>{{ item.bienSoXe }}</td>
                <td>{{ item.hangXe }}</td>
                <td>{{ item.namSanXuat }}</td>
                <td>
                  <span
                    class="badge"
                    :class="statusBadgeClass(item.trangThai)"
                  >
                    {{ item.trangThai }}
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
            <h5 class="modal-title">{{ isEditing ? 'Sửa xe' : 'Thêm xe' }}</h5>
            <button type="button" class="btn-close" @click="closeFormModal"></button>
          </div>
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Mã xe</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="form.maXe"
                  :disabled="isEditing"
                  required
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Biển số xe</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="form.bienSoXe"
                  required
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Hãng xe</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="form.hangXe"
                  required
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Năm sản xuất</label>
                <input
                  type="number"
                  class="form-control"
                  v-model="form.namSanXuat"
                  required
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Trạng thái</label>
                <select class="form-select" v-model="form.trangThai">
                  <option value="">-- Chọn --</option>
                  <option value="Sẵn sàng">Sẵn sàng</option>
                  <option value="Đang sử dụng">Đang sử dụng</option>
                  <option value="Bảo trì">Bảo trì</option>
                  <option value="Hỏng">Hỏng</option>
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
            <p>Bạn có chắc chắn muốn xóa xe <strong>{{ deleteTarget?.bienSoXe }}</strong> ({{ deleteTarget?.maXe }})?</p>
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
  maXe: "",
  bienSoXe: "",
  hangXe: "",
  namSanXuat: "",
  trangThai: "",
  ghiChu: "",
});

const data = ref([
  { maXe: "XE001", bienSoXe: "29A-12345", hangXe: "Toyota Vios", namSanXuat: 2022, trangThai: "Sẵn sàng", ghiChu: "" },
  { maXe: "XE002", bienSoXe: "51B-67890", hangXe: "Honda City", namSanXuat: 2023, trangThai: "Đang sử dụng", ghiChu: "Đang có học viên tập" },
  { maXe: "XE003", bienSoXe: "30C-54321", hangXe: "Mazda 3", namSanXuat: 2021, trangThai: "Bảo trì", ghiChu: "Thay dầu định kỳ" },
]);

const filteredList = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return data.value;
  return data.value.filter(
    (item) =>
      item.maXe.toLowerCase().includes(q) ||
      item.bienSoXe.toLowerCase().includes(q) ||
      item.hangXe.toLowerCase().includes(q)
  );
});

function statusBadgeClass(trangThai) {
  switch (trangThai) {
    case "Sẵn sàng": return "bg-success";
    case "Đang sử dụng": return "bg-warning text-dark";
    case "Bảo trì": return "bg-info text-dark";
    case "Hỏng": return "bg-danger";
    default: return "bg-secondary";
  }
}

function resetForm() {
  form.value = {
    maXe: "",
    bienSoXe: "",
    hangXe: "",
    namSanXuat: "",
    trangThai: "",
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
  editingIndex.value = data.value.findIndex((x) => x.maXe === item.maXe);
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
  const idx = data.value.findIndex((x) => x.maXe === deleteTarget.value.maXe);
  if (idx !== -1) data.value.splice(idx, 1);
  closeDeleteModal();
}
</script>
