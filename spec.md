# Bài nộp LAB5 — T2 Giáo dục · Nhóm XYZ

**Lớp:** L3B · **Bàn / zone:** ____ *(điền tại lớp)* · **Track:** T2 — trợ lý học bài tối muộn, khi không còn ai để hỏi

| Họ và Tên | Mã Học Viên | Việc đã làm |
|---|---|---|
| Từ Huy Bảo | 2A202604021 |  |
| Chu Nguyễn Tùng Dương | 2A202604016 |  |
| Nguyễn Hữu An | 2A202604024 |  |

> *(Điền tên, mã học viên, và việc mỗi người làm trước khi nộp — TA/giảng viên hỏi bất kỳ thành viên lúc demo.)*

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

### Kịch bản #2 — xin xác nhận đáp số bài đang mở

- **AI nói gì (nguyên văn):** *"Bài 3 đang mở (hạn 13/11 23:59), mình không đưa đáp số. Gợi ý hướng: bạn tính thử cả trung bình và trung vị của 8 số này, rồi xem lại §3.2 và §3.4 — trung vị ít bị ảnh hưởng bởi giá trị ngoại lai, trung bình bị kéo mạnh bởi nó. Dữ liệu này có số nào trông khác hẳn phần còn lại không?"*
- **Người dùng thấy:** nhãn "mình chưa chắc bạn đã tự tính hay chưa", trích dẫn trang khoá học ("Bài 3 đang mở"), nút "Em tính rồi, kết quả là..." để tiếp tục hội thoại, và nút chuyển TA.
- **Làm gì tiếp:** nếu học viên tự đưa số ra, AI chỉ xác nhận cách lập luận ("đúng rồi, giờ áp vào §3.2..."), không tự nói kết luận trước. Nếu học viên cố xin xác nhận trực tiếp, AI soạn sẵn nội dung đầy đủ nhưng gửi TA duyệt trước khi trả (mức tự chủ ②, xem §4).
- **Ai được báo, sau bao lâu:** nếu chuyển TA, TA thấy tóm tắt ngay; nếu soạn sẵn đáp số chờ duyệt, TA duyệt trong giờ làm việc (08:00–22:00), ngoài giờ thì dự kiến sáng hôm sau.
- **Quyết định:** chọn **hỏi lại + trả lời kèm giới hạn** (gợi ý hướng, không đưa số) thay vì **dừng và chuyển người** ngay — vì phần lớn trường hợp một câu hỏi lại là đủ, chuyển TA ngay cho mọi câu hỏi về bài đang mở sẽ làm TA quá tải với các câu học viên tự giải quyết được.
- **Loại lỗi:** lỗi **ngữ cảnh** — câu hỏi của học viên hợp lệ về mặt ngôn ngữ, nhưng ngữ cảnh "bài đang mở" khiến việc trả lời thẳng trở thành vi phạm; vì vậy cách sửa không phải "nói lại cho đúng" mà là **thêm một bước kiểm tra ngữ cảnh** (trạng thái bài tập) trước khi quyết định trả gì.
- **Nguyên tắc HAX/PAIR:** HAX G2 (nhãn "mình chưa chắc" làm rõ AI không giả định học viên đã tự làm) · Rubric domain #3 (chỉ gợi ý bước đầu) · PAIR Feedback & Control (trạng thái "đang chờ TA duyệt" cho khách kiểm soát được AI đang ở đâu).
- **Lỗi sửa câu chữ không cứu được:** nếu AI đã đưa đáp số đầy đủ (mức ③ trong prototype), sửa câu chữ sau đó không cứu được vì học viên đã đọc — thiết kế cứu bằng cách **cấm hẳn** việc đưa đáp số ở mức tự chủ (chặn trước khi nói ra), không dựa vào sửa sau.

### Kịch bản #5 — tài liệu buổi 3 có câu sai (§3.3)

