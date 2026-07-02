<template>
  <div>
    <h3>Quản lý Học viên</h3>
    <table border="1" width="100%" cellpadding="6" style="border-collapse:collapse;">
      <tr bgcolor="#eee">
        <th>Mã</th><th>Họ tên</th><th>SĐT</th><th>Hạng</th><th>Trạng thái</th>
      </tr>
      <tr v-for="h in data" :key="h.id">
        <td>{{ h.id }}</td><td>{{ h.name }}</td><td>{{ h.phone }}</td><td>{{ h.hang }}</td>
        <td><span :style="{background:h.bg,color:h.fg,padding:'2px 8px',borderRadius:4,fontSize:13}">{{ h.status }}</span></td>
      </tr>
    </table>
  </div>
</template>
<script setup>
const data = [
  { id:'HV001', name:'Nguyễn Văn An', phone:'0987 654 321', hang:'B1', status:'Đang học', bg:'#d4edda', fg:'#155724' },
  { id:'HV002', name:'Trần Thị Bình', phone:'0978 123 456', hang:'B2', status:'Đang học', bg:'#d4edda', fg:'#155724' },
  { id:'HV003', name:'Lê Văn Cường', phone:'0965 432 109', hang:'C', status:'Chờ xếp lớp', bg:'#fff3cd', fg:'#856404' },
  { id:'HV004', name:'Phạm Thị Dung', phone:'0999 888 777', hang:'B1', status:'Đã tốt nghiệp', bg:'#d1ecf1', fg:'#0c5460' },
  { id:'HV005', name:'Hoàng Văn Em', phone:'0912 345 678', hang:'B1', status:'Đang học', bg:'#d4edda', fg:'#155724' },
]
</script>
