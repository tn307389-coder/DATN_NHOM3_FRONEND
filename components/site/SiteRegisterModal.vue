<template>
  <div class="login-modal-overlay" v-if="showRegister" @click.self="showRegister = false">
    <div class="login-modal register-modal">
      <button class="modal-close" @click="showRegister = false">&times;</button>

      <div class="text-center mb-3">
        <h3 class="mt-2">Đăng ký khóa học</h3>
        <p class="text-muted mb-0">
          Điền thông tin để đăng ký, chúng tôi sẽ duyệt và liên hệ bạn
        </p>
      </div>

      <form @submit.prevent="submitRegister">
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">Họ và tên <span class="text-danger">*</span></label>
            <input v-model="registerForm.hoten" type="text" class="form-control" placeholder="Nguyễn Văn A" required />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Ngày sinh <span class="text-danger">*</span></label>
            <input v-model="registerForm.ngaysinh" type="date" class="form-control" required />
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">Giới tính <span class="text-danger">*</span></label>
            <select v-model="registerForm.gioitinh" class="form-select" required>
              <option value="">-- Chọn --</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">CCCD <span class="text-danger">*</span></label>
            <input v-model="registerForm.cccd" type="text" class="form-control" placeholder="012345678901" required />
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">Số điện thoại <span class="text-danger">*</span></label>
            <input v-model="registerForm.sodienthoai" type="text" class="form-control" placeholder="0912..." required />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Email <span class="text-danger">*</span></label>
            <input v-model="registerForm.email" type="email" class="form-control" placeholder="email@drivehub.vn" required />
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">Địa chỉ <span class="text-danger">*</span></label>
          <input v-model="registerForm.diachi" type="text" class="form-control" placeholder="Quận/Huyện, Tỉnh/TP" required />
        </div>

        <div class="mb-3">
          <label class="form-label">Khóa học đăng ký <span class="text-danger">*</span></label>
          <select v-model="registerForm.makh" class="form-select" required>
            <option value="">-- Chọn khóa học --</option>
            <option v-for="kh in khoaHocList" :key="kh.makh" :value="kh.makh">
              {{ kh.tenkhoahoc }}
            </option>
          </select>
        </div>

        <div v-if="registerError" class="alert alert-danger py-2">{{ registerError }}</div>
        <div v-if="registerSuccess" class="alert alert-success py-2">{{ registerSuccess }}</div>

        <button type="submit" class="btn btn-primary btn-lg w-100" :disabled="registerLoading">
          {{ registerLoading ? "Đang gửi..." : "Gửi đăng ký" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useSite } from "../../composables/useSite";
const {
  khoaHocList,
  showRegister,
  registerLoading,
  registerError,
  registerSuccess,
  registerForm,
  submitRegister,
} = useSite();
</script>
