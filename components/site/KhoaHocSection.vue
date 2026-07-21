<template>
  <section id="khoa-hoc" class="section reveal">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Chương trình học</span>
        <h2>Các khóa học lái xe</h2>
        <p>Lộ trình học bài bản từ lý thuyết đến thực hành.</p>
      </div>

      <div class="cards-grid course-grid">
        <div class="course-card">
          <div class="course-top">
            <div class="course-ic">🚦</div>
            <span class="course-tag">Cơ bản</span>
          </div>
          <h4>Học viên mới</h4>
          <p>
            Trọn gói lý thuyết + thực hành, phù hợp người chưa biết lái.
          </p>
          <ul>
            <li>Giáo trình chuẩn Bộ GTVT</li>
            <li>Thi thử lý thuyết online</li>
            <li>Thực hành sa hình & đường trường</li>
          </ul>
          <div class="course-foot">
            <span class="course-meta"><i class="bi bi-clock"></i> 3 tháng</span>
            <button class="btn-outline" @click="openRegister()">
              Đăng ký tư vấn
            </button>
          </div>
        </div>
        <div class="course-card highlight">
          <div class="ribbon">Phổ biến</div>
          <div class="course-top">
            <div class="course-ic">🚗</div>
            <span class="course-tag">Bán chạy</span>
          </div>
          <h4>Lái xe B2</h4>
          <p>Khóa học toàn diện hạng B2 – lựa chọn của đa số học viên.</p>
          <ul>
            <li>3 tháng hoàn thành</li>
            <li>Xe đời mới, bảo hiểm full</li>
            <li>Hỗ trợ thi sát hạch</li>
          </ul>
          <div class="course-foot">
            <span class="course-meta"><i class="bi bi-cash"></i> Từ 5.5tr</span>
            <button class="btn-primary" @click="openRegister()">
              Đăng ký ngay
            </button>
          </div>
        </div>
        <div class="course-card">
          <div class="course-top">
            <div class="course-ic">⬆️</div>
            <span class="course-tag">Nâng hạng</span>
          </div>
          <h4>Nâng hạng</h4>
          <p>
            Nâng hạng bằng hiện tại (B2 lên C, A1 lên A2...) nhanh chóng.
          </p>
          <ul>
            <li>Miễn giảm học phần</li>
            <li>Lịch học linh hoạt</li>
            <li>Hồ sơ đơn giản</li>
          </ul>
          <div class="course-foot">
            <span class="course-meta"><i class="bi bi-clock"></i> 1.5 tháng</span>
            <button class="btn-outline" @click="openRegister()">
              Đăng ký tư vấn
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useSite } from "../../composables/useSite";
const { openRegister } = useSite();
</script>
