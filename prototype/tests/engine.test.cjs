const { test } = require('node:test');
const assert = require('node:assert/strict');
// Behaviour contracts: wrong routing could leak an answer or invent evidence.
const engine = require('../engine.js');
test('normal explanation provides the two actual source sections', () => {
  const r = engine.resolveQuestion('Trung vị khác trung bình cộng như thế nào?');
  assert.equal(r.state, 'normal');
  assert.deepEqual(r.sources, ['3.1', '3.2']);
  assert.ok(r.followup);
});
test('all open-assignment variants refuse final answers, including mixed intents', () => {
  for (const q of ['Bài 3 cho em đáp án luôn', 'bai tap 3 em tinh ra 11.5 dung khong', 'Bài 3: trung vị và p-value?', 'Lương 8 nhân viên 9 10 10 11 12 12 13 45', '15,25 đúng không?']) {
    const r = engine.resolveQuestion(q);
    assert.equal(r.state, 'bounded_hint', q);
    assert.deepEqual(r.sources, ['3.1', '3.2', '3.5']);
    assert.doesNotMatch(JSON.stringify(r), /11[.,]5|15[.,]25/);
  }
});
test('repeated hints never progress into a full worked solution', () => {
  let state = engine.initialState();
  state = engine.transition(state, { type: 'ASK', question: 'Bài 3 cho đáp án' });
  for (let i = 0; i < 20; i++) state = engine.transition(state, { type: 'NEXT_HINT' });
  assert.equal(state.hintLevel, 2);
  assert.doesNotMatch(JSON.stringify(state.response), /11[.,]5|15[.,]25/);
});
test('source error is marked for verification and names the invalid universal claim', () => {
  const r = engine.resolveQuestion('Tài liệu nói độ lệch chuẩn luôn nhỏ hơn phương sai, đúng không?');
  assert.equal(r.state, 'needs_verification');
  assert.deepEqual(r.sources, ['3.3']);
  assert.match(r.body, /0 < v < 1/);
  assert.deepEqual(r.counterexample, {variance:0.25, standardDeviation:0.5});
  assert.match(r.body, /đơn vị bình phương/);
  assert.match(r.body, /bác bỏ/);
  assert.match(r.causeUncertainty, /Chưa xác định được nguyên nhân/);
  assert.doesNotMatch(r.body, /chưa được TA xác minh/);
});
test('nonexistent slides and unopened p-value do not fabricate material', () => {
  assert.equal(engine.resolveQuestion('Giải thích slide 12').state, 'insufficient_evidence');
  const r = engine.resolveQuestion('Dạy kỹ toàn bộ p-value của buổi 7');
  assert.equal(r.state, 'insufficient_evidence');
  assert.deepEqual(r.sources, []);
});
test('ambiguous and unknown questions ask for clarification', () => {
  assert.equal(engine.resolveQuestion('Cái độ lệch ấy là gì?').state, 'clarification_required');
  assert.equal(engine.resolveQuestion('Hãy nói về một chủ đề hoàn toàn khác').state, 'insufficient_evidence');
});
test('correction recovers through a new question rather than repeats old answer', () => {
  assert.equal(engine.resolveQuestion('Bạn hiểu sai ý tôi.').state, 'correction');
  assert.deepEqual(engine.resolveQuestion('Tôi muốn hỏi về giá trị ngoại lai').sources, ['3.4']);
  assert.equal(engine.resolveQuestion('Bạn hiểu sai ý tôi.',{exercise:true}).state, 'correction');
  assert.deepEqual(engine.resolveQuestion('Tôi muốn hỏi về giá trị ngoại lai',{exercise:true}).sources, ['3.4']);
});
test('TA queue cannot be created before preview and explicit consent', () => {
  let state = engine.initialState();
  assert.equal(engine.transition(state, {type:'CONFIRM_TA', consent:true}).requests.length, 0);
  state = engine.transition(state, {type:'ASK', question:'Tài liệu §3.3 sai?'});
  state = engine.transition(state, {type:'DRAFT_TA'});
  assert.match(state.draft.question, /0,25/);
  assert.equal(state.requests.length, 0);
  assert.equal(engine.transition(state, {type:'CONFIRM_TA', consent:false}).requests.length, 0);
  state = engine.transition(state, {type:'CONFIRM_TA', consent:true});
  assert.equal(state.requests.length, 1);
  assert.equal(state.requests[0].simulated, true);
  assert.equal(state.requests[0].status, 'waiting');
  state = engine.transition(state, {type:'WITHDRAW_TA', id:state.requests[0].id});
  assert.equal(state.requests[0].status, 'withdrawn');
});
test('cancel preview discards draft and clock never uses wall time', () => {
  let state = engine.initialState();
  state = engine.transition(state, {type:'DRAFT_TA'});
  state = engine.transition(state, {type:'CANCEL_TA'});
  assert.equal(state.draft, null);
  assert.equal(state.requests.length, 0);
  assert.equal(engine.taAvailability('22:30').onDuty, false);
  assert.equal(engine.taAvailability('21:10').onDuty, true);
  assert.equal(engine.fixtures.assignment3.status, 'open');
  assert.equal(engine.fixtures.assignment2.answer, 6);
});
test('long TA summary is visibly shortened before consent, never silently changed afterward', () => {
  let state=engine.transition(engine.initialState(),{type:'ASK',question:'Tài liệu §3.3 sai? '+ 'a'.repeat(1180)});
  state=engine.transition(state,{type:'DRAFT_TA'});
  assert.ok(state.draft.question.length<=1200);
  assert.match(state.draft.question,/Đã rút gọn/);
  const reviewed=state.draft.question;
  state=engine.transition(state,{type:'EDIT_DRAFT',question:reviewed});
  state=engine.transition(state,{type:'CONFIRM_TA',consent:true});
  assert.equal(state.requests[0].question,reviewed);
});
test('English demo prompts keep the same evidence and assessment boundaries', () => {
  assert.equal(engine.resolveQuestion('The standard deviation is always smaller than variance, right?').state,'needs_verification');
  assert.equal(engine.resolveQuestion('Assignment 3 part b: is the median the right answer? Confirm it.').state,'bounded_hint');
  assert.equal(engine.resolveQuestion('You misunderstood me.').state,'correction');
  assert.deepEqual(engine.resolveQuestion('How is the median different from the mean?').sources,['3.1','3.2']);
});
