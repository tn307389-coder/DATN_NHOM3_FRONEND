<template>
  <section id="bang-gia" class="section reveal">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Học phí</span>
        <h2>Bảng giá khóa học lái xe</h2>
        <p>Cam kết trọn gói, không phát sinh chi phí ẩn trong quá trình học.</p>
      </div>

      <div class="pricing-grid">
        <div class="price-card">
          <div class="price-head">
            <span class="price-tag">Hạng B1</span>
            <h3>Học viên mới</h3>
            <p class="price-sub">Ô tô số tự động</p>
          </div>
          <div class="price-body">
            <div class="price-row">
              <span class="price-old">8.500.000đ</span>
              <span class="price-now">6.900.000đ</span>
            </div>
            <p class="price-note">Tiết kiệm 1.600.000đ</p>
            <ul class="price-feats">
              <li><i class="bi bi-check-circle-fill"></i> Lý thuyết + thực hành trọn gói</li>
              <li><i class="bi bi-check-circle-fill"></i> Xe đời mới, bảo hiểm full</li>
              <li><i class="bi bi-check-circle-fill"></i> Thi thử lý thuyết online</li>
              <li><i class="bi bi-check-circle-fill"></i> Hỗ trợ thi & cấp bằng</li>
            </ul>
            <button class="btn-price" @click="openRegister()">ĐĂNG KÝ</button>
          </div>
        </div>

        <div class="price-card featured">
          <div class="price-head">
            <span class="price-tag hot">Phổ biến nhất</span>
            <h3>Hạng B2</h3>
            <p class="price-sub">Ô tô số sàn & số tự động</p>
          </div>
          <div class="price-body">
            <div class="price-row">
              <span class="price-old">9.500.000đ</span>
              <span class="price-now">7.500.000đ</span>
            </div>
            <p class="price-note">Tiết kiệm 2.000.000đ</p>
            <ul class="price-feats">
              <li><i class="bi bi-check-circle-fill"></i> Lộ trình 3 tháng hoàn chỉnh</li>
              <li><i class="bi bi-check-circle-fill"></i> Giáo viên kèm sát sao</li>
              <li><i class="bi bi-check-circle-fill"></i> Sa hình & đường trường</li>
              <li><i class="bi bi-check-circle-fill"></i> Hỗ trợ thi sát hạch tận nơi</li>
            </ul>
            <button class="btn-price" @click="openRegister()">ĐĂNG KÝ</button>
          </div>
        </div>

        <div class="price-card">
          <div class="price-head">
            <span class="price-tag">Hạng C1</span>
            <h3>Nâng hạng / Tải</h3>
            <p class="price-sub">Xe tải & nâng hạng</p>
          </div>
          <div class="price-body">
            <div class="price-row">
              <span class="price-old">14.000.000đ</span>
              <span class="price-now">11.500.000đ</span>
            </div>
            <p class="price-note">Tiết kiệm 2.500.000đ</p>
            <ul class="price-feats">
              <li><i class="bi bi-check-circle-fill"></i> Nâng hạng B2 lên C</li>
              <li><i class="bi bi-check-circle-fill"></i> Miễn giảm học phần</li>
              <li><i class="bi bi-check-circle-fill"></i> Lịch học linh hoạt</li>
              <li><i class="bi bi-check-circle-fill"></i> Hồ sơ đơn giản</li>
            </ul>
            <button class="btn-price" @click="openRegister()">ĐĂNG KÝ</button>
          </div>
        </div>
      </div>

      <p class="price-offer">🎁 Ưu đãi thêm khi đăng ký nhóm từ 2 người trở lên</p>
    </div>
  </section>
</template>

<script setup>
import { useSite } from "../../composables/useSite";
const { openRegister } = useSite();
</script>
