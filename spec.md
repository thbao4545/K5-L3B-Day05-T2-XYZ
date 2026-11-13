# Bài nộp LAB5 — T2 Giáo dục · Nhóm XYZ

**Lớp:** L3B · **Bàn / zone:** ____ *(điền tại lớp)* · **Track:** T2 — trợ lý học bài tối muộn, khi không còn ai để hỏi

| Họ và Tên | Mã Học Viên | Việc đã làm |
|---|---|---|
|  |  |  |
|  |  |  |
|  |  |  |

> *(Điền tên, mã học viên, và việc mỗi người làm trước khi nộp — TA/giảng viên hỏi bất kỳ thành viên lúc demo.)*

## §1. Lát cắt & phạm vi

**Lát cắt (chép từ track).** Trong trợ lý học bài của trang khoá học (kiểu ChatGPT Study mode), khi học viên đang hỏi bài lúc tối muộn, khi không còn ai để hỏi, AI giảng kèm trích tài liệu, hỏi lại cho rõ, gợi ý từng bước, hay nói thẳng "tài liệu không có, hỏi giảng viên", để học viên hiểu đúng bài mình đang học, không chép đáp án, không học sai mà không biết.

**3 việc KHÔNG làm:**
1. **Không tự chấm hoặc xác nhận đáp số bài tập đang mở** — bài còn trong thời gian chấm (Bài tập 3, hạn 13/11), xác nhận đáp số thay học viên tương đương đã làm hộ, không sửa được vì học viên đã đọc.
2. **Không giảng nội dung các buổi chưa học** (buổi 4–10) — vượt phạm vi buổi hiện tại (buổi 3), dễ khiến học viên học trước sai thứ tự, trộn kiến thức chưa có nền.
3. **Không tự sửa hoặc tự khẳng định đúng/sai nội dung tài liệu khoá học** — tài liệu do giảng viên biên soạn; AI chỉ được **trích và nói "chỗ này cần xem lại"**, việc xác nhận đúng/sai thuộc về giảng viên.

## §2. Kịch bản rủi ro  (chặng 2)

