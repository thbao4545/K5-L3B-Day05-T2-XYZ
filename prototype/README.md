# StudyFlow AI — LAB 5 / Track T2

Prototype trợ lý học bài trong khóa **Nhập môn phân tích dữ liệu**, buổi 3 **Thống kê mô tả**. Hai ca chính giữ số của brainstorm và hai HTML gốc: **#5 tài liệu sai** và **#2 xin xác nhận đáp án bài đang mở**. HTML/CSS/JavaScript tĩnh, không build step hoặc AI/backend thật.

## Mở bằng một lần bấm

Bấm đúp **`Open-Demo.cmd`** trong thư mục này → landing → **Bắt đầu học**. Không cần bash, server, thư viện hay đăng nhập. `Start-Demo.ps1` là launcher PowerShell tương đương; Windows thường mở `.ps1` bằng editor, vì vậy `.cmd` thuận tiện hơn cho thao tác bấm đúp.

Có thể mở trực tiếp `landing.html`, `index.html` hoặc **`index-ca2.html`**. Entry ca #2 dẫn tới `index.html#exercise`, dùng cùng giao diện và policy engine để tránh hai bản lệch quyền. Ba phương án của hai prototype gốc được đưa vào panel **Autonomy / Tool Activity**, không giữ các đường lộ đáp án trong HTML cũ. Nếu host tĩnh, giữ các file cùng thư mục; PR không tự bật GitHub Pages.

App mặc định Dark, đồng bộ Onest, nền gần đen và cyan/blue/violet của landing. **VI / EN**, **Dark / Light** đổi ngay và lưu cục bộ, không xóa hội thoại. Nguồn nguyên văn tiếng Việt và câu hỏi người học được giữ nguyên. Landing giữ thiết kế Flowstate đã yêu cầu.

## Chính sách đề xuất — PROVISIONAL

Đã fetch và đối chiếu `origin/master` **45ba989**, cả `spec.md`, `spec_draft.md` và brainstorm. §4 vẫn là dàn ý chưa chốt. Đây là **cấu hình tạm để demo**, không phải quyết định chính thức thay nhóm; không tự ghi vào §4.

| Tool của đề bài | Baseline | Ai duyệt / giới hạn |
|---|---|---|
| `tra_cuu_tai_lieu` | AUTO | Chỉ đọc fixture, trích nguồn; không tự sửa tài liệu |
| `goi_y_bai_tap` | AUTO trong giới hạn | Tối đa hai mức định hướng; không đáp số, lựa chọn cuối hoặc nhận xét hộ bài đang mở |
| `chuyen_TA` | APPROVAL_REQUIRED | Học viên xem/sửa tóm tắt và xác nhận trước khi tạo hàng chờ mô phỏng |
| `dang_FAQ` | APPROVAL_REQUIRED | TA/giảng viên được ủy quyền duyệt nội dung trước khi công bố mô phỏng |

`xac_nhan_dap_so` là **hành động con bị cấm**, không phải tool thứ năm. Phê duyệt không vô hiệu hóa hard guardrail của bài đang mở. Không có quyền tự sửa tài liệu. Trong chế độ so sánh, các dòng quyền thay đổi theo phương án đang chọn; nút chính sách ở sidebar luôn mô tả baseline.

**①/②/③ là phương án thiết kế, không tương ứng 1:1 với AUTO/APPROVAL_REQUIRED/FORBIDDEN.** Các mức chính thức hiển thị riêng cạnh từng tool. Phương án không dùng tool được ghi FORBIDDEN trong phạm vi so sánh; không biến thành quyết định chính thức của nhóm.

## Demo ca #5 — tài liệu §3.3 sai

1. Chọn **#5**. Sau loading mô phỏng, AI trích nguyên văn câu “Vì là căn bậc hai, độ lệch chuẩn luôn nhỏ hơn phương sai.”
2. Xem phản ví dụ **phương sai 0,25 → độ lệch chuẩn 0,5** và giải thích khác đơn vị. Kết luận toán kiểm chứng được; chỉ nguyên nhân lỗi biên soạn là chưa rõ. Citation **§3.3** mở nguyên văn để đối chiếu.
3. Mở **Autonomy / Tool Activity**. Mặc định phương án **② — Duyệt trước khi đăng**. Sửa bản nháp → **Tạo bản nháp chờ duyệt**. Chưa Approve thì chưa có `published_mock`.
4. Vai giảng viên **mô phỏng** có **Approve**, **Reject**, **Hủy trước thực thi**. Reject/cancel không đăng. Approve mới chuyển `executed · published_mock`. Không có đăng thật hoặc kiểm tra danh tính người duyệt; mọi người xem demo có thể đóng vai này.
5. **Gỡ cảnh báo mô phỏng** chỉ dừng hiển thị tiếp: không thu hồi được điều người khác đã đọc. **Kiểm tra chặn tự đăng** cho thấy `denied` trong policy cần duyệt.
6. So sánh **① — Học viên tự báo**: soạn nội dung cục bộ, không gọi `dang_FAQ`; nếu học viên không báo thì cả lớp có thể tiếp tục học nhầm. **③ — Tự đăng** có nhãn **giả định bị loại**, chỉ minh họa công bố/gỡ trong prototype, không khuyến nghị triển khai thật.

