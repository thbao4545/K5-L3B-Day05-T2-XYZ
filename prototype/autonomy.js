/* Pure, deterministic permission guard. Exactly four fixture tools; no real execution. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.StudyFlowPolicy=api;})(globalThis,function(){
 'use strict';
 const registry=Object.freeze({
  tra_cuu_tai_lieu:Object.freeze({policy:'AUTO',approver:null,reversible:false}),
  goi_y_bai_tap:Object.freeze({policy:'AUTO',approver:'instructor',reversible:false}),
  chuyen_TA:Object.freeze({policy:'AUTO',approver:null,reversible:true}),
  dang_FAQ:Object.freeze({policy:'APPROVAL_REQUIRED',approver:'instructor',reversible:true})
 });
 const forbidden=new Set(['confirm_answer','final_solution','edit_material']);
 const operations={tra_cuu_tai_lieu:['read'],goi_y_bai_tap:['hint','hint_support'],chuyen_TA:['queue'],dang_FAQ:['publish','publish_now']};
 function recommended(scenario){return scenario==='exercise'?1:2;}
 function initial(scenario='source-error',variant=recommended(scenario)){return {scenario,variant,nextId:1,actions:[]};}
 // Counterfactual replies are fixtures. A selection previews; an action reports what actually ran.
 function comparison(s,language='vi',action=null,generatedFocus=null){
  const en=language==='en',pick=(vi,english)=>en?english:vi,exercise=s.scenario==='exercise';
  const options=exercise?[
   ['Gợi ý giới hạn','Bounded hints','Bài 3 đang mở. Mình chỉ gợi ý phương pháp: tự kiểm tra thứ tự dữ liệu và ảnh hưởng của giá trị ngoại lai. Mình không chốt lựa chọn hay đáp số.','Assignment 3 is open. I offer methods only: check the data order and the influence of outliers yourself. I will not choose or confirm an answer.','Hỗ trợ ngay, dừng trước đáp án.','Immediate help, stopping before the answer.'],
   ['TA duyệt gợi ý','TA reviews guidance','Mình sẽ xin TA duyệt hỗ trợ học tập phù hợp trước khi đưa thêm gợi ý. Bài đang mở nên không ai được dùng phê duyệt để giải hộ.','I will ask a TA to review safe learning support before offering more guidance. Approval cannot authorize solving an open assignment.','Chờ duyệt làm việc học chậm hơn; không mở quyền giải hộ.','Review adds waiting time; it never unlocks a final solution.'],
   ['Tự giải · bị cấm','Full solution · forbidden','Yêu cầu tự giải đã bị chặn. Bài 3 đang mở: mình không đưa hoặc xác nhận đáp số, kể cả trong ví dụ minh họa rủi ro. Bạn có thể sửa câu hỏi hoặc nhờ TA.','The full-solution request is blocked. Assignment 3 is open: I cannot provide or confirm an answer, including in a risk demonstration. Edit the question or ask a TA.','Đáp án đã đọc không thể thu hồi, nên chặn trước khi hiển thị.','An answer cannot be unread, so it is blocked before display.']
  ]:[
   ['Học viên tự báo','Student reports','Phản ví dụ 0,25 → 0,5 cho thấy câu “luôn nhỏ hơn” cần xem lại. Mình có thể soạn nội dung để bạn tự báo giảng viên; mình không đăng FAQ ở phương án này.','The 0.25 → 0.5 counterexample shows that “always smaller” needs review. I can draft a report for you to share with the instructor; I do not publish a FAQ in this option.','Nếu học viên không báo, cả lớp có thể tiếp tục học nhầm.','If the student does not report it, classmates may keep learning the error.'],
   ['Duyệt trước khi đăng','Approve before publishing','Mình sẽ soạn bản nháp cảnh báo §3.3 để giảng viên xác minh. Chỉ sau khi giảng viên duyệt, cảnh báo mới được công bố trong mô phỏng.','I will draft a notice about §3.3 for instructor verification. It will only be published in this simulation after instructor approval.','Một lần duyệt giảm nguy cơ công bố sai cho cả lớp.','One review reduces the risk of misleading the entire class.'],
   ['Tự đăng · bị loại','Auto-publish · rejected','Phương án giả định bị loại: AI tự đăng cảnh báo §3.3 cho cả lớp trước khi giảng viên xem. Chỉ mô phỏng rủi ro; gỡ sau không thu hồi được điều đã đọc.','Rejected hypothesis: AI publishes a notice about §3.3 to the class before instructor review. This only simulates the risk; removal cannot recall information already read.','Nhanh hơn, nhưng cảnh báo có thể lan trước khi được rà soát.','Faster, but the notice can spread before review.']
  ];
  const option=options[s.variant-1]||options[recommended(s.scenario)-1],tool=exercise?'goi_y_bai_tap':'dang_FAQ';
  const a=action?.scenario===s.scenario&&action?.variant===s.variant?action:null;
  let reply=pick(option[2],option[3]),status=a?.status||'not_run';
  if(status==='drafted')reply=pick('Mình đã soạn bản nháp để bạn tự báo giảng viên. Nội dung chỉ ở trình duyệt, chưa gửi ai; dang_FAQ không được gọi.','I prepared a draft for you to report to the instructor. It stays in your browser, nothing was sent, and dang_FAQ was not called.');
  if(status==='awaiting_approval')reply=exercise?pick('Gợi ý phù hợp đang chờ TA duyệt trong mô phỏng. Mình chưa đưa phần gợi ý mới và sẽ không xác nhận đáp số bài đang mở.','Safe guidance is waiting for simulated TA approval. I have not released the new hint and will not confirm an open-assignment answer.'):pick('Bản nháp cảnh báo §3.3 đang chờ giảng viên duyệt trong mô phỏng. Chưa đăng FAQ, chưa gửi thông báo ra ngoài.','The §3.3 notice is waiting for simulated instructor approval. No FAQ has been published and no external notification sent.');
  if(status==='rejected')reply=pick('Người duyệt đã từ chối. Yêu cầu không được thực hiện; bạn có thể sửa nội dung hoặc nhờ TA hỗ trợ phù hợp.','The reviewer rejected the request. Nothing was executed; edit the content or request appropriate TA support.');
  if(status==='cancelled')reply=pick('Đã hủy trước khi thực hiện. Không có nội dung mới được công bố hoặc gửi đi. Bạn có thể sửa rồi chạy lại.','Cancelled before execution. No new content was published or sent. You can edit it and run again.');
  if(status==='executed')reply=exercise?pick('Đã tạo gợi ý an toàn: tự kiểm tra thứ tự dữ liệu, số quan sát và cách phân tích ngoại lai. Không chọn hộ, không tính hoặc xác nhận đáp số.','Safe guidance created: check ordering, observation count and outlier analysis yourself. No final choice, calculation or answer confirmation.'):(s.variant===3?pick('Giả định bị loại: AI đã tự đăng cảnh báo trong mô phỏng, chưa qua giảng viên. Không có FAQ thật. Việc gỡ sau không thu hồi được thông tin đã đọc.','Rejected hypothesis: AI auto-published a simulated notice without instructor review. No real FAQ exists. Removal cannot recall information already read.'):pick('Giảng viên đã duyệt trong mô phỏng. Cảnh báo được công bố cục bộ (published_mock); không có FAQ hay thông báo thật.','The instructor approved it in this simulation. The notice is published locally (published_mock); no real FAQ or notification exists.'));
  if(status==='undone')reply=pick('Đã gỡ cảnh báo mô phỏng để dừng hiển thị tiếp. Không thể thu hồi thông tin người khác đã đọc.','The simulated notice was removed to stop further display. Information already read cannot be recalled.');
  if(status==='denied')reply=exercise?pick(options[2][2],options[2][3]):pick('Chặn tự đăng: phương án này cần giảng viên duyệt trước. Chưa có cảnh báo nào được công bố.','Auto-publishing blocked: this option requires instructor approval first. No notice was published.');
  const questions=exercise?{
   ordering:['Bạn đã sắp xếp dữ liệu theo thứ tự trước khi phân tích chưa?','Have you put the data in order before analyzing it?'],
   outliers:['Bạn muốn kiểm tra ảnh hưởng của ngoại lai theo phương pháp nào?','Which method would you use to check the influence of outliers?'],
   method:['Bạn đang vướng ở cách làm hay cách giải thích lập luận của mình?','Are you stuck on the method or on explaining your reasoning?']
  }:{
   root:['Bạn muốn tự kiểm tra phép căn bậc hai trong phản ví dụ này không?','Would you like to check the square root in this counterexample?'],
   units:['Bạn muốn làm rõ sự khác nhau về đơn vị của hai đại lượng không?','Would you like to clarify how the two quantities have different units?'],
   cause:['Bạn muốn nhờ giảng viên làm rõ nguyên nhân biên soạn câu này không?','Would you like the instructor to clarify why this sentence was written?']
  };
  const generated=Object.hasOwn(questions,generatedFocus)&&(!exercise||s.variant!==3)&&(status==='not_run'||(exercise&&status==='executed'));
  if(generated)reply+=' '+pick(...questions[generatedFocus]);
  return {recommended:recommended(s.scenario),selected:s.variant,title:pick(option[0],option[1]),reply,cost:pick(option[4],option[5]),tool,policy:policy(s,tool),status,rejected:s.variant===3,generated};
 }
 function policy(s,tool){
  if(!Object.hasOwn(registry,tool))return 'FORBIDDEN';
  if(tool==='dang_FAQ'&&s.scenario==='source-error')return s.variant===1?'FORBIDDEN':s.variant===3?'AUTO':'APPROVAL_REQUIRED';
  if(tool==='goi_y_bai_tap'&&s.scenario==='exercise')return s.variant===2?'APPROVAL_REQUIRED':s.variant===3?'FORBIDDEN':'AUTO';
  return registry[tool].policy;
 }
 function evaluate(s,tool,operation,payload){
  const mode=policy(s,tool);
  if(!Object.hasOwn(registry,tool))return {status:'denied',reason:'unknown_tool'};
  // Safety is checked before policy, and checked again at execution. Approval is not an override.
  if(forbidden.has(operation))return {status:'denied',reason:operation==='edit_material'?'read_only':'open_assignment'};
  if(!operations[tool].includes(operation))return {status:'denied',reason:'invalid_operation'};
  if(tool==='tra_cuu_tai_lieu'&&payload.sourceAvailable===false)return {status:'denied',reason:'missing_source'};
  if(mode==='FORBIDDEN')return {status:'denied',reason:'policy_forbidden'};
  if(tool==='dang_FAQ'&&mode==='AUTO'&&!payload.hypothetical)return {status:'denied',reason:'hypothesis_required'};
  if(mode==='APPROVAL_REQUIRED'&&operation==='publish_now')return {status:'denied',reason:'approval_required'};
  if(mode==='APPROVAL_REQUIRED')return {status:'awaiting_approval',reason:'approval_required'};
  return {status:'allowed',reason:'within_policy'};
 }
 function transition(s,e){
  if(e.type==='RESET')return initial(s.scenario,s.scenario==='exercise'?1:2);
  if(e.type==='CONTEXT')return {...s,scenario:e.scenario,variant:e.variant|| (e.scenario==='exercise'?1:2),actions:s.actions.map(a=>['allowed','awaiting_approval'].includes(a.status)?{...a,status:'cancelled',history:[...a.history,'cancelled'],reason:'context_changed'}:a)};
  if(e.type==='REQUEST'){
   const payload={...e.payload};const verdict=evaluate(s,e.tool,e.operation,payload);
   const action={id:'ACT-'+s.nextId,tool:e.tool,operation:e.operation,payload,policy:policy(s,e.tool),scenario:s.scenario,variant:s.variant,...verdict,result:null,hypothetical:!!payload.hypothetical,approvedBy:null,informationRecallable:false,history:['requested','evaluating',verdict.status]};
   return {...s,nextId:s.nextId+1,actions:[...s.actions,action]};
  }
  return {...s,actions:s.actions.map(a=>{
   if(a.id!==e.id)return a;
   const step=(status,extra={})=>({...a,status,history:[...a.history,status],...extra});
   if(e.type==='EDIT'&&a.status==='awaiting_approval')return {...a,payload:{...a.payload,text:String(e.text||'').slice(0,1600)}};
   if(e.type==='CANCEL'&&['allowed','awaiting_approval'].includes(a.status))return step('cancelled',{reason:'cancelled_by_user'});
   if(e.type==='REJECT'&&a.status==='awaiting_approval'&&e.actor===registry[a.tool].approver)return step('rejected',{reason:'reviewer_rejected'});
   if(e.type==='APPROVE'&&a.status==='awaiting_approval'&&e.actor===registry[a.tool].approver&&e.confirmed===true){
    const verdict=evaluate(s,a.tool,a.operation,a.payload);
    if(verdict.status==='denied')return step('denied',{reason:verdict.reason});
    return step('allowed',{approvedBy:e.actor,reason:'approved',history:[...a.history,'approved','allowed']});
   }
   if(e.type==='EXECUTE'&&a.status==='allowed'){
    const verdict=evaluate(s,a.tool,a.operation,a.payload);
    if(verdict.status==='denied')return step('denied',{reason:verdict.reason});
    if(a.policy==='APPROVAL_REQUIRED'&&!a.approvedBy)return a;
    const result={tra_cuu_tai_lieu:'read_mock',goi_y_bai_tap:'hint_mock',chuyen_TA:'queued_mock',dang_FAQ:'published_mock'}[a.tool];
    return step('executed',{result});
   }
   if(e.type==='UNDO'&&a.status==='executed'&&registry[a.tool]?.reversible)return step('undone',{result:a.tool==='dang_FAQ'?'unpublished_mock':'withdrawn_mock',reason:a.tool==='dang_FAQ'?'cannot_unread':'withdrawn'});
   return a;
  })};
 }
 return {registry,initial,recommended,comparison,policy,evaluate,transition};
});
