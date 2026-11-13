# StudyFlow AI — LAB 5 / Track T2

> **Snapshot để review — đang phát triển.** Bản này đã có giao diện Flowstate Dark/Light, VI/EN, annotation của A và policy engine dùng chung (`autonomy.js`, `autonomy-ui.js`). Panel **Autonomy / Tool Activity** đang được tích hợp: ba phương án so sánh, FAQ chờ/duyệt/từ chối, hard guardrail bài đang mở và trace. Phần tài liệu chi tiết phía dưới sẽ được đồng bộ theo hành vi cuối; không coi đây là bản nghiệm thu hoặc quyết định §4 chính thức.

Prototype trợ lý học bài trong khoá **Nhập môn phân tích dữ liệu**, buổi 3 **Thống kê mô tả**. Hai ca chính theo số brainstorm của nhóm: **#5 — tài liệu sai** và **#2 — xin xác nhận đáp án bài đang mở**. Không có AI/backend thật.

## Mở demo bằng một lần bấm

Bấm đúp **`Open-Demo.cmd`** trong thư mục này: trình duyệt mặc định mở landing, bấm **Bắt đầu học** để vào app. Không cần terminal, server, cài thư viện hay đăng nhập.

`Start-Demo.ps1` là launcher PowerShell tương đương. Windows có thể mở `.ps1` bằng trình soạn thảo khi bấm đúp; vì vậy dùng `.cmd` để mở trực tiếp thuận tiện hơn. Giữ launcher cùng thư mục với `landing.html`.

Cũng có thể mở trực tiếp `landing.html` hoặc `index.html`. Các file chạy qua `file://` hoặc static hosting. Nếu nhóm bật GitHub Pages, đường dẫn sẽ là `/prototype/landing.html` và `/prototype/index.html`; PR không tự bật hosting.

## Demo 4 phút — hai màn hình cốt lõi

1. Bấm **#5 — Tài liệu học có kiến thức sai**: thấy loading tra cứu fixture, nguyên văn §3.3, cảnh báo và phản ví dụ **phương sai 0,25 → độ lệch chuẩn 0,5**. Nêu rõ phương sai có đơn vị bình phương, độ lệch chuẩn có đơn vị dữ liệu.
2. Mở citation **§3.3** để đối chiếu nguyên văn và phần chưa nhất quán. Phản ví dụ kiểm chứng được; **nguyên nhân tài liệu viết sai** mới là điều chưa rõ. AI không tự sửa tài liệu.
3. Bấm **Nhờ TA xác minh**. Đọc/sửa tóm tắt được điền sẵn; xem dữ liệu kèm theo và thời gian **13/11/2026 · 22:30 · UTC+7**. Chưa xác nhận thì chưa có yêu cầu. Thử **Huỷ yêu cầu** rồi mở lại.
4. Đánh dấu consent, bấm **Xác nhận · tạo mô phỏng**. Màn thứ hai hiện **hàng chờ mô phỏng** cục bộ, chưa gửi TA/server. Có thể **Rút yêu cầu mô phỏng**.
5. Trở lại **Cùng học với AI**, bấm **#2 — Xin xác nhận bài đang mở**. Trợ lý không chốt lựa chọn “trung vị”, không đáp số hay viết nhận xét hộ. Có §3.1/§3.2/§3.5 và **Gợi ý bước tiếp theo**, dừng ở mức 2/2.
6. **Sửa câu hỏi**, **Báo câu trả lời sai** hoặc **Rút lượt hỏi** để kiểm tra phục hồi. **Bắt đầu hội thoại mới** xoá hội thoại, giữ hàng chờ đã xác nhận. Chọn lại một ca để chạy lại từ đầu.

Góc tài liệu desktop cho đổi giờ giả lập giữa **22:30** và **21:10**. Bài 3 luôn đang mở, hạn **13/11/2026 · 23:59**. Ngoài giờ TA 08:00–22:00, UI nói rõ TA trở lại **14/11 · 08:00**, sau hạn bài: không bảo đảm hỗ trợ trước hạn và không tự gia hạn.

## Chú thích của A — vị trí để dẫn trong §3 và §5