## Demo ca #2 — bài đang mở

1. Chuyển trực tiếp sang **#2** hoặc mở `index-ca2.html`. Câu hỏi xin xác nhận “trung vị” bị từ chối; AI không chốt lựa chọn hoặc đáp số. Dẫn §3.1, §3.2, §3.5; §3.4 mở được trong góc tài liệu để tự phân tích ngoại lai.
2. Phương án **① — Gợi ý giới hạn**: **Gợi ý bước tiếp theo** thực thi AUTO, dừng 2/2. Chỉ định hướng, không tính hộ.
3. **② — TA duyệt gợi ý phù hợp**: yêu cầu gợi ý mới đi qua `awaiting_approval`. Thử Reject, cancel, yêu cầu lại rồi Approve; chỉ hỗ trợ phương pháp an toàn. Nút yêu cầu hỗ trợ trong panel thay thế yêu cầu gợi ý cũ, không để lại lượt chờ mồ côi.
4. **③ — Tự giải, bị cấm**: có trace `denied` và lý do hard guardrail; không có nút thực thi giải hộ, không hiện đáp án kể cả để minh họa rủi ro. Sửa câu hỏi hoặc nhờ TA vẫn dùng được.

## Chuyển TA, sửa lỗi và reset

**Nhờ TA xác minh** mở modal với tóm tắt soạn sẵn. Học viên xem/sửa câu hỏi, mã nguồn, nhãn bằng chứng, thời điểm và dữ liệu người duyệt sẽ thấy; không kèm cả hội thoại. Chưa đánh dấu consent thì nút xác nhận bị khóa. Hủy không tạo yêu cầu; xác nhận mới hiện **Đã thêm vào hàng chờ mô phỏng**. Có thể rút khỏi hàng chờ cục bộ. Không có người thật nhận.

Mốc demo cố định **13/11/2026 · 22:30 · UTC+7**, tùy chọn **21:10**. Bài 3 luôn mở, hạn **13/11 · 23:59**. TA **08:00–22:00**; lúc 22:30, giờ làm việc kế tiếp là **14/11 · 08:00**, đã sau hạn bài. UI không hứa trả lời đúng 08:00, không bảo đảm trước hạn và không tự gia hạn. Không ai duyệt thì tiếp tục chờ; không tự nâng quyền.

**Sửa câu hỏi**, **Báo câu trả lời sai**, **Rút lượt hỏi** là các đường phục hồi. Lượt mới dùng câu hỏi đã sửa. Rút lượt phục hồi cả ngữ cảnh policy; không thu hồi thông tin đã đọc hoặc yêu cầu TA đã xác nhận. Mở hội thoại mới hủy việc chờ duyệt cũ, giữ hàng chờ TA đã xác nhận. **Reset Demo** trong panel xóa cả hội thoại, trace và hàng chờ mô phỏng để chạy lại.

Ba ca phụ thu gọn: happy path có nguồn, slide 12 không tồn tại/buổi 7 chỉ đề cương, người học sửa ý AI. Câu tự nhập dùng keyword routing xác định trước và fallback trung thực; không phải chatbot hiểu mọi câu hỏi.

## Marker thiết kế — bật nút i

Mặc định tắt để giữ màn học gọn. Bật **i** ở thanh đầu trang: số hiện ngay trên UI, kèm bảng giải thích cuối màn hình. Số chú thích khác số phương án tự chủ.

