<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div><h3 class="fw-bold mb-0">Quản lý Phòng học</h3><p class="text-muted mb-0 small">Danh sách phòng học và cơ sở vật chất</p></div>
      <button class="btn btn-primary btn-sm" @click="alert('Demo: Thêm phòng')"><i class="bi bi-plus-lg"></i> Thêm phòng</button>
    </div>
    <div class="row g-3">
      <div class="col-md-4" v-for="r in data" :key="r.name">
        <div class="card border-0 shadow-sm h-100 text-center">
          <div class="card-body">
            <div class="fs-1 mb-2" :style="{ color: r.clr }"><i :class="'bi bi-' + r.icon"></i></div>
            <h5 class="fw-semibold">{{ r.name }}</h5>
            <p class="small text-muted mb-1">Sức chứa: {{ r.capacity }}</p>
            <p class="small text-muted mb-2">{{ r.equipment }}</p>
            <span class="badge" :class="r.badge">{{ r.status }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const data = [
  { name:'Phòng 101', capacity:40, equipment:'Máy chiếu, bảng, điều hòa', status:'Đang sử dụng', icon:'door-open', clr:'#0d6efd', badge:'bg-success bg-opacity-10 text-success' },
  { name:'Phòng 102', capacity:35, equipment:'Máy chiếu, bảng, điều hòa', status:'Đang sử dụng', icon:'door-open', clr:'#198754', badge:'bg-success bg-opacity-10 text-success' },
  { name:'Phòng 103', capacity:30, equipment:'Bảng, điều hòa', status:'Sẵn sàng', icon:'door-open', clr:'#ffc107', badge:'bg-warning bg-opacity-10 text-warning' },
  { name:'Phòng 201', capacity:50, equipment:'Máy chiếu, âm thanh, điều hòa', status:'Đang sử dụng', icon:'door-open', clr:'#6f42c1', badge:'bg-success bg-opacity-10 text-success' },
  { name:'Phòng 202', capacity:25, equipment:'Bảng, điều hòa', status:'Bảo trì', icon:'door-open', clr:'#dc3545', badge:'bg-secondary bg-opacity-10 text-secondary' },
  { name:'Sân tập lái', capacity:'5000 m²', equipment:'Sa hình, biển báo', status:'Đang hoạt động', icon:'car-front', clr:'#0dcaf0', badge:'bg-success bg-opacity-10 text-success' },
]
</script>
