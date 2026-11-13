# Ghi chú §4 — AI Autonomy của prototype

Đã đồng bộ `origin/master` **ee00f61**, §4 đã có quyết định nhóm. Ghi chú này mô tả prototype thực tế. Nhánh “TA duyệt đáp số/số liệu” trong §4 xung đột với yêu cầu cấm đáp án bài đang mở: guard tiếp tục chặn, không sửa nội dung của thành viên khác.

## Cái giá khi sai, đảo lại và chờ duyệt

| Tool | Mức baseline | Sai thì ai chịu gì? | Đảo lại được không? | Chờ duyệt mất gì? / vì sao chọn |
|---|---|---|---|---|
| `tra_cuu_tai_lieu` | AUTO | Học viên có thể tin nguồn sai hoặc citation nhầm, đặc biệt §3.3 | Chỉ đọc; sửa cách trình bày được, không xóa kiến thức đã tiếp nhận | Duyệt mọi lần đọc làm học viên chờ vô ích. Cho tự đọc nhưng mở nguồn, cảnh báo mâu thuẫn, không tự sửa tài liệu |
| `goi_y_bai_tap` | AUTO + hard guardrail | Học viên chép đáp án, mất cơ hội hiểu bài, ảnh hưởng đánh giá | Không thu hồi được đáp án đã đọc | Duyệt mọi gợi ý nhẹ cản trở học tối muộn. Cho hai mức định hướng, chặn đáp số/lựa chọn/nhận xét hộ trước khi hiển thị |
| `chuyen_TA` | AUTO sau yêu cầu chủ động của học viên | Chia sẻ câu hỏi ngoài ý muốn, tốn công TA, khiến học viên tin được hỗ trợ trước hạn | Rút yêu cầu cục bộ được; không hứa xóa điều TA đã đọc trong sản phẩm thật | Không chờ TA phê duyệt việc chuyển. Học viên xem/sửa rồi chủ động tạo request; modal là kiểm soát nội dung chia sẻ, khác policy APPROVAL_REQUIRED. Ngoài giờ vẫn báo giờ trực và trạng thái |
| `dang_FAQ` | APPROVAL_REQUIRED — TA/giảng viên được ủy quyền | Sai một lần ảnh hưởng cả lớp; công bố cách diễn đạt quá mạnh dù phản ví dụ toán đúng | Gỡ bài dừng hiển thị tiếp, không thu hồi việc đã đọc | Chờ có thể kéo dài lỗi trong tài liệu, nhưng người có trách nhiệm cần kiểm tra cách công bố và nguyên nhân. Trả lời riêng vẫn có bằng chứng ngay, không đợi FAQ |

Người duyệt FAQ thấy bản nháp nguyên văn với §3.3, phản ví dụ và mục đích xác minh; có thể sửa, Approve, Reject hoặc hủy. Người duyệt gợi ý chỉ duyệt hướng học an toàn. Học viên duyệt yêu cầu TA thấy câu hỏi/tóm tắt, nguồn, nhãn bằng chứng và mốc giờ, không kèm toàn bộ hội thoại. Không có người thật hoặc kiểm tra vai trò: đây là màn đóng vai người duyệt trong prototype.

Nếu không duyệt thì giữ chờ, không tự công bố hoặc tự nâng quyền. Mốc 22:30 nằm ngoài giờ 08:00–22:00. Giờ làm việc kế tiếp 14/11 08:00 sau hạn bài 3; không hứa có câu trả lời đúng 08:00, trước hạn hoặc được gia hạn.

## Phương án so sánh, không phải ba mức 1:1

**Ca #5:** ① học viên tự báo (không gọi FAQ; bỏ sót thì cả lớp tiếp tục hiểu nhầm); ② bản nháp chờ người có trách nhiệm duyệt (đề xuất); ③ AI tự đăng (giả định bị loại vì lan truyền trước kiểm tra). ③ chỉ mô phỏng kết quả có nhãn, không phải policy triển khai. Gỡ FAQ không đồng nghĩa thu hồi thông tin đã đọc.