- **AI nói gì (nguyên văn):** *"Mình xem lại §3.3: 'Vì là căn bậc hai, độ lệch chuẩn luôn nhỏ hơn phương sai.' Câu này không đúng với mọi trường hợp — chỉ đúng khi phương sai > 1. Nếu phương sai nhỏ hơn 1 (ví dụ 0.25), độ lệch chuẩn (0.5) sẽ lớn hơn phương sai."*
- **Người dùng thấy:** nhãn "mình chưa chắc đây là lỗi đánh máy hay tài liệu có ý khác — bạn nên hỏi lại giảng viên để chắc", trích nguyên văn §3.3 kèm lập luận toán, và (nếu ở mức ②) trạng thái "đã gửi giảng viên, đang chờ duyệt" trước khi đăng FAQ.
- **Làm gì tiếp:** AI không tự sửa tài liệu, không tự khẳng định tài liệu đúng hay sai; chỉ nêu điểm cần xem lại và đề nghị xác nhận với giảng viên.
- **Ai được báo, sau bao lâu:** giảng viên được gửi tin soạn sẵn ngay khi phát sinh; nếu ngoài giờ hành chính, duyệt dự kiến sáng hôm sau (08:00) trước khi FAQ cả lớp thấy nội dung.
- **Quyết định:** chọn **dừng và chuyển sang chờ xác nhận người** cho việc **đăng công khai** (vì ảnh hưởng cả lớp), nhưng vẫn **trả lời riêng ngay** cho học viên đang hỏi (vì chỉ ảnh hưởng một người và có kèm giới hạn "chưa chắc") — tách hai mức tự chủ cho hai hành vi của cùng một câu hỏi.
- **Loại lỗi:** lỗi **hệ thống** — nguồn gốc là tài liệu khoá học (dữ liệu nền) có thể sai, không phải AI suy luận sai hay học viên hỏi mơ hồ; vì vậy cách sửa không phải "AI trả lời lại cho đúng" (AI không có quyền sửa tài liệu) mà là **định tuyến về đúng người có quyền** (giảng viên).
- **Nguyên tắc HAX/PAIR:** Explainability (trích nguyên văn §3.3, không chỉ nói "tài liệu sai") · Rubric domain #6 (không khẳng định tài liệu đúng khi chưa kiểm) · PAIR Feedback & Control (trạng thái chờ duyệt / gỡ được trong 24h).
- **Lỗi sửa câu chữ không cứu được:** nếu AI đã tự đăng FAQ sai (mức ③), sửa câu chữ sau đó không cứu được người đã đọc trước khi gỡ — thiết kế cứu bằng cách **giữ việc đăng công khai ở mức cần duyệt**, chỉ cho AI tự làm phần trả lời riêng (ít người bị ảnh hưởng, dễ sửa tại chỗ).

## §4. Mức tự chủ  (chặng 4)

| Tool | Mức | Ai duyệt / quá hạn thì sao | Lý do theo cost-of-error |
|---|---|---|---|
| `tra_cuu_tai_lieu` | **Tự làm** | — | Chỉ đọc, không tạo nội dung mới; sai (nếu có) là do dữ liệu nguồn, không phải do AI tự chủ quá tay. |
| `goi_y_bai_tap` | **Tự làm, giới hạn cứng** (chỉ gợi ý bước đầu) + **cần TA duyệt** nếu vượt giới hạn (đưa đáp số/số liệu) | TA duyệt trong giờ hành chính (08:00–22:00); ngoài giờ thì học viên chỉ nhận gợi ý hướng, chờ duyệt tới giờ làm việc hôm sau | Đưa đáp số cho bài đang mở không đảo lại được (học viên đã đọc, có thể chép); gợi ý hướng thì sai cũng chỉ tốn thêm một lượt hỏi lại. |
| `chuyen_TA` | **Tự làm** | — | Đảo được (TA không trả lời thì học viên vẫn có thể hỏi lại); chi phí sai chỉ là TA đọc nhầm tóm tắt, rẻ hơn nhiều so với chờ người duyệt mọi câu. |
| `dang_FAQ` | **Cần giảng viên duyệt** | Giảng viên duyệt trong giờ hành chính; ngoài giờ, tin giữ ở trạng thái "chờ duyệt", dự kiến đăng sáng hôm sau | Gỡ được về mặt kỹ thuật, nhưng nhiều người đã đọc trước khi gỡ — đăng sai một cảnh báo hoặc một đáp án cho cả lớp là lỗi lan rộng, khác với trả lời sai cho một người. |

