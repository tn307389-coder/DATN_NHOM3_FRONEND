<template>
  <div>
    <SimpleTablePage
      title="Quản lý kết quả thi"
      subtitle="Kết quả thi sát hạch của học viên"
      search-placeholder="Tìm kiếm kết quả..."
      endpoint="/ket-qua-thi"
      id-key="makq"
      :columns="columns"
      :rows="rows"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    />

    <div class="modal fade" id="ketQuaModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEdit ? "Sửa kết quả" : "Thêm kết quả" }}
            </h5>

            <button
              class="btn-close"
              data-bs-dismiss="modal">
            </button>
          </div>

          <div class="modal-body">

            <div class="row">

              <div class="col-md-6 mb-3">

                <label class="form-label">
                  Học viên <span class="text-danger">*</span>
                </label>

                <select
                  class="form-select"
                  v-model="form.mahv"
                  required>

                  <option value="">
                    -- Chọn học viên --
                  </option>

                  <option
                    v-for="hv in hocVienList"
                    :key="hv.mahv"
                    :value="hv.mahv">

                    {{ hv.hoten }}

                  </option>

                </select>

              </div>

              <div class="col-md-6 mb-3">

                <label class="form-label">
                  Lịch thi <span class="text-danger">*</span>
                </label>

                <select
                  class="form-select"
                  v-model="form.malichthi"
                  required>

                  <option value="">
                    -- Chọn lịch thi --
                  </option>

                  <option
                    v-for="lt in lichThiList"
                    :key="lt.malichthi"
                    :value="lt.malichthi">

                    {{ lt.ngaythi }}

                  </option>

                </select>

              </div>

              <div class="col-md-6 mb-3">

                <label class="form-label">
                  Điểm <span class="text-danger">*</span>
                </label>

                <input
                  class="form-control"
                  type="number"
                  step="0.1"
                  v-model="form.diem"
                  required>

              </div>

              <div class="col-md-6 mb-3">

                <label class="form-label">
                  Kết quả <span class="text-danger">*</span>
                </label>

                <select
                  class="form-select"
                  v-model="form.ketqua"
                  required>

                  <option value="">
                    -- Chọn --
                  </option>

                  <option>
                    Đạt
                  </option>

                  <option>
                    Không đạt
                  </option>

                </select>

              </div>

              <div class="col-12">

                <label class="form-label">
                  Ghi chú <span class="text-danger">*</span>
                </label>

                <textarea
                  rows="3"
                  class="form-control"
                  v-model="form.ghichu"
                  required>
                </textarea>

              </div>

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

const columns = [
  { key: "makq", label: "Mã" },
  { key: "hocvien", label: "Học viên" },
  { key: "lichthi", label: "Lịch thi" },
  { key: "diem", label: "Điểm" },
  { key: "ketqua", label: "Kết quả" },
  { key: "ghichu", label: "Ghi chú" },
];

const rows = ref([]);

const hocVienList = ref([]);
const lichThiList = ref([]);

const isEdit = ref(false);

const form = ref({
  makq: null,
  mahv: "",
  malichthi: "",
  diem: "",
  ketqua: "",
  ghichu: "",
});
const loadData = async () => {
  try {
    const res = await getAll("/ket-qua-thi");

    rows.value = res.data.map((item) => ({
      makq: item.makq,
      hocvien: item.hocVien?.hoten || "",
      lichthi: item.lichThi?.ngaythi || "",
      diem: item.diem,
      ketqua: item.ketqua,
      ghichu: item.ghichu,

      mahv: item.hocVien?.mahv,
      malichthi: item.lichThi?.malichthi,
    }));
  } catch (e) {
    console.log(e);
  }
};

const loadHocVien = async () => {
  hocVienList.value = (await getAll("/hoc-vien")).data;
};

const loadLichThi = async () => {
  lichThiList.value = (await getAll("/lich-thi")).data;
};

const resetForm = () => {
  form.value = {
    makq: null,
    mahv: "",
    malichthi: "",
    diem: "",
    ketqua: "",
    ghichu: "",
  };
};

const openModal = () => {
  Modal.getOrCreateInstance(
    document.getElementById("ketQuaModal")
  ).show();
};

const closeModal = () => {
  Modal.getOrCreateInstance(
    document.getElementById("ketQuaModal")
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
  { key: "mahv", label: "Học viên" },
  { key: "malichthi", label: "Lịch thi" },
  { key: "diem", label: "Điểm" },
  { key: "ketqua", label: "Kết quả" },
  { key: "ghichu", label: "Ghi chú" },
];

const saveData = async () => {
  const err = requiredError(form.value, requiredFields);
  if (err) {
    alert(err);
    return;
  }

  const data = {
    makq: form.value.makq,
    hocVien: {
      mahv: Number(form.value.mahv),
    },
    lichThi: {
      malichthi: Number(form.value.malichthi),
    },
    diem: Number(form.value.diem),
    ketqua: form.value.ketqua,
    ghichu: form.value.ghichu,
  };

  if (isEdit.value) {
    await updateData("/ket-qua-thi", form.value.makq, data);
  } else {
    await createData("/ket-qua-thi", data);
  }

  closeModal();
  await loadData();
};

onMounted(async () => {
  await loadHocVien();
  await loadLichThi();
  await loadData();
});
</script>