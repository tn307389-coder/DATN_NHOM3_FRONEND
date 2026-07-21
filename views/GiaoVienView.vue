<template>
  <div>
    <SimpleTablePage
      title="Quản lý giáo viên"
      subtitle="Danh sách giáo viên giảng dạy"
      search-placeholder="Tìm kiếm giáo viên..."
      endpoint="/giao-vien"
      id-key="magv"
      :columns="columns"
      :rows="rows"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    >
      <template #extra-actions="{ row }">
        <button
          class="btn btn-sm btn-info me-2"
          title="Xem học viên quản lý"
          @click="openThongKe(row)"
        >
          <i class="bi bi-people"></i>
        </button>
      </template>
    </SimpleTablePage>

    <div class="modal fade" id="thongKeModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              Thống kê học viên - {{ thongKe.hotenGiaoVien || "" }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div class="modal-body">
            <div class="row mb-4">
              <div class="col-md-4">
                <div class="card bg-primary text-white">
                  <div class="card-body text-center">
                    <h3 class="mb-0">{{ thongKe.tongSoHocVien }}</h3>
                    <small>Tổng học viên</small>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card bg-info text-white">
                  <div class="card-body text-center">
                    <h3 class="mb-0">{{ thongKe.soHocVienQuaLop }}</h3>
                    <small>Qua lớp học</small>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card bg-success text-white">
                  <div class="card-body text-center">
                    <h3 class="mb-0">{{ thongKe.soHocVienQuaPhanCong }}</h3>
                    <small>Qua phân công</small>
                  </div>
                </div>
              </div>
            </div>

            <h6 class="mb-3">Danh sách học viên</h6>
            <div class="table-responsive">
              <table class="table table-bordered table-hover align-middle">
                <thead class="table-light">
                  <tr>
                    <th>Mã HV</th>
                    <th>Họ tên</th>
                    <th>Số điện thoại</th>
                    <th>Nguồn</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="hv in thongKe.danhSachHocVien" :key="hv.mahv">
                    <td>{{ hv.mahv }}</td>
                    <td>{{ hv.hoten }}</td>
                    <td>{{ hv.sodienthoai }}</td>
                    <td>{{ hv.nguon }}</td>
                  </tr>
                  <tr v-if="!thongKe.danhSachHocVien || thongKe.danhSachHocVien.length === 0">
                    <td colspan="4" class="text-center text-muted py-3">
                      Giáo viên chưa quản lý học viên nào
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="giaoVienModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEdit ? "Sửa giáo viên" : "Thêm giáo viên" }}
            </h5>

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div class="modal-body">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Họ tên <span class="text-danger">*</span></label>
                <input
                  v-model="form.hoten"
                  class="form-control"
                  placeholder="Nhập họ tên giáo viên"
                  required
                />
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Ngày sinh <span class="text-danger">*</span></label>
                <input
                  v-model="form.ngaysinh"
                  type="date"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Giới tính <span class="text-danger">*</span></label>
                <select v-model="form.gioitinh" class="form-select" required>
                  <option value="">-- Chọn giới tính --</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Số điện thoại <span class="text-danger">*</span></label>
                <input
                  v-model="form.sodienthoai"
                  class="form-control"
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Email <span class="text-danger">*</span></label>
                <input
                  v-model="form.email"
                  type="email"
                  class="form-control"
                  placeholder="Nhập email"
                  required
                />
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Hạng dạy <span class="text-danger">*</span></label>
                <select v-model="form.hangday" class="form-select" required>
                  <option value="">-- Chọn hạng dạy --</option>
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                </select>
              </div>

              <div class="col-12 mb-3">
                <label class="form-label">Địa chỉ <span class="text-danger">*</span></label>
                <textarea
                  v-model="form.diachi"
                  class="form-control"
                  rows="3"
                  placeholder="Nhập địa chỉ"
                  required
                ></textarea>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">
              Hủy
            </button>

            <button class="btn btn-primary" @click="saveData">
              {{ isEdit ? "Cập nhật" : "Thêm mới" }}
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
import {
  getAll,
  createData,
  updateData,
} from "../services/crudService";
import { requiredError } from "../services/validation";
import api from "../services/api";

const columns = [
  { key: "magv", label: "Mã GV" },
  { key: "hoten", label: "Họ tên" },
  { key: "ngaysinh", label: "Ngày sinh" },
  { key: "gioitinh", label: "Giới tính" },
  { key: "sodienthoai", label: "Số điện thoại" },
  { key: "email", label: "Email" },
  { key: "diachi", label: "Địa chỉ" },
  { key: "hangday", label: "Hạng dạy" },
];

const rows = ref([]);

const isEdit = ref(false);

const thongKe = ref({
  magv: null,
  hotenGiaoVien: "",
  soHocVienQuaLop: 0,
  soHocVienQuaPhanCong: 0,
  tongSoHocVien: 0,
  danhSachHocVien: [],
});

const form = ref({
  magv: null,
  hoten: "",
  ngaysinh: "",
  gioitinh: "",
  sodienthoai: "",
  email: "",
  diachi: "",
  hangday: "",
});

const loadData = async () => {
  try {
    const res = await getAll("/giao-vien");
    rows.value = res.data;
  } catch (error) {
    console.log(error);
    alert("Không thể tải dữ liệu giáo viên");
  }
};

const openThongKe = async (row) => {
  try {
    const res = await api.get(`/giao-vien/${row.magv}/thong-ke-hoc-vien`);
    thongKe.value = res.data;
    const modalElement = document.getElementById("thongKeModal");
    Modal.getOrCreateInstance(modalElement).show();
  } catch (error) {
    console.log(error);
    alert("Không thể tải thống kê học viên");
  }
};

const resetForm = () => {
  form.value = {
    magv: null,
    hoten: "",
    ngaysinh: "",
    gioitinh: "",
    sodienthoai: "",
    email: "",
    diachi: "",
    hangday: "",
  };
};

const openModal = () => {
  const modalElement = document.getElementById("giaoVienModal");
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
};

const closeModal = () => {
  const modalElement = document.getElementById("giaoVienModal");
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.hide();
};

const openAdd = () => {
  isEdit.value = false;
  resetForm();
  openModal();
};

const openEdit = (row) => {
  isEdit.value = true;
  form.value = { ...row };
  openModal();
};

const requiredFields = [
  { key: "hoten", label: "Họ tên" },
  { key: "ngaysinh", label: "Ngày sinh" },
  { key: "gioitinh", label: "Giới tính" },
  { key: "sodienthoai", label: "Số điện thoại" },
  { key: "email", label: "Email" },
  { key: "hangday", label: "Hạng dạy" },
  { key: "diachi", label: "Địa chỉ" },
];

const saveData = async () => {
  const err = requiredError(form.value, requiredFields);
  if (err) {
    alert(err);
    return;
  }

  try {
    const data = {
      magv: form.value.magv,
      hoten: form.value.hoten,
      ngaysinh: form.value.ngaysinh,
      gioitinh: form.value.gioitinh,
      sodienthoai: form.value.sodienthoai,
      email: form.value.email,
      diachi: form.value.diachi,
      hangday: form.value.hangday,
    };

    if (isEdit.value) {
      await updateData("/giao-vien", form.value.magv, data);
      alert("Cập nhật thành công");
    } else {
      await createData("/giao-vien", data);
      alert("Thêm thành công");
    }

    closeModal();
    await loadData();
  } catch (error) {
    console.log(error);
    alert("Lưu thất bại");
  }
};

onMounted(() => {
  loadData();
});
</script>