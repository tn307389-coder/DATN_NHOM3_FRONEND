<template>
  <footer class="app-footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <span class="footer-logo">🚘</span>
        <div>
          <strong>DriveHub</strong>
          <small>Hệ thống quản lý GPLX</small>
        </div>
      </div>
      <div class="footer-meta">
        © 2026 DATN Nhóm 3 · Phát triển bởi Sinh viên Đồ án tốt nghiệp
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background: #ffffff;
  border-top: 1px solid #e9eef5;
  padding: 16px 28px;
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.footer-logo {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0d6efd, #38bdf8);
  border-radius: 10px;
  font-size: 18px;
}

.footer-brand strong {
  display: block;
  font-size: 14px;
  color: #111827;
  font-weight: 700;
}

.footer-brand small {
  display: block;
  font-size: 12px;
  color: #94a3b8;
}

.footer-meta {
  font-size: 12.5px;
  color: #94a3b8;
}
</style>
