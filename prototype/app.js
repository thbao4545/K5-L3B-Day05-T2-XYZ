/* UI adapter: local fixture state only. All user strings are escaped before rendering. */
(() => {
  'use strict';
  const E = window.StudyFlow, A = window.StudyFlowAutonomy;
  const $ = id => document.getElementById(id);
  const icon = name => `<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let state = E.initialState(), messages = [], undoStack = [], activeScenario = '', editing = false;
  let pendingHint=null, taActionId=null; const taActions=new Map();
  let timer, generation = 0, busy = false, toastTimer, lastTrigger, storageAvailable = true;
  const STORAGE_KEY = 'studyflow-ta-fixture-v1';
  function retainRequests(requests) {
    const waiting = requests.filter(r=>r.status==='waiting');
    const withdrawn = requests.filter(r=>r.status==='withdrawn');
    const keep = new Set([...waiting,...withdrawn.slice(Math.max(0,withdrawn.length-Math.max(0,20-waiting.length)))]);
    return requests.filter(r=>keep.has(r));
  }
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (Array.isArray(saved)) {
      state.requests = retainRequests(saved.filter(r => r && /^MOCK-\d+$/.test(r.id) && Number.isSafeInteger(Number(r.id.slice(5))) && r.simulated === true && ['waiting','withdrawn'].includes(r.status) && typeof r.question === 'string' && r.question.length <= 1200 && ['21:10','22:30','23:10'].includes(r.clock) && Array.isArray(r.sources) && r.sources.every(s => E.fixtures.sections[s]) && typeof r.evidence === 'string'));
      state.nextId = Math.max(0, ...state.requests.map(r => Number(r.id.slice(5)))) + 1;
    }
  } catch { storageAvailable = false; }
  function persist() {
    state.requests = retainRequests(state.requests);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.requests)); }
    catch { storageAvailable = false; toast('Trình duyệt không cho lưu: hàng chờ chỉ giữ trong lần mở trang này.'); }
  }
  function dispatch(event) { state = E.transition(state, event); }
  function toast(text) {
    clearTimeout(toastTimer); $('toast').textContent = text; $('toast').hidden = false;
    toastTimer = setTimeout(() => { $('toast').hidden = true; }, 5500);
  }
  function cancelPending() {
    generation++; clearTimeout(timer); busy = false;
    if(pendingHint){const id=pendingHint.id;pendingHint=null;A.change({type:'CANCEL',id});}
    for(const action of A.state.actions.filter(a=>['allowed','awaiting_approval'].includes(a.status)))A.change({type:'CANCEL',id:action.id});
    $('conversation').removeAttribute('aria-busy'); updateComposer();
  }
  function updateComposer() {
    const length = $('question').value.length;
    $('send-button').disabled = !length || !$('question').value.trim() || busy;
    $('char-count').textContent = `${length} / 1200`;
    $('edit-banner').hidden = !editing;
  }
  function marker(number) { return `<span class="marker" data-mark="${number}" aria-hidden="true">${["","①","②","③","④","⑤","⑥","⑦"][number] || number}</span>`; }
  function citations(r) {
    if (!r.sources.length && !r.courseSource) return '';
    return `<div class="source-row"><span>CĂN CỨ</span>${r.sources.map(id => `<button class="citation" data-action="source" data-source="${id}">${icon('book')}§${id} · ${esc(E.fixtures.sections[id].title)}</button>`).join('')}${r.courseSource ? '<button class="citation" data-action="course-source">Trang khoá học</button>' : ''}${marker(2)}</div>`;
  }
  function comparison() {
    return `<div class="comparison"><div class="comparison-item"><b>Trung bình cộng</b><div class="mini-chart" aria-hidden="true">${'<i></i>'.repeat(6)}</div><span>Nhạy với giá trị ngoại lai</span></div><div class="comparison-item"><b>Trung vị</b><div class="mini-chart median-chart" aria-hidden="true">${'<i></i>'.repeat(6)}</div><span>Tập trung vào vị trí ở giữa</span></div></div>`;
  }
  function sourceErrorDetail() {
    return `<blockquote class="problem-quote">${marker(2)}<span>NGUYÊN VĂN §3.3</span><q data-fixture-source>Vì là căn bậc hai, độ lệch chuẩn luôn nhỏ hơn phương sai.</q></blockquote><div class="counterexample"><div><small>PHƯƠNG SAI</small><strong>0,25</strong><span>đơn vị²</span></div><span class="math-arrow">√ →</span><div><small>ĐỘ LỆCH CHUẨN</small><strong>0,5</strong><span>đơn vị dữ liệu</span></div></div>`;
  }
  function assistant(r, isLatest, reported) {
    const warning = r.state === 'needs_verification';
    const missing = ['insufficient_evidence','clarification_required'].includes(r.state);
    return `<article class="message assistant-message">
      <div class="message-meta"><span class="mini-avatar">${icon('spark')}</span><strong>StudyFlow AI</strong><span>· Phản hồi mô phỏng</span></div>
      <div class="assistant-card">
        ${reported ? '<p class="correction-note">Bạn đã đánh dấu phản hồi cần sửa · ghi nhận cục bộ, chưa báo TA.</p>' : ''}
        <div class="evidence-label ${warning?'warning':missing?'missing':''}">${icon(warning?'alert':missing?'book':'shield')}${esc(r.label)}</div>
        <h2>${esc(r.title)}</h2>
        ${warning?sourceErrorDetail():''}
        <p class="answer-body">${esc(r.body)}</p>
        ${r.state==='bounded_hint'?`<div class="cause-uncertainty">${marker(1)}${esc(window.StudyFlowLocale.t('Mình chưa biết bạn đang vướng ở bước nào; hãy nói rõ phần cần hiểu, không cần đưa đáp án.'))}</div><div class="warning-callout">${marker(3)}${esc(window.StudyFlowLocale.t('Bài đang mở: chỉ gợi ý phương pháp. Xác nhận đáp số bị chặn, kể cả sau khi TA duyệt.'))}</div>`:''}
        ${warning?`<div class="cause-uncertainty"><strong>G2 · Biết kết luận, chưa biết nguyên nhân.</strong>${esc(r.causeUncertainty)}${marker(1)}</div><div class="warning-callout">Câu “độ lệch chuẩn luôn nhỏ hơn phương sai” ở §3.3 cần được xem lại vì phản ví dụ trên bác bỏ tính “luôn”. Tài liệu có nguồn vẫn có thể chứa lỗi.${marker(3)}</div>`:''}
        ${r.comparison?comparison():''}${citations(r)}
        ${r.followup?`<div class="followup"><small>ĐẾN LƯỢT BẠN SUY NGHĨ</small>${esc(r.followup)}</div>`:''}
        ${missing?marker(7):''}
        ${isLatest?`<div class="message-actions">
          ${r.state==='bounded_hint'?`<button class="action-primary" data-action="hint" ${state.hintLevel>=2||A.policy('goi_y_bai_tap')==='FORBIDDEN'||pendingHint?'disabled':''}>${icon('spark')}Gợi ý bước tiếp theo</button>`:''}
          ${(r.choices||[]).map((text,i)=>`<button data-action="choice" data-choice="${i}">${esc(text)}${icon('arrow')}</button>`).join('')}
          ${r.outline?'<button data-action="outline">Xem đề cương</button>':''}
          <button class="${warning?'action-primary':''}" data-action="ta">${icon('chat')}Nhờ TA xác minh</button>${marker(5)}
        </div>
        ${r.state==='bounded_hint'?`<p class="hint-limit">Mức gợi ý ${state.hintLevel}/2 · Chỉ chuẩn bị và định hướng. Không giải trọn bài.${state.hintLevel>=2?' Đã đến giới hạn; hãy tự thực hiện hoặc hỏi TA.':''}</p>`:''}
        <div class="feedback"><button data-action="edit">${icon('edit')}Sửa câu hỏi</button><button data-action="report">${icon('alert')}Báo câu trả lời sai</button><button data-action="undo">${icon('undo')}Rút lượt hỏi</button>${marker(6)}</div>`:''}
      </div></article>`;
  }
  function welcome() {
    return `<div class="welcome"><h2>Chọn một ca để bắt đầu học.</h2><p>Chạy ca #5 hoặc #2 ở phía trên, rồi thử thay đổi quyền AI để so sánh phản hồi và cách xử lý.</p></div>`;
  }
  function renderConversation() {
    const container = $('conversation');
    container.innerHTML = messages.length ? messages.map((m,i) => m.kind==='user' ? `<article class="message user-message"><div class="message-meta">Bạn · ${state.clock}</div><p class="user-bubble" data-user-content>${esc(m.text)}</p></article>` : assistant(m.response, i===messages.length-1 && !busy, m.reported)).join('') : welcome();
    if (busy) container.insertAdjacentHTML('beforeend', `<div class="loading-card" role="status"><div class="loading-header">${icon('spark')}Đang đối chiếu fixture buổi 3… <button class="text-button" data-action="stop">Huỷ</button></div><div class="loading-line"></div><div class="loading-line"></div><div class="loading-line"></div></div>`);
  }
  function setView(queue) {
    $('study-view').hidden = queue; $('queue-view').hidden = !queue;
    $('study-tab').classList.toggle('active', !queue); $('queue-tab').classList.toggle('active', queue);
    $('study-tab').setAttribute('aria-pressed', String(!queue)); $('queue-tab').setAttribute('aria-pressed', String(queue));
    if (queue) renderQueue();
  }
  function renderMeta() {
    const count = state.requests.filter(r=>r.status==='waiting').length;
    $('queue-count').textContent = count; $('tab-count').textContent = count;
    const ta = E.taAvailability(state.clock);
    $('ta-status').textContent = ta.onDuty ? 'Trong giờ hỗ trợ · mô phỏng' : 'Đã hết giờ trực';
    $('ta-dot').style.background = ta.onDuty ? '#6c9565' : '#b3b9ac';
    $('ta-next').textContent = ta.onDuty ? 'Không có TA thật trong prototype' : 'Trở lại 14/11 lúc 08:00 · sau hạn bài 3';
    $('demo-time').value = state.clock;
    document.querySelectorAll('.scenario-button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.scenario===activeScenario)));
    renderQueue();
  }
  function renderQueue() {
    const ta = E.taAvailability(state.clock);
    $('queue-ta-label').textContent = ta.label; $('queue-ta-detail').textContent = ta.detail;
    $('queue-list').innerHTML = state.requests.length ? [...state.requests].reverse().map(r => `<article class="request-card ${r.status==='withdrawn'?'withdrawn':''}"><div class="request-top"><span>${esc(r.id)} · ${esc(r.clock)} · 13/11/2026</span><span class="status-pill">${r.status==='waiting'?'Chờ · mô phỏng':'Đã rút · mô phỏng'}</span></div><h3 data-user-content>${esc(r.question)}</h3><p>Căn cứ: ${r.sources.length?r.sources.map(s=>'§'+esc(s)).join(', '):'chưa có mục nguồn'} · ${esc(r.evidence)}</p><p>Trong sản phẩm thật: TA xem câu hỏi, mục nguồn, nhãn bằng chứng và thời điểm bạn xác nhận. Không chia sẻ toàn bộ hội thoại.</p><p>${esc(E.taAvailability(r.clock).detail)}</p><p><strong>Chỉ lưu cục bộ${storageAvailable?' trong trình duyệt':' trong lần mở này'}. Chưa gửi đến TA hoặc server.</strong></p>${r.status==='waiting'?`<button class="secondary-button" data-action="withdraw" data-id="${esc(r.id)}">Rút yêu cầu mô phỏng</button>`:''}</article>`).join('') : `<div class="queue-empty">${icon('chat')}<h3>Chưa có yêu cầu mô phỏng</h3><p>Chỉ khi bạn xem lại và xác nhận, câu hỏi mới xuất hiện ở đây.</p><button class="primary-button" data-action="study">Quay lại học${icon('arrow')}</button></div>`;
  }
  function ask(question, options={}) {
    const text = String(question).trim();
    if (!text) { $('form-error').hidden=false; $('form-error').textContent='Viết một câu hỏi hoặc chọn tình huống demo.'; return; }
    cancelPending();
    if (options.reset) { messages=[]; undoStack=[]; dispatch({type:'RESET'}); }
    undoStack.push({state:{...state}, messages:messages.slice(),autonomy:{scenario:A.state.scenario,variant:A.state.variant}});
    const context = !options.reset && !editing && state.phase==='bounded_hint' ? {exercise:true} : undefined;
    messages.push({kind:'user',text:text.slice(0,1200)});
    $('question').value=''; editing=false; $('form-error').hidden=true;
    setView(false); busy=true; updateComposer(); renderConversation();
    $('conversation').setAttribute('aria-busy','true');
    const current = ++generation;
    timer = setTimeout(() => {
      if (current!==generation) return;
      dispatch({type:'ASK',question:text,context});
      const scenario=state.phase==='bounded_hint'?'exercise':'source-error';
      if(A.state.scenario!==scenario)A.context(scenario);
      A.request('tra_cuu_tai_lieu','read',{sourceAvailable:state.response.sources.length>0||!!state.response.courseSource});
      if(state.phase==='bounded_hint'){
        if(/đáp|đúng|xác nhận|answer|confirm|right/i.test(text))A.request('goi_y_bai_tap','confirm_answer');
        const action=A.request('goi_y_bai_tap','hint',{level:1});
        if(action.status==='awaiting_approval'){
          pendingHint={id:action.id,level:1,response:state.response};
          state={...state,response:{...state.response,label:'APPROVAL_REQUIRED',body:window.StudyFlowLocale.language==='en'?'Safe guidance is waiting for simulated TA approval. No answer confirmation is allowed. Open Autonomy / Tool Activity to review, approve, reject or cancel.':'Gợi ý phù hợp đang chờ TA duyệt trong mô phỏng. Không cho phép xác nhận đáp án. Mở Autonomy / Tool Activity để xem, duyệt, từ chối hoặc huỷ.'}};A.open();
        }else if(action.status==='denied')state={...state,response:{...state.response,label:'FORBIDDEN',body:window.StudyFlowLocale.language==='en'?'This rejected option is blocked. AI cannot solve or confirm an open assignment. Approval never overrides this rule.':'Phương án bị loại đã bị chặn. AI không được giải hộ hoặc xác nhận bài đang mở. Phê duyệt không vô hiệu hoá quy tắc này.'}};
      }
      messages.push({kind:'assistant', response:state.response});
      busy=false; $('conversation').removeAttribute('aria-busy'); renderConversation();renderMeta();updateComposer();
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 120 : 650);
  }
  function runScenario(index) {
    activeScenario=E.scenarios[index].id; A.context(activeScenario); ask(window.StudyFlowLocale.t(E.scenarios[index].question),{reset:true}); renderMeta();
  }
  function openInfo(title, body, eyebrow='NGỮ CẢNH HỌC TẬP') {
    lastTrigger=document.activeElement;
    $('dialog-eyebrow').textContent=eyebrow;
    $('dialog-content').innerHTML=`<h2 id="dialog-title">${esc(title)}</h2>${body}`;
    $('info-dialog').showModal();
  }
  function showSources(ids=Object.keys(E.fixtures.sections)) {
    const access=A.request('tra_cuu_tai_lieu','read',{sourceAvailable:ids.every(id=>!!E.fixtures.sections[id])});if(access.status!=='executed')return;
    openInfo(ids.length===1?'Nguồn trích dẫn · §'+ids[0]:'Tài liệu buổi 3',`<p class="dialog-intro">Fixture T2 · Thống kê mô tả. Tài liệu chỉ có mục §3.1–§3.5, không có slide đánh số.</p>${ids.map(id=>{const s=E.fixtures.sections[id];return `<section class="source-section"><h3>§${id} · ${esc(s.title)}</h3><p data-fixture-source>${esc(s.text)}</p>${s.warning?`<div class="warning-callout">${esc(s.warning)} Nên nhờ TA hoặc giảng viên kiểm tra; chưa có xác minh trong demo.</div>`:''}</section>`}).join('')}<p class="source-origin">Nguồn: tracks/t2-education.md · Dữ liệu dựng của đề bài AI20K.</p>`,'ĐỐI CHIẾU NGUỒN · G11');
  }
  function showPolicy() {
    openInfo('Chính sách nhóm · §4', `<p class="dialog-intro">Chính sách nhóm tại §4. Các phương án so sánh không thay đổi khuyến nghị mặc định. Đáp số bài đang mở bị chặn ở mọi mức, kể cả sau phê duyệt. Mọi thao tác đều mô phỏng.</p><table class="policy-table"><thead><tr><th>Tool mô phỏng</th><th>Ai quyết định · giới hạn</th></tr></thead><tbody><tr><td><code>tra_cuu_tai_lieu</code></td><td><strong>AI tự làm · chỉ đọc</strong><p>Học viên xem nguồn và rút lượt hỏi. Nguồn vẫn có thể sai.</p></td></tr><tr><td><code>goi_y_bai_tap</code></td><td><strong>AI tự làm trong giới hạn</strong><p>Tối đa hai mức định hướng; không đáp số, xác nhận hoặc nhận xét hộ bài đang mở. Gợi ý đã xem không thể “chưa đọc”, nên giới hạn nằm trong logic.</p></td></tr><tr><td><code>chuyen_TA</code></td><td><strong>AI tự chuyển khi học viên nhờ hỗ trợ</strong><p>Bạn xem và sửa nội dung trước khi chủ động tạo yêu cầu. Sau đó công cụ tự thêm vào hàng chờ mô phỏng, không chờ TA phê duyệt việc chuyển. Có thể hủy bản nháp hoặc rút yêu cầu.</p></td></tr><tr><td><code>dang_FAQ</code></td><td><strong>Cần TA / giảng viên phê duyệt</strong><p>Chỉ TA hoặc giảng viên được phê duyệt và công bố. Panel Autonomy mô phỏng bước duyệt; không có công bố thật.</p></td></tr></tbody></table><div class="queue-notice">${icon('clock')}<p>${esc(E.taAvailability(state.clock).detail)} Nếu không ai duyệt, giữ trạng thái chờ; AI không tự nâng quyền.</p></div><p class="source-origin">Queue TA lưu cục bộ trong trình duyệt; FAQ và nhật ký giữ trong lần mở trang. Không có TA, FAQ hay server thật.</p>`,'CHÍNH SÁCH TỰ CHỦ · MÔ PHỎNG');
  }
  function showOutline() {
    openInfo('Đề cương các buổi tiếp theo',`<p class="dialog-intro">Buổi 1–3 đã mở. Demo chỉ có nội dung buổi 3; các buổi sau chỉ có tên trong đề cương.</p>${E.fixtures.lessons.slice(3).map((name,i)=>`<div class="outline-item"><span>BUỔI ${i+4}</span>${esc(name)}</div>`).join('')}<p class="source-origin">Không có nội dung chi tiết các buổi 4–10 trong fixture.</p>`);
  }
  function showCourseSource() {
    openInfo('Trang khoá học · fixture',`<div class="source-section"><h3>Bài tập 2 · Đã hết hạn</h3><p>Hạn 06/11/2026 lúc 23:59. Đáp án công bố 07/11: “Trung bình cộng của 4, 8, 6, 5, 7 là 6.”</p></div><div class="source-section"><h3>Bài tập 3 · Đang mở</h3><p>Hạn 13/11/2026 lúc 23:59. Trạng thái cố định theo fixture; không lấy đồng hồ máy để đổi hạn.</p></div><div class="source-section"><h3>Giờ TA · 08:00–22:00</h3><p>${esc(E.taAvailability(state.clock).detail)}</p></div><p class="source-origin">Buổi đã mở: 1, 2, 3. Công cụ bài tập: bảng tính. Nguồn: dữ liệu B của tracks/t2-education.md.</p>`);
  }
  function draftTA() {
    if (!state.question) {toast('Hãy hỏi một câu trước khi tạo bản nháp hỗ trợ.');return;}
    if (state.requests.filter(r=>r.status==='waiting').length>=5) {toast('Đã có 5 yêu cầu mô phỏng đang chờ. Bạn có thể rút một yêu cầu trong hàng chờ.');return;}
    dispatch({type:'DRAFT_TA'}); taActionId=null; lastTrigger=document.activeElement;
    // Translate generated context only. The learner's original wording stays verbatim.
    const draftText=state.draft.question, separator='Câu hỏi gốc: ';
    const boundary=state.response?.warning ? draftText.indexOf(separator) : -1;
    $('ta-question').value=boundary<0 ? draftText : window.StudyFlowLocale.t(draftText.slice(0,boundary+separator.length))+draftText.slice(boundary+separator.length);
    $('ta-consent').checked=false; $('confirm-ta').disabled=true; $('ta-error').hidden=true;
    $('draft-context').innerHTML=`<p><strong>Dữ liệu kèm theo:</strong> ${state.draft.sources.map(s=>'§'+esc(s)).join(', ')||'chưa có mục nguồn'} · ${esc(state.draft.evidence)}</p><p><strong>Thời điểm:</strong> 13/11/2026 · ${esc(state.clock)} · UTC+7.</p><p><strong>Người xem trong mô phỏng:</strong> TA của lớp. Không kèm toàn bộ hội thoại. Chưa có TA nào nhận.</p>`;
    $('ta-dialog-hours').textContent=E.taAvailability(state.clock).detail;
    $('ta-dialog').showModal();
  }
  function closeTA() {if(taActionId)A.change({type:'CANCEL',id:taActionId});taActionId=null;dispatch({type:'CANCEL_TA'});$('ta-dialog').close();if(lastTrigger?.isConnected)lastTrigger.focus();toast('Đã huỷ bản nháp. Không tạo yêu cầu TA.');}
  function editQuestion(report=false) {
    if (!state.question) return;
    if(report) {
      const last=messages.filter(m=>m.kind==='assistant').at(-1);if(last)last.reported=true;
      renderConversation();toast('Đã đánh dấu cục bộ. Sửa câu hỏi để trợ lý phản hồi lại; chưa báo TA.');
    }
    editing=true;$('question').value=state.question;updateComposer();$('question').focus();$('question').select();$('question').scrollIntoView({block:'center',behavior:'smooth'});
  }
  function closeMenu() {
    const sidebar=$('sidebar'), mobile=window.innerWidth<=760, trigger=document.querySelector('[data-action="menu"]');
    sidebar.classList.remove('open');$('menu-scrim').hidden=true;document.querySelector('.workspace').inert=false;
    if(mobile && sidebar.contains(document.activeElement)) trigger.focus();
    sidebar.inert=mobile;sidebar.setAttribute('aria-hidden',String(mobile));trigger.setAttribute('aria-expanded','false');
  }
  document.addEventListener('click',event=>{
    const b=event.target.closest('[data-action]');if(!b||b.disabled)return;
    switch(b.dataset.action) {
      case 'sample': runScenario(Number(b.dataset.sample));break;
      case 'scenario': runScenario(Number(b.dataset.index));break;
      case 'choice': {const choice=state.response?.choices?.[Number(b.dataset.choice)];if(choice)ask(window.StudyFlowLocale.t(choice));break;}
      case 'source': if(E.fixtures.sections[b.dataset.source])showSources([b.dataset.source]);break;
      case 'sources': closeMenu();showSources();break;
      case 'course-source': showCourseSource();break;
      case 'outline': closeMenu();showOutline();break;
      case 'policy': closeMenu();showPolicy();break;
      case 'exercise': runScenario(1);break;
      case 'study': closeMenu();setView(false);break;
      case 'queue': closeMenu();setView(true);break;
      case 'hint': {
        const action=A.request('goi_y_bai_tap','hint',{level:2});
        if(action.status==='executed'){dispatch({type:'NEXT_HINT'});if(messages.at(-1)?.kind==='assistant')messages.at(-1).response=state.response;renderConversation();toast('Mức 2/2 · Vẫn giữ giới hạn bài đang mở.');}
        else if(action.status==='awaiting_approval'){pendingHint={id:action.id,level:2};A.open();renderConversation();}
        break;
      }
      case 'edit': editQuestion();break;
      case 'report': editQuestion(true);break;
      case 'cancel-edit': editing=false;$('question').value='';updateComposer();break;
      case 'undo': {cancelPending();const last=undoStack.pop();if(last){const requests=state.requests,nextId=state.nextId;state={...last.state,requests,nextId,clock:state.clock};messages=last.messages;A.context(last.autonomy.scenario,last.autonomy.variant);activeScenario='';renderConversation();renderMeta();toast('Đã rút lượt hỏi khỏi hội thoại. Hàng chờ TA không thay đổi.');}break;}
      case 'stop': cancelPending();if(messages.at(-1)?.kind==='user')messages.pop();undoStack.pop();renderConversation();toast('Đã huỷ phản hồi mô phỏng.');break;
      case 'ta': draftTA();break;
      case 'cancel-ta': closeTA();break;
      case 'withdraw': if(taActions.has(b.dataset.id))A.change({type:'UNDO',id:taActions.get(b.dataset.id)});dispatch({type:'WITHDRAW_TA',id:b.dataset.id});persist();renderMeta();toast('Đã rút yêu cầu khỏi hàng chờ mô phỏng.');break;
      case 'close-dialog': $('info-dialog').close();break;
      case 'annotations': {const on=document.body.classList.toggle('show-annotations');b.setAttribute('aria-pressed',String(on));$('annotation-legend').hidden=!on;$('annotation-legend').open=on;break;}
      case 'reset': cancelPending();dispatch({type:'RESET'});messages=[];undoStack=[];activeScenario='';editing=false;$('question').value='';renderConversation();renderMeta();updateComposer();setView(false);toast('Hội thoại mới đã sẵn sàng. Hàng chờ mô phỏng được giữ lại.');break;
      case 'menu': lastTrigger=b;$('sidebar').inert=false;$('sidebar').setAttribute('aria-hidden','false');$('sidebar').classList.add('open');$('menu-scrim').hidden=false;document.querySelector('.workspace').inert=true;b.setAttribute('aria-expanded','true');$('sidebar').querySelector('a').focus();break;
      case 'close-menu': closeMenu();document.querySelector('[data-action="menu"]').focus();break;
    }
  });
  $('question-form').addEventListener('submit',e=>{e.preventDefault();if(!busy)ask($('question').value);});
  $('question').addEventListener('input',updateComposer);
  $('question').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();if(!busy&&$('question').value.trim())$('question-form').requestSubmit();}});
  $('ta-consent').addEventListener('change',()=>{$('confirm-ta').disabled=!$('ta-consent').checked||!$('ta-question').value.trim();});
  $('ta-question').addEventListener('input',()=>{$('confirm-ta').disabled=!$('ta-consent').checked||!$('ta-question').value.trim();});
  $('ta-form').addEventListener('submit',e=>{
    e.preventDefault();dispatch({type:'EDIT_DRAFT',question:$('ta-question').value});const before=state.requests.length;
    if(!$('ta-consent').checked||!state.draft?.question.trim()){return;}
    const approved=A.request('chuyen_TA','queue',{text:state.draft.question});taActionId=approved.id;
    if(approved?.status!=='executed'){return;}
    dispatch({type:'CONFIRM_TA',consent:$('ta-consent').checked});
    if(state.requests.length===before){$('ta-error').hidden=false;$('ta-error').textContent='Kiểm tra câu hỏi và ô xác nhận trước khi tạo mô phỏng.';return;}
    taActions.set(state.requests.at(-1).id,taActionId);taActionId=null;persist();$('ta-dialog').close();renderMeta();setView(true);toast('Đã thêm vào hàng chờ mô phỏng. Chưa gửi TA thật.');$('queue-tab').focus();
  });
  $('ta-dialog').addEventListener('cancel',e=>{e.preventDefault();closeTA();});
  $('info-dialog').addEventListener('close',()=>{if(lastTrigger?.isConnected)lastTrigger.focus();});
  $('demo-time').addEventListener('change',e=>{dispatch({type:'CLOCK',clock:e.target.value});renderMeta();toast(`Đã đổi mốc giả lập sang ${state.clock}. Bài 3 vẫn đang mở.`);});
  $('menu-scrim').addEventListener('click',closeMenu);
  document.addEventListener('keydown',e=>{
    if(!$('sidebar').classList.contains('open'))return;
    if(e.key==='Escape'){closeMenu();document.querySelector('[data-action="menu"]').focus();}
    if(e.key==='Tab'){const controls=[...$('sidebar').querySelectorAll('a,button:not(:disabled)')].filter(c=>c.offsetParent!==null);const first=controls[0],last=controls.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
  });
  window.addEventListener('resize',()=>{if(!$('sidebar').classList.contains('open')||window.innerWidth>760)closeMenu();});
  $('scenario-list').innerHTML=[2,1].map(i=>{const s=E.scenarios[i];return `<button class="scenario-button primary-scenario" data-action="scenario" data-index="${i}" data-scenario="${s.id}" aria-pressed="false"><span class="scenario-num">${i===2?'#5':'#2'}</span><span>${esc(s.short)}<small>${i===2?'CA CHÍNH · KIỂM CHỨNG NGUỒN':'CA PHỤ · GIỮ GIỚI HẠN GỢI Ý'}</small></span>${icon('arrow')}</button>`}).join('');
  $('extra-scenarios').innerHTML=[0,3,4].map(i=>`<button class="scenario-button" data-action="scenario" data-index="${i}" data-scenario="${E.scenarios[i].id}" aria-pressed="false">${esc(E.scenarios[i].short)}</button>`).join('');
  $('resource-items').innerHTML=Object.entries(E.fixtures.sections).map(([id,s])=>`<button class="resource-item ${s.warning?'flagged':''}" data-action="source" data-source="${id}"><span>§${id}</span><span>${esc(s.title)}</span>${icon(s.warning?'alert':'chevron')}</button>`).join('');
  window.addEventListener('studyflow-tool-approved',event=>{
    const action=event.detail;if(action.tool!=='goi_y_bai_tap'||state.phase!=='bounded_hint')return;
    if(pendingHint&&pendingHint.id!==action.id)return;
    if(!pendingHint&&action.operation!=='hint_support')return;
    if(pendingHint?.id===action.id&&pendingHint.level===1)state={...state,response:pendingHint.response};
    else dispatch({type:'NEXT_HINT'});
    pendingHint=null;if(messages.at(-1)?.kind==='assistant')messages.at(-1).response=state.response;renderConversation();
  });
  window.addEventListener('studyflow-tool-stopped',event=>{
    if(pendingHint?.id!==event.detail.id)return;
    if(pendingHint.level===1){state={...state,response:{...state.response,label:window.StudyFlowLocale.t('Yêu cầu gợi ý đã dừng'),body:window.StudyFlowLocale.t('Yêu cầu chưa được thực hiện. Bạn có thể sửa câu hỏi, yêu cầu gợi ý phù hợp hoặc nhờ TA. Không có đáp số nào được xác nhận.')}};if(messages.at(-1)?.kind==='assistant')messages.at(-1).response=state.response;}
    pendingHint=null;renderConversation();
  });
  window.addEventListener('studyflow-policy-change',()=>{pendingHint=null;renderConversation();});
  window.addEventListener('studyflow-demo-reset',()=>{
    cancelPending();state=E.initialState();messages=[];undoStack=[];pendingHint=null;taActionId=null;taActions.clear();activeScenario='';editing=false;$('question').value='';persist();renderConversation();renderMeta();updateComposer();setView(false);
  });
  closeMenu();renderConversation();renderMeta();updateComposer();
  if(location.hash==='#exercise')runScenario(1);
})();
