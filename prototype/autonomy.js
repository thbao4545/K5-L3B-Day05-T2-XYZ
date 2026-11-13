/* Pure, deterministic permission guard. Exactly four fixture tools; no real execution. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.StudyFlowPolicy=api;})(globalThis,function(){
 'use strict';
 const registry=Object.freeze({
  tra_cuu_tai_lieu:Object.freeze({policy:'AUTO',approver:null,reversible:false}),
  goi_y_bai_tap:Object.freeze({policy:'AUTO',approver:'instructor',reversible:false}),
  chuyen_TA:Object.freeze({policy:'APPROVAL_REQUIRED',approver:'student',reversible:true}),
  dang_FAQ:Object.freeze({policy:'APPROVAL_REQUIRED',approver:'instructor',reversible:true})
 });
 const forbidden=new Set(['confirm_answer','final_solution','edit_material']);
 const operations={tra_cuu_tai_lieu:['read'],goi_y_bai_tap:['hint','hint_support'],chuyen_TA:['queue'],dang_FAQ:['publish','publish_now']};
 function initial(scenario='source-error',variant=scenario==='exercise'?1:2){return {scenario,variant,nextId:1,actions:[]};}
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
 return {registry,initial,policy,evaluate,transition};
});
