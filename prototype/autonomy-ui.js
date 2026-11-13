/* Compact comparison, approval and activity UI, shared by both HTML entry points. */
(()=>{
 'use strict';
 const P=window.StudyFlowPolicy,$=id=>document.getElementById(id);
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const L=(vi,en)=>window.StudyFlowLocale.language==='en'?en:vi;
 let state=P.initial(),selected=null,faqText='Đề nghị TA/giảng viên xác minh câu “độ lệch chuẩn luôn nhỏ hơn phương sai” ở §3.3. Phản ví dụ: phương sai 0,25 → độ lệch chuẩn 0,5. Cần làm rõ nguyên nhân biên soạn, không tự sửa tài liệu.',manualDraft=false;
 const reason={unknown_tool:['Không có tool này trong đề bài.','This tool is not part of the brief.'],read_only:['Chỉ đọc: AI không được tự sửa tài liệu.','Read only: AI cannot edit course materials.'],open_assignment:['Hard guardrail: bài đang mở, cấm xác nhận đáp số hoặc giải hộ. Phê duyệt cũng không bỏ được quy tắc này.','Hard guardrail: no final answers or confirmation for open assignments. Approval cannot override this.'],policy_forbidden:['Bị policy FORBIDDEN chặn.','Blocked by FORBIDDEN policy.'],missing_source:['Không có nguồn này trong fixture.','This source is absent from the fixture.'],approval_required:['Cần đúng người phê duyệt trước khi thực hiện.','The authorized person must approve before execution.'],hypothesis_required:['Chỉ được mô phỏng khi gắn nhãn phương án giả định bị loại.','Only available as an explicitly rejected hypothetical option.'],within_policy:['Trong phạm vi cho phép.','Within the permitted scope.'],approved:['Đã phê duyệt trong mô phỏng.','Approved in this simulation.'],reviewer_rejected:['Người duyệt đã từ chối; không thực hiện.','The reviewer rejected it. Nothing was executed.'],cancelled_by_user:['Người dùng đã huỷ trước thực thi.','Cancelled by the user before execution.'],context_changed:['Đổi ca/phương án: yêu cầu đang chờ được huỷ.','Scenario/option changed: pending requests were cancelled.'],cannot_unread:['Gỡ cảnh báo không thu hồi được thông tin đã đọc.','Removing a notice cannot recall information already read.'],withdrawn:['Đã rút khỏi hàng chờ mô phỏng.','Withdrawn from the simulated queue.']};
 function explain(code){const pair=reason[code];return pair?L(...pair):code;}
 function change(e){
  const before=state;state=P.transition(state,e);render();const action=state.actions.find(a=>a.id===e.id)||state.actions.at(-1);
  for(const stopped of state.actions.filter(a=>['rejected','cancelled'].includes(a.status)&&before.actions.find(old=>old.id===a.id)?.status!==a.status))window.dispatchEvent(new CustomEvent('studyflow-tool-stopped',{detail:stopped}));
  return action;
 }
 function request(tool,operation,payload={},auto=true){
  if(tool==='goi_y_bai_tap'&&operation==='hint_support')for(const action of state.actions.filter(a=>a.tool===tool&&a.status==='awaiting_approval'))change({type:'CANCEL',id:action.id});
  change({type:'REQUEST',tool,operation,payload});const id=state.actions.at(-1).id;
  if(auto&&state.actions.at(-1).status==='allowed')change({type:'EXECUTE',id});
  if(tool!=='chuyen_TA'&&state.actions.at(-1).status==='awaiting_approval'){selected=id;render();}
  return state.actions.find(a=>a.id===id);
 }
 function approve(id,actor,text){
  if(text!==undefined)change({type:'EDIT',id,text});
  change({type:'APPROVE',id,actor,confirmed:true});const action=change({type:'EXECUTE',id});
  if(action?.status==='executed')window.dispatchEvent(new CustomEvent('studyflow-tool-approved',{detail:action}));
  return action;
 }
 function current(){return state.actions.find(a=>a.id===selected);}
 function open(){const panel=$('autonomy-panel');if(panel)panel.open=true;}
 function context(scenario,variant){state=P.transition(state,{type:'CONTEXT',scenario:scenario==='exercise'?'exercise':'source-error',variant});selected=null;manualDraft=false;render();}
 function roleName(tool){return tool==='chuyen_TA'?L('Học viên','Student'):tool==='tra_cuu_tai_lieu'?'—':L('TA / giảng viên được uỷ quyền','Authorized TA / instructor');}
 function executor(tool){const mode=P.policy(state,tool);return mode==='APPROVAL_REQUIRED'?L('Người duyệt: ','Approver: ')+roleName(tool):mode==='FORBIDDEN'?L('Không được thực hiện','Execution prohibited'):tool==='dang_FAQ'?L('AI · chỉ giả định bị loại','AI · rejected hypothesis only'):L('AI tự làm trong phạm vi','AI acts within scope');}
 function render(){
  if(!$('autonomy-content'))return;
  const focused=document.activeElement,focusAction=focused?.dataset.autonomy,focusId=focused?.dataset.id,focusVariant=focused?.dataset.variant;
  const exercise=state.scenario==='exercise',action=current();
  const options=exercise?[['Gợi ý giới hạn','Bounded hints'],['TA duyệt gợi ý phù hợp','TA approves safe guidance'],['Tự giải · bị cấm','Full solution · forbidden']]:[['Học viên tự báo','Student reports manually'],['Duyệt trước khi đăng','Approve before publishing'],['Tự đăng · giả định bị loại','Auto-publish · rejected hypothesis']];
  $('autonomy-content').innerHTML=`<p class="autonomy-intro">${L('PROVISIONAL · §4 chưa chốt. ①/②/③ là phương án thiết kế, không phải ba policy tương ứng 1:1.','PROVISIONAL · Section §4 is not finalized. Options ①/②/③ are design alternatives, not a 1:1 mapping to the three policies.')}</p>
   <div class="autonomy-options" role="group" aria-label="${L('Phương án so sánh','Comparison options')}">${options.map(([vi,en],i)=>`<button data-autonomy="variant" data-variant="${i+1}" aria-pressed="${state.variant===i+1}">${['①','②','③'][i]} ${L(vi,en)}</button>`).join('')}</div>
   <div class="autonomy-tools">${Object.keys(P.registry).map(tool=>`<div><code>${tool}</code><span class="policy-mode">${P.policy(state,tool)}</span><small>${executor(tool)}</small></div>`).join('')}</div>
   <p class="autonomy-boundary">${exercise?L('Bài 3 đang mở. xac_nhan_dap_so là hành động con bị cấm của goi_y_bai_tap, không phải tool thứ năm.','Assignment 3 is open. xac_nhan_dap_so is a forbidden sub-action of goi_y_bai_tap, not a fifth tool.'):L('Chính sách đề xuất: ② cần TA/giảng viên được uỷ quyền duyệt. Phương án ③ bị loại vì một lỗi có thể lan ra cả lớp trước khi kiểm tra.','Proposed policy: option ② requires an authorized TA/instructor. Option ③ is rejected because an error could reach the class before verification.')}</p>
   ${exercise?exerciseControls():faqControls()}
   ${action?reviewCard(action):''}
   <details class="tool-trace" ${state.actions.length?'open':''}><summary>${L('Tool Activity · trace mô phỏng','Tool Activity · simulated trace')} (${state.actions.length})</summary>${state.actions.length?state.actions.slice(-8).reverse().map(a=>`<article class="trace-item"><code>${esc(a.tool)}</code><span class="trace-state ${a.status}">${esc(a.status)}${a.result?' · '+esc(a.result):''}</span><p>${esc(a.operation)} → ${esc(a.policy)} ${a.hypothetical?'· '+L('GIẢ ĐỊNH BỊ LOẠI','REJECTED HYPOTHESIS'):''}</p><small>${esc(a.history.join(' → '))}</small><p>${esc(explain(a.reason))}</p></article>`).join(''):`<p>${L('Chưa gọi tool. Chọn ca hoặc thử một thao tác.','No tools called yet. Choose a scenario or try an action.')}</p>`}</details>
   <button class="secondary-button autonomy-reset" data-autonomy="reset">${L('Reset Demo · xoá dữ liệu mô phỏng','Reset Demo · clear simulated data')}</button>`;
  if(focusAction){const match=[...$('autonomy-content').querySelectorAll('[data-autonomy]')].find(el=>el.dataset.autonomy===focusAction&&el.dataset.id===focusId&&el.dataset.variant===focusVariant);(match||$('autonomy-content').querySelector('.approval-card'))?.focus({preventScroll:true});}
 }
 function faqControls(){
  if(state.variant===1)return `<div class="autonomy-cost">${L('AI không gọi dang_FAQ ở phương án này. Học viên chủ động báo; nếu không báo, cả lớp có thể tiếp tục học nhầm trong lúc chờ.','AI does not call dang_FAQ in this option. The student reports manually; otherwise classmates may continue learning the error.')}</div><button class="secondary-button" data-autonomy="manual">${L('Soạn báo lỗi · chưa gửi','Draft a report · not sent')}</button>${manualDraft?`<label class="autonomy-label" for="faq-draft">${L('Bản nháp của học viên · chỉ cục bộ','Student draft · local only')}</label><textarea id="faq-draft" maxlength="1600" data-user-content>${esc(faqText)}</textarea>`:''}`;
  return `<label class="autonomy-label" for="faq-draft"><span class="marker" data-mark="6" aria-hidden="true">⑥</span>${state.variant===3?L('Phương án giả định bị loại · cảnh báo sẽ hiện cho cả lớp (mock)','Rejected hypothesis · notice visible to the class (mock)'):L('Bản nháp cảnh báo để giảng viên duyệt','Draft notice for instructor approval')}</label><textarea id="faq-draft" maxlength="1600" data-user-content>${esc(faqText)}</textarea><div class="autonomy-buttons"><button class="primary-button" data-autonomy="faq-request">${state.variant===3?L('Mô phỏng phương án bị loại','Simulate the rejected option'):L('Tạo bản nháp chờ duyệt','Prepare a draft for approval')}</button>${state.variant===2?`<button class="secondary-button" data-autonomy="faq-bypass">${L('Kiểm tra chặn tự đăng','Test auto-publish block')}</button>`:''}</div>`;
 }
 function exerciseControls(){
  if(state.variant===3)return `<div class="autonomy-cost">${L('Phương án bị loại: AI tự giải bài đang mở. Hành động bị chặn; không có nút thực thi và không hiển thị đáp án, kể cả khi so sánh rủi ro.','Rejected option: AI solves an open assignment. The action is blocked. No execution button or final answer is shown, including in risk comparisons.')}</div>`;
  if(state.variant===2)return `<p class="autonomy-cost">${L('Chỉ duyệt hỗ trợ học tập phù hợp. Phê duyệt không hợp thức hoá việc giải hộ. Duyệt chậm có thể qua hạn bài; AI không tự mở quyền.','Approval is for safe learning support only. It never authorizes a final answer. Waiting may pass the deadline; AI cannot grant itself more access.')}</p><button class="secondary-button" data-autonomy="hint-support">${L('Yêu cầu duyệt gợi ý phù hợp','Request approval for safe guidance')}</button>`;
  return `<p class="autonomy-cost">${L('AUTO chỉ cho phương pháp và gợi ý đầu. Gợi ý đã đọc không thể hoàn tác thành chưa đọc, vì vậy phải chặn đáp án trước khi hiển thị.','AUTO allows methods and initial hints only. A read hint cannot be unread, so final answers must be blocked before display.')}</p>`;
 }
 function reviewCard(a){
  return `<article class="approval-card" tabindex="-1"><div class="approval-title"><span class="marker" data-mark="4" aria-hidden="true">④</span><strong>${esc(a.tool)}</strong><span>${esc(a.status)}${a.result?' · '+esc(a.result):''}</span></div><p>${esc(explain(a.reason))}</p>${a.payload.text?`<p class="review-copy" data-user-content>${esc(a.payload.text)}</p>`:''}${a.status==='awaiting_approval'?`<p>${L('Vai người duyệt mô phỏng:','Simulated reviewer role:')} <b>${roleName(a.tool)}</b>. ${L('Không có thông báo gửi ra ngoài.','No external notification is sent.')}</p><div class="autonomy-buttons"><button class="primary-button" data-autonomy="approve" data-id="${a.id}">Approve · ${L('duyệt mock','mock approval')}</button><button class="secondary-button" data-autonomy="reject" data-id="${a.id}">Reject · ${L('từ chối','reject')}</button><button class="secondary-button" data-autonomy="cancel" data-id="${a.id}">${L('Huỷ trước thực thi','Cancel before execution')}</button></div>`:''}${a.status==='executed'&&a.tool==='dang_FAQ'?`<p>${L('Chỉ công bố trong prototype. Không có FAQ hoặc server thật.','Published inside this prototype only. No real FAQ or server.')}</p><button class="secondary-button" data-autonomy="undo" data-id="${a.id}">${L('Gỡ cảnh báo mô phỏng','Remove simulated notice')}</button>`:''}${a.status==='undone'?`<p>${L('Thông tin đã đọc không được thu hồi; gỡ chỉ dừng hiển thị tiếp.','Previously read information is not recalled. Removal only stops further display.')}</p>`:''}</article>`;
 }
 document.addEventListener('input',e=>{if(e.target.id==='faq-draft')faqText=e.target.value;});
 document.addEventListener('click',e=>{
  const b=e.target.closest('[data-autonomy]');if(!b)return;open();
  const id=b.dataset.id;
  switch(b.dataset.autonomy){
   case 'variant':change({type:'CONTEXT',scenario:state.scenario,variant:Number(b.dataset.variant)});selected=null;manualDraft=false;if(state.scenario==='exercise'&&state.variant===3)selected=request('goi_y_bai_tap','confirm_answer').id;render();window.dispatchEvent(new CustomEvent('studyflow-policy-change'));break;
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
 window.StudyFlowAutonomy={request,approve,change,context,open,render,get state(){return state;},get policy(){return tool=>P.policy(state,tool);}};
 render();
})();
