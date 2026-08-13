import { describe, it, expect } from "vitest";
import { getBotReply } from "../services/chatbot";

const courses = [
  { tenkhoahoc: "Khóa B2", hangBang: "B2", hocphi: 15000000 },
  { tenkhoahoc: "Khóa C", hangBang: "C", hocphi: 20000000 },
];

describe("chatbot getBotReply", () => {
  it("trả lời về học phí kèm số thật khi có danh sách khóa", () => {
    const reply = getBotReply("học phí khóa B2 bao nhiêu?", courses);
    expect(reply).toContain("15.000.000");
    expect(reply).toContain("Bảng giá");
  });

  it("trả lời học phí dùng nội dung mặc định khi không có khóa", () => {
    const reply = getBotReply("học phí bao nhiêu?", []);
    expect(reply).toContain("hotline 1900 1234");
  });

  it("liệt kê khóa học khi hỏi về khóa", () => {
    const reply = getBotReply("trung tâm có những khóa học nào?", courses);
    expect(reply).toContain("Khóa B2 (hạng B2)");
    expect(reply).toContain("Khóa C (hạng C)");
  });

  it("hướng dẫn đăng ký khi hỏi cách đăng ký", () => {
    const reply = getBotReply("làm sao để đăng ký?", courses);
    expect(reply).toContain("OTP");
  });

  it("cung cấp thông tin liên hệ", () => {
    const reply = getBotReply("cho mình số hotline", courses);
    expect(reply).toContain("1900 1234");
    expect(reply).toContain("lienhe@drivehub.vn");
  });

  it("trả lời mặc định cho câu hỏi không rõ", () => {
    const reply = getBotReply("blablabla", courses);
    expect(reply).toContain("1900 1234");
  });
});
