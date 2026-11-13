# Kiểm tra StudyFlow AI

Thực hiện ngày 13/11/2026 (UTC+7). Trình duyệt Chrome headless qua Playwright; TA/FAQ mô phỏng. Luna tùy chọn chỉ chạy lúc chuẩn bị bản HTML.

## Phạm vi hành vi

Lệnh: `node --test prototype/tests/engine.test.cjs prototype/tests/autonomy.test.cjs prototype/tests/browser.test.cjs prototype/tests/comparison.test.cjs prototype/tests/luna.test.cjs`, Playwright có sẵn qua `NODE_PATH`. Suite có 11 engine tests, 10 autonomy tests, 14 ca browser, 4 ca comparison, 2 kiểm tra Luna và hai test bao ngoài (43 mục trong báo cáo Node). Lượt kiểm tra hoàn tất: **43/43 pass, 0 fail**. Có kiểm tra riêng panel mở ở 390px bằng tiếng Anh, hủy gợi ý rồi yêu cầu lại và marker ca #2.

| Nhóm | Những gì được kiểm tra |
|---|---|
| #5, annotation A | Loading → nguyên văn §3.3 → 0,25/0,5 → khác đơn vị; G2 tách nguyên nhân chưa rõ khỏi kết luận toán; ①②③⑤ hiện đúng ở thẻ, ④ trong modal |
| Xác nhận TA | Chưa consent thì disabled; huỷ không tăng queue; xem/sửa rồi xác nhận mới thêm; refresh giữ yêu cầu; rút được; mọi trạng thái ghi mô phỏng |
| #2 | Chặn xin đáp án, số/xác nhận lựa chọn, câu không dấu, mixed intent và hỏi tiếp; gợi ý dừng 2/2; nguồn §3.1/§3.2/§3.5 |
| Autonomy thực thi | Đúng bốn tool; lookup AUTO; FAQ draft/chờ/Approve/Reject/cancel/chặn tự đăng/gỡ; giả định bị loại có nhãn; gợi ý cần duyệt không lách guardrail; reset/đổi ca/undo giữ state nhất quán |
| VI/EN và theme | Lưu qua reload, không mất hội thoại; câu hỏi người học và nguồn giữ nguyên; form light đủ tương phản; hai ca chạy bằng EN |
| Ca phụ | Happy path có nguồn; slide 12 không tồn tại; p-value chỉ đề cương; người học sửa ý đổi được mục giải thích |
| Phục hồi | Sửa sau bài tập thoát ngữ cảnh cũ; báo sai cục bộ; rút lượt; huỷ loading không sinh phản hồi muộn |
| Dữ liệu | Câu lạ có fallback; HTML nhập vào không thực thi; queue dài không làm mất yêu cầu chờ; bản nháp dài rút gọn rõ trước consent |
| Mốc demo | 22:30 ngoài giờ, 21:10 trong giờ; hạn bài cố định; TA trở lại sau hạn, không hứa SLA hoặc gia hạn |
| Responsive | Không overflow ngang ở 1440, 1024, 768, 390, 320px; nguồn và modal hoạt động trên 390px |
| Keyboard | Escape đóng dialog; mobile menu focus trap, sidebar ẩn có inert; focus rõ |
| Landing | WebGL chạy, pause, reduced motion, CTA tới app; CSS fallback khi không có WebGL; mở file trực tiếp |
| Console/network | Kiểm tra không JS error, không request dịch vụ ngoài; chỉ tải file tĩnh |

Đã xem ảnh thực tế app desktop, modal TA, app và landing mobile 390px, landing desktop 1440px. Ảnh `screenshots/` chụp từ UI thật có marker, không chèn số sau chụp. Launcher PowerShell đã được thực thi để mở landing; CMD chỉ gọi trình xử lý HTML mặc định, không cài hay đổi policy hệ thống.

## Review và sửa lỗi

