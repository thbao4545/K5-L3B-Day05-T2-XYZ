# Ý tưởng brainstorm — T2 Giáo dục (tạm, xoá sau khi nhóm thống nhất xong)

> File này chỉ để cả nhóm cùng xem, không phải bài nộp chính thức. Nội dung chính thức viết vào `spec.md`.

## Bối cảnh track

Trợ lý học bài kiểu ChatGPT Study mode, tích hợp vào trang khoá học "Nhập môn phân tích dữ liệu", học viên đang học buổi 3 ("Thống kê mô tả"). Lỗi **rẻ nhưng âm thầm**: học sai mà không ai biết, không có TA/giảng viên đứng sau để "chuyển".

4 tool có sẵn: `tra_cuu_tai_lieu` (chỉ đọc) · `goi_y_bai_tap` (đảo lại được nếu chưa quá tay) · `chuyen_TA` (đảo được) · `dang_FAQ` (gỡ được nhưng nhiều người đã đọc).

## Chặng 2 — Kịch bản rủi ro (gợi ý, nhóm tự thêm/sửa)

| # | Tin học viên | Lớp | AI có thể sai thế nào |
|---|---|---|---|
| 1 | "Trung vị khác trung bình chỗ nào, khi nào dùng cái nào?" | ① bình thường | Trả đúng nhưng không trích §3.2 → không có căn cứ |
| 2 | "Bài 3 câu (b), con số nào mô tả lương điển hình tốt hơn?" | ③ nhạy (đáp số bài đang mở) | Lỡ xác nhận đáp số thay vì chỉ gợi ý hướng — vi phạm rubric #3 |
| 3 | "Hàm Excel tính độ lệch chuẩn là STDEV đúng không?" | ② có thể sai | Đúng hàm nhưng học viên dùng để giải luôn bài 3 → vô tình "giải hộ" |
| 4 | "Em đọc slide 12 nói ngược lại, đúng không?" | ④ dữ liệu không có | Tài liệu không đánh số slide — nếu AI "ừ" theo thì bịa nguồn |
| 5 | "Độ lệch chuẩn có thể lớn hơn phương sai không?" | ② tài liệu có lỗi bẫy | §3.3 nói độ lệch chuẩn luôn nhỏ hơn phương sai — không phải luôn đúng; đây là chỗ "tài liệu có thể sai" |
| 6 | "Em dốt toán quá, hỏi gì cũng không hiểu" | ① tự chê bản thân | AI nhận xét năng lực người học — vi phạm rubric #8 |
| 7 | "Hạn bài 3 là bao giờ? Trễ thì sao?" | ① | Lấy nhầm hạn Bài tập 2 (đã đóng) thay vì Bài tập 3 (đang mở) |
| 8 | "Buổi 7 học p-value, giảng trước cho em được không?" | ② | Giảng nội dung chưa học → vượt phạm vi "tối đa 1 câu giới thiệu" |
| 9 | "Em nộp bài 3 rồi, AI xác nhận giúp em là bài đúng nhé" | ④ không chấp nhận được | AI tự nhận "đã báo TA" / "đã xác nhận" — việc nó không làm được |

**2 kịch bản đắt nhất (đề xuất):** #2 (xác nhận đáp số bài đang mở — sai thì cả lớp coi như có đáp án, không sửa được) và #4 hoặc #5 (tài liệu/nguồn sai mà AI khẳng định chắc — học sai mà không ai biết).

## Chặng 3 — Khi AI sai

- **#2**: không đưa đáp số; gợi ý hướng ("thử tính cả trung bình và trung vị, xem số nào bị kéo bởi giá trị 45"); hỏi lại "bạn đã thử tính chưa, vướng ở bước nào?".
- **#5**: "§3.3 ghi độ lệch chuẩn luôn nhỏ hơn phương sai — chỗ này cần xem lại, bạn nên hỏi giảng viên." Không tự sửa tài liệu, không khẳng định tài liệu đúng.
- Nguyên tắc có thể trích: Explainability (luôn kèm mã mục §x.x) · Graceful failure (chuyển TA kèm tóm tắt, không bắt học viên gõ lại) · thu hẹp khi nghi ngờ (hỏi lại 1 câu trước khi giảng).

## Chặng 4 — Mức tự chủ

- `tra_cuu_tai_lieu` → **Tự làm** (chỉ đọc).
- `goi_y_bai_tap` → **Cần người duyệt** / giới hạn cứng (chỉ gợi ý bước đầu, cấm đưa đáp số cho bài đang mở) — tool khó xếp nhất, ranh giới "gợi ý" vs "giải hộ" mờ.
- `chuyen_TA` → **Tự làm** (đảo được, rẻ).
- `dang_FAQ` → **Cần người duyệt** (TA duyệt trước khi đăng công khai) — gỡ được nhưng nhiều người đã đọc.

Có thể tách `goi_y_bai_tap` thành 2 tool con: `goi_y_huong_lam` (tự làm) và `xac_nhan_dap_so` (cấm hẳn khi bài đang mở) — ghi rõ lý do trong `spec.md` §4.

## Chặng 5 — Prototype

Chỉ cần **1–2 màn hình**, cho ca khó nhất. Gợi ý: màn chat học viên lúc 22h hỏi về Bài 3 → AI trích §3.1/§3.2, gợi ý hướng, không đưa đáp số, có nút "Chuyển TA" kèm giờ TA (08:00–22:00 → báo "TA offline, sáng mai 08:00 mới có người trả lời"). Đánh số: (1) mã mục trích dẫn, (2) ranh giới gợi ý vs đáp số, (3) nút chuyển TA + thời gian phản hồi. Có thể thêm toggle đổi mức tự chủ của `goi_y_bai_tap` (tự làm / cần duyệt / cấm), giống prototype mẫu của giảng viên.
