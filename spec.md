# Bài nộp LAB5 — T2 Giáo dục · Nhóm XYZ

**Lớp:** L3B · **Bàn / zone:** ____ · **Track:** T2

| Họ và Tên | Mã Học Viên | Việc đã làm |
|---|---|---|
|  |  |  |
|  |  |  |
|  |  |  |

## §1. Lát cắt & phạm vi
- Lát cắt (chép từ track).
- 3 việc tính năng KHÔNG làm, mỗi việc một câu vì sao.

## §2. Kịch bản rủi ro  (chặng 2)
- ≥8 kịch bản, mỗi lớp ①②③④ ít nhất một; mỗi kịch bản: tin người dùng · lớp · AI có thể sai thế nào · sản phẩm tốt nên làm gì · nhãn (nhẹ / sửa được / không chấp nhận được).
- Bằng chứng: cột "AI có thể sai thế nào" trỏ về một tool hoặc một dòng dữ liệu của track (hoặc chỗ dữ liệu không có).
- Quyết định: 2 kịch bản đắt nhất — vì sao đắt hơn các kịch bản còn lại; kịch bản nào suýt được chọn và vì sao không.

## §3. Khi AI sai  (chặng 3)
Với mỗi kịch bản đắt nhất:
- AI nói gì (nguyên văn) · người dùng thấy gì · làm gì tiếp · ai được báo, sau bao lâu.
- Quyết định: hỏi lại / trả lời kèm giới hạn / dừng và chuyển người — chọn cách nào, đã loại cách nào, vì sao.
- Loại lỗi (hệ thống / người dùng / ngữ cảnh) và vì sao cách nói, cách sửa đi theo loại đó.
- 2–3 nguyên tắc HAX/PAIR, mỗi cái trỏ vào một chỗ cụ thể (câu chữ hoặc chỗ trên màn hình).
- Lỗi nào sửa câu chữ không cứu được (nếu có), và thiết kế cứu nó thế nào.

## §4. Mức tự chủ  (chặng 4)
Với mỗi tool:
- Mức của nhóm (tự làm / cần người duyệt / cấm). Nếu cần người duyệt: ai duyệt · người duyệt thấy gì · quá hạn thì sao.
- Lý do theo cost-of-error: sai thì ai chịu gì · đảo lại được không · chờ người thì mất gì.
- Phương án đã cân nhắc và vì sao loại.

Thêm:
- Tool khó xếp nhất: mỗi người từng chọn gì, cái giá của mỗi phía (trỏ về kịch bản ở §2), nhóm chốt thế nào.
- Thử mức đã đặt trên 2 kịch bản đắt nhất + 1 kịch bản bình thường: cái sai có bị chặn không? còn việc nào làm khi lẽ ra phải hỏi? người dùng bình thường có phải chờ vô ích không?
- Luật thêm hoặc tool tách bước (nếu có), và vì sao.
- Một mức tự chủ đã đổi lời hứa nào với người dùng.

## §5. Prototype  (chặng 5)

