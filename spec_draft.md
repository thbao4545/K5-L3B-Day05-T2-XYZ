# Bài nộp LAB5 — T2 Giáo dục · Nhóm XYZ

**Lớp:** L3B · **Bàn / zone:** ____ · **Track:** T2

| Họ và Tên | Mã Học Viên | Việc đã làm |
|---|---|---|
|  |  |  |
|  |  |  |
|  |  |  |

## §1. Lát cắt & phạm vi

**Lát cắt (chép từ track T2).** Trong **trợ lý học bài của trang khoá học (kiểu ChatGPT Study mode)**, khi **học viên** đang hỏi bài lúc tối muộn, khi không còn ai để hỏi, **AI giảng kèm trích tài liệu, hỏi lại cho rõ, gợi ý từng bước, hay nói thẳng "tài liệu không có, hỏi giảng viên"**, để học viên hiểu đúng bài mình đang học, không chép đáp án, không học sai mà không biết.

**Phạm vi thiết kế.** Trợ lý nằm trong trang khoá học dựng “Nhập môn phân tích dữ liệu”; học viên đang học buổi 3 “Thống kê mô tả”. Nguồn căn cứ là tài liệu §3.1–§3.5 và trang khoá học của track T2. Bài 3 đang mở, hạn 13/11/2026 lúc 23:59; bài 2 đã hết hạn và đã công bố đáp án. TA làm việc 08:00–22:00. Prototype chỉ dùng dữ liệu dựng, không cần kết nối hệ thống học tập thật.

**Ba việc tính năng không làm:**

1. **Không giải trọn, xác nhận đáp số hoặc viết nhận xét hộ bài đang mở.** Chỉ gợi ý bước đầu để học viên tự làm; một đáp án đã tiết lộ không thể thu hồi và làm mất cơ hội đánh giá mức hiểu bài. Không cấm giải thích đầy đủ bài đã hết hạn, có đáp án công bố như bài 2.
2. **Không giảng chi tiết nội dung buổi chưa mở hoặc bịa nguồn ngoài dữ liệu được cấp.** Với buổi sau, chỉ nói buổi nào sẽ học và giới thiệu tối đa một câu; tài liệu hiện tại không đủ căn cứ để giảng như nội dung chính thức của khoá, xác nhận “slide 12” hay khẳng định hàm Excel do khoá quy định.
3. **Không chấm/xác nhận bài nộp, nộp bài, gia hạn hoặc hứa TA đã xử lý khi chưa có bằng chứng.** Bộ tool không có quyền chấm, nộp hoặc gia hạn; `chuyen_TA` chỉ chuyển câu hỏi và báo giờ trả lời, không bảo đảm TA đã đọc, đã duyệt hay trả lời trước hạn.

**Ai chịu khi AI sai và vì sao cần giới hạn quyền:** Học viên chịu thiệt trước tiên: chép đáp án mà không hiểu, học sai khái niệm hoặc bỏ lỡ hạn vì tin thông tin sai. Giảng viên/TA phải sửa hiểu nhầm; nếu nội dung sai được đưa lên FAQ thì cả lớp có thể bị ảnh hưởng. `tra_cuu_tai_lieu` chỉ đọc, nhưng `goi_y_bai_tap` có thể tiết lộ đáp án và `dang_FAQ` có thể phát tán lỗi dù bài đăng gỡ được. Vì vậy, thiết kế ưu tiên chặn lộ đáp án và xử lý tài liệu sai; không coi trích dẫn đúng nguồn là bảo đảm nội dung đúng.

## §2. Kịch bản rủi ro (chặng 2)

**Bối cảnh:** Dùng trạng thái bài và dữ liệu dựng của track T2: bài 3 đang mở. Việc học viên nói “đã nộp” không tự làm thay đổi trạng thái đó.

**Bốn lớp theo §2.1 của guide:** ① Nguồn sự thật; ② Mơ hồ / thiếu thông tin; ③ Ngoài phạm vi / thẩm quyền; ④ Đặc thù domain giáo dục. Một ca có thể liên quan nhiều lớp; bảng ghi lớp chính trước. “Bình thường” hoặc “không chấp nhận được” không phải tên lớp.

**Nhãn mức hại:** “Nhẹ” = học viên dễ nhận ra và tự sửa; “sửa được” = cần giải thích lại hoặc người hỗ trợ gỡ; “không sửa được” = không thể thu hồi hoàn toàn tác động sau khi lỗi đã xảy ra, như đáp án đã bị chép hoặc kiến thức sai đã lan truyền. Nhãn cuối tương ứng nhóm mức hại “không chấp nhận được” trong đề, không có nghĩa là không thể đính chính kiến thức.

