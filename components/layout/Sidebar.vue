<template>
  <div class="sidebar bg-dark text-white">
    <h4 class="text-center py-3">
      DriveHub
    </h4>

    <router-link to="/" class="menu-item">
      📊 Dashboard
    </router-link>

    <router-link to="/hoc-vien" class="menu-item">
      👨‍🎓 Học viên
    </router-link>

    <router-link to="/ho-so-hoc-vien" class="menu-item">
      📁 Hồ sơ học viên
    </router-link>

    <router-link to="/giao-vien" class="menu-item">
      👨‍🏫 Giáo viên
    </router-link>

    <router-link to="/chuong-trinh-hoc" class="menu-item">
      📚 Chương trình học
    </router-link>

    <router-link to="/phong-hoc" class="menu-item">
      🏫 Phòng học
    </router-link>

    <router-link to="/xe-tap-lai" class="menu-item">
      🚗 Xe tập lái
    </router-link>

    <router-link to="/phan-cong" class="menu-item">
      📋 Phân công
    </router-link>

    <router-link to="/lich-hoc" class="menu-item">
      📅 Lịch học
    </router-link>

    <router-link to="/thanh-toan" class="menu-item">
      💰 Thanh toán
    </router-link>

    <router-link to="/thi-sat-hach" class="menu-item">
      📝 Thi sát hạch
    </router-link>

    <router-link to="/tra-gplx" class="menu-item">
      🪪 Trả GPLX
    </router-link>
  </div>
</template>

<style scoped>
.sidebar {
  width: 260px;
  min-height: 100vh;
}

.menu-item {
  display: block;
  color: white;
  padding: 15px 20px;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
}

.menu-item:hover {
  background: #0d6efd;
}

.router-link-active {
  background: #0d6efd;
}
</style>