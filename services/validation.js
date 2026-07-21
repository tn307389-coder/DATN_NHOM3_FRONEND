// Kiểm tra các trường bắt buộc của một form.
// form: object chứa dữ liệu (vd: form.value)
// fields: mảng [{ key, label }] – các trường cần bắt buộc nhập
// Trả về mảng nhãn các trường bị để trống (rỗng nếu hợp lệ).
export function getMissingRequired(form, fields) {
  return fields
    .filter((f) => !String(form[f.key] ?? "").trim())
    .map((f) => f.label);
}

// Trả về chuỗi thông báo lỗi (rỗng nếu không thiếu trường nào).
export function requiredError(form, fields) {
  const missing = getMissingRequired(form, fields);
  return missing.length ? "Vui lòng điền đầy đủ: " + missing.join(", ") : "";
}
