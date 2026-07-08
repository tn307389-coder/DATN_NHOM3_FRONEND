<template>
  <div>
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
    />

    <div class="modal fade" id="thanhToanModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEdit ? "Sửa thanh toán" : "Thêm thanh toán" }}
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
                <label class="form-label">Học viên</label>
                <select v-model="form.mahv" class="form-select">
                  <option value="">-- Chọn học viên --</option>

                  <option
                    v-for="hv in hocVienList"
                    :key="hv.mahv"
                    :value="hv.mahv"
                  >
                    {{ hv.hoten }} - {{ hv.cccd }}
                  </option>
                </select>
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Đăng ký khóa học</label>
                <select v-model="form.madk" class="form-select">
                  <option value="">-- Chọn đăng ký khóa học --</option>

                  <option
                    v-for="dk in dangKyList"
                    :key="dk.madk"
                    :value="dk.madk"
                  >
                    {{ dk.hocVien?.hoten }} - {{ dk.khoaHoc?.tenkhoahoc }}
                  </option>
                </select>
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Ngày thanh toán</label>
                <input
                  v-model="form.ngaythanhtoan"
                  type="date"
                  class="form-control"
                />
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Số tiền</label>
                <input
                  v-model="form.sotien"
                  type="number"
                  class="form-control"
                  placeholder="Nhập số tiền"
                />
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Phương thức</label>
                <select v-model="form.phuongthuc" class="form-select">
                  <option value="">-- Chọn phương thức --</option>
                  <option value="Tiền mặt">Tiền mặt</option>
                  <option value="Chuyển khoản">Chuyển khoản</option>
                  <option value="Ví điện tử">Ví điện tử</option>
                </select>
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Trạng thái</label>
                <select v-model="form.trangthai" class="form-select">
                  <option value="">-- Chọn trạng thái --</option>
                  <option value="Đã thanh toán">Đã thanh toán</option>
                  <option value="Chưa thanh toán">Chưa thanh toán</option>
                  <option value="Thanh toán một phần">Thanh toán một phần</option>
                </select>
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
  { key: "matt", label: "Mã TT" },
  { key: "hocvien", label: "Học viên" },
  { key: "khoahoc", label: "Khóa học" },
  { key: "ngaythanhtoan", label: "Ngày thanh toán" },
  { key: "sotienText", label: "Số tiền" },
  { key: "phuongthuc", label: "Phương thức" },
  { key: "trangthai", label: "Trạng thái" },
];

const rows = ref([]);
const hocVienList = ref([]);
const dangKyList = ref([]);

const isEdit = ref(false);

const form = ref({
  matt: null,
  mahv: "",
  madk: "",
  ngaythanhtoan: "",
  sotien: "",
  phuongthuc: "",
  trangthai: "",
});

const loadData = async () => {
  try {
    const res = await getAll("/thanh-toan");

    rows.value = res.data.map((item) => ({
      matt: item.matt,
      hocvien: item.hocVien?.hoten || "",
      khoahoc: item.dangKyKhoaHoc?.khoaHoc?.tenkhoahoc || "",
      ngaythanhtoan: item.ngaythanhtoan,
      sotien: item.sotien,
      sotienText: item.sotien
        ? item.sotien.toLocaleString("vi-VN") + "đ"
        : "",
      phuongthuc: item.phuongthuc,
      trangthai: item.trangthai,

      mahv: item.hocVien?.mahv || "",
      madk: item.dangKyKhoaHoc?.madk || "",
    }));
  } catch (error) {
    console.log(error);
    alert("Không thể tải dữ liệu thanh toán");
  }
};

const loadHocVien = async () => {
  const res = await getAll("/hoc-vien");
  hocVienList.value = res.data;
};

const loadDangKy = async () => {
  const res = await getAll("/dang-ky-khoa-hoc");
  dangKyList.value = res.data;
};

const resetForm = () => {
  form.value = {
    matt: null,
    mahv: "",
    madk: "",
    ngaythanhtoan: "",
    sotien: "",
    phuongthuc: "",
    trangthai: "",
  };
};

const openModal = () => {
  const modalElement = document.getElementById("thanhToanModal");
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
};

const closeModal = () => {
  const modalElement = document.getElementById("thanhToanModal");
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

  form.value = {
    matt: row.matt,
    mahv: row.mahv,
    madk: row.madk,
    ngaythanhtoan: row.ngaythanhtoan,
    sotien: row.sotien,
    phuongthuc: row.phuongthuc,
    trangthai: row.trangthai,
  };

  openModal();
};

const saveData = async () => {
  if (!form.value.mahv) {
    alert("Vui lòng chọn học viên");
    return;
  }

  if (!form.value.madk) {
    alert("Vui lòng chọn đăng ký khóa học");
    return;
  }

  if (!form.value.sotien) {
    alert("Vui lòng nhập số tiền");
    return;
  }

  try {
    const data = {
      matt: form.value.matt,
      hocVien: {
        mahv: Number(form.value.mahv),
      },
      dangKyKhoaHoc: {
        madk: Number(form.value.madk),
      },
      ngaythanhtoan: form.value.ngaythanhtoan,
      sotien: Number(form.value.sotien),
      phuongthuc: form.value.phuongthuc,
      trangthai: form.value.trangthai,
    };

    if (isEdit.value) {
      await updateData("/thanh-toan", form.value.matt, data);
      alert("Cập nhật thành công");
    } else {
      await createData("/thanh-toan", data);
      alert("Thêm thành công");
    }

    closeModal();
    await loadData();
  } catch (error) {
    console.log(error);
    alert("Lưu thất bại");
  }
};

onMounted(async () => {
  await loadHocVien();
  await loadDangKy();
  await loadData();
});
</script>