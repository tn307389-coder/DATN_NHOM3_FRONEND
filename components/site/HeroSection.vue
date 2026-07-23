<template>
  <section id="top" class="hero">
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
          <div class="visual-emoji">🚘</div>
          <div class="visual-chips">
            <span class="chip">Bằng B2</span>
            <span class="chip">B1 số tự động</span>
            <span class="chip">A1 xe máy</span>
            <span class="chip">C xe tải</span>
          </div>
        </div>
        <div class="floating-stat s1">🎓 25.000+ học viên</div>
        <div class="floating-stat s2">✅ 95% tỷ lệ đậu</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useSite } from "../../composables/useSite";
const { openRegister } = useSite();
</script>
