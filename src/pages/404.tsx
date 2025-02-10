import Link from "next/link";

export default function Custom404() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>404 - Page Not Found</h1>
      <p>Xin lỗi, chúng tôi không thể tìm thấy trang bạn yêu cầu.</p>
      <Link href="/">Quay lại trang chủ</Link>
    </div>
  );
}
