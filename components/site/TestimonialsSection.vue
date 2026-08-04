<template>
  <section class="section alt reveal">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Học viên nói gì</span>
        <h2>Cảm nhận từ học viên</h2>
        <p>Hàng nghìn học viên đã tin tưởng và thành công cùng DriveHub.</p>
      </div>

      <div class="testimonials-grid">
        <div class="testimonial-card" v-for="(t, i) in testimonials" :key="i">
          <div class="testimonial-stars">
            <span v-for="n in 5" :key="n">{{ n <= t.stars ? '★' : '☆' }}</span>
          </div>
          <p class="testimonial-text">{{ t.text }}</p>
          <div class="testimonial-author">
            <div class="testimonial-avatar" :style="{ background: t.color }">
              {{ t.initials }}
            </div>
            <div>
              <div class="testimonial-name">{{ t.name }}</div>
              <div class="testimonial-title">{{ t.title }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const testimonials = [
  {
    stars: 5,
    text: "Học xong B2 tại DriveHub chỉ sau 3 tháng. Giáo viên nhiệt tình, xe tập mới và sạch sẽ. Thi đậu ngay lần đầu!",
    name: "Nguyễn Văn An",
    title: "Học viên khóa B2",
    initials: "NA",
    color: "linear-gradient(135deg, #d4a853, #c99a3e)",
  },
  {
    stars: 5,
    text: "Mình học A1 ở đây thấy rất bài bản. Lịch học linh hoạt, hỗ trợ đăng ký thi nhanh gọn. Sẽ giới thiệu bạn bè.",
    name: "Trần Thị Mai",
    title: "Học viên khóa A1",
    initials: "TM",
    color: "linear-gradient(135deg, #0d6efd, #0a58ca)",
  },
  {
    stars: 5,
    text: "Nâng hạng từ B2 lên C, thủ tục đơn giản, giáo viên dạy dễ hiểu. Trung tâm có bãi sa hình rộng, tập thoải mái.",
    name: "Lê Hoàng Nam",
    title: "Học viên nâng hạng C",
    initials: "LN",
    color: "linear-gradient(135deg, #198754, #146c43)",
  },
];
</script>
