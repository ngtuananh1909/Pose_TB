# POSE QUEST — Thử thách chọn 5 pose bằng thẻ úp

Trang web tương tác rút thẻ pose ngẫu nhiên dành cho teambuilding, minigame tiệc hoặc hoạt náo đội nhóm.

🌐 **Trải nghiệm trực tiếp trên GitHub Pages**:  
👉 [https://ngtuananh1909.github.io/Pose_TB/](https://ngtuananh1909.github.io/Pose_TB/)

---

## 🎯 Cách chơi
1. Nhấn **🎴 XÁO BÀI**: 20 thẻ pose bí mật sẽ được xáo đều và trải ra màn hình.
2. Người chơi chọn 1 thẻ bất kỳ đang úp.
3. Thẻ sẽ lật mở hiển thị hình ảnh pose chi tiết.
4. Bấm **✓ ĐÓNG ẢNH & GIỮ POSE** (hoặc dấu ×) để lưu pose vào danh sách đội (tính 1 lượt).
5. Lặp lại cho đến khi đội chọn đủ **5 pose**.
6. Nhấn **↺ ĐỔI TEAM / RESET** để chuyển sang đội tiếp theo (Team 02, Team 03...).

---

## 📱 Điểm nổi bật
- **Tối ưu Mobile-first**: Tự động tính toán số cột và kích thước thẻ vừa vặn màn hình điện thoại (không bị tràn ngang hay cuộn quá dài).
- **20 Pose phong phú**: Tự động liên kết đúng 20 ảnh thực tế trong thư mục `images/`.
- **Luật chơi linh hoạt**:
  - Mặc định: Không trùng pose trong cùng một đội, các đội sau được rút lại những pose của đội trước.
  - Tùy chọn: Cho phép trùng ảnh ngay trong đội.
- **Lưu lịch sử đội**: Tự động lưu kết quả các đội vào `localStorage` của trình duyệt.
