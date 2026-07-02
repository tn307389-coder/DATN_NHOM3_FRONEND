<template>
  <div>
    <h3>Hồ sơ học viên</h3>
    <table border="1" width="100%" cellpadding="6" style="border-collapse:collapse;">
      <tr bgcolor="#eee">
        <th>Mã HS</th><th>Học viên</th><th>Hạng</th><th>Giấy tờ</th><th>Trạng thái</th>
      </tr>
      <tr v-for="h in data" :key="h.ma">
        <td>{{ h.ma }}</td><td>{{ h.hv }}</td><td>{{ h.hang }}</td><td>{{ h.giayTo }}</td>
        <td><span :style="{background:h.bg,color:h.fg,padding:'2px 8px',borderRadius:4,fontSize:13}">{{ h.status }}</span></td>
      </tr>
    </table>
  </div>
</template>
<script setup>
const data = [
  { ma:'HS001', hv:'Nguyễn Văn An', hang:'B1', giayTo:'Đầy đủ', status:'Đã duyệt', bg:'#d4edda', fg:'#155724' },
  { ma:'HS002', hv:'Trần Thị Bình', hang:'B2', giayTo:'Đầy đủ', status:'Đã duyệt', bg:'#d4edda', fg:'#155724' },
  { ma:'HS003', hv:'Lê Văn Cường', hang:'C', giayTo:'Đầy đủ', status:'Chờ duyệt', bg:'#fff3cd', fg:'#856404' },
  { ma:'HS004', hv:'Phạm Thị Dung', hang:'B1', giayTo:'Thiếu CMND', status:'Thiếu giấy tờ', bg:'#f8d7da', fg:'#721c24' },
  { ma:'HS005', hv:'Hoàng Văn Em', hang:'B1', giayTo:'Đầy đủ', status:'Chờ duyệt', bg:'#fff3cd', fg:'#856404' },
]
</script>
