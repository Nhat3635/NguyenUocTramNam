# Kế hoạch: Tích hợp Google Sheets để xử lý RSVP (Chỉ nhận Tên, SĐT, Tham gia)

### Mục tiêu
Tích hợp Google Sheets làm cơ sở dữ liệu (backend) cho biểu mẫu xác nhận tham gia (RSVP). Khi khách mời gửi biểu mẫu, thông tin của họ (Họ tên, Số điện thoại, và Trạng thái tham gia) sẽ được lưu trực tiếp vào Google Sheet thông qua Google Apps Script.

### Giả định
1. Người dùng có tài khoản Google và có thể tạo Google Sheet.
2. Người dùng có quyền cấu hình triển khai Apps Script dưới dạng Web App.
3. Giao diện biểu mẫu RSVP và các trường nhập liệu trên website đã được hoàn thiện.

### Kế hoạch chi tiết

1. **Tạo và Cấu hình Google Sheet**
   - **Thực hiện**: Tạo bảng tính Google Sheet và đặt tên tiêu đề cho các cột.
   - **Tên các cột (Hàng 1 từ cột A đến C)**: `Họ tên`, `Số điện thoại`, `Tham gia`
   - **Xác minh**: Bảng tính đã được tạo thành công với cấu trúc cột chính xác (3 cột).

2. **Viết và Triển khai Google Apps Script**
   - **Thực hiện**: Cung cấp đoạn mã Google Apps Script và hướng dẫn người dùng triển khai dưới dạng Ứng dụng web (Web App).
   - **Mã nguồn**:
     ```javascript
     function doPost(e) {
       try {
         var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
         var data = JSON.parse(e.postData.contents);
         
         // Thêm dấu nháy đơn trước số điện thoại để Google Sheets giữ nguyên số 0 ở đầu
         var formattedPhone = "'" + data.phone;
         
         // Thêm hàng dữ liệu: [Họ tên, Số điện thoại, Tham gia]
         sheet.appendRow([
           data.name,
           formattedPhone,
           data.attendance
         ]);
         
         return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
           .setMimeType(ContentService.MimeType.JSON);
       } catch (error) {
         return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
           .setMimeType(ContentService.MimeType.JSON);
       }
     }
     ```
   - **Cấu hình**: Cấu hình quyền truy cập thành "Bất kỳ ai" (Anyone) để cho phép nhận gửi dữ liệu từ website.
   - **Xác minh**: Nhận được đường dẫn URL Web App dạng `https://script.google.com/macros/s/.../exec`.

3. **Cập nhật Cấu hình ở Frontend**
   - **Tệp chỉnh sửa**: `js/script.js`
   - **Thay đổi**: Thay thế chuỗi rỗng trong `const RSVP_SCRIPT_URL = ""` bằng URL Web App vừa tạo ở trên.
   - **Xác minh**: Đảm bảo tệp đã lưu thành công và biến `RSVP_SCRIPT_URL` đã nhận giá trị URL.

4. **Kiểm tra liên thông đầu cuối (End-to-End)**
   - **Thực hiện**: Mở trình duyệt, thực hiện nhập và gửi biểu mẫu RSVP thử nghiệm.
   - **Xác minh**: Kiểm tra dữ liệu có xuất hiện ngay lập tức trên trang Google Sheet của bạn hay không (3 cột được điền tự động).

### Rủi ro & Cách khắc phục
- **Lỗi CORS/Chặn mạng**: Sử dụng `mode: "no-cors"` khi gọi API fetch ở phía frontend để gửi dữ liệu dạng tĩnh mà không lo lỗi chặn CORS.
- **Dữ liệu rác/Gửi lặp**: Các trường nhập liệu phía HTML đã có thuộc tính `required` để kiểm tra thông tin hợp lệ trước khi gửi.

### Kế hoạch khôi phục (Rollback)
- Trả biến `RSVP_SCRIPT_URL` trong `js/script.js` về chuỗi rỗng `""` để hệ thống tự động chạy ở chế độ giả lập cục bộ (Simulation mode).
