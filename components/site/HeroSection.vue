<template>
<section id="top" class="hero">
  <div class="hero-bg"></div>
  <div class="container hero-grid">
    <div class="hero-text">
      <span class="hero-badge"><i class="bi bi-star-fill"></i> Trung tâm đào tạo & sát hạch lái xe uy tín #1</span>
      <h1>
        Học lái xe dễ dàng,<br />
        <span class="hl">lấy bằng nhanh chóng</span>
      </h1>
      <p>
        DriveHub đồng hành cùng bạn trên hành trình chinh phục vô lăng – từ
        đăng ký khóa học, luyện tập thực hành đến thi sát hạch và tra cứu
        giấy phép lái xe, tất cả trong một hệ thống hiện đại.
      </p>

      <div class="hero-actions">
        <a href="#khoa-hoc" class="btn-primary-lg">Xem khóa học</a>
        <button class="btn-ghost-lg" @click="openRegister()">
          <i class="bi bi-person-plus"></i> Đăng ký ngay
        </button>
      </div>

      <ul class="hero-features">
        <li><i class="bi bi-car-front-fill"></i> Đào tạo các hạng A1 – E</li>
        <li><i class="bi bi-calendar-check-fill"></i> Lịch học & điểm danh trực tuyến</li>
        <li><i class="bi bi-file-text-fill"></i> Thi sát hạch & tra cứu kết quả</li>
        <li><i class="bi bi-person-badge-fill"></i> Quản lý hồ sơ & cấp lại GPLX</li>
      </ul>
    </div>

    <div class="hero-visual">
      <div class="visual-card">
        <div class="visual-icon">
          <svg viewBox="0 0 64 64" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="28" width="48" height="20" rx="6" fill="none" stroke="currentColor" stroke-width="2" />
            <circle cx="18" cy="48" r="6" fill="none" stroke="currentColor" stroke-width="2" />
            <circle cx="46" cy="48" r="6" fill="none" stroke="currentColor" stroke-width="2" />
            <path d="M22 28 L28 18 L44 18 L50 28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            <path d="M24 28 L22 34" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            <path d="M40 28 L42 34" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            <circle cx="32" cy="22" r="3" fill="currentColor" opacity="0.3" />
          </svg>
        </div>
        <div class="visual-chips">
          <span class="chip">Bằng B2</span><span class="chip">B1 số tự động</span>
          <span class="chip">A1 xe máy</span><span class="chip">C xe tải</span>
        </div>
      </div>
      <div class="floating-stat s1">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        25.000+ học viên
      </div>
      <div class="floating-stat s2">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        95% tỷ lệ đậu
      </div>
    </div>
  </div>
  <div class="scroll-indicator">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
  </div>
</section>
</template>

<script setup>
import { useSite } from "../../composables/useSite";
const { openRegister } = useSite();
</script>