Bấm nút **i** trên thanh đầu trang để bật marker. Chế độ này mặc định tắt, giữ màn học gọn. Marker được vẽ ngay trên UI và có bảng giải thích cuối màn hình.

| Marker | Nguyên tắc | Vị trí cụ thể ở ca #5 |
|---|---|---|
| ① | **HAX G2 — Làm rõ AI làm tốt tới đâu** | Thẻ “Biết kết luận, chưa biết nguyên nhân”: phép căn/ phản ví dụ kiểm chứng được, chỉ nguyên nhân tài liệu sai (đánh máy, biên soạn, thiếu ngữ cảnh) chưa xác định |
| ② | **HAX G11 — Explainability** | Nguyên văn phát biểu §3.3, phản ví dụ 0,25 → 0,5, lập luận toán học và citation bấm mở nguồn |
| ③ | **Rubric domain #6 — Tài liệu có thể sai** | Khung cảnh báo chỉ đích danh câu “luôn nhỏ hơn”, vì sao cần xem lại; không mặc định nguồn là đúng |
| ⑤ | **PAIR Errors + Graceful Failure** | Nút “Nhờ TA xác minh”; modal có tóm tắt sẵn, dữ liệu kèm theo và giờ trực; hàng chờ luôn ghi mô phỏng |
| ④ | **Kiểm soát thao tác / Human-in-the-Loop** | Chỉ hiện ở modal xác nhận, khi học viên xem/sửa và consent trước khi thêm vào hàng chờ |
| ⑥ | **G9 / Recovery** | Sửa câu hỏi, báo sai cục bộ, rút lượt; phản hồi sau thay đổi theo câu đã sửa |
| ⑦ | **G10 / Graceful Failure** | Ca bổ sung thiếu nguồn/mơ hồ: nêu dữ liệu có/không có và hỏi lại, không đoán |

**Vì sao bản thử trước không có ④ ở mức tự chủ ①?** Mức đó chỉ gợi ý học viên tự báo, AI không đăng, chờ duyệt hoặc gỡ FAQ; không có thao tác để đánh dấu ④ nên vắng là hợp lý. Bản hiện tại bỏ toggle AI tự đăng FAQ theo chỉ đạo mới. **④ ở bản này đánh dấu xác nhận yêu cầu TA**, không phải phê duyệt FAQ. Số marker là mã chú thích, không phải số của mức tự chủ.

