<template>
  <footer class="footer">
    <div class="container footer-inner">
      <div class="footer-brand">
        <div class="brand">
          <img src="/logo1.jpg" alt="Logo" class="brand-logo" />
          <span>DriveHub</span>
        </div>
        <p class="footer-desc">
          Hệ thống quản lý trung tâm đào tạo & sát hạch lái xe hiện đại.
          Đào tạo các hạng GPLX từ A1 đến F, cam kết chất lượng và uy tín.
        </p>
        <div class="footer-social">
          <a href="#" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
          <a href="#" aria-label="Zalo"><i class="bi bi-chat-dots"></i></a>
          <a href="#" aria-label="Phone"><i class="bi bi-telephone"></i></a>
          <a href="#" aria-label="Email"><i class="bi bi-envelope"></i></a>
        </div>
      </div>
      <div class="footer-col">
        <h5>Liên kết</h5>
        <router-link to="/trang-chu">Trang chủ</router-link>
        <router-link to="/gioi-thieu">Giới thiệu</router-link>
        <router-link to="/hang-gplx">Hạng GPLX</router-link>
        <router-link to="/khoa-hoc">Khóa học</router-link>
        <router-link to="/bang-gia">Bảng giá</router-link>
        <router-link to="/tin-tuc">Tin tức</router-link>
        <router-link to="/lien-he">Liên hệ</router-link>
      </div>
      <div class="footer-col">
        <h5>Liên hệ</h5>
        <p><i class="bi bi-geo-alt"></i> Số 123 Đường Lê Lợi, Quận 1, TP.HCM</p>
        <p><i class="bi bi-telephone"></i> (028) 1234 5678</p>
        <p><i class="bi bi-envelope"></i> info@drivehub.vn</p>
        <p><i class="bi bi-clock"></i> Tất cả các ngày trong tuần, 7:00 - 21:00</p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2026 DriveHub. Bản quyền thuộc về Trung tâm Đào tạo Lái xe.</p>
    </div>
  </footer>
</template>