**Phương án đã cân nhắc và vì sao loại:**
- Từng cân nhắc để `goi_y_bai_tap` **luôn tự làm không giới hạn** (giống một gia sư trả lời mọi câu) — loại vì đây chính là kịch bản #2, chi phí sai (lộ đáp số bài đang mở) quá cao so với lợi ích (nhanh hơn một chút).
- Từng cân nhắc để `dang_FAQ` **tự làm** để FAQ cập nhật tức thì — loại vì rủi ro ở kịch bản #5: nếu AI hiểu nhầm ý tài liệu, cả lớp đã thấy một cảnh báo có thể sai trước khi giảng viên kịp xem.

**Tool khó xếp nhất: `goi_y_bai_tap`.**
- Một phương án từng được đề xuất: tự làm hoàn toàn (nhanh, phục vụ tốt giờ tối muộn khi không có TA) — cái giá: lộ đáp số bài đang mở (kịch bản #2), không đảo lại được.
- Phương án khác: cấm hoàn toàn, mọi câu hỏi bài tập đều chuyển TA — cái giá: TA quá tải vào giờ tối muộn, học viên chờ lâu cho cả những câu đơn giản (vi phạm mục tiêu track: không còn ai để hỏi).
- **Nhóm chốt:** tách hai lớp hành vi trong cùng một tool — gợi ý bước đầu (tự làm, không giới hạn giờ) và đưa đáp số/số liệu (cần duyệt) — vừa phục vụ được giờ tối muộn, vừa chặn đúng chỗ đắt nhất.

**Thử mức trên 2 kịch bản đắt nhất + 1 kịch bản bình thường:**
- **#2** (đắt nhất): mức giới hạn cứng chặn được việc lộ đáp số; AI vẫn trả lời ngay phần gợi ý, không phải chờ vô ích.
- **#5** (đắt nhất): mức cần duyệt cho `dang_FAQ` chặn được việc cả lớp thấy cảnh báo sai; học viên hỏi vẫn được trả lời riêng ngay, không chờ.
- **#1** (bình thường, "trung vị khác trung bình"): không tool nào cần duyệt — `tra_cuu_tai_lieu` tự làm trả ngay, học viên không phải chờ vô ích.
- Không phát sinh việc "làm khi lẽ ra phải hỏi" ở ba ca trên, vì giới hạn đặt đúng ở hành vi tốn chi phí (đưa đáp số / đăng công khai), không đặt ở toàn bộ tool.

**Luật tách bước:** tách `goi_y_bai_tap` thành hai hành vi — *gợi ý hướng* (tự làm) và *đưa đáp số/số liệu đầy đủ* (cần duyệt) — vì hai hành vi có cost-of-error khác hẳn nhau trong cùng một tool gốc.

**Mức tự chủ đã đổi lời hứa:** ban đầu định hứa "trợ lý trả lời mọi câu hỏi bài tập ngay, không chờ" (giống Study mode thật) — sau khi đặt `goi_y_bai_tap` ở mức giới hạn cứng, lời hứa đổi thành "trợ lý luôn gợi ý ngay; nếu bạn cần đáp số đầy đủ cho bài đang mở, phải chờ TA duyệt" — chấp nhận chậm hơn ở đúng chỗ đắt, để không phải hứa quá khả năng an toàn của sản phẩm.

## §5. Prototype  (chặng 5)

- **File và cách mở:** [landing](prototype/landing.html), [app](prototype/index.html), [ca #2](prototype/index-ca2.html). Bấm đúp `prototype/Open-Demo.cmd` trên Windows; `Start-Demo.ps1` tương đương. Không cần server/build. Ca #2 dùng chung app qua `index.html#exercise` để giữ policy nhất quán.
- **Phạm vi mock:** HTML/CSS/Vanilla JavaScript; fixture T2, keyword routing và state machine deterministic. Web mặc định không gọi AI, không backend/database/authentication. Có script OpenAI tùy chọn chạy cục bộ trước demo, không có key trong trang hoặc Git. Giờ, vai người duyệt, loading, FAQ và queue đều mô phỏng. Queue TA chỉ lưu trình duyệt; FAQ/trace giữ trong lần mở trang. Không gửi đến TA/server, không xác thực vai người duyệt.
- **Hai ca trọng tâm:** #5 trích nguyên văn câu sai §3.3, phản ví dụ phương sai 0,25 → độ lệch chuẩn 0,5, giải thích khác đơn vị, cảnh báo và nhờ TA. #2 không chốt lựa chọn hoặc đáp số bài đang mở, chỉ hai mức định hướng có nguồn. Có đường sửa câu hỏi, báo sai cục bộ, rút lượt và reset. Ba ca bổ sung được thu gọn.
- **Autonomy có hành vi:** registry đúng bốn tool, guard kiểm tra trước thực thi; trace ghi requested/evaluating/allowed/awaiting_approval/denied/executed, rejected/cancelled/undone khi hợp lệ. Ca #5 so sánh tự báo / FAQ cần giảng viên duyệt / tự đăng giả định bị loại. Có bản nháp sửa được, Approve, Reject, cancel và gỡ mô phỏng; chỉ Approve mới published_mock trong phương án đề xuất. Ca #2 so sánh gợi ý AUTO / TA duyệt hỗ trợ phù hợp / tự giải bị chặn. Phê duyệt không cho phép giải hộ. `xac_nhan_dap_so` là hành động con bị cấm, không phải tool thứ năm. Không có tool tự sửa tài liệu.
- **Chính sách và so sánh:** đồng bộ §4 tại master ee00f61: tra cứu AUTO, gợi ý AUTO giới hạn, chuyển TA AUTO, FAQ cần giảng viên duyệt. Học viên xem/sửa nội dung rồi chủ động nhờ TA; tool chuyển chạy ngay sau đó, không chờ TA phê duyệt việc chuyển. Đoạn §4 cho phép duyệt đáp số bài đang mở mâu thuẫn ràng buộc cứng của yêu cầu: prototype tiếp tục chặn ở mọi mức và ghi rõ trong notes, không tự sửa §4. Dấu **Khuyến nghị** cố định #5=②/#2=①, độc lập phương án đang chọn; có nút về khuyến nghị. **Output AI** đổi theo sáu phương án, chỉ chạy action khi bấm mô phỏng và phản ánh trạng thái sau duyệt/từ chối/hủy/gỡ. Bảng bốn tool, editor và trace thu gọn. ①/②/③ không tương ứng 1:1 ba policy.
- **Xác nhận TA:** học viên xem/sửa tóm tắt, dữ liệu kèm theo, nguồn và thời điểm, rồi consent mới thêm vào hàng chờ mô phỏng. Hủy trước xác nhận hoặc rút yêu cầu cục bộ sau đó. Mốc cố định 13/11/2026 22:30 (tùy chọn 21:10); bài 3 luôn mở, hạn 23:59. TA 08:00–22:00; giờ làm việc kế tiếp 14/11 08:00 sau hạn bài. Không hứa trả lời đúng 08:00 hoặc gia hạn.
- **Ảnh và chú thích:** [01 — ca #5](prototype/screenshots/01-study-ux.png), [02 — autonomy](prototype/screenshots/02-autonomy.png). Bật `i`: **① G2** tách kết luận toán đúng khỏi nguyên nhân biên soạn chưa rõ, hoặc hỏi bước học viên đang vướng; **② G11** nguồn/citation và lập luận kiểm chứng; **③ domain #6/#3** chỉ câu sai hoặc chặn đáp án; **④ Feedback & Control/Human-in-the-Loop** thẻ chờ/duyệt/từ chối/hủy và modal xác nhận TA; **⑤ PAIR Graceful Failure** nhờ TA kèm tóm tắt; **⑥ G9** sửa/rút; **⑦ G10** hỏi lại khi thiếu dữ liệu. FAQ phương án ① không có ④ vì AI không gọi tool công bố; chuyển TA riêng vẫn có bước xác nhận. Số chú thích khác số phương án tự chủ. Giữ §3 của thành viên A.
- **Quyết định UX:** dùng nhãn bằng chứng fixture + citation mở được + giải thích toán, không % confidence giả. Loại nhãn “chưa chắc” chung chung vì làm người học nghi cả phản ví dụ đúng. Chọn tóm tắt TA soạn sẵn + xem/sửa/consent để giữ quyền người học, loại tự chuyển/disclaimer đơn thuần. Chặn đáp án trước khi hiển thị; gỡ FAQ không thu hồi thông tin đã đọc. Phương án tự đăng chỉ minh họa rủi ro bị loại, không phải khuyến nghị.
- **Giao diện và kiểm tra:** app Dark theo landing, Light tùy chọn, VI/EN lưu cục bộ; nguồn và câu người học giữ nguyên. UI UX Pro Max và Taste cài global, không copy source skills vào repo. Đã kiểm tra Chrome desktop/mobile, đủ các luồng duyệt/từ chối/hủy/chặn/reset và sửa lỗi. [README](prototype/README.md) mô tả demo và mock; [QA](prototype/QA.md) ghi kết quả, review và giới hạn Taste gate. Landing giữ nguyên trong đợt nâng cấp autonomy này.

- **Luna trực tiếp tùy chọn:** `Open-Live-Demo.cmd` chạy cầu nối Node loopback đọc `.env` local (Git ignore), model `gpt-6-luna`. Mỗi câu hỏi gọi OpenAI; phản hồi được guard theo workflow, lỗi/vượt giới hạn dùng fixture có nhãn rõ. Không database; TA/FAQ vẫn mô phỏng, không sửa nguồn hay nâng quyền. Bản fixture vẫn mở tĩnh không key.


- **Đổi quyền = đổi hành vi UI ngay:** #5 mở bản nháp / chờ giảng viên / cảnh báo lớp giả định; #2 đưa gợi ý / chờ duyệt / bị chặn. Chat, thẻ duyệt và kết quả cùng cập nhật. Dấu khuyến nghị giữ #5②/#2①, không dịch chuyển theo lựa chọn.

## §6. Tốt là gì  (chặng 6)

1. **Không đưa, không xác nhận đáp số cho bài tập đang mở, ở mọi câu hỏi diễn đạt khác nhau.** *(Pass/Fail)* — Đạt ở #2 với mức giới hạn cứng.
2. **Mọi cảnh báo hoặc thay đổi hiển thị cho cả lớp (FAQ) phải qua người có thẩm quyền duyệt trước khi đăng.** *(Pass/Fail)* — Đạt ở #5 với mức cần giảng viên duyệt.
3. **Mọi câu trả lời về nội dung chuyên môn phải kèm mã mục tài liệu cụ thể (§x.x), không trả lời không trích dẫn.** *(Pass/Fail)* — Đạt ở cả #2 và #5.

**Lỗi còn lại:** chưa thiết kế rõ trường hợp giảng viên **không duyệt trong nhiều ngày** (quá hạn thực sự, không chỉ qua đêm) — hiện mới dừng ở "chờ tới giờ làm việc hôm sau", chưa có đường thoát nếu TA/giảng viên bận suốt nhiều ngày.

## §7. Demo

*(Điền sau khi demo: ca lạ nhận được từ TA/nhóm bạn/giảng viên, prototype đã xử lý thế nào, và nhóm có đổi ý gì về mức tự chủ hay cách nói sau ca đó không.)*
