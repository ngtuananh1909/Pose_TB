# Truy Tìm Biểu Thức — Game Master

Trang web điều phối trò chơi **rút thẻ ảo, chạy lấy thẻ thật** cho bốn đội, mỗi đội ba cấp. Thiết kế cho một điện thoại gác trạm, không cần tài khoản và không có đáp án trong mã nguồn trang web.

## Cách sử dụng

1. Mở trang, bấm **Bắt đầu Team 01**.
2. Xáo và rút 1 lá trong các đề chưa dùng ở cấp hiện tại.
3. Cho đội đọc đề, bấm **Bắt đầu 30 giây**; người chơi chạy lấy thẻ và ghép biểu thức ngoài đời thật.
4. Gác trạm bấm **Đúng** hoặc **Sai**. Nếu hết giờ, bấm **Xác nhận hết giờ**. Web không tự chuyển cấp.
5. Chuyển tiếp cấp 2, 3; sau đó tới Team 02, 03, 04. Xem bảng xếp hạng ở cuối.

## Điểm và dữ liệu

- Cấp 1 = 10, cấp 2 = 20, cấp 3 = 30 điểm, ghi thời gian giải đúng.
- Trong cùng một phiên, các đội **không bốc trùng đề** ở từng cấp. Có 6 đề/cấp, 4 team dùng 4 đề; 2 đề còn lại dự phòng.
- **Reset team**: xóa điểm và kết quả của đội đang chơi nhưng giữ nguyên đề đã rút, tránh thao túng random.
- **Reset toàn bộ**: xóa tất cả điểm, thời gian và danh sách đề đã rút.
- **Sửa lần chấm**: cho phép sửa nhầm Đúng/Sai ngay trước khi chuyển cấp; không chạy lại đồng hồ.
- Lưu tự động trong `localStorage` của trình duyệt. **Không đồng bộ nhiều thiết bị**.

## Dụng cụ thật

- 2 bộ thẻ số 0–9 và 2 bộ 4 dấu `+ − × ÷`.
- Không cần thẻ ngoặc, không cần thẻ dấu bằng.
- Cấp 3 có thể cần các thẻ số hoặc dấu trùng nhau, vì vậy nên để cả 2 bộ cạnh nhau.

## Kỹ thuật

Web tĩnh HTML, CSS và JavaScript modules, không phụ thuộc CDN, thư viện ngoài hoặc công đoạn build. PWA có service worker và manifest; tải đầy đủ trang qua HTTPS ít nhất một lần rồi có thể dùng offline trên trình duyệt hỗ trợ. Mọi âm thanh đều được tạo từ Web Audio, không tải tệp nhạc.

### Chạy thử tại máy

```bash
python3 -m http.server 8000
# Mở http://localhost:8000/
```

### Test

```bash
node --test tests/*.test.mjs
```

### GitHub Pages

Đặt toàn bộ thư mục này trong `expression-hunt/` thuộc repo đang xuất bản GitHub Pages ở thư mục gốc. Trang nằm tại `/expression-hunt/`, không ảnh hưởng ứng dụng hiện có ở `/`.