**Ca #2:** ① tự gợi ý có giới hạn (đề xuất); ② cần TA duyệt gợi ý phù hợp (chi phí chờ cao, có thể qua hạn; không được duyệt giải hộ); ③ AI tự giải (bị chặn, không trình diễn đáp án). So với hai HTML gốc, đã loại bản nháp có đáp số, xác nhận “tính đúng rồi” và lời hứa đã chuyển TA trước xác nhận.

`xac_nhan_dap_so` là hành động con của `goi_y_bai_tap`, không tăng số tool. `edit_material` bị cấm vì tool tra cứu chỉ đọc. Phê duyệt là điều kiện của quyền, không phải quyền vượt qua hard guardrail.

## Lời hứa thay đổi theo quyền

- AUTO gợi ý: “Tôi giúp bạn bắt đầu ngay, trong giới hạn phương pháp.”
- Gợi ý cần duyệt: “Tôi dừng ở yêu cầu an toàn và chờ TA; chờ không đồng nghĩa sẽ được giải hộ.”
- FAQ cần duyệt: “Tôi chuẩn bị nội dung; chỉ công bố mô phỏng sau Approve.”
- Chuyển TA: “Bạn quyết định nội dung trước khi thêm vào hàng chờ mô phỏng.”

## State và kiểm chứng

Registry đúng bốn tool. Mọi lần gọi đọc/gợi ý/chuyển TA/FAQ mới đi qua guard; actor và consent được kiểm tra. `REQUEST → evaluating → allowed/awaiting_approval/denied`; có `approved`, `rejected`, `cancelled`, `executed` và `undone` khi hợp lệ. Mỗi action có ID riêng. Đổi ngữ cảnh hủy việc chờ; rút lượt phục hồi policy liên quan; Reset Demo xóa dữ liệu. Hàng chờ TA đã xác nhận có thể giữ qua reload; trace/FAQ chỉ giữ trong lần mở trang.

Kiểm tra bình thường: so sánh trung bình/trung vị, đọc AUTO có citation, không chờ duyệt vô ích. Kiểm tra #5: nguyên văn nguồn sai, 0,25/0,5, nguyên nhân biên soạn chưa rõ, FAQ reject/approve/gỡ và chuyển TA có xác nhận. Kiểm tra #2: không đáp số ở cả ba phương án, kể cả Approve. Xem `QA.md` và tests để chạy lại.

## Liên hệ chú thích

① G2 phân biệt điều biết/chưa biết; ② G11 mở bằng chứng; ③ domain #6/#3 bảo vệ đúng rủi ro; ④ Feedback & Control/Human-in-the-Loop gắn vào chờ/duyệt/từ chối/huỷ; ⑤ PAIR Graceful Failure chuyển người kèm tóm tắt; ⑥ G9 sửa/rút; ⑦ G10 hỏi lại khi thiếu nguồn. FAQ phương án ① không có ④ vì không gọi tool công bố; chuyển TA riêng vẫn có ④.

## So sánh hành vi và Luna trực tiếp

Khuyến nghị cố định #5②/#2①. Chọn phương án tự chạy luồng: bản nháp học viên / chờ giảng viên / cảnh báo lớp giả định; ca #2 gợi ý / chờ hỗ trợ / bị chặn. Chat và trạng thái thực thi cùng đổi; không chỉ thay lời mô tả. Đổi ca/phương án hủy yêu cầu đang chờ cũ. Approve/Reject/Cancel/gỡ cập nhật quyết định ngay.

Chế độ Luna tùy chọn sinh phản hồi cho mỗi câu hỏi qua Node loopback đọc key .env. Policy và fixture quyết định quyền, nguồn hợp lệ và guard; model không tự thay quyền hoặc gọi tool. Nếu kết quả sinh vượt guard thì dùng fixture có nhãn rõ. FAQ và TA luôn mô phỏng, kể cả khi phản hồi là Luna thật.

Ca #2③ dùng AUTO giả định cho tool để minh họa AI tự giải, nhưng không mở quyền hành động con giải hộ. Preview có lời giải/đáp án được che; `final_solution` vẫn denied vì bài đang mở. Phân biệt quyền tool, output giả định và hard guardrail; baseline và recommendation không đổi.
