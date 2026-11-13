/* Dev-only browser QA. Requires Playwright and a local Chrome; no app dependencies. */
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const {pathToFileURL} = require('node:url');
const {chromium} = require('playwright');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.woff2':'font/woff2','.svg':'image/svg+xml'};
test('T2 end-to-end, truthful autonomy, recovery and responsive static pages', {timeout:180000}, async t=>{
  const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://local').pathname));if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}fs.readFile(file,(err,data)=>{res.writeHead(err?404:200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(err?'Not found':data);});});
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const url=`http://127.0.0.1:${server.address().port}`;
  const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  const errors=[],unexpected=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',req=>{if(!req.url().startsWith(url)&&!req.url().startsWith('data:'))unexpected.push(req.url());});
  const finished=()=>page.waitForFunction(()=>!document.getElementById('conversation').hasAttribute('aria-busy'));
  const scenario=async id=>{await page.locator(`[data-scenario="${id}"]`).click();await finished();};
  const lastAnswer=()=>page.locator('.assistant-card').last();
  try {
    await page.goto(url+'/index.html');
    await t.test('primary #5: quote, counterexample, units, source and confirmation boundary',async()=>{
      await page.locator('[data-scenario="source-error"]').click();
      await page.locator('.loading-card').waitFor();await finished();
      assert.match(await lastAnswer().innerText(),/0,25/);assert.match(await lastAnswer().innerText(),/0,5/);
      assert.match(await lastAnswer().innerText(),/đơn vị bình phương/);
      assert.match(await page.locator('.problem-quote').innerText(),/Vì là căn bậc hai/);
      await lastAnswer().locator('[data-source="3.3"]').click();
      assert.equal(await page.locator('#info-dialog').isVisible(),true);
      assert.match(await page.locator('#info-dialog').innerText(),/Câu cuối cần kiểm tra/);
      await page.keyboard.press('Escape');
      await page.locator('[data-action="annotations"]').click();
      for(const mark of ['1','2','3','5'])assert.equal(await lastAnswer().locator(`[data-mark="${mark}"]`).first().isVisible(),true,`annotation ${mark} visible`);
      assert.match(await lastAnswer().locator('.cause-uncertainty').innerText(),/Chưa xác định được nguyên nhân/);
      assert.equal(await lastAnswer().locator('[data-mark="4"]').count(),0,'approval marker belongs in confirmation, not unapproved response');
      await page.screenshot({path:path.join(root,'screenshots/01-study-ux.png'),fullPage:true});
      await lastAnswer().locator('[data-action="ta"]').click();
      assert.equal(await page.locator('#confirm-ta').isDisabled(),true);
      assert.equal(await page.locator('#ta-dialog [data-mark="4"]').isVisible(),true);
      assert.match(await page.locator('#ta-question').inputValue(),/0,25/);
      assert.match(await page.locator('#ta-dialog-hours').innerText(),/sau hạn bài 3/);
      assert.equal(await page.locator('#queue-count').innerText(),'0');
      await page.locator('[data-action="cancel-ta"]').last().click();
      assert.equal(await page.locator('#queue-count').innerText(),'0');
      await lastAnswer().locator('[data-action="ta"]').click();
      await page.locator('#ta-question').fill('Nhờ TA xác minh §3.3. Phương sai 0,25, độ lệch chuẩn 0,5. Tôi cần hiểu đơn vị.');
      await page.locator('#ta-consent').check();await page.locator('#confirm-ta').click();
      assert.equal(await page.locator('.request-card').count(),1);
      assert.match(await page.locator('#queue-list').innerText(),/Chưa gửi đến TA hoặc server/);
      await page.reload();await page.locator('#queue-tab').click();assert.equal(await page.locator('.request-card').count(),1);
      await page.locator('[data-action="withdraw"]').click();assert.equal(await page.locator('.request-card.withdrawn').count(),1);
      await page.locator('#study-tab').click();
    });
    await t.test('secondary #2: direct switch, no confirmation, hints capped at two',async()=>{
      await scenario('exercise');
      assert.match(await lastAnswer().innerText(),/không cung cấp hoặc xác nhận/);
      assert.doesNotMatch(await lastAnswer().innerText(),/11[.,]5|15[.,]25|đáp án là trung vị/);
      assert.equal(await lastAnswer().locator('.citation').count(),3);
      await page.locator('[data-action="hint"]').click();assert.equal(await page.locator('[data-action="hint"]').isDisabled(),true);
      await page.locator('#question').fill('Vậy có đúng là trung vị không?');await page.locator('#send-button').click();await finished();
      assert.match(await lastAnswer().innerText(),/không cung cấp hoặc xác nhận/);
      await lastAnswer().locator('[data-action="edit"]').click();
      await page.locator('#question').fill('Tôi muốn hỏi về giá trị ngoại lai');await page.locator('#send-button').click();await finished();
      assert.match(await lastAnswer().innerText(),/Mình hiểu lại/);
    });
    await t.test('three supplementary scenarios and correction recovery',async()=>{
      await page.locator('.extra-scenarios summary').click();await scenario('happy');
      assert.equal(await lastAnswer().locator('.citation').count(),2);
      await scenario('missing');assert.match(await lastAnswer().innerText(),/không đánh số slide/);
      await lastAnswer().locator('[data-action="choice"]').last().click();await finished();assert.match(await lastAnswer().innerText(),/Chưa có nội dung chi tiết/);
      await scenario('correction');await lastAnswer().locator('[data-action="choice"]').first().click();await finished();assert.match(await lastAnswer().innerText(),/Mình hiểu lại/);
      await page.locator('[data-action="report"]').last().click();assert.equal(await page.locator('#edit-banner').isVisible(),true);
      await page.locator('#question').fill('Trung vị khác trung bình cộng như thế nào?');await page.locator('#send-button').click();await finished();assert.equal(await lastAnswer().locator('.citation').count(),2);
      await page.locator('[data-action="undo"]').last().click();assert.match(await lastAnswer().innerText(),/giá trị ngoại lai/);
    });
    await t.test('cancel pending, free-text fallback and HTML injection remain local text',async()=>{
      await page.locator('[data-scenario="source-error"]').click();await page.locator('[data-action="stop"]').click();
      await page.waitForTimeout(800);assert.equal(await page.locator('.loading-card').count(),0);
      await page.locator('#question').fill('<img src=x onerror="window.HACKED=true">');await page.locator('#send-button').click();await finished();
      assert.equal(await page.evaluate(()=>window.HACKED),undefined);
      assert.match(await lastAnswer().innerText(),/prototype dùng từ khoá/);
    });
    await t.test('daytime fixture and provisional policy, no FAQ publish action',async()=>{
      await page.locator('#demo-time').selectOption('21:10');assert.match(await page.locator('#ta-status').innerText(),/Trong giờ/);
      await page.locator('[data-action="policy"]').first().click();assert.match(await page.locator('#info-dialog').innerText(),/PROVISIONAL/);
      assert.match(await page.locator('#info-dialog').innerText(),/Cần TA \/ giảng viên phê duyệt/);await page.keyboard.press('Escape');
      await page.locator('#demo-time').selectOption('22:30');
    });
    await t.test('responsive desktop/tablet/mobile, source and TA controls work on mobile',async()=>{
      for(const width of [1440,1024,768,390,320]){
        await page.setViewportSize({width,height:width<600?844:1000});
        const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
        assert.equal(overflow,false,`overflow at ${width}`);
      }
      await page.setViewportSize({width:390,height:844});await scenario('source-error');
      assert.equal(await page.locator('#sidebar').evaluate(el=>el.inert),true,'closed mobile navigation must not be tabbable');
      await lastAnswer().locator('[data-source="3.3"]').click();await page.keyboard.press('Escape');
      await lastAnswer().locator('[data-action="ta"]').click();assert.equal(await page.locator('#ta-dialog').isVisible(),true);
      assert.equal(await page.evaluate(()=>document.getElementById('ta-dialog').scrollWidth>document.getElementById('ta-dialog').clientWidth),false);
      await page.keyboard.press('Escape');
      await page.locator('[data-action="menu"]').click();assert.equal(await page.locator('.sidebar.open').count(),1);
      await page.keyboard.press('Escape');assert.equal(await page.locator('.sidebar.open').count(),0);
    });
    await t.test('waiting requests survive pruning of old withdrawn history',async()=>{
      const extra=await browser.newPage({viewport:{width:1440,height:1000}});
      const records=Array.from({length:20},(_,i)=>({id:`MOCK-${String(i+1).padStart(3,'0')}`,question:'Câu hỏi fixture',sources:['3.3'],evidence:'Cần xác minh',clock:'22:30',simulated:true,status:i===0?'waiting':'withdrawn'}));
      await extra.goto(url+'/index.html');await extra.evaluate(records=>localStorage.setItem('studyflow-ta-fixture-v1',JSON.stringify(records)),records);await extra.reload();
      await extra.locator('[data-scenario="source-error"]').click();await extra.waitForFunction(()=>!document.getElementById('conversation').hasAttribute('aria-busy'));
      await extra.locator('[data-action="ta"]').click();await extra.locator('#ta-consent').check();await extra.locator('#confirm-ta').click();
      assert.equal(await extra.locator('#queue-count').innerText(),'2');await extra.reload();assert.equal(await extra.locator('#queue-count').innerText(),'2');
      await extra.close();
    });
    await t.test('FAQ comparison really drafts, approves, rejects, blocks and removes mock publication',async()=>{
      await page.setViewportSize({width:1440,height:1000});await scenario('source-error');
      await page.locator('#autonomy-panel summary').first().click();
      await page.locator('[data-autonomy="variant"][data-variant="1"]').click();
      await page.locator('[data-autonomy="manual"]').click();assert.equal(await page.locator('#faq-draft').isVisible(),true);
      assert.equal(await page.locator('.trace-item').filter({hasText:'dang_FAQ'}).count(),0,'manual-report option must not call FAQ tool');
      await page.locator('[data-autonomy="variant"][data-variant="2"]').click();
      await page.locator('[data-autonomy="faq-request"]').click();assert.match(await page.locator('.approval-card').innerText(),/awaiting_approval/);
      assert.doesNotMatch(await page.locator('.approval-card').innerText(),/published_mock/);
      if(!await page.locator('body').evaluate(el=>el.classList.contains('show-annotations')))await page.locator('[data-action="annotations"]').click();
      assert.equal(await page.locator('.approval-card [data-mark="4"]').isVisible(),true);
      await page.locator('#autonomy-panel').screenshot({path:path.join(root,'screenshots/02-autonomy.png')});
      await page.setViewportSize({width:390,height:844});
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'approval annotations stay inside mobile viewport');
      await page.setViewportSize({width:1440,height:1000});
      await page.locator('[data-autonomy="reject"]').click();assert.match(await page.locator('.approval-card').innerText(),/rejected/);
      await page.locator('[data-autonomy="faq-request"]').click();await page.locator('[data-autonomy="approve"]').click();assert.match(await page.locator('.approval-card').innerText(),/published_mock/);
      await page.locator('[data-autonomy="undo"]').click();assert.match(await page.locator('.approval-card').innerText(),/unpublished_mock/);assert.match(await page.locator('.approval-card').innerText(),/không được thu hồi/);
      await page.locator('[data-autonomy="faq-bypass"]').click();assert.match(await page.locator('.approval-card').innerText(),/denied/);
      await page.locator('[data-autonomy="variant"][data-variant="3"]').click();await page.locator('[data-autonomy="faq-request"]').click();assert.match(await page.locator('.approval-card').innerText(),/published_mock/);assert.match(await page.locator('#autonomy-content').innerText(),/GIẢ ĐỊNH BỊ LOẠI|giả định bị loại/);
      await page.locator('[data-autonomy="undo"]').click();
      await page.locator('[data-autonomy="variant"][data-variant="2"]').click();await page.locator('[data-autonomy="faq-request"]').click();
      await page.locator('[data-action="reset"]').click();
      assert.equal(await page.locator('[data-autonomy="approve"]').count(),0,'new conversation cancels old pending FAQ');
    });
    await t.test('TA may approve a safe hint, never an answer; rejected hint can be requested again',async()=>{
      await scenario('exercise');
      await page.locator('[data-autonomy="variant"][data-variant="2"]').click();
      await page.locator('[data-action="hint"]').click();
      assert.match(await page.locator('.approval-card').innerText(),/awaiting_approval/);
      await page.locator('[data-autonomy="reject"]').click();assert.equal(await page.locator('[data-action="hint"]').isDisabled(),false);
      await page.locator('[data-action="hint"]').click();await page.locator('[data-autonomy="approve"]').click();
      assert.equal(await page.locator('[data-action="hint"]').isDisabled(),true);assert.doesNotMatch(await lastAnswer().innerText(),/11[.,]5|15[.,]25|đáp án là trung vị/);
      await scenario('exercise');await page.locator('[data-autonomy="variant"][data-variant="3"]').click();assert.equal(await page.locator('[data-action="hint"]').isDisabled(),true);
      assert.match(await page.locator('#autonomy-content').innerText(),/open_assignment|Hard guardrail/);
      await lastAnswer().locator('[data-action="edit"]').click();await page.locator('#question').fill('Tôi muốn hỏi về phương sai');await page.locator('#send-button').click();await finished();
      await lastAnswer().locator('[data-action="undo"]').click();
      assert.equal(await page.locator('[data-action="hint"]').isDisabled(),true,'undo restores exercise comparison policy');
      await page.locator('[data-autonomy="variant"][data-variant="2"]').click();
      await page.locator('#question').fill('Bài 3 câu b cần hiểu ngoại lai');await page.locator('#send-button').click();await finished();
      await page.locator('[data-autonomy="hint-support"]').click();await page.locator('[data-autonomy="approve"]').click();
      assert.equal(await page.evaluate(()=>StudyFlowAutonomy.state.actions.filter(a=>a.status==='awaiting_approval').length),0,'replacement guidance leaves no orphan approval');
    });
    await t.test('reset clears simulated activity and pending work and both scenarios can replay',async()=>{
      await page.locator('[data-autonomy="reset"]').click();assert.equal(await page.locator('.trace-item').count(),0);assert.equal(await page.locator('#queue-count').innerText(),'0');
      await scenario('source-error');assert.match(await lastAnswer().innerText(),/0,25/);
      await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      await scenario('exercise');assert.match(await lastAnswer().innerText(),/không cung cấp hoặc xác nhận/);
      await page.setViewportSize({width:1440,height:1000});
    });
    await t.test('landing renders, pauses, respects reduced motion and links to app',async()=>{
      await page.setViewportSize({width:1440,height:900});await page.goto(url+'/landing.html');await page.waitForTimeout(1500);
      assert.equal(await page.locator('body').evaluate(el=>el.classList.contains('gl-ready')),true);
      await page.locator('#pause').click();assert.equal(await page.locator('#pause').getAttribute('aria-pressed'),'true');
      for(const width of [1440,1024,768,390,320]){await page.setViewportSize({width,height:width<600?844:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`landing overflow ${width}`);}
      await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>document.getElementById('pause').disabled);assert.equal(await page.locator('#pause').isDisabled(),true);
      assert.equal(await page.locator('h1').evaluate(el=>getComputedStyle(el).opacity),'1');
      await page.locator('.hero-cta').click();assert.match(page.url(),/index.html$/);
    });
    await t.test('Flowstate theme and bilingual controls persist without clearing consent or work',async()=>{
      await page.setViewportSize({width:1440,height:1000});await page.goto(url+'/index.html');
      assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
      await page.locator('#language-toggle').click();assert.equal(await page.locator('html').getAttribute('lang'),'en');
      assert.match(await page.locator('h1').innerText(),/Descriptive statistics/);
      await scenario('source-error');assert.match(await lastAnswer().innerText(),/counterexample/i);
      assert.match(await lastAnswer().innerText(),/cause/i);
      await lastAnswer().locator('[data-action="ta"]').click();assert.match(await page.locator('#ta-dialog-title').innerText(),/Review/);
      assert.match(await page.locator('#ta-question').inputValue(),/Please verify/);
      await page.locator('#ta-consent').check();await page.keyboard.press('Escape');
      const originalVietnamese='Tài liệu §3.3 nói độ lệch chuẩn luôn nhỏ hơn phương sai, đúng không?';
      await page.locator('#question').fill(originalVietnamese);await page.locator('#send-button').click();await finished();
      await lastAnswer().locator('[data-action="ta"]').click();
      assert.equal((await page.locator('#ta-question').inputValue()).endsWith(originalVietnamese),true,'the generated summary may translate; the student question must stay verbatim');
      await page.keyboard.press('Escape');
      await page.locator('#theme-toggle').click();assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
      await page.locator('#question').fill(' ');await page.locator('#question-form').evaluate(form=>form.requestSubmit());
      const errorContrast=await page.locator('#form-error').evaluate(el=>{const fg=getComputedStyle(el).color.match(/[\d.]+/g).slice(0,3).map(Number);const bg=getComputedStyle(document.body).backgroundColor.match(/[\d.]+/g).slice(0,3).map(Number);const luminance=c=>c.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);return (Math.max(luminance(fg),luminance(bg))+.05)/(Math.min(luminance(fg),luminance(bg))+.05);});
      assert.ok(errorContrast>=4.5,`light-mode error contrast ${errorContrast}`);
      await page.reload();assert.equal(await page.locator('html').getAttribute('data-theme'),'light');assert.equal(await page.locator('html').getAttribute('lang'),'en');
      await scenario('exercise');assert.match(await lastAnswer().innerText(),/cannot provide or confirm/);
      await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      await page.locator('#language-toggle').click();await page.locator('#theme-toggle').click();
    });
    await t.test('the team’s separate case-2 URL opens the integrated guarded flow',async()=>{
      await page.evaluate(()=>localStorage.setItem('studyflow-language','vi'));
      await page.goto(url+'/index-ca2.html');await page.waitForURL('**/index.html#exercise');await finished();
      assert.match(await lastAnswer().innerText(),/không cung cấp hoặc xác nhận/);
      assert.doesNotMatch(await lastAnswer().innerText(),/11[.,]5|15[.,]25/);
    });
    await t.test('direct file protocol works without server; WebGL-disabled landing has fallback',async()=>{
      await page.goto(pathToFileURL(path.join(root,'index.html')).href);await scenario('source-error');assert.match(await lastAnswer().innerText(),/0,25/);
      const context=await browser.newContext({viewport:{width:390,height:844}});
      await context.addInitScript(()=>{HTMLCanvasElement.prototype.getContext=function(){return null;};});
      const fallback=await context.newPage();await fallback.goto(pathToFileURL(path.join(root,'landing.html')).href);
      assert.equal(await fallback.locator('body').evaluate(el=>el.classList.contains('gl-ready')),false);
      assert.notEqual(await fallback.locator('.ink-fallback').evaluate(el=>getComputedStyle(el).backgroundImage),'none');
      await context.close();
    });
    assert.deepEqual(errors,[],'browser JS errors');
    // After file:// check, file asset requests are expected; no external service may be called.
    assert.deepEqual(unexpected.filter(u=>!u.startsWith('file:')),[],'unexpected network requests');
  }finally{await browser.close();await new Promise(r=>server.close(r));}
});
