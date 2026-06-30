<template>
  <div>
    <h3 class="fw-bold">Chương trình học</h3>
    <p class="text-muted">Quản lý chương trình đào tạo theo từng hạng GPLX</p>
    <div class="row g-3">
      <div class="col-md-4" v-for="p in data" :key="p.hang">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-header bg-white d-flex justify-content-between align-items-center">
            <h5 class="mb-0 fw-semibold"><i :class="'bi bi-' + p.icon" :style="{ color: p.clr }"></i> Hạng {{ p.hang }}</h5>
            <span class="badge bg-success bg-opacity-10 text-success">{{ p.label }}</span>
          </div>
          <div class="card-body">
            <p class="mb-1"><strong>Thời gian:</strong> {{ p.time }}</p>
            <p class="mb-1"><strong>Lý thuyết:</strong> {{ p.lt }} buổi</p>
            <p class="mb-1"><strong>Thực hành:</strong> {{ p.th }} buổi</p>
            <p class="mb-1"><strong>Nội dung:</strong></p>
            <ul class="small text-muted ps-3 mb-0">
              <li v-for="n in p.noiDung" :key="n">{{ n }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const data = [
  { hang:'B1', icon:'car-front', clr:'#0d6efd', time:'3 tháng', lt:30, th:40, label:'Đang áp dụng', noiDung:['Luật giao thông đường bộ','Kỹ thuật lái xe cơ bản','Thực hành lái xe trong sa hình','Thực hành lái xe trên đường','Ôn thi lý thuyết'] },
  { hang:'B2', icon:'car-front', clr:'#198754', time:'4 tháng', lt:40, th:50, label:'Đang áp dụng', noiDung:['Luật giao thông đường bộ nâng cao','Kỹ thuật lái xe nâng cao','Thực hành sa hình','Lái xe đường trường','Kỹ năng xử lý tình huống'] },
  { hang:'C', icon:'truck', clr:'#ffc107', time:'5 tháng', lt:50, th:60, label:'Đang áp dụng', noiDung:['Luật giao thông chuyên sâu','Kỹ thuật lái xe tải','Thực hành sa hình hạng C','Lái xe đường trường','Kỹ năng an toàn'] },
]
</script>
