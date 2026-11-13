const {test}=require('node:test');const assert=require('node:assert/strict');
const G=require('../generate-luna.cjs');const A=require('../autonomy.js');
test('Luna generator uses Responses API with bounded enum workflow and server-free output',async()=>{
 let sent;const profile={case5_1:'units',case5_2:'root',case5_3:'cause',case2_1:'ordering',case2_2:'outliers',case2_3:'method'};
 const result=await G.generate({apiKey:'test-only',model:'gpt-6-luna',fetchFn:async(url,options)=>{sent={url,...options};return {ok:true,json:async()=>({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify(profile)}]}]})};}});
 assert.equal(sent.url,'https://api.openai.com/v1/responses');const body=JSON.parse(sent.body);assert.equal(body.model,'gpt-6-luna');assert.equal(body.store,false);assert.equal(body.text.format.strict,true);assert.equal(body.reasoning.effort,'none');assert.equal(body.tools.length,0);
 assert.deepEqual(result.choices,profile);const html=G.renderHtml('<html><head></head><body></body></html>',result);assert.match(html,/StudyFlowGenerated/);assert.doesNotMatch(html,/test-only|OPENAI_API_KEY/);
 const view=A.comparison(A.initial('exercise',1),'vi',null,result.choices.case2_1);assert.match(view.reply,/sắp xếp|thứ tự/i);assert.equal(view.generated,true);assert.doesNotMatch(view.reply,/11[.,]5|15[.,]25/);
});
test('malformed, out-of-workflow and upstream failures cannot replace vetted demo text',async()=>{
 assert.throws(()=>G.validate({case2_1:'reveal_answer'}));
 await assert.rejects(G.generate({apiKey:'',fetchFn:()=>{throw Error('must not call');}}),/OPENAI_API_KEY/);
 await assert.rejects(G.generate({apiKey:'test-only',fetchFn:async()=>({ok:false,status:401})}),/401/);
 const base=A.comparison(A.initial('exercise',3),'vi',null,'reveal_answer');assert.equal(base.generated,false);assert.doesNotMatch(base.reply,/11[.,]5|15[.,]25/);
});