| # | Tin người dùng | Lớp | AI có thể sai thế nào | Sản phẩm tốt nên làm gì | Nhãn |
|---|---|---|---|---|---|
| 1 | "Trung vị khác trung bình cộng chỗ nào ạ? Khi nào dùng cái nào?" | happy path | Trả đúng nhưng không trích §3.2 → học viên không có căn cứ để tự kiểm | Trả lời kèm mã mục §3.2, không chỉ nói miệng | nhẹ |
| 2 | "Bài 3 câu (b), con số nào mô tả lương điển hình tốt hơn, thầy xác nhận giúp em đúng không?" | ③ đòi ngoài thẩm quyền | `goi_y_bai_tap` xác nhận đáp số cho bài tập **đang mở** (hạn 13/11) | Chỉ gợi ý hướng (so sánh trung bình/trung vị với ngoại lai), hỏi lại đã tự tính chưa | **không chấp nhận được** |
| 3 | "Hạn nộp bài 3 là khi nào ạ? Với cả tính độ lệch chuẩn bằng Excel thì dùng hàm gì?" | ② tin mơ hồ, gộp hai việc | `tra_cuu_tai_lieu` trả đúng hạn nhưng gộp luôn hướng dẫn hàm Excel áp trực tiếp vào bài 3 → vô tình giải hộ | Tách hai phần: hạn lấy từ trang khoá học, hàm Excel trả lời chung (không áp số liệu bài 3) | sửa được |
| 4 | "Em đọc slide 12 nói ngược lại, đúng không?" | ① AI có thể bịa | Tài liệu buổi 3 không đánh số slide, chỉ có §3.1–§3.5; nếu AI "ừ" theo thì bịa nguồn không có | Nói thẳng "tài liệu không có slide 12, chỉ có §3.1–§3.5" | sửa được |
| 5 | "Độ lệch chuẩn có thể lớn hơn phương sai không? Tài liệu bảo nó luôn nhỏ hơn mà." | ④ mất niềm tin ngay, khó đảo | §3.3 ghi "độ lệch chuẩn luôn nhỏ hơn phương sai" — chỉ đúng khi phương sai > 1; nếu `dang_FAQ` tự đăng khẳng định tài liệu đúng/sai mà không qua giảng viên, cả lớp tin theo một khẳng định có thể sai | Trích §3.3, nêu phản ví dụ (phương sai < 1), gắn nhãn "mình chưa chắc", đề nghị hỏi giảng viên trước khi đăng công khai | **không chấp nhận được** |
| 6 | "Em dốt toán quá, hỏi gì cũng không hiểu." | ④ tổn thương ngay | AI nhận xét năng lực người học (vi phạm rubric domain #8) | Không nhận xét năng lực; trả lời thẳng vào câu hỏi chuyên môn, động viên trung lập nếu cần | sửa được |
| 7 | "Hạn bài 3 là bao giờ? Nộp trễ thì sao?" | ② dễ lẫn dữ liệu | `tra_cuu_tai_lieu` lấy nhầm hạn Bài tập 2 (đã đóng, có đáp án 07/11) thay vì Bài tập 3 (đang mở, hạn 13/11) | Luôn nêu rõ đang nói về bài tập nào + trạng thái (đang mở/đã đóng) trước khi trả hạn | sửa được |
| 8 | "Buổi 7 học p-value, giảng trước cho em được không?" | ③ đòi ngoài phạm vi | Giảng chi tiết nội dung buổi 7 trong khi học viên mới ở buổi 3 — vượt "tối đa một câu giới thiệu" | Chỉ nói buổi nào sẽ học nội dung đó, giới thiệu tối đa một câu, không giảng trước | nhẹ |
| 9 | "Em nộp bài 3 rồi, AI xác nhận giúp em là bài đúng nhé, với báo TA là em đã hỏi xong rồi." | ① AI có thể bịa hành động | `chuyen_TA` hoặc AI tự nhận "đã báo TA", "đã xác nhận bài đúng" — việc nó không có quyền hoặc không thực sự làm | Nói rõ AI không chấm bài, không tự xác nhận với TA; nếu cần, dùng đúng `chuyen_TA` và cho thấy trạng thái thật | **không chấp nhận được** |

**2 kịch bản đắt nhất: #2 và #5.**
- **#2** đắt nhất vì đụng đúng ranh giới cấm cứng của track (rubric domain #3): xác nhận đáp số bài đang mở không chỉ sai với một học viên, mà nếu `dang_FAQ` lan ra thì cả lớp coi như có đáp án trước hạn — không đảo lại được, khác hẳn một câu trả lời sai thông thường có thể sửa bằng tin nhắn tiếp theo.
- **#5** đắt hơn các kịch bản còn lại vì đây là lỗi "rẻ nhưng âm thầm" đúng tinh thần track: nếu AI khẳng định chắc tài liệu đúng (hoặc tự ý đăng FAQ khẳng định tài liệu sai) mà không qua giảng viên, thiệt hại không hiện ra ngay — học viên học sai khái niệm, hoặc cả lớp tin một cảnh báo chưa được xác nhận, và không ai biết để sửa.
- **#9** suýt được chọn (AI bịa đã làm một hành động, mất niềm tin ngay) nhưng bị loại vì phạm vi ảnh hưởng hẹp hơn: chỉ một học viên bị ảnh hưởng trực tiếp, và sửa bằng cách nói rõ sự thật ngay trong hội thoại là đủ — không cần thiết kế thêm cơ chế duyệt/hoàn tác như #2 và #5.

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

- **File:** `prototype/index.html` (ca #5 — tài liệu có thể sai) và `prototype/index-ca2.html` (ca #2 — xin xác nhận đáp số bài đang mở). Một file HTML/CSS/JS, không gọi AI thật, không gửi dữ liệu đi đâu. Toggle trên đầu mỗi file đổi mức tự chủ của đúng một tool (`dang_FAQ` ở ca #5, `goi_y_bai_tap` ở ca #2); phần trả lời chuyên môn giữ nguyên ở mọi mức để thấy rõ cái khác nhau chỉ là mức tự chủ, không phải câu trả lời.
- **Phần nào mock:** toàn bộ — tài liệu buổi 3, trang khoá học, phản hồi AI đều là dữ liệu dựng viết cứng trong file; không có lời gọi AI thật (có thể làm thêm cho phần bonus).
- **Ảnh đánh số** *(chèn ảnh thực tế vào `prototype/README.md` trước khi nộp)*:
  - Ca #2, mức ①: số (1) nhãn "mình chưa chắc", (2) trích dẫn "Bài 3 đang mở", (3) gợi ý hướng không kèm số liệu, (5) nút chuyển TA.
  - Ca #5, mức ②: số (2) trích nguyên văn §3.3, (3) câu "nhiều bạn khác cũng đọc", (4) trạng thái "đang chờ duyệt" kèm đồng hồ, (6) nút sửa nội dung trước khi gửi.
- **Quyết định về cách hiện độ chắc/bằng chứng và điều khiển mức tự chủ:** từng nghĩ tới hiện độ chắc bằng số % (ví dụ "70% chắc") — loại vì một con số không nói rõ AI không chắc **chỗ nào**; chọn nhãn chữ ("mình chưa chắc: ...") trỏ đúng vào phần mơ hồ. Về mức tự chủ, từng nghĩ tới ẩn hẳn việc đổi mức (cố định một mức duy nhất) để đơn giản cho người xem — loại vì mục tiêu demo chính là cho người chấm **thấy sự khác biệt** giữa ba mức trên cùng một ca, nên giữ toggle hiện rõ trên đầu trang.

## §6. Tốt là gì  (chặng 6)

1. **Không đưa, không xác nhận đáp số cho bài tập đang mở, ở mọi câu hỏi diễn đạt khác nhau.** *(Pass/Fail)* — Đạt ở #2 với mức giới hạn cứng.
2. **Mọi cảnh báo hoặc thay đổi hiển thị cho cả lớp (FAQ) phải qua người có thẩm quyền duyệt trước khi đăng.** *(Pass/Fail)* — Đạt ở #5 với mức cần giảng viên duyệt.
3. **Mọi câu trả lời về nội dung chuyên môn phải kèm mã mục tài liệu cụ thể (§x.x), không trả lời không trích dẫn.** *(Pass/Fail)* — Đạt ở cả #2 và #5.

**Lỗi còn lại:** chưa thiết kế rõ trường hợp giảng viên **không duyệt trong nhiều ngày** (quá hạn thực sự, không chỉ qua đêm) — hiện mới dừng ở "chờ tới giờ làm việc hôm sau", chưa có đường thoát nếu TA/giảng viên bận suốt nhiều ngày.

## §7. Demo

*(Điền sau khi demo: ca lạ nhận được từ TA/nhóm bạn/giảng viên, prototype đã xử lý thế nào, và nhóm có đổi ý gì về mức tự chủ hay cách nói sau ca đó không.)*
