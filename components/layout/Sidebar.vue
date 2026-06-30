<template>
  <div class="d-flex flex-column bg-dark text-white" style="width:260px;min-height:100vh;position:sticky;top:0;">
    <router-link to="/dashboard" class="text-white text-decoration-none p-3 border-bottom border-secondary">
      <div class="d-flex align-items-center gap-2">
        <div class="bg-primary rounded-2 d-flex align-items-center justify-content-center" style="width:38px;height:38px;">
          <i class="bi bi-car-front-fill fs-5"></i>
        </div>
        <div>
          <div class="fw-bold fs-6">DriveHub</div>
          <div class="small text-secondary">Trung tâm đào tạo lái xe</div>
        </div>
      </div>
    </router-link>

    <nav class="flex-grow-1 overflow-auto py-2">
      <div class="px-3 py-1 small text-secondary text-uppercase fw-semibold">Tổng quan</div>
      <router-link to="/dashboard" class="sidebar-link"><i class="bi bi-speedometer2"></i> Dashboard</router-link>

      <div class="px-3 py-1 small text-secondary text-uppercase fw-semibold mt-2">Quản lý đào tạo</div>
      <router-link to="/hoc-vien" class="sidebar-link"><i class="bi bi-people"></i> Học viên</router-link>
      <router-link to="/giao-vien" class="sidebar-link"><i class="bi bi-person-badge"></i> Giáo viên</router-link>
      <router-link to="/chuong-trinh-hoc" class="sidebar-link"><i class="bi bi-book"></i> Chương trình học</router-link>
      <router-link to="/lich-hoc" class="sidebar-link"><i class="bi bi-calendar"></i> Lịch học</router-link>
      <router-link to="/phan-cong" class="sidebar-link"><i class="bi bi-diagram-3"></i> Phân công</router-link>

      <div class="px-3 py-1 small text-secondary text-uppercase fw-semibold mt-2">Cơ sở vật chất</div>
      <router-link to="/phong-hoc" class="sidebar-link"><i class="bi bi-door-open"></i> Phòng học</router-link>
      <router-link to="/xe-tap-lai" class="sidebar-link"><i class="bi bi-car-front"></i> Xe tập lái</router-link>

      <div class="px-3 py-1 small text-secondary text-uppercase fw-semibold mt-2">Nghiệp vụ</div>
      <router-link to="/ho-so-hoc-vien" class="sidebar-link"><i class="bi bi-folder"></i> Hồ sơ học viên</router-link>
      <router-link to="/thi-sat-hach" class="sidebar-link"><i class="bi bi-signpost-2"></i> Thi sát hạch</router-link>
      <router-link to="/tra-gplx" class="sidebar-link"><i class="bi bi-card-text"></i> Trả GPLX</router-link>
      <router-link to="/thanh-toan" class="sidebar-link"><i class="bi bi-cash"></i> Thanh toán</router-link>

      <div class="px-3 py-1 small text-secondary text-uppercase fw-semibold mt-2">Hệ thống</div>
      <router-link to="/tai-khoan" class="sidebar-link"><i class="bi bi-person-gear"></i> Tài khoản</router-link>
    </nav>

    <div class="p-3 border-top border-secondary">
      <div class="d-flex align-items-center gap-2 mb-2">
        <div class="bg-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style="width:34px;height:34px;font-size:13px;">AD</div>
        <div>
          <div class="small fw-medium">Admin</div>
          <div class="small text-secondary">Quản trị viên</div>
        </div>
      </div>
      <router-link to="/" class="sidebar-link small"><i class="bi bi-box-arrow-right"></i> Đăng xuất</router-link>
    </div>
  </div>
</template>

<style scoped>
.sidebar-link {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 16px; color: #cbd5e1; text-decoration: none;
  font-size: 14px; border-left: 3px solid transparent; transition: all 0.15s;
}
.sidebar-link:hover { background: #1e293b; color: #fff; }
.sidebar-link i { width: 18px; text-align: center; }
.sidebar-link.router-link-exact-active { background: #1e293b; color: #fff; border-left-color: #0d6efd; }
</style>