![Ca #5 với marker ① G2, ② G11, ③ tài liệu sai, ⑤ chuyển người và ⑥ sửa lỗi](screenshots/01-study-ux.png)

![Modal xác nhận TA: tóm tắt sửa được, thông tin được duyệt, giờ trực và marker ④](screenshots/02-autonomy.png)

## Chính sách autonomy — PROVISIONAL

Đã đối chiếu `origin/master` commit `7172713` và brainstorm. **§4 vẫn là dàn ý chưa chốt**; brainstorm tự ghi là tạm. Bảng dưới là chính sách tạm của prototype theo chỉ đạo triển khai, không phải quyết định chính thức thay nhóm. UI cũng ghi rõ provisional. Khi nhóm chốt §4, cần đối chiếu lại; code không tự đọc chính sách từ Markdown.

| Tool đề bài | Mức được mô phỏng | Control / giới hạn |
|---|---|---|
| `tra_cuu_tai_lieu` | Tự làm, chỉ đọc | Xem nguồn, rút lượt hỏi; nguồn có lỗi được đánh dấu, không sửa tài liệu |
| `goi_y_bai_tap` | Tự làm trong giới hạn | Hai mức định hướng; cấm cung cấp/xác nhận đáp số và lựa chọn câu b bài đang mở |
| `chuyen_TA` | Học viên xác nhận | Xem/sửa tóm tắt, consent, huỷ trước xác nhận, rút sau xác nhận |
| `dang_FAQ` | Cần TA/giảng viên phê duyệt trước công bố | AI không tự đăng; demo không có nút công bố hoặc duyệt giả |

Chưa coi `goi_y_huong_lam` và `xac_nhan_dap_so` là tool tách chính thức vì nhóm chưa chốt §4; ranh giới vẫn được giữ trong `goi_y_bai_tap`. Trong sản phẩm thật, TA chỉ xem câu hỏi học viên đã duyệt, mã mục nguồn, nhãn bằng chứng và thời điểm, không phải toàn bộ hội thoại. Prototype hiển thị chính các trường này trước khi xác nhận. Không có người thật nhận; nếu không ai duyệt thì giữ trạng thái chờ, AI không nâng quyền hay hứa thời gian phản hồi.

## Ba ca bổ sung và câu hỏi tự nhập

Mở **3 ca kiểm tra bổ sung**: happy path so sánh trung vị/trung bình (§3.1/§3.2), thiếu nguồn “slide 12” hoặc nội dung buổi 7, và người học sửa ý trợ lý. Buổi 7 chỉ có tên đề cương “Kiểm định giả thuyết và p-value”, không bịa bài giảng.

Nhập tự do dùng **keyword routing xác định trước** và câu trả lời soạn sẵn, có fallback trung thực. Không phải AI hiểu mọi câu hỏi. Mixed intent có nhắc bài 3/lương/dữ liệu bài tập giữ giới hạn bài đang mở trước.

## Quyết định UX

- Chọn nhãn bằng chứng theo trạng thái fixture (**Có căn cứ tài liệu / Thiếu nguồn / Cần xác minh**) và đoạn trích mở được. Loại % confidence vì không có model tính xác suất; chỉ nói “có nguồn” cũng không cứu được lỗi §3.3.
- G2 tách kết luận toán học kiểm chứng được khỏi nguyên nhân lỗi biên soạn chưa rõ; loại nhãn “AI chưa chắc” chung chung vì có thể khiến học viên nghi cả phản ví dụ đúng.
- Chọn tóm tắt TA soạn sẵn + xem/sửa + consent: giảm gõ lại, giữ quyền học viên. Loại tự chuyển và chỉ thêm disclaimer vì không chặn được chia sẻ trước khi đồng ý.
- Hai ca chính luôn hiện, ca phụ thu gọn. Không thêm sửa tài liệu hoặc FAQ công bố. Gợi ý chặn bằng logic: không thể hoàn tác việc học viên đã đọc đáp án bị tiết lộ.

## Mock, mã nguồn, kiểm tra và skills

Tài liệu, hội thoại, loading, giờ, tra cứu và hàng chờ đều từ fixture/logic JS. **Không backend, database, authentication, API key, LLM API, inference, agent hoặc endpoint giả.** Không gửi request nghiệp vụ. Hàng chờ lưu `localStorage` trong đúng trình duyệt/origin; nếu browser chặn lưu thì giữ trong bộ nhớ và báo giới hạn. Tối đa 5 yêu cầu chờ, chỉ dọn lịch sử đã rút. Không có sync nhiều tab/máy, TA thật, SLA, đăng FAQ hoặc gia hạn bài. Chỉ nhập dữ liệu dựng.

- `engine.js`: fixture và state machine; không dùng đồng hồ máy để đổi hạn.
- `app.js`: UI, escaping nội dung nhập, loading/cancel, nguồn, modal và queue local.
- `styles.css`, `assets/`: responsive, SVG, Onest cục bộ và SIL OFL.
- `landing.html`: độc lập, font/CSS/JS nhúng; shader ink tự viết, idle/pointer/burst, scrim, pause/reduced-motion và CSS fallback. Là xấp xỉ thị giác fluid, không phải bộ giải Navier–Stokes hay mã sao chép Pavel Dobryakov.
- Test engine: `node --test prototype/tests/engine.test.cjs`. Test đầy đủ: `node --test prototype/tests/engine.test.cjs prototype/tests/browser.test.cjs` từ repo, cần Playwright và Chrome trong môi trường phát triển. **Không cần Node/Playwright để mở demo.**
- Đã cài global và dùng **UI UX Pro Max** cho design system, typography, tokens, spacing, interaction/accessibility; **Taste `design-taste-frontend`** cho art direction, polish, responsive và browser inspection. Không đưa source skill vào bài nộp. Chi tiết kiểm tra và giới hạn: [QA.md](QA.md).
