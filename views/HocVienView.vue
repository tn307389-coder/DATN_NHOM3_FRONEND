<template>
  <div class="container-fluid">
    <h2 class="mb-4">Quản lý học viên</h2>

    <div class="card shadow">
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-md-4">
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-search"></i></span>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm (mã HV, họ tên, CCCD, SĐT...)"
                v-model="searchQuery"
              />
            </div>
          </div>
          <div class="col-md-8 text-end">
            <button class="btn btn-primary" @click="openAddModal">
              <i class="bi bi-plus-lg"></i> Thêm học viên
            </button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table table-bordered table-hover align-middle mb-0">
            <thead class="table-dark">
              <tr>
                <th>Mã HV</th>
                <th>Họ tên</th>
                <th>Ngày sinh</th>
                <th>Giới tính</th>
                <th>CCCD</th>
                <th>SĐT</th>
                <th>Địa chỉ</th>
                <th>Ngày đăng ký</th>
                <th>Mã CT Học</th>
                <th style="width:120px">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredList.length === 0">
                <td colspan="10" class="text-center text-muted py-4">
                  Không có dữ liệu
                </td>
              </tr>
              <tr v-for="item in filteredList" :key="item.maHV">
                <td>{{ item.maHV }}</td>
                <td>{{ item.hoTen }}</td>
                <td>{{ item.ngaySinh }}</td>
                <td>{{ item.gioiTinh }}</td>
                <td>{{ item.cccd }}</td>
                <td>{{ item.sdt }}</td>
                <td>{{ item.diaChi }}</td>
                <td>{{ item.ngayDangKy }}</td>
                <td>{{ item.maCTHoc }}</td>
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
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? 'Sửa học viên' : 'Thêm học viên' }}</h5>
            <button type="button" class="btn-close" @click="closeFormModal"></button>
          </div>
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-4">
                <label class="form-label">Mã học viên</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="form.maHV"
                  :disabled="isEditing"
                  required
                />
              </div>
              <div class="col-md-8">
                <label class="form-label">Họ tên</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="form.hoTen"
                  required
                />
              </div>
              <div class="col-md-4">
                <label class="form-label">Ngày sinh</label>
                <input
                  type="date"
                  class="form-control"
                  v-model="form.ngaySinh"
                  required
                />
              </div>
              <div class="col-md-4">
                <label class="form-label">Giới tính</label>
                <select class="form-select" v-model="form.gioiTinh">
                  <option value="">-- Chọn --</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label">CCCD</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="form.cccd"
                  required
                />
              </div>
              <div class="col-md-4">
                <label class="form-label">SĐT</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="form.sdt"
                  required
                />
              </div>
              <div class="col-md-8">
                <label class="form-label">Địa chỉ</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="form.diaChi"
                  required
                />
              </div>
              <div class="col-md-4">
                <label class="form-label">Ngày đăng ký</label>
                <input
                  type="date"
                  class="form-control"
                  v-model="form.ngayDangKy"
                  required
                />
              </div>
              <div class="col-md-4">
                <label class="form-label">Mã chương trình học</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="form.maCTHoc"
                  required
                />
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
            <p>Bạn có chắc chắn muốn xóa học viên <strong>{{ deleteTarget?.hoTen }}</strong> ({{ deleteTarget?.maHV }})?</p>
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
  maHV: "",
  hoTen: "",
  ngaySinh: "",
  gioiTinh: "",
  cccd: "",
  sdt: "",
  diaChi: "",
  ngayDangKy: "",
  maCTHoc: "",
});

const data = ref([
  { maHV: "HV001", hoTen: "Nguyễn Văn An", ngaySinh: "2000-01-15", gioiTinh: "Nam", cccd: "123456789", sdt: "0912345678", diaChi: "Hà Nội", ngayDangKy: "2026-01-10", maCTHoc: "CT001" },
  { maHV: "HV002", hoTen: "Trần Thị Bình", ngaySinh: "1999-05-20", gioiTinh: "Nữ", cccd: "987654321", sdt: "0987654321", diaChi: "TP. Hồ Chí Minh", ngayDangKy: "2026-02-15", maCTHoc: "CT002" },
  { maHV: "HV003", hoTen: "Lê Văn Cường", ngaySinh: "2001-08-10", gioiTinh: "Nam", cccd: "456789123", sdt: "0909090909", diaChi: "Đà Nẵng", ngayDangKy: "2026-03-05", maCTHoc: "CT001" },
]);

const filteredList = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return data.value;
  return data.value.filter(
    (item) =>
      item.maHV.toLowerCase().includes(q) ||
      item.hoTen.toLowerCase().includes(q) ||
      item.cccd.includes(q) ||
      item.sdt.includes(q)
  );
});

function resetForm() {
  form.value = {
    maHV: "",
    hoTen: "",
    ngaySinh: "",
    gioiTinh: "",
    cccd: "",
    sdt: "",
    diaChi: "",
    ngayDangKy: "",
    maCTHoc: "",
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
  editingIndex.value = data.value.findIndex((x) => x.maHV === item.maHV);
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
  const idx = data.value.findIndex((x) => x.maHV === deleteTarget.value.maHV);
  if (idx !== -1) data.value.splice(idx, 1);
  closeDeleteModal();
}
</script>
