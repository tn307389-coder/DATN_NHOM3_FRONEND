<template>
  <div class="site">
    <!-- Hero -->
    <section id="top" class="hero">
      <div class="container hero-grid">
        <div class="hero-text">
          <span class="hero-badge">⭐ Trung tâm đào tạo & sát hạch lái xe uy tín #1</span>
          <h1>
            Học lái xe dễ dàng,<br />
            <span class="hl">lấy bằng nhanh chóng</span>
          </h1>
          <p>
            DriveHub đồng hành cùng bạn trên hành trình chinh phục vô lăng – từ
            đăng ký khóa học, luyện tập thực hành đến thi sát hạch và tra cứu
            giấy phép lái xe, tất cả trong một hệ thống hiện đại.
          </p>

          <div class="hero-actions">
            <a href="#khoa-hoc" class="btn-primary-lg">Xem khóa học</a>
            <button class="btn-ghost-lg" @click="loggedIn ? goPortal() : (showLogin = true)">
              <i class="bi bi-person-circle"></i>
              {{ loggedIn ? "Vào hệ thống" : "Đăng nhập hệ thống" }}
            </button>
          </div>

          <ul class="hero-features">
            <li>🚗 Đào tạo các hạng A1 – E</li>
            <li>📅 Lịch học & điểm danh trực tuyến</li>
            <li>📝 Thi sát hạch & tra cứu kết quả</li>
            <li>🪪 Quản lý hồ sơ & cấp lại GPLX</li>
          </ul>
        </div>

        <div class="hero-visual">
          <div class="visual-card">
            <div class="visual-emoji">🚘</div>
            <div class="visual-chips">
              <span class="chip">Bằng B2</span>
              <span class="chip">B1 số tự động</span>
              <span class="chip">A1 xe máy</span>
              <span class="chip">C xe tải</span>
            </div>
          </div>
          <div class="floating-stat s1">🎓 25.000+ học viên</div>
          <div class="floating-stat s2"> 95% tỷ lệ đậu</div>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="stats">
      <div class="container stats-grid">
        <div class="stat">
          <strong>15<i>+</i></strong>
          <span>Năm kinh nghiệm</span>
        </div>
        <div class="stat">
          <strong>50<i>+</i></strong>
          <span>Giáo viên chuyên nghiệp</span>
        </div>
        <div class="stat">
          <strong>30<i>+</i></strong>
          <span>Xe tập lái hiện đại</span>
        </div>
        <div class="stat">
          <strong>98<i>%</i></strong>
          <span>Hài lòng học viên</span>
        </div>
      </div>
    </section>

    <!-- Giới thiệu -->
    <section id="gioi-thieu" class="section">
      <div class="container about-grid">
        <div class="about-text">
          <span class="eyebrow">Về chúng tôi</span>
          <h2>Trung tâm đào tạo lái xe hàng đầu</h2>
          <p>
            Với cơ sở vật chất khang trang, đội ngũ giáo viên giàu kinh nghiệm
            và giáo trình chuẩn Bộ GTVT, DriveHub cam kết mang đến trải nghiệm
            học lái xe an toàn, bài bản và hiệu quả.
          </p>
          <ul class="tick-list">
            <li>✔ Giáo trình chuẩn Bộ Giao thông Vận tải</li>
            <li>✔ Xe tập lái đời mới, bảo hiểm toàn diện</li>
            <li>✔ Lịch học linh hoạt, ca sáng – chiều – tối</li>
            <li>✔ Hỗ trợ thủ tục thi và cấp bằng tận nơi</li>
          </ul>
        </div>
        <div class="about-cards">
          <div class="mini-card">
            <div class="mini-ic">🎯</div>
            <h4>Tỷ lệ đậu cao</h4>
            <p>Phương pháp giảng dạy thực tế giúp học viên tự tin khi thi.</p>
          </div>
          <div class="mini-card">
            <div class="mini-ic">🕒</div>
            <h4>Linh hoạt thời gian</h4>
            <p>Đăng ký ca học phù hợp với lịch trình cá nhân.</p>
          </div>
          <div class="mini-card">
            <div class="mini-ic">💡</div>
            <h4>Hỗ trợ tận tâm</h4>
            <p>Giáo viên và nhân viên đồng hành mọi lúc.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Hạng GPLX -->
    <section id="hang-gplx" class="section alt">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Các hạng đào tạo</span>
          <h2>Hạng giấy phép lái xe</h2>
          <p>Đa dạng hạng bằng phù hợp với nhu cầu của từng học viên.</p>
        </div>

        <div class="cards-grid">
          <div class="license-card">
            <div class="lc-badge">A1</div>
            <h4>Xe máy đến 125cc</h4>
            <p>Học và thi hạng A1 cho xe máy dung tích nhỏ, phổ biến nhất.</p>
            <span class="lc-tag">Tuổi từ 18</span>
          </div>
          <div class="license-card">
            <div class="lc-badge">A2</div>
            <h4>Xe máy trên 125cc</h4>
            <p>Dành cho xe phân khối lớn, mô tô phân khối lớn.</p>
            <span class="lc-tag">Tuổi từ 18</span>
          </div>
          <div class="license-card">
            <div class="lc-badge">B1</div>
            <h4>Ô tô số tự động</h4>
            <p>Lái xe ô tô số tự động đến 9 chỗ ngồi.</p>
            <span class="lc-tag">Tuổi từ 18</span>
          </div>
          <div class="license-card">
            <div class="lc-badge">B2</div>
            <h4>Ô tô số sàn</h4>
            <p>Hạng phổ biến nhất, lái ô tô số sàn & số tự động.</p>
            <span class="lc-tag">Tuổi từ 18</span>
          </div>
          <div class="license-card">
            <div class="lc-badge">C</div>
            <h4>Xe tải</h4>
            <p>Đào tạo lái xe tải trọng tải lớn, phục vụ vận tải.</p>
            <span class="lc-tag">Tuổi từ 21</span>
          </div>
          <div class="license-card">
            <div class="lc-badge">D/E</div>
            <h4>Khách & cao cấp</h4>
            <p>Lái xe khách, xe buýt và các hạng nâng cao.</p>
            <span class="lc-tag">Tuổi từ 24</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Khóa học -->
    <section id="khoa-hoc" class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Chương trình học</span>
          <h2>Các khóa học lái xe</h2>
          <p>Lộ trình học bài bản từ lý thuyết đến thực hành.</p>
        </div>

        <div class="cards-grid course-grid">
          <div class="course-card">
            <div class="course-ic">🚦</div>
            <h4>Học viên mới</h4>
            <p>
              Trọn gói lý thuyết + thực hành, phù hợp người chưa biết lái.
            </p>
            <ul>
              <li>Giáo trình chuẩn Bộ GTVT</li>
              <li>Thi thử lý thuyết online</li>
              <li>Thực hành sa hình & đường trường</li>
            </ul>
            <button class="btn-outline" @click="openRegister()">
              Đăng ký tư vấn
            </button>
          </div>
          <div class="course-card highlight">
            <div class="ribbon">Phổ biến</div>
            <div class="course-ic">🚗</div>
            <h4>Lái xe B2</h4>
            <p>Khóa học toàn diện hạng B2 – lựa chọn của đa số học viên.</p>
            <ul>
              <li>3 tháng hoàn thành</li>
              <li>Xe đời mới, bảo hiểm full</li>
              <li>Hỗ trợ thi sát hạch</li>
            </ul>
            <button class="btn-primary" @click="openRegister()">
              Đăng ký ngay
            </button>
          </div>
          <div class="course-card">
            <div class="course-ic">⬆️</div>
            <h4>Nâng hạng</h4>
            <p>
              Nâng hạng bằng hiện tại (B2 lên C, A1 lên A2...) nhanh chóng.
            </p>
            <ul>
              <li>Miễn giảm học phần</li>
              <li>Lịch học linh hoạt</li>
              <li>Hồ sơ đơn giản</li>
            </ul>
            <button class="btn-outline" @click="openRegister()">
              Đăng ký tư vấn
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Tại sao chọn -->
    <section class="section alt">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Cam kết</span>
          <h2>Tại sao chọn DriveHub</h2>
        </div>
        <div class="cards-grid feature-grid">
          <div class="feature">
            <div class="f-ic">🏫</div>
            <h4>Cơ sở hiện đại</h4>
            <p>Phòng học tiêu chuẩn, sa hình chuẩn thi sát hạch.</p>
          </div>
          <div class="feature">
            <div class="f-ic">👨‍🏫</div>
            <h4>Giáo viên giỏi</h4>
            <p>Đội ngũ giáo viên nhiệt huyết, nhiều năm kinh nghiệm.</p>
          </div>
          <div class="feature">
            <div class="f-ic">📱</div>
            <h4>Quản lý online</h4>
            <p>Theo dõi lịch học, điểm danh, kết quả trên hệ thống.</p>
          </div>
          <div class="feature">
            <div class="f-ic">💰</div>
            <h4>Học phí minh bạch</h4>
            <p>Chi phí trọn gói, không phát sinh trong quá trình học.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Quy trình -->
    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Đơn giản</span>
          <h2>Quy trình đăng ký 4 bước</h2>
        </div>
        <div class="steps">
          <div class="step">
            <div class="step-no">1</div>
            <h4>Đăng ký</h4>
            <p>Tạo tài khoản và chọn khóa học phù hợp.</p>
          </div>
          <div class="step">
            <div class="step-no">2</div>
            <h4>Học lý thuyết</h4>
            <p>Học luật giao thông & thi thử online.</p>
          </div>
          <div class="step">
            <div class="step-no">3</div>
            <h4>Thực hành</h4>
            <p>Luyện tập sa hình và đường trường cùng giáo viên.</p>
          </div>
          <div class="step">
            <div class="step-no">4</div>
            <h4>Thi & nhận bằng</h4>
            <p>Thi sát hạch và nhận GPLX sau khi đậu.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta">
      <div class="container cta-inner">
        <h2>Sẵn sàng lên vô lăng cùng DriveHub?</h2>
        <p>Đăng nhập hệ thống để đăng ký khóa học và theo dõi lộ trình học.</p>
        <button class="btn-primary-lg light"             @click="loggedIn ? goPortal() : (showLogin = true)">
          Đăng nhập ngay
        </button>
      </div>
    </section>

    <!-- Liên hệ -->
    <section id="lien-he" class="section alt">
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
          <button class="btn-primary" @click="openRegister()">
            Đăng ký khóa học
          </button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container footer-inner">
        <div>
          <div class="brand">
            <img src="/logo1.jpg" alt="Logo" class="brand-logo" />
            <span>DriveHub</span>
          </div>
          <p class="footer-desc">
            Hệ thống quản lý trung tâm đào tạo & sát hạch lái xe hiện đại.
          </p>
        </div>
        <div class="footer-links">
          <a href="#gioi-thieu">Giới thiệu</a>
          <a href="#hang-gplx">Hạng GPLX</a>
          <a href="#khoa-hoc">Khóa học</a>
          <a href="#lien-he">Liên hệ</a>
        </div>
      </div>
      <div class="footer-bottom">
        © 2026 DriveHub. Bản quyền thuộc về Trung tâm Đào tạo Lái xe.
      </div>
    </footer>
  </div>

    <!-- Modal đăng nhập / đăng ký (gộp chung) -->
    <div
      class="login-modal-overlay"
      v-if="showLogin"
      @click.self="showLogin = false"
    >
      <div class="login-modal">
        <button class="modal-close" @click="showLogin = false">&times;</button>

        <div class="text-center mb-3">
          <img src="/logo1.jpg" alt="Logo" class="login-logo" />
        </div>

        <!-- Tabs -->
        <div class="d-flex mb-4 auth-tabs">
          <button
            class="auth-tab flex-fill text-center py-2 fw-bold rounded-3"
            :class="authTab === 'login' ? 'active' : 'text-muted'"
            @click="authTab = 'login'"
          >Đăng nhập</button>
          <button
            class="auth-tab flex-fill text-center py-2 fw-bold rounded-3"
            :class="authTab === 'register' ? 'active' : 'text-muted'"
            @click="authTab = 'register'"
          >Đăng ký</button>
        </div>

        <!-- Tab Login -->
        <form v-if="authTab === 'login'" @submit.prevent="handleLogin">
          <div class="mb-3">
            <label class="form-label">Tên tài khoản hoặc CCCD</label>
            <input
              ref="userInput"
              v-model="username"
              type="text"
              class="form-control form-control-lg"
              placeholder="Nhập tên tài khoản hoặc CCCD"
            />
          </div>

          <div class="mb-3">
            <label class="form-label">Mật khẩu</label>
            <input
              v-model="password"
              type="password"
              class="form-control form-control-lg"
              placeholder="Nhập mật khẩu"
            />
          </div>

          <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>

          <button type="submit" class="btn btn-primary btn-lg w-100">Đăng nhập</button>

          <div class="text-center mt-3">
            <small class="text-muted">
              Chưa có tài khoản?
              <a href="#" class="text-primary fw-semibold" @click.prevent="authTab = 'register'">Đăng ký ngay</a>
            </small>
          </div>
        </form>

        <!-- Tab Register -->
        <form v-if="authTab === 'register'" @submit.prevent="submitRegister">
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
              <label class="form-label">Gmail <span class="text-danger">*</span></label>
              <input v-model="registerForm.email" type="email" class="form-control" placeholder="user@gmail.com" required />
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Số điện thoại <span class="text-danger">*</span></label>
              <input v-model="registerForm.sodienthoai" type="text" class="form-control" placeholder="0912..." required />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Địa chỉ <span class="text-danger">*</span></label>
              <input v-model="registerForm.diachi" type="text" class="form-control" placeholder="Quận/Huyện, Tỉnh/TP" required />
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Khóa học đăng ký <span class="text-danger">*</span></label>
            <select v-model="registerForm.makh" class="form-select" required>
              <option value="">-- Chọn khóa học --</option>
              <option v-for="kh in khoaHocList" :key="kh.makh" :value="kh.makh">{{ kh.tenkhoahoc }}</option>
            </select>
          </div>

          <div v-if="registerError" class="alert alert-danger py-2">{{ registerError }}</div>
          <div v-if="registerSuccess" class="alert alert-success py-2">{{ registerSuccess }}</div>

          <button type="submit" class="btn btn-primary btn-lg w-100" :disabled="registerLoading">
            {{ registerLoading ? "Đang gửi..." : "Gửi đăng ký" }}
          </button>

          <div class="text-center mt-3">
            <small class="text-muted">
              Đã có tài khoản?
              <a href="#" class="text-primary fw-semibold" @click.prevent="authTab = 'login'">Đăng nhập</a>
            </small>
          </div>
        </form>

        <div class="text-center mt-3">
          <small class="text-muted">TK demo: admin / admin123 (quản trị) — hocvien1 / 123456 (học viên) — giaovien1 / 123456 (giáo viên)</small>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";
