/**
 * Logic trả lời của bot tư vấn DriveHub.
 * Hàm thuần (pure) — không phụ thuộc router/API nên dễ unit test.
 * @param {string} userText Câu hỏi người dùng nhập.
 * @param {Array<{tenkhoahoc:string, hangBang:string, hocphi:number}>} [courses]
 * @returns {string} Nội dung trả lời.
 */
export function getBotReply(userText, courses = []) {
  const t = (userText || "").toLowerCase();

  if (t.match(/học phí|hoc phi|giá|tiền|bao nhiêu|phí|phi/)) {
    if (courses.length) {
      const lines = courses
        .map((c) => `- ${c.tenkhoahoc}: ${Number(c.hocphi).toLocaleString("vi-VN")} VNĐ`)
        .join("\n");
      return `Học phí các khóa hiện tại:\n${lines}\nBạn có thể xem chi tiết tại trang Bảng giá.`;
    }
    return "Hiện tại trung tâm có các khóa hạng B2, C... Bạn vui lòng xem trang Bảng giá để biết học phí chi tiết hoặc gọi hotline 1900 1234.";
  }

  if (t.match(/khóa học|khoá học|hạng bằng|hạng b|hạng c|đào tạo|f tim học|tìm khóa/)) {
    if (courses.length) {
      const lines = courses.map((c) => `- ${c.tenkhoahoc} (hạng ${c.hangBang})`).join("\n");
      return `DriveHub đang mở các khóa:\n${lines}\nBạn muốn đăng ký khóa nào ạ?`;
    }
    return "Chúng tôi đào tạo các hạng B2, C... Bạn có thể xem chi tiết tại trang Khóa học.";
  }

  if (t.match(/đăng ký|đăng ki|học thế nào|làm sao|thủ tục|để học/)) {
    return "Để đăng ký, bạn bấm nút “Đăng ký khóa học” trên trang, điền họ tên, SĐT, email, chọn khóa học, xác thực OTP qua email là hoàn tất. Nhân viên sẽ liên hệ hỗ trợ sớm nhất.";
  }

  if (t.match(/liên hệ|lien he|hotline|số điện thoại|so dien thoai|địa chỉ|dia chi|email|gmail/)) {
    return "Thông tin liên hệ DriveHub:\n📍 123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM\n📞 1900 1234 – 028 1234 5678\n✉️ lienhe@drivehub.vn\n🕒 7:00 – 21:00 (Thứ 2 – Chủ nhật)";
  }

  if (t.match(/giờ|gio|lịch học|lich hoc|mấy giờ|may gio|thời gian|thoi gian|ca học|ca hoc/)) {
    return "Trung tâm phục vụ từ 7:00 đến 21:00 tất cả các ngày trong tuần (Thứ 2 – Chủ nhật), lịch học linh hoạt theo ca sáng – chiều – tối.";
  }

  if (t.match(/cảm ơn|cam on|thanks|thank/)) {
    return "Rất sẵn lòng giúp bạn! Nếu cần thêm thông tin, cứ nhắn nhé 😊";
  }

  return "Cảm ơn bạn đã quan tâm. Bạn có thể hỏi về: học phí, các khóa học, cách đăng ký, hoặc thông tin liên hệ. Hoặc gọi hotline 1900 1234 để được tư vấn trực tiếp.";
}