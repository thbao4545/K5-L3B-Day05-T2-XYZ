/* StudyFlow: deterministic fixture engine. No AI inference, network or wall clock. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.StudyFlow = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const fixtures = {
    date: '13/11/2026', clock: '22:30', timezone: 'UTC+7',
    course: 'Nhập môn phân tích dữ liệu', session: 'Thống kê mô tả',
    assignment3: { status: 'open', deadline: '13/11/2026 · 23:59', data: [9, 10, 10, 11, 12, 12, 13, 45] },
    assignment2: { status: 'closed', deadline: '06/11/2026 · 23:59', published: '07/11/2026', answer: 6 },
    sections: {
      '3.1': { title: 'Trung bình cộng', text: 'Tổng các giá trị chia cho số giá trị. Trung bình bị kéo mạnh bởi giá trị ngoại lai.' },
      '3.2': { title: 'Trung vị', text: 'Giá trị đứng giữa khi sắp xếp dữ liệu tăng dần. Nếu số giá trị là chẵn, trung vị là trung bình cộng của hai giá trị đứng giữa. Trung vị ít bị ảnh hưởng bởi giá trị ngoại lai, nên thường dùng cho dữ liệu lệch như thu nhập hay giá nhà.' },
      '3.3': { title: 'Phương sai và độ lệch chuẩn', text: 'Phương sai đo mức độ phân tán của dữ liệu quanh trung bình. Độ lệch chuẩn là căn bậc hai của phương sai, có cùng đơn vị với dữ liệu. Vì là căn bậc hai, độ lệch chuẩn luôn nhỏ hơn phương sai.', warning: 'Câu cuối cần kiểm tra: “luôn nhỏ hơn” không đúng với mọi giá trị phương sai.' },
      '3.4': { title: 'Giá trị ngoại lai', text: 'Giá trị khác hẳn phần lớn dữ liệu. Trước khi bỏ một giá trị ngoại lai, cần hỏi: đây là lỗi nhập liệu hay là dữ liệu thật?' },
      '3.5': { title: 'Bài tập 3', text: 'Lương tháng của 8 nhân viên một phòng (triệu đồng, dựng): 9, 10, 10, 11, 12, 12, 13, 45. (a) Tính trung bình và trung vị. (b) Con số nào mô tả “lương điển hình” của phòng tốt hơn? Vì sao?' }
    },
    lessons: ['Buổi 1 · đã mở, chưa có nội dung trong fixture', 'Buổi 2 · đã mở, chưa có nội dung trong fixture', 'Thống kê mô tả', 'Trực quan hoá dữ liệu', 'Xác suất cơ bản', 'Phân phối chuẩn', 'Kiểm định giả thuyết và p-value', 'Hồi quy tuyến tính', 'Làm sạch dữ liệu', 'Dự án cuối khoá']
  };
  const scenarios = [
    { id: 'happy', short: 'Hiểu khái niệm', label: '01 · Hiểu khái niệm', question: 'Trung vị khác trung bình cộng như thế nào?' },
    { id: 'exercise', short: 'Xin xác nhận bài đang mở', label: '#2 · Bài đang mở', question: 'Bài 3 câu b đáp án là trung vị đúng không? Xác nhận giúp tôi.' },
    { id: 'source-error', short: 'Tài liệu học có kiến thức sai', label: '#5 · Tài liệu sai', question: 'Tài liệu §3.3 nói độ lệch chuẩn luôn nhỏ hơn phương sai, đúng không?' },
    { id: 'missing', short: 'Thiếu nguồn', label: '04 · Thiếu nguồn', question: 'Giải thích slide 12' },
    { id: 'correction', short: 'Sửa lại trợ lý', label: '05 · Sửa lại trợ lý', question: 'Bạn hiểu sai ý tôi.' }
  ];
  const normalize = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
  function response(state, label, title, body, sources = [], extra = {}) {
    return { state, label, title, body, sources, ...extra };
  }
  const hints = [
    'Bắt đầu bằng việc kiểm tra dữ liệu đã được sắp xếp tăng dần chưa và đếm số quan sát. Dừng ở bước chuẩn bị này trước khi tính.',
    'Để tự phân tích câu b, dùng §3.1 và §3.2 làm hai hướng so sánh. Hãy tự xem một giá trị khác hẳn phần lớn dữ liệu có thể tác động đến mỗi cách đo thế nào. Mình dừng ở phương pháp, không chọn thước đo hoặc viết kết luận thay bạn.'
  ];
  function resolveQuestion(question, context = {}) {
    // The bilingual UI shares one deterministic router and the same assessment guards.
    const q = normalize(question)
      .replace(/standard deviation/g, 'do lech chuan').replace(/variance/g, 'phuong sai')
      .replace(/assignments?|exercise/g, 'bai tap').replace(/median/g, 'trung vi')
      .replace(/\bmean\b|average/g, 'trung binh').replace(/outliers?/g, 'ngoai lai')
      .replace(/you misunderstood me|you got it wrong|wrong answer/g, 'ban hieu sai')
      .replace(/i want to ask/g, 'toi muon hoi').replace(/lesson\s*/g, 'buoi ')
      .replace(/which deviation/g, 'cai do lech').replace(/i am bad at math/g,'em dot toan')
      .replace(/deadline/g, 'han nop').replace(/salary|salaries/g, 'luong');
    // A correction can narrow or change scope. Explicit assessment references still stay protected.
    const changesScope = /hieu sai|sai y|ban sai|tra loi sai|toi muon hoi|doi cau hoi/.test(q);
    // Assessment protection takes priority over every other intent, including mixed requests.
    if (/bai\s*(tap\s*)?0?3\b|8\s*nhan vien|luong|11[.,]5|15[.,]25|\b45\b/.test(q) || (context.exercise && !changesScope)) {
      return response('bounded_hint', 'Gợi ý có giới hạn', 'Mình có thể giúp bạn bắt đầu.',
        'Bài 3 đang mở đến 13/11/2026 lúc 23:59. Mình không cung cấp hoặc xác nhận đáp số hay lựa chọn cho câu b, cũng không viết nhận xét hộ. ' + hints[Math.min(context.hintLevel || 1, 2) - 1], ['3.1', '3.2', '3.5'], { followup: 'Bạn đang vướng ở cách tính hay cách phân tích giá trị ngoại lai?', hintLevel: Math.min(context.hintLevel || 1, 2) });
    }
    if (/hieu sai|sai y|ban sai|tra loi sai/.test(q)) return response('correction', 'Bạn có thể sửa lại', 'Cảm ơn bạn đã chỉ ra.', 'Mình chưa nắm đúng ý bạn. Bạn muốn sửa câu hỏi hoặc nói rõ phần mình hiểu nhầm? Mình sẽ dùng câu hỏi đã sửa để chọn lại phần giải thích, thay vì lặp lại câu trả lời cũ.', [], { choices: ['Tôi muốn hỏi về giá trị ngoại lai', 'Tôi muốn so sánh trung vị và trung bình cộng'] });
    if (/slide|trang\s*12/.test(q)) return response('insufficient_evidence', 'Thiếu nguồn', 'Mình không tìm thấy “slide 12”.', 'Dữ liệu hiện có chỉ gồm các mục §3.1–§3.5 của buổi 3; tài liệu này không đánh số slide. Mình chưa có tệp hay nội dung slide bạn nhắc đến. Bạn muốn xem mục nào, hay sửa câu hỏi để chỉ rõ khái niệm?', [], { choices: ['Trung vị khác trung bình cộng như thế nào?', 'Dạy kỹ toàn bộ p-value của buổi 7.'] });
    if (/p[ -]?value|buoi\s*0?[4-9]|buoi\s*10/.test(q)) return response('insufficient_evidence', 'Chỉ có đề cương', 'Nội dung này chưa có trong tài liệu đã mở.', 'Mình chỉ có tài liệu buổi 3 và đề cương các buổi sau. Buổi 7 có chủ đề “Kiểm định giả thuyết và p-value”. Chưa có nội dung chi tiết để giảng tiếp; bạn có thể xem đề cương hoặc chuẩn bị câu hỏi cho TA.', [], { outline: true });
    if (/3[.,]3|phuong sai|do lech chuan/.test(q)) return response('needs_verification', 'Nội dung tài liệu cần xác minh', '“Luôn nhỏ hơn” chưa chính xác.', 'Theo định nghĩa ở §3.3, độ lệch chuẩn = √v. Phản ví dụ: phương sai 0,25 thì độ lệch chuẩn là 0,5 — lớn hơn về giá trị số. Khi 0 < v < 1, √v > v. Hơn nữa, phương sai có đơn vị bình phương, còn độ lệch chuẩn cùng đơn vị dữ liệu; không nên so sánh hai đại lượng khác đơn vị như một quy tắc chung. Phản ví dụ này bác bỏ phát biểu “luôn nhỏ hơn”; bạn có thể tự kiểm tra bằng phép căn bậc hai.', ['3.3'], { warning: true, causeUncertainty: 'Chưa xác định được nguyên nhân tài liệu viết sai: lỗi đánh máy, biên soạn hay thiếu ngữ cảnh. Cần TA hoặc giảng viên kiểm tra nguyên nhân; điều này không làm phản ví dụ toán học kém đáng tin.', counterexample: {variance:0.25, standardDeviation:0.5}, followup:'Mình có thể giúp bạn soạn yêu cầu TA kiểm tra câu này. Bạn muốn làm rõ phần căn bậc hai hay phần đơn vị?' });
    if (/cai do lech|do lech ay|khong hieu/.test(q)) return response('clarification_required', 'Cần làm rõ', 'Bạn đang nói đến “độ lệch” nào?', 'Trong tài liệu hiện có, §3.3 nói về phương sai và độ lệch chuẩn, còn §3.4 nói về giá trị ngoại lai. Mình cần bạn chọn ý muốn hỏi để tránh giải thích nhầm.', [], { choices: ['Độ lệch chuẩn trong §3.3', 'Giá trị ngoại lai trong §3.4'] });
    if (/ngoai lai/.test(q)) return response('normal', 'Có căn cứ tài liệu', 'Mình hiểu lại: bạn hỏi về giá trị ngoại lai.', 'Theo §3.4, đó là một giá trị khác hẳn phần lớn dữ liệu. Trước khi loại nó, cần kiểm tra đây là lỗi nhập liệu hay dữ liệu thật. Mình đã chuyển sang đúng mục bạn vừa làm rõ.', ['3.4'], { followup: 'Bạn sẽ kiểm tra nguồn dữ liệu thế nào trước khi bỏ một giá trị?' });
    if (/bai\s*(tap\s*)?2\b/.test(q)) return response('normal', 'Đáp án đã công bố', 'Bài 2 đã hết hạn và có đáp án.', 'Trang khoá học ghi: hạn 06/11/2026 lúc 23:59, đáp án công bố ngày 07/11. Trung bình cộng của 4, 8, 6, 5, 7 là 6: tổng bằng 30, chia cho 5 giá trị. Quy tắc tính dựa trên §3.1.', ['3.1'], { courseSource: true });
    if (/han nop|deadline|gio ta/.test(q)) return response('normal', 'Nguồn: trang khoá học', 'Mốc thời gian của lớp.', 'Bài 3 đang mở, hạn 13/11/2026 lúc 23:59. TA trực 08:00–22:00. Demo đang dùng thời điểm cố định 13/11/2026; giờ demo không thay đổi hạn bài và không tự gia hạn.', [], { courseSource: true });
    if (/trung vi|trung binh/.test(q)) return response('normal', 'Có căn cứ tài liệu', 'Cùng một dữ liệu, hai cách nhìn.', 'Trung bình cộng dùng tổng các giá trị chia cho số giá trị (§3.1). Trung vị là giá trị ở giữa sau khi sắp xếp; nếu có số lượng chẵn thì lấy trung bình của hai giá trị giữa (§3.2). Một giá trị rất lớn có thể kéo trung bình lên mạnh, còn trung vị ít bị ảnh hưởng hơn.', ['3.1', '3.2'], { comparison: true, followup: 'Nếu một giá trị tăng lên rất nhiều, thước đo nào sẽ thay đổi rõ hơn? Vì sao?' });
    if (/dang.*faq|faq/.test(q)) return response('insufficient_evidence', 'Cần TA hoặc giảng viên', 'AI không có quyền đăng FAQ.', 'Chỉ TA hoặc giảng viên được duyệt và đăng nội dung cho cả lớp. Bạn có thể soạn câu hỏi để nhờ TA xem xét; demo không đăng nội dung lên bất kỳ nơi nào.');
    if (/ngu|kem|dot/.test(q)) return response('clarification_required', 'Học từng bước', 'Mình cùng xem phần bạn đang vướng.', 'Bạn đang mắc ở khái niệm hay một bước làm bài? Mình có thể tra §3.1–§3.5 và gợi ý trong phạm vi cho phép. Một chỗ chưa hiểu không nói lên năng lực của bạn.', [], { choices: ['Cái độ lệch ấy là gì?', 'Trung vị khác trung bình cộng như thế nào?'] });
    return response('insufficient_evidence', 'Ngoài bộ câu hỏi mô phỏng', 'Mình chưa có đủ căn cứ cho câu hỏi này.', 'Đây là prototype dùng từ khoá và câu trả lời soạn sẵn, không phải AI hiểu mọi câu hỏi. Mình chỉ có fixture buổi 3, lịch bài tập và đề cương. Hãy sửa câu hỏi, chọn một ca demo, hoặc chuẩn bị yêu cầu TA.', [], { choices: ['Cái độ lệch ấy là gì?', 'Trung vị khác trung bình cộng như thế nào?'] });
  }
  function taAvailability(clock) {
    const onDuty = clock === '21:10';
    return { onDuty, label: onDuty ? 'Trong giờ TA · 08:00–22:00' : 'TA đã hết ca · trở lại 08:00', detail: onDuty ? 'Mốc demo 13/11 · 21:10 nằm trong giờ trực. Không có TA thật hoặc cam kết thời gian trả lời trong prototype.' : 'TA trở lại 14/11 lúc 08:00, sau hạn bài 3 (13/11 · 23:59). Không đảm bảo được hỗ trợ trước hạn và không tự gia hạn bài.' };
  }
  function initialState() {
    return { phase: 'idle', clock: fixtures.clock, question: '', response: null, hintLevel: 1, draft: null, requests: [], nextId: 1 };
  }
  function transition(state, event) {
    switch (event.type) {
      case 'ASK': {
        const question = String(event.question || '').trim().slice(0, 1200);
        if (!question) return state;
        const result = resolveQuestion(question, event.context);
        return { ...state, phase: result.state, question, response: result, hintLevel: 1, draft: null };
      }
      case 'NEXT_HINT':
        if (state.phase !== 'bounded_hint') return state;
        return { ...state, hintLevel: 2, response: resolveQuestion(state.question, { exercise: true, hintLevel: 2 }) };
      case 'DRAFT_TA': {
        if (!state.question) return state;
        const raw = state.response?.warning ? 'Nhờ TA xác minh §3.3: tài liệu ghi “Vì là căn bậc hai, độ lệch chuẩn luôn nhỏ hơn phương sai.” Phản ví dụ: phương sai 0,25 → độ lệch chuẩn 0,5; phương sai có đơn vị bình phương, độ lệch chuẩn cùng đơn vị dữ liệu. Xin kiểm tra phát biểu và giải thích cho học viên. Câu hỏi gốc: ' + state.question : state.question;
        const question = raw.length > 1200 ? raw.slice(0, 1150) + '\n… (Đã rút gọn trước khi xác nhận.)' : raw;
        return { ...state, draft: { question, sources: state.response?.sources || [], evidence: state.response?.label || '', clock: state.clock } };
      }
      case 'EDIT_DRAFT':
        return state.draft ? { ...state, draft: { ...state.draft, question: String(event.question || '').slice(0, 1200) } } : state;
      case 'CANCEL_TA': return { ...state, draft: null };
      case 'CONFIRM_TA': {
        if (!state.draft || !event.consent || !state.draft.question.trim() || state.requests.filter(r => r.status === 'waiting').length >= 5) return state;
        const request = { ...state.draft, id: 'MOCK-' + String(state.nextId).padStart(3, '0'), status: 'waiting', simulated: true };
        return { ...state, draft: null, requests: [...state.requests, request], nextId: state.nextId + 1 };
      }
      case 'WITHDRAW_TA': return { ...state, requests: state.requests.map(r => r.id === event.id ? { ...r, status: 'withdrawn' } : r) };
      case 'CLOCK': return { ...state, clock: event.clock === '21:10' ? '21:10' : '22:30' };
      case 'RESET': return { ...initialState(), clock: state.clock, requests: state.requests, nextId: state.nextId };
      default: return state;
    }
  }
  return { fixtures, scenarios, initialState, transition, resolveQuestion, taAvailability };
}));