import { roleHome } from "../services/permissions";
import { useSite } from "../composables/useSite";

const router = useRouter();
const { showLogin, authVersion, authTab, registerForm, registerLoading, registerError, registerSuccess, khoaHocList, submitRegister, openRegister, loadKhoaHocPublic } = useSite();

const username = ref("");
const password = ref("");
const error = ref("");
const userInput = ref(null);

// Người dùng hiện tại (đọc khi component được mount)
let siteUser = {};
try {
  siteUser = JSON.parse(localStorage.getItem("user") || "{}");
} catch (e) {
  siteUser = {};
}
const loggedIn = !!siteUser.maVaiTro;

const goPortal = () => router.push(roleHome(siteUser.maVaiTro));

watch(showLogin, (val) => {
  if (val) {
    nextTick(() => userInput.value?.focus());
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
});

const handleLogin = async () => {
  if (!username.value || !password.value) {
    error.value = "Vui lòng nhập đầy đủ thông tin";
    return;
  }

  try {
    const res = await api.post("/login", {
      tendangnhap: username.value,
      matkhau: password.value,
    });

    if (res.data.success) {
      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.data));

      showLogin.value = false;
      authVersion.value++;
      router.push(roleHome(res.data.data.maVaiTro));
    } else {
      error.value = res.data.message;
    }
  } catch (err) {
    error.value = err.response?.data?.message || "Đăng nhập thất bại";
    console.error(err);
  }
};

