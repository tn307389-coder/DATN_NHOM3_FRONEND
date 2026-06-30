<template>
  <nav class="navbar navbar-light bg-white shadow-sm px-4 border-bottom">
    <div class="d-flex align-items-center gap-2">
      <span class="text-muted small">
        <router-link to="/dashboard" class="text-muted text-decoration-none">Trang chủ</router-link>
        <span class="mx-1">/</span>
        <span class="fw-medium text-dark">{{ currentPage }}</span>
      </span>
    </div>
    <div class="d-flex align-items-center gap-3">
      <div class="position-relative">
        <i class="bi bi-bell text-muted fs-5"></i>
        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size:10px;">3</span>
      </div>
      <div class="d-flex align-items-center gap-2">
        <div class="bg-primary rounded-circle d-flex align-items-center justify-content-center fw-bold text-white" style="width:32px;height:32px;font-size:12px;">AD</div>
        <span class="small fw-medium">Admin</span>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const pageNames = {
  '/dashboard': 'Dashboard', '/hoc-vien': 'Học viên', '/giao-vien': 'Giáo viên',
  '/chuong-trinh-hoc': 'Chương trình học', '/lich-hoc': 'Lịch học', '/phan-cong': 'Phân công',
  '/phong-hoc': 'Phòng học', '/xe-tap-lai': 'Xe tập lái', '/ho-so-hoc-vien': 'Hồ sơ học viên',
  '/thi-sat-hach': 'Thi sát hạch', '/tra-gplx': 'Trả GPLX', '/thanh-toan': 'Thanh toán', '/tai-khoan': 'Tài khoản'
}
const currentPage = computed(() => pageNames[route.path] || '')
</script>
