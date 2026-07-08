<template>
  <div>
    <SimpleTablePage
      title="Quản lý lịch thi"
      subtitle="Danh sách lịch thi sát hạch"
      search-placeholder="Tìm kiếm lịch thi..."
      endpoint="/lich-thi"
      id-key="malichthi"
      :columns="columns"
      :rows="rows"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    />

    <div class="modal fade" id="lichThiModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEdit ? "Sửa lịch thi" : "Thêm lịch thi" }}
            </h5>

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal">
            </button>
          </div>

          <div class="modal-body">

            <div class="row">

              <div class="col-md-6 mb-3">
                <label class="form-label">Khóa học</label>

                <select
                  class="form-select"
                  v-model="form.makhoahoc">

                  <option value="">
                    -- Chọn khóa học --
                  </option>

                  <option
                    v-for="kh in khoaHocList"
                    :key="kh.makhoahoc"
                    :value="kh.makhoahoc">

                    {{ kh.tenkhoahoc }}

                  </option>

                </select>
              </div>

              <div class="col-md-6 mb-3">

                <label class="form-label">
                  Phòng thi
                </label>

                <select
                  class="form-select"
                  v-model="form.maphongthi">

                  <option value="">
                    -- Chọn phòng --
                  </option>

                  <option
                    v-for="pt in phongThiList"
                    :key="pt.maphongthi"
                    :value="pt.maphongthi">

                    {{ pt.tenphong }}

                  </option>

                </select>

              </div>

              <div class="col-md-6 mb-3">

                <label class="form-label">
                  Ca thi
                </label>

                <select
                  class="form-select"
                  v-model="form.macathi">

                  <option value="">
                    -- Chọn ca --
                  </option>

                  <option
                    v-for="ct in caThiList"
                    :key="ct.macathi"
                    :value="ct.macathi">

                    {{ ct.tencathi }}

                  </option>

                </select>

              </div>

              <div class="col-md-6 mb-3">

                <label class="form-label">
                  Ngày thi
                </label>

                <input
                  type="date"
                  class="form-control"
                  v-model="form.ngaythi">

              </div>

              <div class="col-12">

                <label class="form-label">
                  Ghi chú
                </label>

                <textarea
                  rows="3"
                  class="form-control"
                  v-model="form.ghichu">
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

const columns = [
  { key: "malichthi", label: "Mã" },
  { key: "khoahoc", label: "Khóa học" },
  { key: "phongthi", label: "Phòng thi" },
  { key: "cathi", label: "Ca thi" },
  { key: "ngaythi", label: "Ngày thi" },
  { key: "ghichu", label: "Ghi chú" },
];

const rows = ref([]);

const khoaHocList = ref([]);
const phongThiList = ref([]);
const caThiList = ref([]);

const isEdit = ref(false);

const form = ref({
  malichthi: null,
  makhoahoc: "",
  maphongthi: "",
  macathi: "",
  ngaythi: "",
  ghichu: "",
});
const loadData = async () => {
  try {
    const res = await getAll("/lich-thi");

    rows.value = res.data.map((item) => ({
      malichthi: item.malichthi,
      khoahoc: item.khoaHoc?.tenkhoahoc || "",
      phongthi: item.phongThi?.tenphong || "",
      cathi: item.caThi?.tencathi || "",
      ngaythi: item.ngaythi,
      ghichu: item.ghichu,

      makhoahoc: item.khoaHoc?.makhoahoc,
      maphongthi: item.phongThi?.maphongthi,
      macathi: item.caThi?.macathi,
    }));
  } catch (e) {
    console.log(e);
    alert("Không tải được dữ liệu");
  }
};

const loadKhoaHoc = async () => {
  const res = await getAll("/khoa-hoc");
  khoaHocList.value = res.data;
};

const loadPhongThi = async () => {
  const res = await getAll("/phong-thi");
  phongThiList.value = res.data;
};

const loadCaThi = async () => {
  const res = await getAll("/ca-thi");
  caThiList.value = res.data;
};

const resetForm = () => {
  form.value = {
    malichthi: null,
    makhoahoc: "",
    maphongthi: "",
    macathi: "",
    ngaythi: "",
    ghichu: "",
  };
};

const openModal = () => {
  Modal.getOrCreateInstance(
    document.getElementById("lichThiModal")
  ).show();
};

const closeModal = () => {
  Modal.getOrCreateInstance(
    document.getElementById("lichThiModal")
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

const saveData = async () => {
  try {
    const data = {
      malichthi: form.value.malichthi,
      khoaHoc: {
        makhoahoc: Number(form.value.makhoahoc),
      },
      phongThi: {
        maphongthi: Number(form.value.maphongthi),
      },
      caThi: {
        macathi: Number(form.value.macathi),
      },
      ngaythi: form.value.ngaythi,
      ghichu: form.value.ghichu,
    };

    if (isEdit.value) {
      await updateData(
        "/lich-thi",
        form.value.malichthi,
        data
      );
      alert("Cập nhật thành công");
    } else {
      await createData(
        "/lich-thi",
        data
      );
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
  await loadKhoaHoc();
  await loadPhongThi();
  await loadCaThi();
  await loadData();
});
</script>