// Đăng ký khóa học công khai — dùng từ useSite
loadKhoaHocPublic();

loadKhoaHocPublic();
</script>

<style scoped>
.site {
  font-family: inherit;
  color: #1f2937;
}

.container {
  width: 100%;
  max-width: 1160px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Navbar */
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 16px rgba(15, 23, 42, 0.08);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 800;
  color: #0d6efd;
  text-decoration: none;
}

.brand small {
  display: block;
  font-size: 11px;
  font-weight: 500;
  color: #6b7280;
  letter-spacing: 0.3px;
}

.brand-logo {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  object-fit: cover;
}

.nav-links a {
  margin: 0 16px;
  color: #374151;
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: #0d6efd;
}

.login-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #0d6efd, #2563eb);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  padding: 10px 20px;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(13, 110, 253, 0.3);
  transition: 0.2s;
}

.login-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(13, 110, 253, 0.4);
}

/* Hero */
.hero {
  background: linear-gradient(135deg, #0b1220 0%, #0d6efd 100%);
  color: #fff;
  padding: 70px 0 90px;
  overflow: hidden;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 50px;
  align-items: center;
}

.hero-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.14);
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 13px;
  margin-bottom: 18px;
}

.hero-text h1 {
  font-size: 46px;
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 18px;
}