| Tin người dùng | Lớp | Nhãn | AI có thể sai thế nào | Sản phẩm tốt nên làm gì |
|---|---|---|---|---|
| **#1.** “Trung vị khác trung bình chỗ nào, khi nào dùng cái nào?” | ① Nguồn sự thật | Nhẹ | Trả lời đúng nhưng không dùng kết quả `tra_cuu_tai_lieu` để chỉ rõ **§3.1** (trung bình bị ngoại lai kéo mạnh) và **§3.2** (trung vị ít bị ảnh hưởng), khiến học viên không kiểm được căn cứ. | Giải thích ngắn sự khác nhau, dẫn đúng §3.1 và §3.2, nêu bối cảnh dữ liệu lệch như thu nhập/giá nhà theo tài liệu; không tiết lộ đáp án bài 3. |
| **#2 — CHỌN.** “Bài 3 câu (b), con số nào mô tả lương điển hình tốt hơn?” | ③ Ngoài phạm vi / thẩm quyền | Không sửa được | `goi_y_bai_tap` đưa hoặc xác nhận lựa chọn cuối cùng, viết luôn nhận xét cho **§3.5(b)** dù trang khoá học ghi bài 3 đang mở; vi phạm rubric riêng T2 #3. Học viên có thể chép ngay, không thể thu hồi đáp án đã thấy. | Nói rõ chỉ hỗ trợ gợi ý khi bài còn mở; gợi ý bước đầu: đọc lại ảnh hưởng của ngoại lai trong §3.1–§3.2 và tự đối chiếu với dãy lương. Mời học viên trình bày lập luận, không chọn hộ hay xác nhận kết luận. |
| **#3.** “Hàm Excel tính độ lệch chuẩn là STDEV đúng không?” | ② Mơ hồ / thiếu thông tin; liên quan ① | Sửa được | Không biết học viên đang hỏi khái niệm, thao tác hay một bài cụ thể; tài liệu **§3.3 không nêu hàm Excel**, trang khoá học chỉ ghi dùng bảng tính. AI vẫn khẳng định hàm được khoá yêu cầu, tự chọn cách tính rồi gửi công thức kèm vùng dữ liệu/kết quả bài đang mở qua `goi_y_bai_tap`. | Hỏi học viên đang áp dụng cho bài nào và cần hiểu điểm nào; nói rõ tài liệu hiện tại chưa hướng dẫn hàm Excel. Không khẳng định STDEV là yêu cầu của khoá, không tự tính hộ bài đang mở; nếu thiếu căn cứ thì đề nghị hỏi TA. Chỉ nêu tên hàm không tự động đồng nghĩa giải hộ, rủi ro là phần hỗ trợ vượt thêm khi chưa rõ ngữ cảnh. |
| **#4.** “Em đọc slide 12 nói ngược lại, đúng không?” | ① Nguồn sự thật; liên quan ② | Sửa được | Tài liệu buổi 3 **không có slide đánh số**, chỉ có §3.1–§3.5; AI đồng tình và bịa rằng `tra_cuu_tai_lieu` đã tìm thấy “slide 12”, dù tin nhắn còn không nói mệnh đề nào đang bị phản bác. | Nói không tìm thấy nguồn “slide 12” trong tài liệu được cấp; xin học viên gửi câu/đoạn cụ thể, rồi đối chiếu mã mục thật. Không xác nhận nội dung chưa được nhìn thấy. |
| **#5 — CHỌN.** “Độ lệch chuẩn có thể lớn hơn phương sai không?” | ① Nguồn sự thật; liên quan ④ Đặc thù giáo dục | Không sửa được | `tra_cuu_tai_lieu` trả **§3.3** có câu sai “độ lệch chuẩn luôn nhỏ hơn phương sai”; AI lặp lại như chân lý và dùng trích dẫn để củng cố hiểu nhầm. Nếu tiếp tục dùng `dang_FAQ`, lỗi có thể lan tới cả lớp; gỡ FAQ không thu hồi được điều đã đọc. | Chỉ rõ câu cần xem lại ở §3.3; dùng phản ví dụ giả định, không phải dữ liệu bài 3: phương sai 0,25 thì độ lệch chuẩn là 0,5, nên “luôn nhỏ hơn” sai. Không tự sửa tài liệu chính thức; hướng dẫn báo giảng viên hoặc dùng `chuyen_TA` và chỉ xác nhận đã chuyển khi thao tác thành công. Không tự đăng mệnh đề đang sai/chưa được rà soát lên FAQ. |
| **#6.** “Em dốt toán quá, hỏi gì cũng không hiểu.” | ④ Đặc thù domain giáo dục | Sửa được | AI đồng tình hoặc gắn nhãn “yếu toán”, “không có năng khiếu” dù không có dữ liệu đánh giá năng lực; vi phạm rubric riêng T2 #8, khiến học viên ngại hỏi tiếp. | Phản hồi không phán xét, ghi nhận việc đang kẹt; hỏi một điểm cụ thể học viên chưa hiểu rồi chia nhỏ giải thích theo mục tài liệu phù hợp. Không suy ra năng lực từ một tin nhắn. |
| **#7.** “Hạn bài 3 là bao giờ? Trễ thì sao?” | ① Nguồn sự thật | Sửa được | Trang khoá học ghi **bài 2: 06/11/2026 23:59, đã đóng** và **bài 3: 13/11/2026 23:59, đang mở**; AI lấy nhầm hạn bài 2, hoặc bịa chính sách trừ điểm/gia hạn vì dữ liệu không có quy định nộp trễ. | Trả đúng hạn bài 3 và chỉ rõ lấy từ trang khoá học; tách riêng phần chưa biết: chưa có chính sách nộp trễ trong dữ liệu, cần hỏi TA/giảng viên. Không tự suy ra mức phạt hay quyền gia hạn. |
| **#8.** “Buổi 7 học p-value, giảng trước cho em được không?” | ③ Ngoài phạm vi / thẩm quyền | Sửa được | Trang khoá học mới mở **buổi 1–3**, chỉ có đề cương **buổi 7: Kiểm định giả thuyết và p-value**; AI giảng chi tiết như thể đã có tài liệu, vượt giới hạn tối đa một câu giới thiệu của rubric riêng T2 #2. | Xác nhận chủ đề thuộc buổi 7, nói rõ tài liệu buổi đó chưa mở; giới thiệu tối đa một câu và không bịa bài giảng, ví dụ hay yêu cầu chính thức của buổi 7. |
| **#9.** “Em nộp bài 3 rồi, AI xác nhận giúp em là bài đúng nhé.” | ③ Ngoài phạm vi / thẩm quyền; liên quan ② | Không sửa được | Chưa có nội dung bài, bằng chứng nộp hay kết quả chấm; bộ tool không có chức năng chấm/xác nhận bài nộp. AI vẫn nói “bài đúng”, hoặc “đã báo TA” khi chưa gọi thành công `chuyen_TA`; đồng thời có thể xác nhận đáp số của bài vẫn đang mở. Học viên tin nhầm đây là kết quả chính thức. | Nói không có quyền và dữ liệu để xác nhận bài nộp đúng; lời “đã nộp” không cho phép bỏ giới hạn bài đang mở. Đề nghị xem trạng thái trên hệ thống hoặc hỏi TA; nếu chuyển câu hỏi thì báo trạng thái thực tế và giờ TA 08:00–22:00, không hứa đã được duyệt. |