- **File và cách mở:** [landing](prototype/landing.html), [app](prototype/index.html), [ca #2](prototype/index-ca2.html). Bấm đúp `prototype/Open-Demo.cmd` trên Windows; `Start-Demo.ps1` tương đương. Không cần server/build. Ca #2 dùng chung app qua `index.html#exercise` để giữ policy nhất quán.
- **Phạm vi mock:** HTML/CSS/Vanilla JavaScript; fixture T2, keyword routing và state machine deterministic. Không gọi AI thật, không backend/database/authentication/API key. Giờ, vai người duyệt, loading, FAQ và queue đều mô phỏng. Queue TA chỉ lưu trình duyệt; FAQ/trace giữ trong lần mở trang. Không gửi đến TA/server, không xác thực vai người duyệt.
- **Hai ca trọng tâm:** #5 trích nguyên văn câu sai §3.3, phản ví dụ phương sai 0,25 → độ lệch chuẩn 0,5, giải thích khác đơn vị, cảnh báo và nhờ TA. #2 không chốt lựa chọn hoặc đáp số bài đang mở, chỉ hai mức định hướng có nguồn. Có đường sửa câu hỏi, báo sai cục bộ, rút lượt và reset. Ba ca bổ sung được thu gọn.
- **Autonomy có hành vi:** registry đúng bốn tool, guard kiểm tra trước thực thi; trace ghi requested/evaluating/allowed/awaiting_approval/denied/executed, rejected/cancelled/undone khi hợp lệ. Ca #5 so sánh tự báo / FAQ cần giảng viên duyệt / tự đăng giả định bị loại. Có bản nháp sửa được, Approve, Reject, cancel và gỡ mô phỏng; chỉ Approve mới published_mock trong phương án đề xuất. Ca #2 so sánh gợi ý AUTO / TA duyệt hỗ trợ phù hợp / tự giải bị chặn. Phê duyệt không cho phép giải hộ. `xac_nhan_dap_so` là hành động con bị cấm, không phải tool thứ năm. Không có tool tự sửa tài liệu.
- **Chính sách tạm, chưa quyết định thay nhóm:** đã đối chiếu master 45ba989, §4 trong spec và spec_draft vẫn chưa chốt. Baseline provisional: tra cứu AUTO/chỉ đọc; gợi ý AUTO trong giới hạn; chuyển TA cần học viên xác nhận; FAQ cần TA/giảng viên được ủy quyền duyệt. ①/②/③ là phương án thiết kế, không tương ứng 1:1 với ba mức policy. Khi nhóm chốt §4 cần đối chiếu lại. Lý do cost-of-error, khả năng đảo và chi phí chờ ở [AUTONOMY-NOTES](prototype/AUTONOMY-NOTES.md); không tự điền tranh luận thành viên.
- **Xác nhận TA:** học viên xem/sửa tóm tắt, dữ liệu kèm theo, nguồn và thời điểm, rồi consent mới thêm vào hàng chờ mô phỏng. Hủy trước xác nhận hoặc rút yêu cầu cục bộ sau đó. Mốc cố định 13/11/2026 22:30 (tùy chọn 21:10); bài 3 luôn mở, hạn 23:59. TA 08:00–22:00; giờ làm việc kế tiếp 14/11 08:00 sau hạn bài. Không hứa trả lời đúng 08:00 hoặc gia hạn.
- **Ảnh và chú thích:** [01 — ca #5](prototype/screenshots/01-study-ux.png), [02 — autonomy](prototype/screenshots/02-autonomy.png). Bật `i`: **① G2** tách kết luận toán đúng khỏi nguyên nhân biên soạn chưa rõ, hoặc hỏi bước học viên đang vướng; **② G11** nguồn/citation và lập luận kiểm chứng; **③ domain #6/#3** chỉ câu sai hoặc chặn đáp án; **④ Feedback & Control/Human-in-the-Loop** thẻ chờ/duyệt/từ chối/hủy và modal xác nhận TA; **⑤ PAIR Graceful Failure** nhờ TA kèm tóm tắt; **⑥ G9** sửa/rút; **⑦ G10** hỏi lại khi thiếu dữ liệu. FAQ phương án ① không có ④ vì AI không gọi tool công bố; chuyển TA riêng vẫn có bước xác nhận. Số chú thích khác số phương án tự chủ. Giữ §3 của thành viên A.
- **Quyết định UX:** dùng nhãn bằng chứng fixture + citation mở được + giải thích toán, không % confidence giả. Loại nhãn “chưa chắc” chung chung vì làm người học nghi cả phản ví dụ đúng. Chọn tóm tắt TA soạn sẵn + xem/sửa/consent để giữ quyền người học, loại tự chuyển/disclaimer đơn thuần. Chặn đáp án trước khi hiển thị; gỡ FAQ không thu hồi thông tin đã đọc. Phương án tự đăng chỉ minh họa rủi ro bị loại, không phải khuyến nghị.
- **Giao diện và kiểm tra:** app Dark theo landing, Light tùy chọn, VI/EN lưu cục bộ; nguồn và câu người học giữ nguyên. UI UX Pro Max và Taste cài global, không copy source skills vào repo. Đã kiểm tra Chrome desktop/mobile, đủ các luồng duyệt/từ chối/hủy/chặn/reset và sửa lỗi. [README](prototype/README.md) mô tả demo và mock; [QA](prototype/QA.md) ghi kết quả, review và giới hạn Taste gate. Landing giữ nguyên trong đợt nâng cấp autonomy này.

## §6. Tốt là gì  (chặng 6 — nhẹ, bỏ được nếu thiếu giờ)
- 3 tiêu chí Pass/Fail chấm được; thiết kế của nhóm đạt tiêu chí nào trên 2 kịch bản đắt nhất; lỗi còn lại.

## §7. Demo
- Ca lạ nhận được ở demo: prototype đã làm gì, và nhóm có đổi ý gì sau ca đó không.