.hero-text .hl {
  color: #ffd86b;
}

.hero-text p {
  font-size: 17px;
  line-height: 1.7;
  opacity: 0.92;
  margin-bottom: 26px;
}

.hero-actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 26px;
}

.btn-primary-lg {
  display: inline-flex;
  align-items: center;
  background: #ffd86b;
  color: #1f2937;
  font-weight: 700;
  padding: 13px 26px;
  border-radius: 14px;
  text-decoration: none;
  transition: 0.2s;
}

.btn-primary-lg:hover {
  transform: translateY(-2px);
}

.btn-ghost-lg {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.4);
  font-weight: 600;
  padding: 13px 22px;
  border-radius: 14px;
  cursor: pointer;
  transition: 0.2s;
}

.btn-ghost-lg:hover {
  background: rgba(255, 255, 255, 0.2);
}

.hero-features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 20px;
}

.hero-features li {
  font-size: 14px;
  opacity: 0.92;
}

/* Hero visual */
.hero-visual {
  position: relative;
  display: flex;
  justify-content: center;
}

.visual-card {
  width: 320px;
  height: 320px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}

.visual-emoji {
  font-size: 90px;
}

.visual-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  max-width: 240px;
}

.chip {
  background: rgba(255, 255, 255, 0.18);
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 13px;
}