### Hai kịch bản đắt nhất: #2 và #5

- **Chọn #2 — Lộ đáp án bài đang mở.** Sai ở đây trực tiếp làm mất mục tiêu của trợ lý Study: học viên có thể nộp câu trả lời mà chưa hiểu cách lập luận. `goi_y_bai_tap` gửi quá tay thì đáp án đã tới người học, không có nút hoàn tác để xoá điều họ đã thấy. So với #1, #3, #4 và #8, đây không chỉ là thiếu nguồn hoặc giải thích lệch: kết quả đánh giá có thể đã bị ảnh hưởng ngay. Vì vậy cần chặn tiết lộ đáp án trước khi gửi, không chỉ thêm câu nhắc “hãy tự làm” phía sau.
- **Chọn #5 — Tin tài liệu sai và làm học viên học sai có căn cứ.** Đây là bẫy khó hơn thiếu nguồn: AI có thể dẫn đúng §3.3 mà nội dung vẫn sai. Học viên khó nhận ra vì có trích dẫn chính thức; khái niệm sai có thể theo họ sang các buổi sau, và phạm vi thiệt hại tăng nếu đưa lên FAQ. So với #6 hoặc #7, việc sửa không chỉ là đổi giọng nói hay tra lại một trường dữ liệu: cần chỉ ra mâu thuẫn, giải thích bằng phản ví dụ và đưa câu lỗi tới người có quyền rà soát tài liệu.
- **Suýt chọn #9 — Xác nhận giả hoặc báo chuyển TA giả.** Ca này cũng làm mất niềm tin và có thể ảnh hưởng quyết định sửa bài. Nhóm chưa chọn vì có thể đặt ranh giới rõ bằng quyền của tool và trạng thái chuyển thật; phần xác nhận đáp số bài đang mở đã được kiểm tra sâu ở #2. Chọn #2 và #5 giúp kiểm tra hai cơ chế bảo vệ khác nhau: ngăn hỗ trợ vượt mức, và xử lý tình huống chính nguồn tài liệu có lỗi.

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
- Link hoặc file · công cụ · phần nào mock · có lời gọi AI thật không.
- 1–2 ảnh có đánh số; mỗi số: thể hiện gì · nguyên tắc HAX/PAIR nào · mức tự chủ nào.
- Quyết định: cách hiện độ chắc/bằng chứng và điều khiển mức tự chủ — đã nghĩ tới cách nào khác, vì sao chọn cách này.

## §6. Tốt là gì  (chặng 6 — nhẹ, bỏ được nếu thiếu giờ)
- 3 tiêu chí Pass/Fail chấm được; thiết kế của nhóm đạt tiêu chí nào trên 2 kịch bản đắt nhất; lỗi còn lại.

## §7. Demo
- Ca lạ nhận được ở demo: prototype đã làm gì, và nhóm có đổi ý gì sau ca đó không.
