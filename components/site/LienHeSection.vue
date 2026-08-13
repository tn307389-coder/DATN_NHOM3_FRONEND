<template>
  <section id="lien-he" class="section alt reveal">
    <div class="container contact-grid">
      <div>
        <span class="eyebrow">Liên hệ</span>
        <h2>Đến với chúng tôi</h2>
        <ul class="contact-list">
          <li><span>📍</span> 123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM</li>
          <li><span>📞</span> 1900 1234 – 028 1234 5678</li>
          <li><span>✉️</span> lienhe@drivehub.vn</li>
          <li><span>🕒</span> Thứ 2 – Chủ nhật: 7:00 – 21:00</li>
        </ul>
      </div>
      <div class="contact-card">
        <h4>Gửi yêu cầu tư vấn</h4>
        <p>
          Đội ngũ tư vấn sẽ liên hệ lại trong thời gian sớm nhất để hỗ trợ
          bạn chọn khóa học phù hợp.
        </p>
        <button class="btn-primary" @click="openChat()">
          Nhắn để được tư vấn
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useChat } from "../../composables/useChat";
const { openChat } = useChat();
</script>
