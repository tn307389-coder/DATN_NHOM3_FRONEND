<template>
  <div>
    <h3 class="fw-bold">Dashboard</h3>
    <p class="text-muted">Tổng quan hoạt động của trung tâm</p>

    <div class="row g-3 mb-4">
      <div class="col-md-3" v-for="s in stats" :key="s.label">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <div class="rounded-3 d-flex align-items-center justify-content-center" :style="{ background: s.bg, color: s.clr, width: 44, height: 44 }">
                <i :class="'bi bi-' + s.icon + ' fs-5'"></i>
              </div>
              <span class="badge" :class="s.up ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'">
                <i :class="'bi bi-arrow-' + (s.up ? 'up' : 'down')"></i> {{ s.pct }}
              </span>
            </div>
            <div class="fs-3 fw-bold">{{ s.value }}</div>
            <div class="text-muted small">{{ s.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-3 mb-4">
      <div class="col-md-8">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white fw-semibold">Học viên đăng ký theo tháng</div>
          <div class="card-body">
            <div class="d-flex align-items-end gap-2" style="height:180px;">
              <div v-for="(m,i) in months" :key="i" class="flex-grow-1 d-flex flex-column align-items-center gap-1">
                <div class="w-100 rounded-top" :style="{ height: m.h + '%', background: i >= 6 ? '#198754' : '#0d6efd', maxWidth: 40 }"></div>
                <span class="small text-muted">{{ m.l }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white fw-semibold">Hoạt động gần đây</div>
          <div class="card-body p-0">
            <div v-for="a in activities" :key="a.text" class="d-flex align-items-start gap-3 p-3 border-bottom">
              <div class="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0" :style="{ background: a.bg, color: a.clr, width: 34, height: 34 }">
                <i :class="'bi bi-' + a.icon"></i>
              </div>
              <div>
                <p class="mb-0 small" v-html="a.text"></p>
                <span class="small text-muted">{{ a.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-header bg-white d-flex justify-content-between align-items-center">
        <span class="fw-semibold">Học viên mới nhất</span>
        <router-link to="/hoc-vien" class="btn btn-outline-secondary btn-sm">Xem tất cả</router-link>
      </div>
      <div class="table-responsive">
        <table class="table table-hover mb-0 small">
          <thead class="table-light">
            <tr><th>Họ tên</th><th>SĐT</th><th>Hạng xe</th><th>Ngày đăng ký</th><th>Trạng thái</th></tr>
          </thead>
          <tbody>
            <tr v-for="h in students" :key="h.name">
              <td>{{ h.name }}</td><td>{{ h.phone }}</td><td>{{ h.hang }}</td><td>{{ h.regDate }}</td>
              <td><span class="badge" :class="h.badge">{{ h.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
const stats = [
  { icon:'people', bg:'#dbeafe', clr:'#0d6efd', value:256, label:'Tổng học viên', up:true, pct:'+12%' },
  { icon:'person-badge', bg:'#d1e7dd', clr:'#198754', value:18, label:'Giáo viên', up:true, pct:'+5%' },
  { icon:'car-front', bg:'#fff3cd', clr:'#ffc107', value:12, label:'Xe tập lái', up:false, pct:'-3%' },
  { icon:'signpost-2', bg:'#e2d9f3', clr:'#6f42c1', value:42, label:'Thi sát hạch (tháng)', up:true, pct:'+25%' },
]
const months = [
  {h:30,l:'T1'},{h:45,l:'T2'},{h:25,l:'T3'},{h:55,l:'T4'},{h:40,l:'T5'},{h:65,l:'T6'},
  {h:70,l:'T7'},{h:50,l:'T8'},{h:80,l:'T9'},{h:60,l:'T10'},{h:75,l:'T11'},{h:90,l:'T12'}
]
const activities = [
  {icon:'plus-circle', bg:'#d1e7dd', clr:'#198754', text:'Thêm học viên <strong>Nguyễn Văn An</strong>', time:'5 phút trước'},
  {icon:'pencil', bg:'#dbeafe', clr:'#0d6efd', text:'Cập nhật lịch học lớp <strong>B1.01</strong>', time:'15 phút trước'},
  {icon:'car-front', bg:'#fff3cd', clr:'#ffc107', text:'Bảo dưỡng xe <strong>29A-123.45</strong>', time:'1 giờ trước'},
  {icon:'file-earmark', bg:'#f8d7da', clr:'#dc3545', text:'Nộp hồ sơ thi cho <strong>5 học viên</strong>', time:'2 giờ trước'},
  {icon:'card-text', bg:'#e2d9f3', clr:'#6f42c1', text:'Cấp GPLX cho <strong>3 học viên</strong>', time:'3 giờ trước'},
]
const students = [
  { name:'Nguyễn Văn An', phone:'0987 654 321', hang:'B1', regDate:'15/06/2026', status:'Đang học', badge:'bg-success bg-opacity-10 text-success' },
  { name:'Trần Thị Bình', phone:'0978 123 456', hang:'B2', regDate:'14/06/2026', status:'Đang học', badge:'bg-success bg-opacity-10 text-success' },
  { name:'Lê Văn Cường', phone:'0965 432 109', hang:'C', regDate:'12/06/2026', status:'Chờ xếp lớp', badge:'bg-warning bg-opacity-10 text-warning' },
  { name:'Phạm Thị Dung', phone:'0999 888 777', hang:'B1', regDate:'10/06/2026', status:'Đã tốt nghiệp', badge:'bg-info bg-opacity-10 text-info' },
  { name:'Hoàng Văn Em', phone:'0912 345 678', hang:'B1', regDate:'08/06/2026', status:'Đang học', badge:'bg-success bg-opacity-10 text-success' },
]
</script>
