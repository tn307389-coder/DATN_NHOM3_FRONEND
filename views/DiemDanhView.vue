<template>
  <div>
    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <h4 class="fw-bold mb-1">Điểm danh học viên</h4>
        <p class="text-muted mb-3" v-if="!isHV">Chọn lớp học và ngày để tiến hành điểm danh</p>
        <p class="text-muted mb-3" v-else>Xem thông tin điểm danh của bạn theo lớp và ngày</p>

        <div class="row g-3 align-items-end">
          <div class="col-md-4">
            <label class="form-label">Lớp học <span class="text-danger">*</span></label>
            <select class="form-select" v-model="selectedLop" @change="onLopChange">
              <option value="">-- Chọn lớp học --</option>
              <option v-for="lh in lopHocList" :key="lh.malop" :value="lh.malop">
                {{ lh.tenlop }}
                <template v-if="lh.khoaHoc"> ({{ lh.khoaHoc.tenkhoahoc }})</template>
              </option>
            </select>
          </div>

          <div class="col-md-4">
            <label class="form-label">Ngày điểm danh <span class="text-danger">*</span></label>
            <input type="date" class="form-control" v-model="selectedDate" />
          </div>

          <div class="col-md-4">
            <button class="btn btn-primary w-100" @click="loadStudents" :disabled="!selectedLop || !selectedDate || loading">
              <i class="bi bi-arrow-clockwise"></i> Tải danh sách
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-5 text-muted">
      <div class="spinner-border text-primary"></div>
    </div>

    <div v-else-if="students.length" class="card shadow-sm">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <div>
            <h5 class="fw-bold mb-0">{{ currentLopName }}</h5>
            <small class="text-muted">Ngày: {{ selectedDate }}</small>
          </div>
          <div>
            <span class="badge bg-success me-2">Có mặt: {{ presentCount }}</span>
            <span class="badge bg-secondary">Vắng: {{ absentCount }}</span>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table align-middle mb-0">
            <thead>
              <tr>
                <th style="width: 60px">#</th>
                <th>Học viên</th>
                <th>Trạng thái</th>
                <th class="text-end">Có mặt</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(sv, idx) in students" :key="sv.mahv">
                <td>{{ idx + 1 }}</td>
                <td>
                  <div class="fw-semibold">{{ sv.hoten }}</div>
                  <small class="text-muted" v-if="sv.cccd">CCCD: {{ sv.cccd }}</small>
                </td>
                <td>
                  <span class="badge" :class="sv.present ? 'bg-success' : 'bg-secondary'">
                    {{ sv.present ? "Có mặt" : "Vắng" }}
                  </span>
                </td>
                <td class="text-end">
                  <label class="diemdanh-switch" :class="{ disabled: isHV }">
                    <input type="checkbox" v-model="sv.present" :disabled="isHV" />
                    <span class="slider"></span>
                  </label>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="d-flex justify-content-end mt-3" v-if="!isHV">
          <button class="btn btn-outline-secondary me-2" @click="selectAll(true)">
            <i class="bi bi-check-all"></i> Tất cả có mặt
          </button>
          <button class="btn btn-outline-secondary me-2" @click="selectAll(false)">
            <i class="bi bi-x-circle"></i> Tất cả vắng
          </button>
          <button class="btn btn-primary" @click="saveAll" :disabled="saving">
            <i class="bi bi-save"></i> Lưu điểm danh
          </button>
        </div>
      </div>
    </div>

    <div v-else-if="loaded" class="card shadow-sm">
      <div class="card-body text-center text-muted py-5">
        <i class="bi bi-inbox fs-1 d-block mb-2"></i>
        Lớp học này chưa có học viên đăng ký hoặc chưa chọn ngày.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { getAll, createData } from "../services/crudService";
import api from "../services/api";

const lopHocList = ref([]);
const selectedLop = ref("");
const selectedDate = ref(new Date().toISOString().slice(0, 10));
const students = ref([]);
const loading = ref(false);
const saving = ref(false);
const loaded = ref(false);

const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
const isHV = computed(() => currentUser.maVaiTro === "HV");
const myMahv = ref(null);

const currentRoleLabel = computed(() =>
  isHV.value ? "Học viên" : ""
);

