<template>
  <div>
    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <h4 class="fw-bold mb-1">Bảng điểm thường xuyên</h4>
        <p class="text-muted mb-3" v-if="!isHV">Chọn lớp học và môn học để nhập điểm cho học viên</p>
        <p class="text-muted mb-3" v-else>Xem điểm thường xuyên của bạn theo lớp và môn học</p>

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
            <label class="form-label">Môn học <span class="text-danger">*</span></label>
            <select class="form-select" v-model="selectedMon" @change="onMonChange">
              <option value="">-- Chọn môn học --</option>
              <option v-for="mh in monHocList" :key="mh.mamh" :value="mh.mamh">
                {{ mh.tenmonhoc }}
              </option>
            </select>
          </div>

          <div class="col-md-4">
            <button class="btn btn-primary w-100" @click="loadStudents" :disabled="!selectedLop || !selectedMon || loading">
              <i class="bi bi-arrow-clockwise"></i> Tải danh sách
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- THỐNG KÊ -->
    <div v-if="!loading && students.length" class="row g-3 mb-4">
      <div class="col-md-4">
        <div class="card border-0 shadow-sm rounded-4 h-100">
          <div class="card-body d-flex align-items-center gap-3 p-3">
            <div class="rounded-3 p-3" style="background:rgba(13,110,253,.1)"><i class="bi bi-people fs-4 text-primary"></i></div>
            <div>
              <div class="text-muted small">Sĩ số</div>
              <h4 class="mb-0 fw-bold">{{ students.length }}</h4>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card border-0 shadow-sm rounded-4 h-100">
          <div class="card-body d-flex align-items-center gap-3 p-3">
            <div class="rounded-3 p-3" style="background:rgba(25,135,84,.1)"><i class="bi bi-check2-circle fs-4 text-success"></i></div>
            <div>
              <div class="text-muted small">Đã chấm điểm</div>
              <h4 class="mb-0 fw-bold">{{ daChamCount }} <small class="fs-6 text-muted">/ {{ students.length }}</small></h4>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card border-0 shadow-sm rounded-4 h-100">
          <div class="card-body d-flex align-items-center gap-3 p-3">
            <div class="rounded-3 p-3" style="background:rgba(255,193,7,.15)"><i class="bi bi-bar-chart fs-4 text-warning"></i></div>
            <div>
              <div class="text-muted small">Điểm trung bình {{ isHV ? 'của tôi' : 'lớp' }}</div>
              <h4 class="mb-0 fw-bold">{{ avgDiem }}</h4>
            </div>
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
            <small class="text-muted">Môn: {{ currentMonName }}</small>
          </div>
          <div>
            <span class="badge bg-primary">Sĩ số: {{ students.length }}</span>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table align-middle mb-0">
            <thead>
              <tr>
                <th style="width: 60px">#</th>
                <th>Học viên</th>
                <th style="width: 200px">Điểm (0-10)</th>
                <th>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(sv, idx) in students" :key="sv.mahv">
                <td>{{ idx + 1 }}</td>
                <td>
                  <div class="fw-semibold">
                    {{ sv.hoten }}
                    <span v-if="sv.diem !== null && sv.diem !== ''" class="badge bg-success bg-opacity-10 text-success ms-1">Đã chấm</span>
                  </div>
                  <small class="text-muted" v-if="sv.cccd">CCCD: {{ sv.cccd }}</small>
                </td>
                <td>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    class="form-control diem-input"
                    v-model="sv.diem"
                    placeholder="Nhập điểm"
                    :disabled="isHV"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    class="form-control"
                    v-model="sv.ghichu"
                    placeholder="Ghi chú"
                    :disabled="isHV"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="d-flex justify-content-end mt-3" v-if="!isHV">
          <button class="btn btn-primary" @click="saveAll" :disabled="saving">
            <i class="bi bi-save"></i> Lưu bảng điểm
          </button>
        </div>
      </div>
    </div>

    <div v-else-if="loaded" class="card shadow-sm">
      <div class="card-body text-center text-muted py-5">
        <i class="bi bi-inbox fs-1 d-block mb-2"></i>
        Lớp học này chưa có học viên đăng ký hoặc chưa chọn môn học.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getAll, createData, updateData } from "../services/crudService";
import api from "../services/api";

const lopHocList = ref([]);
const monHocList = ref([]);
const selectedLop = ref("");
const selectedMon = ref("");
const students = ref([]);
const loading = ref(false);
const saving = ref(false);
const loaded = ref(false);

const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
const isHV = computed(() => currentUser.maVaiTro === "HV");
const myMahv = ref(null);

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

const currentMonName = computed(() => {
  const mh = monHocList.value.find((x) => String(x.mamh) === String(selectedMon.value));
  return mh ? mh.tenmonhoc : "";
});

const daChamCount = computed(() =>
  students.value.filter((s) => s.diem !== null && s.diem !== "" && s.diem !== undefined).length
);

const avgDiem = computed(() => {
  const vals = students.value
    .map((s) => Number(s.diem))
    .filter((v) => !isNaN(v) && v !== null && v !== "");
  if (!vals.length) return "—";
  return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2);
});

const loadLopHoc = async () => {
  const res = await getAll("/lop-hoc");
  lopHocList.value = res.data;
};

const loadMonHoc = async () => {
  const res = await getAll("/mon-hoc");
  monHocList.value = res.data;
};

const onLopChange = () => {
  students.value = [];
  loaded.value = false;
};

const onMonChange = () => {
  students.value = [];
  loaded.value = false;
};

const loadStudents = async () => {
  if (!selectedLop.value || !selectedMon.value) return;
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

    const bdRes = await getAll("/bang-diem-thuong-xuyen");
    const bdMap = {};
    bdRes.data.forEach((bd) => {
      if (
        bd.lopHoc?.malop === Number(selectedLop.value) &&
        bd.monHoc?.mamh === Number(selectedMon.value)
      ) {
        bdMap[bd.hocVien?.mahv] = bd;
      }
    });

    let list = mahvList.map((mahv) => {
      const hv = hocVienMap[mahv] || { mahv, hoten: "HV " + mahv };
      const existing = bdMap[mahv];
      return {
        mahv,
        hoten: hv.hoten,
        cccd: hv.cccd,
        mabd: existing ? existing.mabd : null,
        diem: existing ? existing.diem : null,
        ghichu: existing ? existing.ghichu || "" : "",
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

const saveAll = async () => {
  if (!selectedLop.value || !selectedMon.value) return;
  saving.value = true;
  try {
    for (const sv of students.value) {
      const data = {
        hocVien: { mahv: Number(sv.mahv) },
        monHoc: { mamh: Number(selectedMon.value) },
        lopHoc: { malop: Number(selectedLop.value) },
        diem: sv.diem === "" || sv.diem === null ? null : Number(sv.diem),
        ghichu: sv.ghichu || "",
        ngayCham: new Date().toISOString().slice(0, 10),
      };
      if (sv.mabd) {
        await updateData("/bang-diem-thuong-xuyen", sv.mabd, { ...data, mabd: sv.mabd });
      } else {
        await createData("/bang-diem-thuong-xuyen", data);
      }
    }
    alert("Lưu bảng điểm thành công");
  } catch (e) {
    console.error(e);
    alert("Lưu bảng điểm thất bại");
  } finally {
    saving.value = false;
  }
};

onMounted(async () => {
  await loadMyProfile();
  await loadLopHoc();
  await loadMonHoc();
});
</script>

<style scoped>
.diem-input {
  max-width: 130px;
}
</style>
