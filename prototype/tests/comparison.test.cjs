/* Counterfactual autonomy QA: recommendation is fixed; selection and output change. */
const {test}=require('node:test');const assert=require('node:assert/strict');
const {chromium}=require('playwright');const {pathToFileURL}=require('node:url');const path=require('node:path');
test('autonomy comparison outputs and compact presentation',{timeout:90000},async t=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const choose=async id=>{await page.locator(`[data-scenario="${id}"]`).click();await page.waitForFunction(()=>!document.getElementById('conversation').hasAttribute('aria-busy'));if(!await page.locator('#autonomy-panel').evaluate(e=>e.open))await page.locator('#autonomy-panel>summary').click();};
 const variant=async n=>page.locator(`[data-autonomy="variant"][data-variant="${n}"]`).click();
 const reply=()=>page.locator('#comparison-output').innerText();
 try{
  await page.goto(pathToFileURL(path.resolve(__dirname,'../index.html')).href);
  await t.test('#5 selection changes output; recommendation remains option2 through review and hypothetical AUTO',async()=>{
   await choose('source-error');assert.equal(await page.locator('[data-recommended="true"]').count(),1,'one fixed recommendation badge');
   assert.equal(await page.locator('[data-recommended="true"]').getAttribute('data-variant'),'2');const baseline=await reply();
   await variant(1);assert.notEqual(await reply(),baseline);assert.equal(await page.locator('[data-recommended="true"]').getAttribute('data-variant'),'2');
   await page.locator('[data-autonomy="manual"]').click();assert.match(await reply(),/bản nháp|Bản nháp/);
   await variant(2);await page.locator('[data-autonomy="faq-request"]').click();assert.match(await reply(),/chờ.*duyệt/i);
   await page.locator('[data-autonomy="approve"]').click();assert.match(await reply(),/đã duyệt/i);
   await page.locator('[data-autonomy="undo"]').click();assert.match(await reply(),/không.*thu hồi/i);
   await variant(3);await page.locator('[data-autonomy="faq-request"]').click();assert.match(await reply(),/giả định bị loại/i);assert.match(await reply(),/mô phỏng/i);
   await page.locator('[data-autonomy="recommended"]').click();assert.equal(await page.locator('[data-autonomy="variant"][aria-pressed="true"]').getAttribute('data-variant'),'2');
  });
  await t.test('#2 all three outputs differ without answers; default badge stays option1',async()=>{
   await choose('exercise');const first=await reply();assert.equal(await page.locator('[data-recommended="true"]').getAttribute('data-variant'),'1');
   await page.locator('[data-autonomy="hint-demo"]').click();assert.match(await reply(),/gợi ý/i);
   await variant(2);assert.notEqual(await reply(),first);await page.locator('[data-autonomy="hint-support"]').click();assert.match(await reply(),/chờ.*duyệt/i);
   await page.locator('[data-autonomy="reject"]').click();assert.match(await reply(),/từ chối/i);
   await variant(3);assert.match(await reply(),/chặn|cấm/i);assert.equal(await page.locator('[data-autonomy="variant"][data-recommended="true"]').getAttribute('data-variant'),'1');
   assert.equal(await page.locator('[data-autonomy="hint-demo"]').count(),0);
   assert.doesNotMatch(await reply(),/11[.,]5|15[.,]25|đáp án là trung vị/i);
  });
  await t.test('diagnostics start collapsed, keyboard and mobile layouts keep output and badge visible',async()=>{
   await choose('source-error');assert.equal(await page.locator('[data-disclosure="tools"]').evaluate(e=>e.open),false);
   assert.equal(await page.locator('.tool-trace').evaluate(e=>e.open),false);
   const height=await page.locator('#autonomy-panel').evaluate(e=>e.getBoundingClientRect().height);assert.ok(height<760,`compact baseline panel ${height}`);
   for(const width of [1440,1024,768,390,320]){await page.setViewportSize({width,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`overflow ${width}`);}
   await page.locator('#language-toggle').click();await page.locator('#theme-toggle').click();
   assert.match(await page.locator('[data-recommended="true"]').innerText(),/Recommended/);await variant(1);assert.match(await reply(),/report|draft/i);
   assert.equal(await page.locator('[data-recommended="true"]').getAttribute('data-variant'),'2');
   assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
  });
  await t.test('optional Luna profile changes only vetted follow-ups in the static workflow',async()=>{
   const profile={model:'gpt-6-luna',choices:{case5_1:'units',case5_2:'root',case5_3:'cause',case2_1:'ordering',case2_2:'outliers',case2_3:'method'}};
   await page.addInitScript(profile=>{window.StudyFlowGenerated=profile;},profile);await page.reload();
   await choose('source-error');assert.match(await page.locator('.generated-badge').innerText(),/Luna/);assert.match(await reply(),/square root|căn bậc hai/);
   await choose('exercise');assert.match(await reply(),/order|thứ tự/);assert.doesNotMatch(await reply(),/11[.,]5|15[.,]25/);
   await variant(3);assert.equal(await page.locator('.generated-badge').count(),0);assert.match(await reply(),/blocked|chặn/i);
  });
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});