.floating-stat {
  position: absolute;
  background: #fff;
  color: #1f2937;
  font-weight: 700;
  font-size: 14px;
  padding: 10px 16px;
  border-radius: 14px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
}

.floating-stat.s1 {
  top: 10px;
  left: 0;
}

.floating-stat.s2 {
  bottom: 10px;
  right: 0;
}

/* Stats */
.stats {
  background: #0d6efd;
  color: #fff;
  padding: 36px 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  text-align: center;
}

.stat strong {
  display: block;
  font-size: 38px;
  font-weight: 800;
}

.stat strong i {
  font-size: 22px;
  font-style: normal;
  opacity: 0.8;
}

.stat span {
  font-size: 14px;
  opacity: 0.9;
}

/* Sections */
.section {
  padding: 70px 0;
}

.section.alt {
  background: #f4f7fb;
}

.section-head {
  text-align: center;
  max-width: 640px;
  margin: 0 auto 40px;
}

.eyebrow {
  display: inline-block;
  color: #0d6efd;
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
}

.section-head h2 {
  font-size: 32px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 10px;
}

.section-head p {
  color: #6b7280;
}

/* About */
.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  align-items: center;
}

.about-text h2 {
  font-size: 30px;
  font-weight: 800;
  margin-bottom: 14px;
}

.about-text p {
  color: #4b5563;
  line-height: 1.7;
  margin-bottom: 18px;
}

.tick-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tick-list li {
  padding: 8px 0;
  color: #374151;
  font-weight: 500;
}

.about-cards {
  display: grid;
  gap: 16px;
}

.mini-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.06);
}

.mini-ic {
  font-size: 30px;
  margin-bottom: 8px;
}

.mini-card h4 {
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 6px;
}

.mini-card p {
  color: #6b7280;
  margin: 0;
  font-size: 14px;
}

/* Cards grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

/* License */
.license-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 26px;
  text-align: center;
  transition: 0.25s;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.05);
}

.license-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 36px rgba(13, 110, 253, 0.18);
}

.lc-badge {
  width: 64px;
  height: 64px;
  margin: 0 auto 14px;
  border-radius: 16px;
  background: linear-gradient(135deg, #0d6efd, #2563eb);
  color: #fff;
  font-size: 22px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.license-card h4 {
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 8px;
}

.license-card p {
  color: #6b7280;
  font-size: 14px;
  min-height: 42px;
}

.lc-tag {
  display: inline-block;
  margin-top: 10px;
  background: #eef2ff;
  color: #0d6efd;
  font-size: 13px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 999px;
}

/* Course */
.course-card {
  position: relative;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 22px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.06);
}

.course-card.highlight {
  border: 2px solid #0d6efd;
  box-shadow: 0 16px 40px rgba(13, 110, 253, 0.2);
}

.ribbon {
  position: absolute;
  top: -12px;
  left: 28px;
  background: #ffd86b;
  color: #1f2937;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 999px;
}

.course-ic {
  font-size: 38px;
  margin-bottom: 10px;
}

.course-card h4 {
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 8px;
}

.course-card p {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 14px;
}

.course-card ul {
  list-style: none;
  padding: 0;
  margin: 0 0 18px;
  flex: 1;
}

.course-card ul li {
  padding: 6px 0;
  color: #374151;
  font-size: 14px;
  border-bottom: 1px dashed #eef2f7;
}

.btn-primary,
.btn-outline {
  border-radius: 12px;
  font-weight: 700;
  padding: 11px 18px;
  cursor: pointer;
  border: none;
  transition: 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #0d6efd, #2563eb);
  color: #fff;
  box-shadow: 0 6px 16px rgba(13, 110, 253, 0.28);
}

.btn-primary:hover {
  transform: translateY(-1px);
}

.btn-outline {
  background: #fff;
  color: #0d6efd;
  border: 2px solid #0d6efd;
}

.btn-outline:hover {
  background: #0d6efd;
  color: #fff;
}

/* Features */
.feature-grid {
  grid-template-columns: repeat(4, 1fr);
}

.feature {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.05);
}

