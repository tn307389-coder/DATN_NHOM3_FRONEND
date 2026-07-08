<template>
  <div>
    <SimpleTablePage
      title="Quản lý hồ sơ học viên"
      subtitle="Danh sách hồ sơ đăng ký của học viên"
      search-placeholder="Tìm kiếm hồ sơ học viên..."
      endpoint="/ho-so-hoc-vien"
      id-key="mahs"
      :columns="columns"
      :rows="rows"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    />

    <div class="modal fade" id="hoSoHocVienModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEdit ? "Sửa hồ sơ học viên" : "Thêm hồ sơ học viên" }}
            </h5>

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div class="modal-body">
            <div class="mb-3">
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

            <div class="mb-3">
              <label class="form-label">Ngày đăng ký</label>
              <input
                v-model="form.ngaydangky"
                type="date"
                class="form-control"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Tình trạng</label>
              <select v-model="form.tinhtrang" class="form-select">
                <option value="">-- Chọn tình trạng --</option>
                <option value="Đang xử lý">Đang xử lý</option>
                <option value="Đã duyệt">Đã duyệt</option>
                <option value="Bổ sung hồ sơ">Bổ sung hồ sơ</option>
                <option value="Từ chối">Từ chối</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Ghi chú</label>
              <textarea
                v-model="form.ghichu"
                class="form-control"
                rows="3"
                placeholder="Nhập ghi chú"
              ></textarea>
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

const form = ref({
  mahs: null,
  mahv: "",
  ngaydangky: "",
  tinhtrang: "",
  ghichu: "",
});

const loadData = async () => {
  try {
    const res = await getAll("/ho-so-hoc-vien");

    rows.value = res.data.map((item) => ({
      ...item,
      hocvien: item.hocVien?.hoten || "",
      cccd: item.hocVien?.cccd || "",
      mahv: item.hocVien?.mahv || "",
    }));
  } catch (error) {
    console.log(error);
    alert("Không thể tải dữ liệu hồ sơ học viên");
  }
};

const loadHocVien = async () => {
  try {
    const res = await getAll("/hoc-vien");
    hocVienList.value = res.data;
  } catch (error) {
    console.log(error);
    alert("Không thể tải dữ liệu học viên");
  }
};

const resetForm = () => {
  form.value = {
    mahs: null,
    mahv: "",
    ngaydangky: "",
    tinhtrang: "",
    ghichu: "",
  };
};

const openModal = () => {
  const modalElement = document.getElementById("hoSoHocVienModal");
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
};

const closeModal = () => {
  const modalElement = document.getElementById("hoSoHocVienModal");
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
    mahs: row.mahs,
    mahv: row.mahv,
    ngaydangky: row.ngaydangky,
    tinhtrang: row.tinhtrang,
    ghichu: row.ghichu,
  };

  openModal();
};

const saveData = async () => {
  if (!form.value.mahv) {
    alert("Vui lòng chọn học viên");
    return;
  }

  if (!form.value.ngaydangky) {
    alert("Vui lòng chọn ngày đăng ký");
    return;
  }

  try {
    const data = {
      mahs: form.value.mahs,
      hocVien: {
        mahv: Number(form.value.mahv),
      },
      ngaydangky: form.value.ngaydangky,
      tinhtrang: form.value.tinhtrang,
      ghichu: form.value.ghichu,
    };

    if (isEdit.value) {
      await updateData("/ho-so-hoc-vien", form.value.mahs, data);
      alert("Cập nhật thành công");
    } else {
      await createData("/ho-so-hoc-vien", data);
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
  await loadData();
});
</script>