const loadMyProfile = async () => {
  if (!isHV.value) return;
  try {
    const me = await api.get("/tai-khoan/me");
    const cccd = me.data.cccd;
    if (cccd) {
      const hv = await api.get("/hoc-vien/me");
      myMahv.value = hv.data.mahv;
    }
  } catch (e) {
    console.error(e);
  }
};

const currentLopName = computed(() => {
  const lh = lopHocList.value.find((x) => String(x.malop) === String(selectedLop.value));
  if (!lh) return "";
  return `${lh.tenlop}${lh.khoaHoc ? " (" + lh.khoaHoc.tenkhoahoc + ")" : ""}`;
});

const presentCount = computed(() => students.value.filter((s) => s.present).length);
const absentCount = computed(() => students.value.length - presentCount.value);

const loadLopHoc = async () => {
  const res = await getAll("/lop-hoc");
  lopHocList.value = res.data;
};

const onLopChange = () => {
  students.value = [];
  loaded.value = false;
};

const loadStudents = async () => {
  if (!selectedLop.value || !selectedDate.value) return;
  loading.value = true;
  loaded.value = false;
  try {
    const lopRes = await getAll("/lop-hoc");
    const lop = lopRes.data.find((x) => String(x.malop) === String(selectedLop.value));
    if (!lop || !lop.khoaHoc) {
      students.value = [];
      loaded.value = true;
      return;
    }
    const makh = lop.khoaHoc.makh;

    const dkRes = await getAll("/dang-ky-khoa-hoc");
    const mahvList = dkRes.data
      .filter((dk) => dk.khoaHoc && dk.khoaHoc.makh === makh)
      .map((dk) => dk.hocVien?.mahv)
      .filter(Boolean);

    const hvRes = await getAll("/hoc-vien");
    const hocVienMap = {};
    hvRes.data.forEach((hv) => (hocVienMap[hv.mahv] = hv));

    const ddRes = await getAll("/diem-danh");
    const ddMap = {};
    ddRes.data.forEach((dd) => {
      if (
        dd.malich === Number(selectedLop.value) &&
        dd.ngaydiemdanh === selectedDate.value
      ) {
        ddMap[dd.mahv] = dd.trangthai;
      }
    });

    let list = mahvList.map((mahv) => {
      const hv = hocVienMap[mahv] || { mahv, hoten: "HV " + mahv };
      const existing = ddMap[mahv];
      return {
        mahv,
        hoten: hv.hoten,
        cccd: hv.cccd,
        present: existing ? existing === "Có mặt" : true,
      };
    });

    if (isHV.value && myMahv.value) {
      list = list.filter((s) => String(s.mahv) === String(myMahv.value));
    }

    students.value = list;
    loaded.value = true;
  } catch (e) {
    console.error(e);
    alert("Không tải được danh sách học viên");
  } finally {
    loading.value = false;
  }
};

const selectAll = (val) => {
  students.value.forEach((s) => (s.present = val));
};

const saveAll = async () => {
  if (!selectedLop.value || !selectedDate.value) return;
  saving.value = true;
  try {
    for (const sv of students.value) {
      const data = {
        hocVien: { mahv: Number(sv.mahv) },
        lichHoc: { malich: Number(selectedLop.value) },
        ngaydiemdanh: selectedDate.value,
        trangthai: sv.present ? "Có mặt" : "Vắng",
        ghichu: "",
      };
      await createData("/diem-danh", data);
    }
    alert("Lưu điểm danh thành công");
  } catch (e) {
    console.error(e);
    alert("Lưu điểm danh thất bại");
  } finally {
    saving.value = false;
  }
};

import { onMounted } from "vue";
onMounted(async () => {
  await loadMyProfile();
  await loadLopHoc();
});
</script>

<style scoped>
.diemdanh-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
}
.diemdanh-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.diemdanh-switch .slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background: #cbd5e1;
  border-radius: 999px;
  transition: 0.25s;
}
.diemdanh-switch .slider::before {
  content: "";
  position: absolute;
  height: 22px;
  width: 22px;
  left: 3px;
  bottom: 3px;
  background: #fff;
  border-radius: 50%;
  transition: 0.25s;
}
.diemdanh-switch input:checked + .slider {
  background: #198754;
}
.diemdanh-switch input:checked + .slider::before {
  transform: translateX(22px);
}
.diemdanh-switch.disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
