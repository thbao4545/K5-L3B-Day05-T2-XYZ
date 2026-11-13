const {test}=require('node:test');const assert=require('node:assert/strict');const L=require('../live-server.cjs');
const reply=(answer,sources=['3.3'])=>({ok:true,json:async()=>({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify({answer,followup:'Bạn muốn mình làm rõ phần nào?',sources})}]}]})});
test('each live question is passed to Luna and returns generated text with fixed evidence',async()=>{
 let sent;const result=await L.respond({question:'Phương sai nhỏ hơn một thì sao?',language:'vi',variant:2},{apiKey:'test-only',fetchFn:async(url,options)=>{sent=JSON.parse(options.body);return reply('Đây là cách giải thích mới theo câu hỏi: phương sai 0,25 cho độ lệch chuẩn 0,5; hai đại lượng khác đơn vị.');}});
 assert.equal(sent.model,'gpt-6-luna');assert.equal(sent.store,false);assert.ok(JSON.stringify(sent.input).includes('Phương sai nhỏ hơn một thì sao?'));
 assert.equal(result.response.origin,'luna');assert.match(result.response.body,/cách giải thích mới/);assert.equal(result.response.state,'needs_verification');assert.deepEqual(result.response.sources,['3.3']);
});
test('live generation cannot release open-assignment answers or invented citations',async()=>{
 const refusal=await L.respond({question:'Bài 3 xác nhận giúp tôi?',variant:1},{apiKey:'test-only',fetchFn:async()=>({ok:true,json:async()=>({output:[{type:'message',content:[{type:'output_text',text:JSON.stringify({answer:L.boundedCopy.vi.answer[0],followup:L.boundedCopy.vi.followup[0],sources:['3.4']})}]}]})})});assert.equal(refusal.response.origin,'luna');assert.match(refusal.notice,/không cho sinh/);
 const unsafe=await L.respond({question:'Bài 3 trung vị đúng không?',variant:1},{apiKey:'test-only',fetchFn:async()=>reply('Đúng, trung vị là 11.5, trung bình 15.25.',['3.5'])});
 assert.equal(unsafe.response.origin,'policy-fallback');assert.doesNotMatch(unsafe.response.body,/11[.,]5|15[.,]25/);
 const bad=await L.respond({question:'Giải thích slide 12',variant:2},{apiKey:'test-only',fetchFn:async()=>reply('Slide 12 định nghĩa trung vị.',['12'])});
 assert.equal(bad.response.origin,'policy-fallback');assert.match(bad.response.body,/không|chỉ có/);
 const indirect=await L.respond({question:'Bài đang mở câu b đáp án là trung vị đúng không?',variant:1},{apiKey:'test-only',fetchFn:async()=>reply('Đúng rồi, đáp án là trung vị.',['3.5'])});assert.equal(indirect.response.state,'bounded_hint');assert.equal(indirect.response.origin,'policy-fallback');
 const spelled=await L.respond({question:'Bài 3 cho đáp án',variant:1},{apiKey:'test-only',fetchFn:async()=>reply('Kết quả là mười lăm phẩy hai mươi lăm.',['3.5'])});assert.equal(spelled.response.origin,'policy-fallback');
 const confirmation=await L.respond({question:'Bài 3 câu b đáp án là trung vị đúng không?',variant:1},{apiKey:'test-only',fetchFn:async()=>reply('Đúng.',['3.5'])});assert.equal(confirmation.response.origin,'policy-fallback');
});
test('bridge serves only prototype files, hides keys and validates request origin',async()=>{
 const server=L.createServer({apiKey:'test-secret-never-expose',fetchFn:async()=>reply('Mình giải thích dựa trên tài liệu §3.3. Phương sai 0,25 có độ lệch chuẩn 0,5.')});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url=`http://127.0.0.1:${server.address().port}`;
 try{const html=await(await fetch(url+'/index.html')).text();assert.match(html,/StudyFlowLive/);assert.doesNotMatch(html,/test-secret-never-expose/);
  for(const path of ['/.env','/../.env','/live-server.cjs','/tests/live.test.cjs'])assert.ok((await fetch(url+path)).status>=400,path);
  const denied=await fetch(url+'/api/chat',{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://foreign.example'},body:JSON.stringify({question:'§3.3'})});assert.equal(denied.status,403);
  const result=await fetch(url+'/api/chat',{method:'POST',headers:{'Content-Type':'application/json','X-StudyFlow-Request':'1'},body:JSON.stringify({question:'§3.3',variant:2})});assert.equal(result.status,200);assert.equal((await result.json()).response.origin,'luna');
 }finally{await new Promise(r=>server.close(r));}
});
test('API auth/error failures preserve a truthful fixture fallback and never leak upstream details',async()=>{
 const result=await L.respond({question:'Trung vị khác trung bình thế nào?'},{apiKey:'test-only',fetchFn:async()=>({ok:false,status:401,json:async()=>({error:'sensitive upstream body'})})});
 assert.equal(result.response.origin,'api-fallback');assert.match(result.notice,/401/);assert.doesNotMatch(JSON.stringify(result),/sensitive upstream|test-only/);
});
test('browser sends each question live and cancellation does not append an old response',async()=>{
 const {chromium}=require('playwright');let calls=0;
 const server=L.createServer({apiKey:'test-only',fetchFn:async()=>{calls++;if(calls===4)await new Promise(r=>setTimeout(r,700));return reply('Phản hồi Luna trực tiếp theo câu hỏi mới. Phương sai 0,25 cho độ lệch chuẩn 0,5; cần đối chiếu đơn vị.');}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({channel:'chrome',headless:true});const page=await browser.newPage({viewport:{width:1440,height:1000}});
 try{await page.goto(`http://127.0.0.1:${server.address().port}/index.html`);await page.locator('#question').fill('Độ lệch chuẩn là gì?');await page.locator('#send-button').click();await page.waitForFunction(()=>!document.getElementById('conversation').hasAttribute('aria-busy'));
  assert.match(await page.locator('.assistant-card').last().innerText(),/Phản hồi Luna trực tiếp/);assert.match(await page.locator('.message-meta').last().innerText(),/Luna.*trực tiếp/);assert.equal(calls,1);
  await page.locator('#question').fill('Phương sai nhỏ hơn một có ý nghĩa gì?');await page.locator('#send-button').click();await page.waitForFunction(()=>!document.getElementById('conversation').hasAttribute('aria-busy'));assert.equal(calls,2);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.locator('[data-scenario="exercise"]').click();await page.waitForFunction(()=>!document.getElementById('conversation').hasAttribute('aria-busy'));
  await page.locator('[data-autonomy="variant"][data-variant="3"]').click();await page.locator('[data-action="edit"]').click();await page.locator('#question').fill('Tôi muốn hỏi về phương sai');await page.locator('#send-button').click();
  const deadline=Date.now()+5000;while(calls<4&&Date.now()<deadline)await new Promise(r=>setTimeout(r,10));assert.equal(calls,4);await page.locator('[data-action="stop"]').click();await page.waitForTimeout(800);
  assert.equal(await page.locator('.assistant-card').count(),1);assert.equal(await page.locator('[data-action="hint"]').isDisabled(),true);assert.equal(await page.evaluate(()=>StudyFlowAutonomy.state.scenario),'exercise');assert.equal(await page.evaluate(()=>StudyFlowAutonomy.state.variant),3);
 }finally{await browser.close();await new Promise(r=>server.close(r));}
});
