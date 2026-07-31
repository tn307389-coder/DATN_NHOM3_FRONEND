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
            <span class="price-tag">A1</span>
            <h3>Hạng A1</h3>
            <p class="price-sub">10 buổi LT, 20 buổi TH</p>
          </div>
          <div class="price-body">
            <div class="price-row">
              <span class="price-now">2.500.000₫</span>
            </div>
            <p class="price-note">Trọn gói, không phát sinh</p>
            <ul class="price-feats">
              <li><i class="bi bi-check-circle-fill"></i> Lý thuyết + thực hành trọn gói</li>
              <li><i class="bi bi-check-circle-fill"></i> Xe đời mới, bảo hiểm full</li>
              <li><i class="bi bi-check-circle-fill"></i> Thi thử lý thuyết online</li>
              <li><i class="bi bi-check-circle-fill"></i> Hỗ trợ thi & cấp bằng</li>
            </ul>
            <button class="btn-price" @click="openRegister()">ĐĂNG KÝ</button>
          </div>
        </div>

        <div class="price-card">
          <div class="price-head">
            <span class="price-tag">B1</span>
            <h3>Hạng B1</h3>
            <p class="price-sub">10 buổi LT, 30 buổi TH</p>
          </div>
          <div class="price-body">
            <div class="price-row">
              <span class="price-now">6.500.000₫</span>
            </div>
            <p class="price-note">Trọn gói, không phát sinh</p>
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
            <span class="price-tag hot">B2</span>
            <h3>Hạng B2</h3>
            <p class="price-sub">10 buổi LT, 35 buổi TH</p>
          </div>
          <div class="price-body">
            <div class="price-row">
              <span class="price-now">7.500.000₫</span>
            </div>
            <p class="price-note">Trọn gói, không phát sinh</p>
            <ul class="price-feats">
              <li><i class="bi bi-check-circle-fill"></i> Lý thuyết + thực hành trọn gói</li>
              <li><i class="bi bi-check-circle-fill"></i> Xe đời mới, bảo hiểm full</li>
              <li><i class="bi bi-check-circle-fill"></i> Thi thử lý thuyết online</li>
              <li><i class="bi bi-check-circle-fill"></i> Hỗ trợ thi & cấp bằng</li>
            </ul>
            <button class="btn-price" @click="openRegister()">ĐĂNG KÝ</button>
          </div>
        </div>

        <div class="price-card">
          <div class="price-head">
            <span class="price-tag">C</span>
            <h3>Hạng C</h3>
            <p class="price-sub">10 buổi LT, 40 buổi TH</p>
          </div>
          <div class="price-body">
            <div class="price-row">
              <span class="price-now">9.500.000₫</span>
            </div>
            <p class="price-note">Trọn gói, không phát sinh</p>
            <ul class="price-feats">
              <li><i class="bi bi-check-circle-fill"></i> Lý thuyết + thực hành trọn gói</li>
              <li><i class="bi bi-check-circle-fill"></i> Xe đời mới, bảo hiểm full</li>
              <li><i class="bi bi-check-circle-fill"></i> Thi thử lý thuyết online</li>
              <li><i class="bi bi-check-circle-fill"></i> Hỗ trợ thi & cấp bằng</li>
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
