/* Optional offline preparation. Reads a local key; never starts a server. */
'use strict';
const fs=require('node:fs');const path=require('node:path');
const allowed={case5_1:['root','units','cause'],case5_2:['root','units','cause'],case5_3:['root','units','cause'],case2_1:['ordering','outliers','method'],case2_2:['ordering','outliers','method'],case2_3:['ordering','outliers','method']};
function validate(value){
 if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).length!==6)throw Error('Invalid workflow profile. Existing demo was not changed.');
 for(const [key,values] of Object.entries(allowed))if(!Object.hasOwn(value,key)||!values.includes(value[key]))throw Error('Out-of-workflow choice. Existing demo was not changed.');
 return Object.fromEntries(Object.keys(allowed).map(key=>[key,value[key]]));
}
async function generate({apiKey,model='gpt-6-luna',fetchFn=fetch}){
 if(!apiKey?.trim())throw Error('Fill OPENAI_API_KEY in the repository .env file, then run again.');
 const schema={type:'object',properties:Object.fromEntries(Object.entries(allowed).map(([key,values])=>[key,{type:'string',enum:values}])),required:Object.keys(allowed),additionalProperties:false};
 const body={model,store:false,reasoning:{effort:'none'},max_output_tokens:300,tools:[],instructions:'Choose one safe follow-up focus for each fixed StudyFlow workflow. Return only the requested JSON schema. Case5: a false universal claim in section3.3; variance0.25 gives standard deviation0.5; editing cause unknown. Options1 student reports,2 instructor approves FAQ,3 rejected auto-publication hypothesis. Case2 is an OPEN assignment: never solve, calculate or confirm its answer. Options1 bounded hints,2 safe guidance review,3 forbidden solution. Only choose a focus from approved IDs. You cannot change policies, perform actions, edit sources, publish FAQ or contact a TA.',input:'Prepare a varied follow-up profile for the six comparison screens. Case5: favor independent verification for manual reporting, units or root for review, editing cause for the rejected hypothesis. Case2: favor method and ordering before outlier analysis. No learner data is provided.',text:{format:{type:'json_schema',name:'studyflow_workflow',strict:true,schema}}};
 let response;
 try{response=await fetchFn('https://api.openai.com/v1/responses',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+apiKey.trim()},signal:AbortSignal.timeout(25000),body:JSON.stringify(body)});}
 catch{throw Error('Cannot reach OpenAI or request timed out. Existing static demo is unchanged.');}
 if(!response.ok)throw Error(`OpenAI HTTP ${response.status}. Check key access, model access and quota; existing demo is unchanged.`);
 const data=await response.json();if(data.status&&data.status!=='completed')throw Error('Luna did not complete the workflow. Existing demo is unchanged.');
 const raw=(data.output||[]).filter(item=>item.type==='message').flatMap(item=>item.content||[]).filter(c=>c.type==='output_text').map(c=>c.text).join('');
 let choices;try{choices=validate(JSON.parse(raw));}catch{throw Error('Luna output failed the workflow guard. Existing demo is unchanged.');}
 return {model,generatedAt:new Date().toISOString(),choices};
}
function renderHtml(template,profile){
 validate(profile.choices);
 const safe=JSON.stringify(profile).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
 if(!template.includes('</head>'))throw Error('Invalid StudyFlow template.');
 return template.replace('</head>',`<script>window.StudyFlowGenerated=${safe};</script>\n</head>`);
}
module.exports={generate,validate,renderHtml};
if(require.main===module)(async()=>{
 const envFile=path.join(__dirname,'..','.env');if(fs.existsSync(envFile))process.loadEnvFile(envFile);
 const result=await generate({apiKey:process.env.OPENAI_API_KEY,model:process.env.OPENAI_MODEL||'gpt-6-luna'});
 const html=renderHtml(fs.readFileSync(path.join(__dirname,'index.html'),'utf8'),result);
 const output=path.join(__dirname,'luna-demo.html'),temp=output+'.tmp';fs.writeFileSync(temp,html);fs.renameSync(temp,output);
 console.log('Created luna-demo.html. No key is included. Open the file to demo offline.');
})().catch(error=>{console.error(error.message);process.exitCode=1;});
