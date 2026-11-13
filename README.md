# StudyFlow AI — LAB 5 · Track T2

Prototype trợ lý học tập cho khóa **Nhập môn phân tích dữ liệu**, buổi 3 **Thống kê mô tả**. Hai ca chính: **#5 tài liệu §3.3 có kiến thức sai** và **#2 xin xác nhận đáp án bài đang mở**.

## Mở demo Luna trực tiếp — cần OpenAI API key

**Muốn Luna phản hồi theo câu hỏi, cần API key OpenAI hợp lệ trong file `.env` trên máy.** Key không được đưa lên GitHub và không đi kèm repository. Chỉ mở HTML hoặc điền key mà chưa chạy launcher live thì chưa kết nối Luna.

1. Máy cần **Node.js 22 trở lên**, Windows và kết nối Internet cho chế độ live.
2. Trong thư mục gốc repository, sao chép [`.env.example`](.env.example) thành **`.env`**, cùng cấp với `spec.md`. Mở bằng trình soạn thảo và điền key của bạn:

   ```dotenv
   OPENAI_API_KEY=gia_tri_api_key_cua_ban
   OPENAI_MODEL=gpt-6-luna
   ```

   Thay giá trị mẫu bằng key thật, lưu đúng tên `.env`, tránh `.env.txt`. Không dán key vào README, HTML hoặc chat. File `.env` đã được Git ignore.

3. Trong **File Explorer**, mở thư mục `prototype`, bấm đúp **`Open-Live-Demo.cmd`**. Không cần chạy bash hoặc tự khởi động server. File này gọi `Start-Live-Demo.ps1`, chạy cầu nối Node cục bộ và mở trình duyệt.
4. Khi launcher đã chạy, mở một trong các trang sau trên **chính máy đó**:

   | Trang | Địa chỉ |
   |---|---|
   | Landing → Bắt đầu học | [Mở landing](http://127.0.0.1:5180/landing.html) |
   | Trợ lý học tập | [Mở demo](http://127.0.0.1:5180/index.html) |
   | Vào thẳng ca #2 | [Mở ca bài tập](http://127.0.0.1:5180/index.html#exercise) |

Các địa chỉ `127.0.0.1` là **demo trên máy**, không phải website online để chia sẻ cho người khác. Người demo trên máy khác cần clone/download repo, tự cấu hình `.env` và chạy launcher.

### Nhận biết API key có đang được dùng

- Gửi câu hỏi trong phạm vi được phép. **Luna · trực tiếp** cho biết câu trả lời ca #5 được sinh qua API; ca #2 hiển thị **Luna · gợi ý giới hạn**, dùng nội dung hướng dẫn đã duyệt để bảo vệ bài đang mở.
- Nếu có nhãn **Fixture dự phòng**, xem lý do ngay trong phản hồi: có thể thiếu key, lỗi kết nối/quota/model hoặc kết quả vượt guardrail. Đây là phản hồi mẫu, không phải phản hồi Luna vừa sinh.
- Khi đang chờ phê duyệt hoặc minh họa phương án bị loại, phản hồi/trạng thái là mô phỏng theo workflow; không phải mỗi lần đổi quyền đều gọi API.
- Cầu nối đọc `.env` khi khởi động. Đổi key lúc nó đang chạy cần khởi động lại tiến trình `prototype/live-server.cjs`; chỉ tải lại trang không nạp key mới.

## Trình tự demo nhanh

1. Chọn **#5**: xem nguyên văn §3.3, phản ví dụ **0,25 → 0,5**, mở nguồn trích dẫn.
2. Thử ①/②/③ ở panel trên. Phần **Học viên nhìn thấy** bên dưới đổi phản hồi và bản nháp theo quyền. Khuyến nghị cố định là **②**.
3. Ở ②, đóng vai giảng viên mô phỏng: thử **Approve / Reject / Hủy**. Chỉ sau Approve mới xuất hiện cảnh báo lớp mô phỏng; có thể gỡ nhưng không thu hồi được thông tin đã đọc.
4. Chuyển sang **#2**. Thử gợi ý giới hạn, chờ TA duyệt và phương án AI tự giải. Ca tự giải hiện lời giải dạng xem trước với lựa chọn/đáp án **đã che**; khuyến nghị giữ **①**.
5. Bật nút **i** để hiện marker HAX/PAIR; thử **VI/EN**, **Dark/Light** và **Reset Demo** để chạy lại.

**TA và FAQ luôn là mô phỏng cục bộ**, kể cả khi Luna đang trả lời qua API thật. Không có yêu cầu thực sự gửi tới TA, không công bố FAQ thật, không database và không tự sửa tài liệu. Chỉ nhập dữ liệu dựng để demo; ở chế độ live, câu hỏi/ngữ cảnh giới hạn được gửi tới OpenAI.

## Mở bản không cần API key

Bấm đúp **`prototype/Open-Demo.cmd`** → landing → **Bắt đầu học**. Hoặc mở `prototype/landing.html` / `prototype/index.html` trực tiếp. Bản này dùng fixture, không gọi LLM; các ca, quyền tự chủ và approval vẫn tương tác được.

`Generate-Luna-Demo.cmd` là công cụ cũ để tạo sẵn cấu hình gợi mở, **không phải launcher chat trực tiếp**. Khi muốn dùng key để hỏi Luna, chọn **`Open-Live-Demo.cmd`**.

## Tài liệu

- [Hướng dẫn prototype, autonomy, HAX/PAIR và ảnh minh họa](prototype/README.md)
- [Ghi chú quyết định autonomy](prototype/AUTONOMY-NOTES.md)
- [Kiểm thử và giới hạn](prototype/QA.md)
- [Đặc tả nhóm](spec.md)
