/* Compact comparison, approval and activity UI, shared by both HTML entry points. */
(()=>{
 'use strict';
 const P=window.StudyFlowPolicy,$=id=>document.getElementById(id);
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const L=(vi,en)=>window.StudyFlowLocale.language==='en'?en:vi;
 const disclosures=new Map();
 let state=P.initial(),selected=null,faqText='Đề nghị TA/giảng viên xác minh câu “độ lệch chuẩn luôn nhỏ hơn phương sai” ở §3.3. Phản ví dụ: phương sai 0,25 → độ lệch chuẩn 0,5. Cần làm rõ nguyên nhân biên soạn, không tự sửa tài liệu.',manualDraft=false;
 const reason={unknown_tool:['Không có tool này trong đề bài.','This tool is not part of the brief.'],read_only:['Chỉ đọc: AI không được tự sửa tài liệu.','Read only: AI cannot edit course materials.'],open_assignment:['Hard guardrail: bài đang mở, cấm xác nhận đáp số hoặc giải hộ. Phê duyệt cũng không bỏ được quy tắc này.','Hard guardrail: no final answers or confirmation for open assignments. Approval cannot override this.'],policy_forbidden:['Bị policy FORBIDDEN chặn.','Blocked by FORBIDDEN policy.'],missing_source:['Không có nguồn này trong fixture.','This source is absent from the fixture.'],approval_required:['Cần đúng người phê duyệt trước khi thực hiện.','The authorized person must approve before execution.'],hypothesis_required:['Chỉ được mô phỏng khi gắn nhãn phương án giả định bị loại.','Only available as an explicitly rejected hypothetical option.'],within_policy:['Trong phạm vi cho phép.','Within the permitted scope.'],approved:['Đã phê duyệt trong mô phỏng.','Approved in this simulation.'],reviewer_rejected:['Người duyệt đã từ chối; không thực hiện.','The reviewer rejected it. Nothing was executed.'],cancelled_by_user:['Người dùng đã huỷ trước thực thi.','Cancelled by the user before execution.'],context_changed:['Đổi ca/phương án: yêu cầu đang chờ được huỷ.','Scenario/option changed: pending requests were cancelled.'],cannot_unread:['Gỡ cảnh báo không thu hồi được thông tin đã đọc.','Removing a notice cannot recall information already read.'],withdrawn:['Đã rút khỏi hàng chờ mô phỏng.','Withdrawn from the simulated queue.']};
 function explain(code){const pair=reason[code];return pair?L(...pair):code;}
 function change(e){
  const before=state;state=P.transition(state,e);render();const action=state.actions.find(a=>a.id===e.id)||state.actions.at(-1);
  for(const stopped of state.actions.filter(a=>['rejected','cancelled'].includes(a.status)&&before.actions.find(old=>old.id===a.id)?.status!==a.status))window.dispatchEvent(new CustomEvent('studyflow-tool-stopped',{detail:stopped}));
  return action;
 }
 function request(tool,operation,payload={},auto=true){
  if((tool==='goi_y_bai_tap'&&operation==='hint_support')||tool==='dang_FAQ')for(const action of state.actions.filter(a=>a.tool===tool&&a.status==='awaiting_approval'))change({type:'CANCEL',id:action.id});
  change({type:'REQUEST',tool,operation,payload});const id=state.actions.at(-1).id;
  if(auto&&state.actions.at(-1).status==='allowed')change({type:'EXECUTE',id});
  if(!['chuyen_TA','tra_cuu_tai_lieu'].includes(tool)){selected=id;render();}
  return state.actions.find(a=>a.id===id);
 }
 function approve(id,actor,text){
  if(text!==undefined)change({type:'EDIT',id,text});
  change({type:'APPROVE',id,actor,confirmed:true});const action=change({type:'EXECUTE',id});
  if(action?.status==='executed')window.dispatchEvent(new CustomEvent('studyflow-tool-approved',{detail:action}));
  return action;
 }
 function current(){return state.actions.find(a=>a.id===selected);}
 function manualAction(){return manualDraft?{scenario:state.scenario,variant:state.variant,status:'drafted',payload:{text:faqText}}:null;}
 function emitWorkflow(view){const action=current()||manualAction();window.dispatchEvent(new CustomEvent('studyflow-workflow-change',{detail:{scenario:state.scenario,variant:state.variant,action,output:view||P.comparison(state,window.StudyFlowLocale.language,action)}}));}
 function open(){const panel=$('autonomy-panel');if(panel)panel.open=true;}
 function closeDraft(){disclosures.set('draft',false);const editor=document.querySelector('[data-disclosure="draft"]');if(editor)editor.open=false;}
 function context(scenario,variant){closeDraft();state=P.transition(state,{type:'CONTEXT',scenario:scenario==='exercise'?'exercise':'source-error',variant});selected=null;manualDraft=false;render();}
 function simulate(){
  if(state.scenario==='source-error'){
   if(state.variant===1){manualDraft=true;selected=null;}
   else selected=request('dang_FAQ','publish',{text:faqText.trim(),hypothetical:state.variant===3}).id;
  }else selected=request('goi_y_bai_tap',state.variant===3?'confirm_answer':state.variant===2?'hint_support':'hint',{level:1,text:L('Chỉ hướng dẫn phương pháp, không xác nhận lựa chọn hoặc đáp số bài đang mở.','Guide the method only; never confirm a choice or final answer for the open assignment.')}).id;
  render();
 }
 function roleName(tool){return tool==='chuyen_TA'?L('Học viên','Student'):tool==='tra_cuu_tai_lieu'?'—':L('TA / giảng viên được uỷ quyền','Authorized TA / instructor');}
 function executor(tool){const mode=P.policy(state,tool);return mode==='APPROVAL_REQUIRED'?L('Người duyệt: ','Approver: ')+roleName(tool):mode==='FORBIDDEN'?L('Không được thực hiện','Execution prohibited'):tool==='dang_FAQ'?L('AI · chỉ giả định bị loại','AI · rejected hypothesis only'):L('AI tự làm trong phạm vi','AI acts within scope');}
 function statusLabel(status){return ({not_run:L('Xem trước · chưa chạy','Preview · not run'),drafted:L('Bản nháp cục bộ','Local draft'),awaiting_approval:L('Chờ phê duyệt','Awaiting approval'),executed:L('Đã thực hiện · mô phỏng','Executed · simulated'),denied:L('Đã chặn','Blocked'),rejected:L('Đã từ chối','Rejected'),cancelled:L('Đã hủy','Cancelled'),undone:L('Đã gỡ · mô phỏng','Removed · simulated')})[status]||status;}
 function render(){
  if(!$('autonomy-content'))return;
  for(const detail of $('autonomy-content').querySelectorAll('[data-disclosure]'))disclosures.set(detail.dataset.disclosure,detail.open);
  const focused=document.activeElement,focusAction=focused?.dataset.autonomy,focusId=focused?.dataset.id,focusVariant=focused?.dataset.variant;
  const exercise=state.scenario==='exercise',action=current();
  const manual=manualAction();
  const generatedFocus=window.StudyFlowGenerated?.choices?.[`${exercise?'case2':'case5'}_${state.variant}`];
  const view=P.comparison(state,window.StudyFlowLocale.language,action||manual,generatedFocus);
  const recommended=P.recommended(state.scenario),marks=['①','②','③'];
  const options=[1,2,3].map(variant=>P.comparison({...state,variant},window.StudyFlowLocale.language));
  $('autonomy-content').innerHTML=`
   <div class="comparison-heading"><div><span class="comparison-eyebrow">${exercise?'CASE 02':'CASE 05'} · ${L('THỬ QUYỀN AI','TEST AI PERMISSIONS')}</span><h2>${L('Cùng một câu hỏi. Khác quyền quyết định.','Same question. Different permissions.')}</h2></div><span class="comparison-mock">${L('Chỉ mô phỏng','Simulation only')}</span></div>
   <div class="autonomy-options" role="group" aria-label="${L('Phương án so sánh','Comparison options')}">${options.map((option,i)=>`<button data-autonomy="variant" data-variant="${i+1}" data-recommended="${i+1===recommended}" aria-pressed="${state.variant===i+1}"><span class="option-caption">${marks[i]} ${i+1===recommended?`<span class="recommended-label"><svg aria-hidden="true"><use href="#i-check"/></svg>${L('Khuyến nghị','Recommended')}</span>`:i===2?L('Phương án bị loại','Rejected option'):L('Để so sánh','Alternative')}</span><strong>${esc(option.title)}</strong><small>${option.policy}</small></button>`).join('')}</div>
   <div class="comparison-selection"><span>${L('Đang thử','Testing')} ${marks[state.variant-1]} · ${L('khuyến nghị cố định','fixed recommendation')} ${marks[recommended-1]}</span><button data-autonomy="recommended" ${state.variant===recommended?'disabled':''}>${L('Về khuyến nghị','Restore recommended')}</button></div>
   <article class="comparison-output ${view.rejected?'rejected-option':''}" id="comparison-output" data-output-status="${view.status}" aria-live="polite" aria-atomic="true"><div class="output-heading"><span><svg aria-hidden="true"><use href="#i-spark"/></svg>${L('Hành vi theo quyền','Behavior by permission')}</span><span class="output-status">${exercise&&state.variant===3?L('Preview rủi ro · đáp án ẩn','Risk preview · answer hidden'):statusLabel(view.status)}</span></div><p>${esc(view.reply)}</p><div class="output-boundary"><code>${view.tool}</code><span>${view.policy}</span>${view.generated?`<b class="generated-badge">${L('Luna · gợi mở đã tạo sẵn','Luna · prepared follow-up')}</b>`:''}${view.rejected?`<b>${L('GIẢ ĐỊNH BỊ LOẠI','REJECTED HYPOTHESIS')}</b>`:''}</div></article>
   ${exercise?exerciseControls():faqControls()}
   ${action?reviewCard(action):''}
   <p class="comparison-cost">${esc(view.cost)}</p>
   <div class="comparison-inspect"><details data-disclosure="tools" ${disclosures.get('tools')?'open':''}><summary>${L('4 tool & chính sách','4 tools & policy')}<span>§4</span></summary><p class="autonomy-intro">${L('①/②/③ là phương án thiết kế, không tương ứng 1:1 với ba policy. Bảng dưới theo phương án đang thử; khuyến nghị của ca luôn giữ nguyên.','Options ①/②/③ are design alternatives, not a 1:1 mapping to policies. This table follows the selected alternative; the scenario recommendation stays fixed.')}</p><div class="autonomy-tools">${Object.keys(P.registry).map(tool=>`<div><code>${tool}</code><span class="policy-mode">${P.policy(state,tool)}</span><small>${executor(tool)}</small></div>`).join('')}</div><p class="autonomy-boundary">${L('§4: chuyển TA tự làm sau khi học viên chủ động nhờ hỗ trợ. Đáp số bài đang mở vẫn bị cấm kể cả được duyệt; xac_nhan_dap_so là hành động con, không phải tool thứ năm.','Section §4: TA routing is automatic after the learner requests help. Open-assignment answers stay forbidden even after approval; xac_nhan_dap_so is a sub-action, not a fifth tool.')}</p></details>
   <details class="tool-trace" data-disclosure="trace" ${disclosures.get('trace')?'open':''}><summary>${L('Tool Activity · nhật ký','Tool Activity · trace')}<span>${state.actions.length}</span></summary>${trace()}</details></div>
   <div class="comparison-footer"><span>${L('Tool cục bộ · TA/FAQ chưa gửi thật','Local tools · no real TA/FAQ delivery')}</span><button class="text-button autonomy-reset" data-autonomy="reset">Reset Demo</button></div>`;
  if(focusAction){const match=[...$('autonomy-content').querySelectorAll('[data-autonomy]')].find(el=>el.dataset.autonomy===focusAction&&el.dataset.id===focusId&&el.dataset.variant===focusVariant);(match||$('autonomy-content').querySelector('.approval-card'))?.focus({preventScroll:true});}
  emitWorkflow(view);
 }
 function draftEditor(label,forceOpen=false){
  return `<details class="draft-editor" data-disclosure="draft" ${forceOpen||disclosures.get('draft')?'open':''}><summary><span class="marker" data-mark="6" aria-hidden="true">⑥</span>${label}</summary><label class="autonomy-label" for="faq-draft">${L('Nội dung sẽ được xem trong mô phỏng','Content to review in this simulation')}</label><textarea id="faq-draft" maxlength="1600" data-user-content>${esc(faqText)}</textarea></details>`;
 }
 function faqControls(){
  if(state.variant===1)return `<div class="autonomy-buttons"><button class="primary-button" data-autonomy="manual">${L('Chạy mô phỏng · soạn báo lỗi','Run simulation · draft a report')}</button></div>${manualDraft?draftEditor(L('Xem / sửa bản nháp của học viên','View / edit the student draft'),true):''}`;
  return `<div class="autonomy-buttons"><button class="primary-button" data-autonomy="faq-request">${state.variant===3?L('Chạy giả định bị loại','Run rejected hypothesis'):L('Chạy mô phỏng · chờ duyệt','Run simulation · request review')}</button>${state.variant===2?`<button class="secondary-button" data-autonomy="faq-bypass">${L('Thử tự đăng → bị chặn','Try auto-publishing → blocked')}</button>`:''}</div>${draftEditor(L('Xem / sửa bản nháp cảnh báo','View / edit the draft notice'))}`;
 }
 function exerciseControls(){
  if(state.variant===3)return `<p class="blocked-action"><svg aria-hidden="true"><use href="#i-shield"/></svg>${L('Không có nút giải hộ. Hard guardrail áp dụng ở mọi mức.','No full-solution control. The hard guardrail applies at every level.')}</p>`;
  return `<div class="autonomy-buttons"><button class="primary-button" data-autonomy="${state.variant===2?'hint-support':'hint-demo'}">${state.variant===2?L('Chạy mô phỏng · TA duyệt gợi ý','Run simulation · request safe guidance'):L('Chạy mô phỏng · gợi ý ngay','Run simulation · hint now')}</button></div>`;
 }
 function reviewCard(a){
  if(a.tool==='goi_y_bai_tap'&&a.status==='executed')return '';
  return `<article class="approval-card" tabindex="-1"><div class="approval-title"><span class="marker" data-mark="4" aria-hidden="true">④</span><strong>${a.status==='awaiting_approval'?L('Vai người duyệt · mô phỏng','Reviewer role · simulated'):L('Kết quả thao tác','Action result')}</strong><code>${esc(a.status)}${a.result?' · '+esc(a.result):''}</code></div>${a.status==='awaiting_approval'?`<p>${roleName(a.tool)} · ${L('Không có thông báo gửi ra ngoài.','No external notification is sent.')}</p>${a.payload.text?`<p class="review-copy" data-user-content>${esc(a.payload.text)}</p>`:''}<div class="autonomy-buttons"><button class="primary-button" data-autonomy="approve" data-id="${a.id}">Approve · ${L('duyệt mock','mock approval')}</button><button class="secondary-button" data-autonomy="reject" data-id="${a.id}">Reject · ${L('từ chối','reject')}</button><button class="secondary-button" data-autonomy="cancel" data-id="${a.id}">${L('Hủy trước thực thi','Cancel before execution')}</button></div>`:`<p>${esc(explain(a.reason))}</p>`}${a.status==='executed'&&a.tool==='dang_FAQ'?`<button class="secondary-button" data-autonomy="undo" data-id="${a.id}">${L('Gỡ cảnh báo mô phỏng','Remove simulated notice')}</button>`:''}${a.status==='undone'?`<p>${L('Thông tin đã đọc không được thu hồi; gỡ chỉ dừng hiển thị tiếp.','Previously read information is not recalled. Removal only stops further display.')}</p>`:''}</article>`;
 }
 function trace(){return state.actions.length?state.actions.slice(-8).reverse().map(a=>`<article class="trace-item"><code>${esc(a.tool)}</code><span class="trace-state ${a.status}">${esc(a.status)}${a.result?' · '+esc(a.result):''}</span><p>${esc(a.operation)} → ${esc(a.policy)} ${a.hypothetical?'· '+L('GIẢ ĐỊNH BỊ LOẠI','REJECTED HYPOTHESIS'):''}</p><small>${esc(a.history.join(' → '))}${a.approvedBy?' · '+esc(a.approvedBy):''}</small><p>${esc(explain(a.reason))}</p></article>`).join(''):`<p>${L('Chưa gọi tool. Chọn ca hoặc chạy một phương án.','No tools called. Choose a scenario or run an alternative.')}</p>`;}
 document.addEventListener('input',e=>{if(e.target.id!=='faq-draft')return;faqText=e.target.value;const action=current();if(action?.status==='awaiting_approval'){state=P.transition(state,{type:'EDIT',id:action.id,text:faqText});const copy=document.querySelector('.review-copy');if(copy)copy.textContent=faqText;}emitWorkflow();});
 document.addEventListener('click',e=>{
  const b=e.target.closest('[data-autonomy]');if(!b)return;open();
  const id=b.dataset.id;
  switch(b.dataset.autonomy){
   case 'variant':closeDraft();state=P.transition(state,{type:'CONTEXT',scenario:state.scenario,variant:Number(b.dataset.variant)});selected=null;manualDraft=false;window.dispatchEvent(new CustomEvent('studyflow-policy-change'));simulate();break;
   case 'recommended':document.querySelector(`[data-autonomy="variant"][data-variant="${P.recommended(state.scenario)}"]`).click();break;
   case 'hint-demo':selected=request('goi_y_bai_tap','hint',{level:1}).id;render();break;
   case 'manual':manualDraft=true;render();break;
   case 'faq-request':if(!faqText.trim())return;selected=request('dang_FAQ','publish',{text:faqText.trim(),hypothetical:state.variant===3}).id;render();break;
   case 'faq-bypass':selected=request('dang_FAQ','publish_now',{text:faqText.trim()}).id;render();break;
   case 'hint-support':selected=request('goi_y_bai_tap','hint_support',{text:L('Chỉ hướng dẫn kiểm tra thứ tự, số quan sát và phương pháp phân tích ngoại lai. Không chốt lựa chọn hay đáp số.','Only guide ordering, observation count and outlier analysis. No final choice or answer.'),level:2}).id;render();break;
   case 'approve':approve(id,'instructor',$('faq-draft')?.value);break;
   case 'reject':change({type:'REJECT',id,actor:'instructor'});break;
   case 'cancel':change({type:'CANCEL',id});break;
   case 'undo':change({type:'UNDO',id});break;
   case 'reset':state=P.initial(state.scenario);selected=null;manualDraft=false;render();window.dispatchEvent(new CustomEvent('studyflow-demo-reset'));break;
  }
 });
 window.addEventListener('studyflow-locale-change',render);
 window.StudyFlowAutonomy={request,approve,change,context,simulate,open,render,get state(){return state;},get policy(){return tool=>P.policy(state,tool);}};
 render();
})();
