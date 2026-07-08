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
    />

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
                <label class="form-label">Họ tên</label>
                <input
                  v-model="form.hoten"
                  class="form-control"
                  placeholder="Nhập họ tên giáo viên"
                />
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Ngày sinh</label>
                <input
                  v-model="form.ngaysinh"
                  type="date"
                  class="form-control"
                />
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Giới tính</label>
                <select v-model="form.gioitinh" class="form-select">
                  <option value="">-- Chọn giới tính --</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Số điện thoại</label>
                <input
                  v-model="form.sodienthoai"
                  class="form-control"
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Email</label>
                <input
                  v-model="form.email"
                  type="email"
                  class="form-control"
                  placeholder="Nhập email"
                />
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Hạng dạy</label>
                <select v-model="form.hangday" class="form-select">
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

              <div class="col-md-12 mb-3">
                <label class="form-label">Địa chỉ</label>
                <textarea
                  v-model="form.diachi"
                  class="form-control"
                  rows="3"
                  placeholder="Nhập địa chỉ"
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

const saveData = async () => {
  if (!form.value.hoten) {
    alert("Vui lòng nhập họ tên giáo viên");
    return;
  }

  if (!form.value.sodienthoai) {
    alert("Vui lòng nhập số điện thoại");
    return;
  }

  if (!form.value.hangday) {
    alert("Vui lòng chọn hạng dạy");
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