Reviewer độc lập không thấy critical. Ba important được tái hiện rồi sửa: ngữ cảnh bài tập giữ quá lâu, menu mobile ẩn vẫn nhận Tab, và dọn lịch sử làm mất queue đang chờ. Có test RED→GREEN. Cũng sửa bản nháp dài bị cắt sau khi xem; nay nội dung được rút gọn có nhãn trước bước xác nhận. Review VI/EN/theme tìm ra bản nháp dịch cả câu người học và lỗi form light tương phản thấp: đã sửa và kiểm tra. Review autonomy tái hiện ba lỗi state: hội thoại mới giữ FAQ chờ duyệt, undo không phục hồi policy và gợi ý nhận nhầm phê duyệt; đã bổ sung regression và sửa gắn action ID, hủy yêu cầu cũ, phục hồi context. Rà ảnh tìm thêm marker ④/⑥ của panel thiếu điểm neo, gây tràn 9px ở 390px; đã đặt lại vị trí tương đối và kiểm tra panel mở bằng VI/EN.

## Skills và Taste inspection

Cả hai skills cài global, đọc trực tiếp, không copy vào repo. UI UX Pro Max: search design system và keyboard/focus/modal; dùng Onest theo brief và tokens/spacing 4–8, semantic controls. Không dùng kết quả gợi ý phông trẻ em vì không hợp đối tượng học viên.

Taste copy-lint trên cả hai trang: **0 FAIL, 0 WARN**. Performance landing 1440/390px: **0 FAIL, 0 WARN, PASS**; một WebGL context, layout shift 0,004/0,000, kiểm tra phục vụ tĩnh không lỗi request. Số đo headless trên một máy, không phải benchmark GPU/thiết bị di động thật.

Consistency phát hiện tên GLSL `active` thuộc nhóm reserved: đã đổi thành `pointerEnergy`; sửa hero vượt chiều cao desktop và tăng vùng chạm logo.

Finish gate đã chạy: **GATE: FAIL 9 (round 1 of 3)**. Không gọi là pass, không sửa checker hay giấu UI. Các mục còn mở thuộc quy tắc template khác với landing Flowstate tự viết:

- `hero-enter`: checker yêu cầu `html.m-enter` của kit; landing dùng word reveal và entrance riêng, đã kiểm tra reduced motion.
- `moment-none`: yêu cầu moment deal từ kit; giữ một hero fluid theo brief, không thêm section để thoả template.
- Năm `container-edges`: skip link trước main, ba phần nav/content/footer trong hero, ink/scrim full-screen thay vì một `.wrap` của kit. Browser thực tế không overflow.
- Hai `edge-left`: CTA nav mobile và nút pause footer desktop căn phải, nằm trong viewport.

Ba WARN còn lại: copy dài hơn mức marketing do giữ nhãn mô phỏng/câu chữ brief; detector không nhận skip link tiếng Việt dù đây là Tab đầu; chưa có ảnh social share/canonical khi chưa host. Không có waiver. Gate style chưa đạt là giới hạn được bàn giao, độc lập với kiểm thử hành vi.

## Giới hạn

Đã đồng bộ §4 tại ee00f61. Phần cho duyệt đáp số xung đột hard guardrail nên không được triển khai; ghi rõ trong notes, không tự sửa §4. Routing bằng fixture có thể không nhận cách hỏi mới; sẽ có fallback. Queue không sync nhiều tab/máy, không delivery hoặc trả lời thật. Không kiểm thử toàn bộ screen reader, zoom 200%, mọi browser hoặc máy cảm ứng thật. Shader là xấp xỉ ink, thiết bị yếu dùng CSS. GitHub Pages chưa được bật bởi PR.

## Đợt so sánh output và Luna tùy chọn

Sáu output khác nhau, badge khuyến nghị giữ #5=②/#2=① dù đổi lựa chọn; nút về mặc định, trạng thái sau Approve/Reject/undo và diagnostics thu gọn được kiểm tra. Bản Luna dùng cấu hình từ ngân hàng gợi mở đã duyệt; generated HTML được kiểm tra trong browser với profile thử. Đã gọi OpenAI thật một lần thành công sau khi người dùng điền key, tạo luna-demo.html hợp lệ. Browser kiểm tra chính file thật: sáu phương án, badge cố định, mobile/Light/EN, không có HTTP/API request lúc demo. Test API tự động dùng test double; không suy ra SLA hoặc quota còn lại từ một lần thành công. `.env` và HTML tạo sẵn bị ignore, key không xuất vào trang.

Reviewer độc lập không thấy lỗi important mới ở khuyến nghị cố định, sáu output, TA AUTO sau hành động học viên, guard enum Luna và luồng key. Copy-lint app hiện tại: 0 FAIL/0 WARN. Landing giữ nguyên, các giới hạn gate đã ghi ở trên vẫn tồn tại.
