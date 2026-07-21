<template>
  <section class="cta reveal">
    <div class="container cta-inner">
      <h2>Sẵn sàng lên vô lăng cùng DriveHub?</h2>
      <p>Đăng ký khóa học ngay hôm nay để nhận ưu đãi học phí tốt nhất.</p>
      <button class="btn-primary-lg light" @click="openRegister()">
        Đăng ký ngay
      </button>
    </div>
  </section>
</template>

<script setup>
import { useSite } from "../../composables/useSite";
const { openRegister } = useSite();
</script>
