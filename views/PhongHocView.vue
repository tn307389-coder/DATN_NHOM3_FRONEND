<template>
  <div>
    <SimpleTablePage
      title="Quản lý phòng học"
      subtitle="Danh sách phòng học của trung tâm"
      search-placeholder="Tìm kiếm phòng học..."
      endpoint="/phong-hoc"
      id-key="maphong"
      :columns="columns"
      :rows="rows"
      :addable="!isHV"
      :editable="!isHV"
      :deletable="!isHV"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    />

    <div class="modal fade" id="phongHocModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEdit ? "Sửa phòng học" : "Thêm phòng học" }}
            </h5>

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Tên phòng <span class="text-danger">*</span></label>
              <input
                v-model="form.tenphong"
                class="form-control"
                placeholder="Ví dụ: Phòng 101"
                required
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Sức chứa <span class="text-danger">*</span></label>
              <input
                v-model="form.succhua"
                type="number"
                class="form-control"
                placeholder="Nhập sức chứa"
                required
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Trạng thái <span class="text-danger">*</span></label>
              <select v-model="form.trangthai" class="form-select" required>
                <option value="">-- Chọn trạng thái --</option>
                <option value="Đang sử dụng">Đang sử dụng</option>
                <option value="Trống">Trống</option>
                <option value="Bảo trì">Bảo trì</option>
              </select>
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
import { useMyScope } from "../composables/useMyScope";

const { isHV, myMalop, loadMyScope } = useMyScope();

const columns = [
  { key: "maphong", label: "Mã phòng" },
  { key: "tenphong", label: "Tên phòng" },
  { key: "succhua", label: "Sức chứa" },
  { key: "trangthai", label: "Trạng thái" },
];

const rows = ref([]);

const isEdit = ref(false);

const form = ref({
  maphong: null,
  tenphong: "",
  succhua: "",
  trangthai: "",
});

const loadData = async () => {
  try {
    const res = await getAll("/phong-hoc");
    let list = res.data;
    if (isHV.value && myMalop.value.length) {
      const lopSet = myMalop.value.map(String);
      const lich = (await getAll("/lich-hoc")).data || [];
      const myPhong = new Set(
        lich
          .filter((l) => l.lopHoc && lopSet.includes(String(l.lopHoc.malop)))
          .map((l) => l.phongHoc?.maphong)
          .filter(Boolean)
          .map(String)
      );
      list = list.filter((p) => myPhong.has(String(p.maphong)));
    }
    rows.value = list;
  } catch (error) {
    console.log(error);
    alert("Không thể tải dữ liệu phòng học");
  }
};

const resetForm = () => {
  form.value = {
    maphong: null,
    tenphong: "",
    succhua: "",
    trangthai: "",
  };
};

const openModal = () => {
  const modalElement = document.getElementById("phongHocModal");
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
};

const closeModal = () => {
  const modalElement = document.getElementById("phongHocModal");
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
  { key: "tenphong", label: "Tên phòng" },
  { key: "succhua", label: "Sức chứa" },
  { key: "trangthai", label: "Trạng thái" },
];

const saveData = async () => {
  const err = requiredError(form.value, requiredFields);
  if (err) {
    alert(err);
    return;
  }

  try {
    const data = {
      ...form.value,
      succhua: form.value.succhua ? Number(form.value.succhua) : null,
    };

    if (isEdit.value) {
      await updateData("/phong-hoc", form.value.maphong, data);
      alert("Cập nhật thành công");
    } else {
      await createData("/phong-hoc", data);
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
  await loadMyScope();
  await loadData();
});
</script>