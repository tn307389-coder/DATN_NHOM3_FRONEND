<template>
  <footer class="footer">
    <div class="container footer-inner">
      <div>
        <div class="brand">
          <img src="/logo1.jpg" alt="Logo" class="brand-logo" />
          <span>DriveHub</span>
        </div>
        <p class="footer-desc">
          Hệ thống quản lý trung tâm đào tạo & sát hạch lái xe hiện đại.
        </p>
      </div>
      <div class="footer-links">
        <router-link to="/gioi-thieu">Giới thiệu</router-link>
        <router-link to="/hang-gplx">Hạng GPLX</router-link>
        <router-link to="/khoa-hoc">Khóa học</router-link>
        <router-link to="/bang-gia">Bảng giá</router-link>
        <router-link to="/tin-tuc">Tin tức</router-link>
        <router-link to="/lien-he">Liên hệ</router-link>
      </div>
    </div>
    <div class="footer-bottom">
      © 2026 DriveHub. Bản quyền thuộc về Trung tâm Đào tạo Lái xe.
    </div>
  </footer>
</template>
