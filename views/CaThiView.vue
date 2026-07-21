<template>
  <div>
    <SimpleTablePage
      title="Quản lý ca thi"
      subtitle="Danh sách ca thi sát hạch"
      search-placeholder="Tìm kiếm ca thi..."
      endpoint="/ca-thi"
      id-key="macathi"
      :columns="columns"
      :rows="rows"
      :addable="!isHV"
      :editable="!isHV"
      :deletable="!isHV"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    />

    <div class="modal fade" id="caThiModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEdit ? "Sửa ca thi" : "Thêm ca thi" }}
            </h5>

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal">
            </button>
          </div>

          <div class="modal-body">

            <div class="mb-3">
              <label class="form-label">
                Tên ca thi <span class="text-danger">*</span>
              </label>

              <input
                class="form-control"
                v-model="form.tencathi"
                required>
            </div>

            <div class="mb-3">
              <label class="form-label">
                Giờ bắt đầu <span class="text-danger">*</span>
              </label>

              <input
                type="time"
                class="form-control"
                v-model="form.giobatdau"
                required>
            </div>

            <div class="mb-3">
              <label class="form-label">
                Giờ kết thúc <span class="text-danger">*</span>
              </label>

              <input
                type="time"
                class="form-control"
                v-model="form.gioketthuc"
                required>
            </div>

          </div>

          <div class="modal-footer">

            <button
              class="btn btn-secondary"
              data-bs-dismiss="modal">
              Hủy
            </button>

            <button
              class="btn btn-primary"
              @click="saveData">

              {{ isEdit ? "Cập nhật" : "Thêm mới" }}

            </button>

          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Modal } from "bootstrap";

import SimpleTablePage from "../components/common/SimpleTablePage.vue";

import {
  getAll,
  createData,
  updateData,
} from "../services/crudService";
import { requiredError } from "../services/validation";
import { useMyScope } from "../composables/useMyScope";

const { isHV, myMakh, loadMyScope } = useMyScope();

const columns = [
  { key: "macathi", label: "Mã" },
  { key: "tencathi", label: "Tên ca" },
  { key: "giobatdau", label: "Bắt đầu" },
  { key: "gioketthuc", label: "Kết thúc" },
];

const rows = ref([]);

const isEdit = ref(false);

const form = ref({
  macathi: null,
  tencathi: "",
  giobatdau: "",
  gioketthuc: "",
});
const loadData = async () => {
  try {
    const res = await getAll("/ca-thi");
    let list = res.data;
    if (isHV.value && myMakh.value.length) {
      const khSet = myMakh.value.map(String);
      const lich = (await getAll("/lich-thi")).data || [];
      const myCa = new Set(
        lich
          .filter((l) => l.khoaHoc && khSet.includes(String(l.khoaHoc.makhoahoc)))
          .map((l) => l.caThi?.macathi)
          .filter(Boolean)
          .map(String)
      );
      list = list.filter((c) => myCa.has(String(c.macathi)));
    }
    rows.value = list;
  } catch (e) {
    console.log(e);
    alert("Không tải được dữ liệu");
  }
};

const resetForm = () => {
  form.value = {
    macathi: null,
    tencathi: "",
    giobatdau: "",
    gioketthuc: "",
  };
};

const openModal = () => {
  Modal.getOrCreateInstance(
    document.getElementById("caThiModal")
  ).show();
};

const closeModal = () => {
  Modal.getOrCreateInstance(
    document.getElementById("caThiModal")
  ).hide();
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
  { key: "tencathi", label: "Tên ca thi" },
  { key: "giobatdau", label: "Giờ bắt đầu" },
  { key: "gioketthuc", label: "Giờ kết thúc" },
];

const saveData = async () => {
  const err = requiredError(form.value, requiredFields);
  if (err) {
    alert(err);
    return;
  }

  try {
    const data = {
      macathi: form.value.macathi,
      tencathi: form.value.tencathi,
      giobatdau: form.value.giobatdau,
      gioketthuc: form.value.gioketthuc,
    };

    if (isEdit.value) {
      await updateData("/ca-thi", form.value.macathi, data);
      alert("Cập nhật thành công");
    } else {
      await createData("/ca-thi", data);
      alert("Thêm thành công");
    }

    closeModal();
    await loadData();
  } catch (e) {
    console.log(e);
    alert("Lưu thất bại");
  }
};

onMounted(async () => {
  await loadMyScope();
  await loadData();
});
</script>