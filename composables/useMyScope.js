import { ref, computed } from "vue";
import api from "../services/api";

const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
const isHV = computed(() => currentUser.maVaiTro === "HV");

const mahv = ref(null);
const myMakh = ref([]); // danh sách mã khóa học học viên đăng ký
const myMalop = ref([]); // danh sách mã lớp học viên thuộc về
const loaded = ref(false);

const loadMyScope = async () => {
  if (!isHV.value || loaded.value) return;
  try {
    const me = await api.get("/tai-khoan/me");
    const cccd = me.data.cccd;
    if (!cccd) return;
    const hv = await api.get("/hoc-vien/me");
    mahv.value = hv.data.mahv;

    const dk = (await api.get("/dang-ky-khoa-hoc")).data || [];
    const makhSet = new Set();
    dk
      .filter((d) => d.hocVien && d.hocVien.mahv === mahv.value && d.khoaHoc)
      .forEach((d) => makhSet.add(Number(d.khoaHoc.makh)));
    myMakh.value = Array.from(makhSet);

    const lop = (await api.get("/lop-hoc")).data || [];
    myMalop.value = lop
      .filter((l) => l.khoaHoc && makhSet.has(Number(l.khoaHoc.makh)))
      .map((l) => Number(l.malop));
    loaded.value = true;
  } catch (e) {
    console.error(e);
  }
};

export function useMyScope() {
  return { isHV, mahv, myMakh, myMalop, loaded, loadMyScope };
}