.f-ic {
  font-size: 36px;
  margin-bottom: 10px;
}

.feature h4 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 6px;
}

.feature p {
  color: #6b7280;
  font-size: 14px;
  margin: 0;
}

/* Steps */
.steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 22px;
}

.step {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  padding: 26px 20px;
  text-align: center;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.05);
}

.step-no {
  width: 48px;
  height: 48px;
  margin: 0 auto 14px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0d6efd, #2563eb);
  color: #fff;
  font-size: 20px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step h4 {
  font-weight: 700;
  margin-bottom: 6px;
}

.step p {
  color: #6b7280;
  font-size: 14px;
  margin: 0;
}

/* CTA */
.cta {
  background: linear-gradient(135deg, #0d6efd, #1e293b);
  color: #fff;
  padding: 64px 0;
  text-align: center;
}

.cta-inner h2 {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 12px;
}

.cta-inner p {
  opacity: 0.9;
  margin-bottom: 24px;
}

.btn-primary-lg.light {
  background: #fff;
  color: #0d6efd;
}

.btn-primary-lg.light:hover {
  background: #ffd86b;
  color: #1f2937;
}

/* Contact */
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
}

.contact-list {
  list-style: none;
  padding: 0;
  margin: 18px 0 0;
}

.contact-list li {
  display: flex;
  gap: 12px;
  padding: 10px 0;
  font-size: 15px;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.contact-card {
  background: #fff;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}

.contact-card h4 {
  font-weight: 800;
  margin-bottom: 10px;
}

.contact-card p {
  color: #6b7280;
  margin-bottom: 18px;
}

/* Footer */
.footer {
  background: #0b1220;
  color: #cbd5e1;
  padding: 50px 0 24px;
}

.footer-inner {
  display: flex;
  justify-content: space-between;
  gap: 30px;
  flex-wrap: wrap;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.footer .brand {
  color: #fff;
}

.footer-desc {
  max-width: 320px;
  margin-top: 12px;
  font-size: 14px;
  color: #94a3b8;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-links a {
  color: #cbd5e1;
  text-decoration: none;
  font-size: 14px;
}

.footer-links a:hover {
  color: #fff;
}

.footer-bottom {
  text-align: center;
  padding-top: 18px;
  font-size: 13px;
  color: #64748b;
}

/* Modal */
.login-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1050;
  animation: fadeIn 0.2s ease;
}

.login-modal {
  position: relative;
  width: 100%;
  max-width: 500px;
  background: #fff;
  padding: 36px;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 16px;
  border: none;
  background: transparent;
  font-size: 28px;
  line-height: 1;
  color: #aaa;
  cursor: pointer;
}

.modal-close:hover {
  color: #333;
}

.login-logo {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 992px) {
  .hero-grid,
  .about-grid,
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  .hero-visual {
    display: none;
  }
  .cards-grid,
  .course-grid,
  .feature-grid,
  .steps {
    grid-template-columns: 1fr 1fr;
  }
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
  .nav-links {
    display: none;
  }
  .hero-text h1 {
    font-size: 34px;
  }
}

@media (max-width: 560px) {
  .cards-grid,
  .course-grid,
  .feature-grid,
  .steps,
  .stats-grid {
    grid-template-columns: 1fr;
  }
  .hero-features {
    grid-template-columns: 1fr;
  }
}

.auth-tabs {
  background: #f1f5f9;
  padding: 4px;
}
.auth-tab {
  border: none;
  background: transparent;
  transition: all 0.2s;
  cursor: pointer;
}
.auth-tab.active {
  background: #fff;
  color: #0d6efd !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
</style>
