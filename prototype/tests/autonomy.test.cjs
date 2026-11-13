const {test}=require('node:test');const assert=require('node:assert/strict');
const A=require('../autonomy.js');
const request=(s,tool,operation,payload={})=>A.transition(s,{type:'REQUEST',tool,operation,payload});
const latest=s=>s.actions.at(-1);
test('registry has exactly four tools and read AUTO actually executes through guard',()=>{
 let s=A.initial();assert.equal(Object.keys(A.registry).length,4);
 s=request(s,'tra_cuu_tai_lieu','read',{sourceAvailable:true});assert.equal(latest(s).status,'allowed');
 s=A.transition(s,{type:'EXECUTE',id:latest(s).id});assert.equal(latest(s).result,'read_mock');
 assert.deepEqual(latest(s).history,['requested','evaluating','allowed','executed']);
});
test('FAQ waits for the right approver, then can publish and remove with read-history warning',()=>{
 let s=request(A.initial(),'dang_FAQ','publish',{text:'Verify §3.3'});const id=latest(s).id;
 assert.equal(latest(s).status,'awaiting_approval');
 s=A.transition(s,{type:'EXECUTE',id});assert.equal(latest(s).status,'awaiting_approval');
 s=A.transition(s,{type:'APPROVE',id,actor:'student',confirmed:true});assert.equal(latest(s).status,'awaiting_approval');
 s=A.transition(s,{type:'APPROVE',id,actor:'instructor',confirmed:true});
 s=A.transition(s,{type:'EXECUTE',id});assert.equal(latest(s).result,'published_mock');
 s=A.transition(s,{type:'UNDO',id});assert.equal(latest(s).result,'unpublished_mock');assert.equal(latest(s).informationRecallable,false);
});
test('reject and cancel never publish; approval cannot resurrect a rejected request',()=>{
 let s=request(A.initial(),'dang_FAQ','publish',{text:'Verify §3.3'});const id=latest(s).id;
 s=A.transition(s,{type:'REJECT',id,actor:'instructor'});assert.equal(latest(s).status,'rejected');
 s=A.transition(s,{type:'APPROVE',id,actor:'instructor',confirmed:true});s=A.transition(s,{type:'EXECUTE',id});assert.equal(latest(s).result,null);
 s=request(s,'chuyen_TA','queue',{text:'Question'});const ta=latest(s).id;s=A.transition(s,{type:'CANCEL',id:ta});assert.equal(latest(s).status,'cancelled');
});
test('TA is AUTO after a student request, and only reversible actions may be undone',()=>{
 let s=request(A.initial(),'chuyen_TA','queue',{text:'Question'});const id=latest(s).id;
 assert.equal(A.registry.chuyen_TA.policy,'AUTO');assert.equal(latest(s).status,'allowed');
 s=A.transition(s,{type:'EXECUTE',id});assert.equal(latest(s).result,'queued_mock');
 s=A.transition(s,{type:'UNDO',id});assert.equal(latest(s).result,'withdrawn_mock');
 s=request(s,'goi_y_bai_tap','hint');const hint=latest(s).id;s=A.transition(s,{type:'EXECUTE',id:hint});s=A.transition(s,{type:'UNDO',id:hint});assert.equal(latest(s).status,'executed');
});
test('recommendations stay fixed while selected alternatives and reset change',()=>{
 for(const scenario of ['source-error','exercise'])for(const variant of [1,2,3]){
  const s=A.initial(scenario,variant),view=A.comparison(s,'vi');
  assert.equal(view.recommended,scenario==='exercise'?1:2);assert.equal(view.selected,variant);
  assert.equal(A.transition(s,{type:'RESET'}).variant,view.recommended);
 }
});
test('six comparison outputs are distinct, bilingual and never reveal open assignment answers',()=>{
 for(const lang of ['vi','en'])for(const scenario of ['source-error','exercise']){
  const views=[1,2,3].map(v=>A.comparison(A.initial(scenario,v),lang));
  assert.equal(new Set(views.map(v=>v.reply)).size,3);
  for(const view of views){assert.ok(view.reply.length>50);assert.doesNotMatch(view.reply,/11[.,]5|15[.,]25|đáp án là trung vị|answer is the median/i);}
 }
});
test('comparison output follows actual approval, rejection and removal state',()=>{
 let s=request(A.initial(),'dang_FAQ','publish',{text:'Verify §3.3'});const id=latest(s).id;
 assert.match(A.comparison(s,'vi',latest(s)).reply,/chờ.*duyệt/i);
 const rejected=A.transition(s,{type:'REJECT',id,actor:'instructor'});assert.match(A.comparison(rejected,'vi',latest(rejected)).reply,/từ chối/i);
 s=A.transition(s,{type:'APPROVE',id,actor:'instructor',confirmed:true});s=A.transition(s,{type:'EXECUTE',id});assert.match(A.comparison(s,'vi',latest(s)).reply,/đã duyệt/i);
 s=A.transition(s,{type:'UNDO',id});assert.match(A.comparison(s,'vi',latest(s)).reply,/không.*thu hồi/i);
});
test('no policy or approval bypasses the open-assignment guardrail',()=>{
 for(const variant of [1,2,3]){
  let s=A.initial('exercise',variant);s=request(s,'goi_y_bai_tap','confirm_answer');const id=latest(s).id;
  assert.equal(latest(s).status,'denied');
  s=A.transition(s,{type:'APPROVE',id,actor:'instructor',confirmed:true});s=A.transition(s,{type:'EXECUTE',id});assert.equal(latest(s).result,null);
 }
});
test('comparison variants alter permissions, with hypothetical FAQ AUTO requiring explicit risk context',()=>{
 let s=A.initial('source-error',1);assert.equal(A.policy(s,'dang_FAQ'),'FORBIDDEN');
 s=A.initial('source-error',3);s=request(s,'dang_FAQ','publish',{text:'Verify'});assert.equal(latest(s).status,'denied');
 s=request(s,'dang_FAQ','publish',{text:'Verify',hypothetical:true});s=A.transition(s,{type:'EXECUTE',id:latest(s).id});assert.equal(latest(s).hypothetical,true);assert.equal(latest(s).result,'published_mock');
 s=request(A.initial('exercise',2),'goi_y_bai_tap','hint');assert.equal(latest(s).status,'awaiting_approval');
});
test('context change cancels pending approval; source editing and missing sources stay forbidden',()=>{
 let s=request(A.initial(),'dang_FAQ','publish',{text:'Verify'});s=A.transition(s,{type:'CONTEXT',scenario:'exercise',variant:1});assert.equal(s.actions[0].status,'cancelled');
 s=request(s,'tra_cuu_tai_lieu','edit_material');assert.equal(latest(s).status,'denied');
 s=request(s,'tra_cuu_tai_lieu','read',{sourceAvailable:false});assert.equal(latest(s).status,'denied');
 s=request(s,'xac_nhan_dap_so','execute');assert.equal(latest(s).status,'denied');assert.equal(Object.keys(A.registry).length,4);
});