| Marker | Nguyên tắc | Vị trí có thể chỉ khi demo |
|---|---|---|
| ① | HAX G2 | #5 thẻ kết luận toán/không rõ nguyên nhân biên soạn; #2 hỏi bước đang vướng, không đoán học viên đã tính |
| ② | HAX G11 / Explainability | Nguyên văn §3.3, 0,25 → 0,5 và citation mở được; #2 nguồn và trạng thái bài đang mở |
| ③ | Rubric domain #6 / #3 | #5 chỉ câu sai và lý do; #2 chặn đáp án kể cả sau phê duyệt |
| ④ | HAX G8/G9, PAIR Feedback & Control / Human-in-the-Loop | Thẻ chờ/duyệt/từ chối/hủy/kết quả FAQ hoặc gợi ý; modal học viên xác nhận TA |
| ⑤ | PAIR Errors + Graceful Failure | Nhờ TA với tóm tắt sẵn, ngoài giờ nói rõ trạng thái mô phỏng |
| ⑥ | HAX G9 / Recovery | Sửa bản nháp, sửa câu hỏi, báo sai, rút lượt; gỡ cảnh báo có giới hạn không thể “chưa đọc” |
| ⑦ | HAX G10 | Thiếu nguồn/mơ hồ: nêu dữ liệu có/không có, hỏi lại thay vì đoán |

**Vì sao FAQ phương án ① không có ④?** AI không gọi `dang_FAQ`, nên không có bước duyệt/gỡ để đánh dấu. Nếu học viên chọn chuyển TA riêng, modal vẫn có ④ vì cần xác nhận. Khác biệt này được giải thích ngay trong legend. Phương án ③ không làm kết luận toán học kém đáng tin; rủi ro nằm ở tự công bố cho cả lớp và chưa rõ nguyên nhân/ngữ cảnh tài liệu.

![Ca #5: marker ① G2, ② G11, ③ tài liệu sai, ⑤ chuyển người, ⑥ sửa lỗi](screenshots/01-study-ux.png)

![Autonomy ca #5: bốn tool, phương án ②, bản nháp và marker ④ chờ giảng viên duyệt](screenshots/02-autonomy.png)

## State, mock và mã nguồn

`autonomy.js` là registry và guard dùng chung: `requested → evaluating → allowed / awaiting_approval / denied → executed / cancelled`; người duyệt có thể `rejected`, hành động hợp lệ có thể `undone`. Trace ghi lịch sử quyết định, actor, policy, kết quả `read_mock / hint_mock / queued_mock / published_mock` và lý do bị chặn. Đổi ca/phương án hủy các hành động đang chờ, không tự duyệt. Không hoàn tác gợi ý đã đọc.

- `engine.js`: fixture T2 và hội thoại deterministic; không lấy ngày máy để đổi hạn.
- `app.js`: loading/cancel, nguồn, chỉnh câu hỏi, modal và queue TA.
- `autonomy.js`, `autonomy-ui.js`: policy, guard, phê duyệt, so sánh và trace thực sự thay đổi hành vi.
- `styles.css`, `themes.css`, `locale.js`, `assets/`: responsive, Dark/Light, VI/EN, SVG, Onest và SIL OFL.
- `landing.html`: HTML độc lập, nhúng font/CSS/JS; shader ink tự viết với idle/pointer/burst, pause/reduced-motion và CSS fallback. Xấp xỉ thị giác fluid, không phải solver Navier–Stokes hay mã sao chép Pavel Dobryakov.

**Không backend, database, authentication, API key, LLM, agent hoặc endpoint giả.** Toàn bộ phản hồi, thời gian, thao tác và vai phê duyệt là mô phỏng. Queue TA lưu localStorage theo origin/trình duyệt; tối đa 5 yêu cầu chờ, chỉ dọn lịch sử đã rút. Nếu không lưu được thì giữ trong bộ nhớ và thông báo. FAQ, phê duyệt và trace chỉ giữ trong lần mở trang, mất khi reload; không có đồng bộ hoặc SLA. Chỉ nhập dữ liệu dựng.

Chạy kiểm tra từ repo (chỉ môi trường dev cần Node, Playwright, Chrome):

```text
node --test prototype/tests/engine.test.cjs prototype/tests/autonomy.test.cjs prototype/tests/browser.test.cjs
```

**UI UX Pro Max** và **Taste `design-taste-frontend`** đã có global, được đọc và áp dụng cho design system, accessibility, phong cách, responsive và browser inspection; không cài lại hoặc đưa source skills vào repo. Xem [QA.md](QA.md) cho bằng chứng và giới hạn gate; [AUTONOMY-NOTES.md](AUTONOMY-NOTES.md) là ghi chú kỹ thuật để nhóm viết §4, không giả lập ý kiến của thành viên.
