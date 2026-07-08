<template>
  <div>
    <SimpleTablePage
      title="Quản lý chương trình học"
      subtitle="Danh sách chương trình đào tạo lái xe"
      search-placeholder="Tìm kiếm chương trình học..."
      endpoint="/chuong-trinh-hoc"
      id-key="macth"
      :columns="columns"
      :rows="rows"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    />

    <div class="modal fade" id="chuongTrinhHocModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEdit ? "Sửa chương trình học" : "Thêm chương trình học" }}
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
                <label class="form-label">Tên chương trình</label>
                <input
                  v-model="form.tenchuongtrinh"
                  class="form-control"
                  placeholder="Nhập tên chương trình"
                />
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Hạng bằng</label>
                <select v-model="form.hangbang" class="form-select">
                  <option value="">-- Chọn hạng bằng --</option>
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                </select>
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Học phí</label>
                <input
                  v-model="form.hocphi"
                  type="number"
                  class="form-control"
                  placeholder="Nhập học phí"
                />
              </div>

              <div class="col-md-3 mb-3">
                <label class="form-label">Buổi lý thuyết</label>
                <input
                  v-model="form.sobuoilythuyet"
                  type="number"
                  class="form-control"
                  placeholder="Số buổi"
                />
              </div>

              <div class="col-md-3 mb-3">
                <label class="form-label">Buổi thực hành</label>
                <input
                  v-model="form.sobuoithuchanh"
                  type="number"
                  class="form-control"
                  placeholder="Số buổi"
                />
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
  { key: "macth", label: "Mã CT" },
  { key: "tenchuongtrinh", label: "Tên chương trình" },
  { key: "hangbang", label: "Hạng bằng" },
  { key: "hocphiText", label: "Học phí" },
  { key: "sobuoilythuyet", label: "Buổi lý thuyết" },
  { key: "sobuoithuchanh", label: "Buổi thực hành" },
];

const rows = ref([]);

const isEdit = ref(false);

const form = ref({
  macth: null,
  tenchuongtrinh: "",
  hangbang: "",
  hocphi: "",
  sobuoilythuyet: "",
  sobuoithuchanh: "",
});

const loadData = async () => {
  try {
    const res = await getAll("/chuong-trinh-hoc");

    rows.value = res.data.map((item) => ({
      ...item,
      hocphiText: item.hocphi
        ? item.hocphi.toLocaleString("vi-VN") + "đ"
        : "",
    }));
  } catch (error) {
    console.log(error);
    alert("Không thể tải dữ liệu chương trình học");
  }
};

const resetForm = () => {
  form.value = {
    macth: null,
    tenchuongtrinh: "",
    hangbang: "",
    hocphi: "",
    sobuoilythuyet: "",
    sobuoithuchanh: "",
  };
};

const openModal = () => {
  const modalElement = document.getElementById("chuongTrinhHocModal");
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
};

const closeModal = () => {
  const modalElement = document.getElementById("chuongTrinhHocModal");
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
    macth: row.macth,
    tenchuongtrinh: row.tenchuongtrinh,
    hangbang: row.hangbang,
    hocphi: row.hocphi,
    sobuoilythuyet: row.sobuoilythuyet,
    sobuoithuchanh: row.sobuoithuchanh,
  };

  openModal();
};

const saveData = async () => {
  if (!form.value.tenchuongtrinh) {
    alert("Vui lòng nhập tên chương trình");
    return;
  }

  if (!form.value.hangbang) {
    alert("Vui lòng chọn hạng bằng");
    return;
  }

  try {
    const data = {
      macth: form.value.macth,
      tenchuongtrinh: form.value.tenchuongtrinh,
      hangbang: form.value.hangbang,
      hocphi: form.value.hocphi ? Number(form.value.hocphi) : null,
      sobuoilythuyet: form.value.sobuoilythuyet
        ? Number(form.value.sobuoilythuyet)
        : null,
      sobuoithuchanh: form.value.sobuoithuchanh
        ? Number(form.value.sobuoithuchanh)
        : null,
    };

    if (isEdit.value) {
      await updateData("/chuong-trinh-hoc", form.value.macth, data);
      alert("Cập nhật thành công");
    } else {
      await createData("/chuong-trinh-hoc", data);
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