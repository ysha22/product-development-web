const {test}=require('node:test');
const assert=require('node:assert/strict');
const {loader}=require('./loader.cjs');
const React=require('react');
const load=loader();
const {DEMO_REPORT:demo}=load('src/data/mockData.ts');
const storage=load('src/services/reportStorage.ts');
const report={...structuredClone(demo),id:'saved-drug',isDemoData:false};
function memory(){const data=new Map();return {data,getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)};}
function walk(node,predicate){if(!node||typeof node!=='object')return; if(predicate(node))return node;for(const child of [node.props?.children].flat(Infinity)){const found=walk(child,predicate);if(found)return found;}}
function text(node){if(node==null||typeof node==='boolean')return '';if(typeof node==='string'||typeof node==='number')return String(node);return [node?.props?.children].flat(Infinity).map(text).join('');}
function harness(file,name,props,overrides={},globals={}){
 const slots=[];let cursor=0;
 const react={...React,useState(initial){const i=cursor++;if(!(i in slots))slots[i]=typeof initial==='function'?initial():initial;return [slots[i],v=>{slots[i]=typeof v==='function'?v(slots[i]):v;}];},useRef(initial){const i=cursor++;return slots[i]??(slots[i]={current:initial});},useCallback:fn=>fn};
 const Component=loader({...overrides,react},globals)(file)[name];
 return ()=>{cursor=0;return Component(props);};
}
const button=(tree,label)=>walk(tree,n=>n.type==='button'&&text(n)===label);
const input=(tree,label)=>walk(walk(tree,n=>n.type==='label'&&text(n).startsWith(label)),n=>n.type==='input');
test('JSON roundtrip retains all report sections and edited financial data, excludes keys',()=>{
 const financial=load('src/utils/financial.ts').calculateFinancial({...report.part9.inputs,expectedPrice:20000000},2026);
 const encoded=storage.encodeReport({...report,part9:financial,apiKey:'sk-do-not-export',settings:{apiKey:'other-secret'}});
 const restored=storage.decodeReport(encoded);
 assert.equal(restored.part9.npv,financial.npv);assert.equal(restored.part4.trials.length,report.part4.trials.length);
 assert.equal(Object.keys(restored.sources).length,Object.keys(report.sources).length);
 assert.ok(!encoded.includes('sk-do-not-export'));assert.ok(!encoded.includes('other-secret'));
 assert.equal(restored.isDemoData,false);
});
test('Corrupt, unsupported, oversize and unsafe link imports are rejected',()=>{
 assert.throws(()=>storage.decodeReport('{'),/JSON/);
 assert.throws(()=>storage.decodeReport(JSON.stringify({format:'PharmaDD',version:2,report})),/버전/);
 assert.throws(()=>storage.decodeReport(JSON.stringify({format:'PharmaDD',version:1,report:{}})),/손상/);
 assert.throws(()=>storage.decodeReport(' '.repeat(5*1024*1024+1)),/5MB/);
 const bad=structuredClone(report);bad.part11.references[0].url='javascript:alert(1)';
 assert.throws(()=>storage.decodeReport(JSON.stringify({format:'PharmaDD',version:1,report:bad})),/손상/);
});
test('Library persists across sessions; searches distinguish drug, dev type and demo',()=>{
 const localStorage=memory();const a=loader({}, {localStorage})('src/services/reportStorage.ts');
 const entries=a.upsertReport([],report,'TAGRISSO');assert.equal(a.writeLibrary(entries),'');
 const b=loader({}, {localStorage})('src/services/reportStorage.ts');const read=b.readLibrary();assert.equal(read.warning,'');
 assert.equal(b.findSavedReport(read.entries,'  osimertinib  ',report.input.developmentType).id,report.id);
 assert.equal(b.findSavedReport(read.entries,'tagrisso',report.input.developmentType).id,report.id);
 assert.equal(b.findSavedReport(read.entries,'Semaglutide',report.input.developmentType),undefined);
 assert.equal(b.findSavedReport(read.entries,'Osimertinib','generic'),undefined);
 assert.equal(b.findSavedReport([{query:'Osimertinib',report:demo}],'Osimertinib',demo.input.developmentType),undefined);
});
test('Failed persistence retains previous library and reports warning',()=>{
 const localStorage=memory();const a=loader({}, {localStorage})('src/services/reportStorage.ts');
 a.writeLibrary([{query:'drug',report}]);const before=localStorage.getItem('pharmadd_reports_v1');
 localStorage.setItem=()=>{throw Error('QuotaExceededError');};
 assert.match(a.writeLibrary([]),/저장/);assert.equal(localStorage.getItem('pharmadd_reports_v1'),before);
 localStorage.data.set('pharmadd_reports_v1','broken');assert.match(a.readLibrary().warning,/읽을/);
 assert.match(a.writeLibrary([]),/덮어쓰지/);
});
test('Saved report opens without API; new drug enters setup without API',()=>{
 let opened,requests=0;const render=harness('src/components/input/SearchForm.tsx','SearchForm',{entries:[{query:'Osimertinib',report}],notice:'',onOpen:r=>{opened=r;},onLoadDemo:()=>{},onSearch:()=>requests++});
 let tree=render();input(tree,'성분명').props.onChange({target:{value:'Osimertinib'}});tree=render();walk(tree,n=>n.type==='form').props.onSubmit({preventDefault(){}});assert.equal(opened.id,report.id);assert.equal(requests,0);
 input(tree,'성분명').props.onChange({target:{value:'Semaglutide'}});tree=render();walk(tree,n=>n.type==='form').props.onSubmit({preventDefault(){}});tree=render();assert.equal(walk(tree,n=>n.type?.name==='AnalysisSetup').props.query,'Semaglutide');assert.equal(requests,0);
});
test('Provider selection clears key; API only dispatched after final confirmation',()=>{
 const calls=[];const render=harness('src/components/input/AnalysisSetup.tsx','AnalysisSetup',{query:'Semaglutide',devType:'generic',onConfirm:x=>calls.push(x),onCancel:()=>{}});
 let tree=render();input(tree,'Gemini').props.onChange({target:{value:'google-secret'}});tree=render();walk(tree,n=>n.type==='select').props.onChange({target:{value:'openai'}});tree=render();assert.equal(input(tree,'GPT').props.value,'');
 input(tree,'GPT').props.onChange({target:{value:'sk-test'}});tree=render();walk(tree,n=>n.type==='form').props.onSubmit({preventDefault(){}});tree=render();assert.equal(calls.length,0);assert.ok(!text(tree).includes('sk-test'));
 button(tree,'설정 수정').props.onClick();tree=render();assert.equal(calls.length,0);walk(tree,n=>n.type==='form').props.onSubmit({preventDefault(){}});tree=render();button(tree,'분석 진행').props.onClick();
 assert.equal(calls.length,1);assert.equal(calls[0].provider,'openai');assert.equal(calls[0].apiKey,'sk-test');
});
test('GPT adapter uses Responses API and extracts message text',async()=>{
 let request;const {callProvider}=loader({}, {fetch:async(url,options)=>{request={url,options};return {ok:true,json:async()=>({status:'completed',output:[{type:'reasoning'},{type:'message',content:[{type:'output_text',text:'{"ok":true}'}]}]})};}})('src/services/providers.ts');
 const text=await callProvider({provider:'openai',model:'gpt-4.1-mini',apiKey:'sk-test'},'Return JSON','drug');
 assert.equal(text,'{"ok":true}');assert.equal(request.url,'https://api.openai.com/v1/responses');assert.equal(request.options.headers.Authorization,'Bearer sk-test');assert.equal(JSON.parse(request.options.body).store,false);
});
test('Claude adapter uses Messages API, browser headers, and rejects truncated output',async()=>{
 let request;let truncated=false;const {callProvider}=loader({}, {fetch:async(url,options)=>{request={url,options};return {ok:true,json:async()=>({stop_reason:truncated?'max_tokens':'end_turn',content:[{type:'text',text:'{}'}]})};}})('src/services/providers.ts');
 const settings={provider:'anthropic',model:'claude-sonnet-4-6',apiKey:'claude-test'};
 assert.equal(await callProvider(settings,'JSON','drug'),'{}');assert.equal(request.url,'https://api.anthropic.com/v1/messages');assert.equal(request.options.headers['x-api-key'],'claude-test');assert.equal(request.options.headers['anthropic-dangerous-direct-browser-access'],'true');assert.equal(JSON.parse(request.options.body).model,settings.model);
 truncated=true;await assert.rejects(callProvider(settings,'JSON','drug'),/한도/);
});
test('Provider errors stop after one request without automatic retries',async()=>{
 let calls=0;const {callProvider}=loader({}, {fetch:async()=>{calls++;return {ok:false,status:429,text:async()=>'{"error":"quota"}'};}})('src/services/providers.ts');
 await assert.rejects(callProvider({provider:'openai',model:'gpt-4.1-mini',apiKey:'test'},'JSON','drug'),/429/);assert.equal(calls,1);
});
test('Changing provider or model clears incompatible partial chunks',async()=>{
 const cp={query:'drug',devType:'generic',provider:'gemini',model:'gemini-3.6-flash',chunks:[{bad:true}]};
 let count=0;const {fetchDrugReport}=loader({'./providers':{PROVIDERS:{gemini:{model:'gemini-3.6-flash'}},callProvider:async()=>{count++;throw Error('stop');}}})('src/services/aiService.ts');
 await assert.rejects(fetchDrugReport('drug','generic','test',()=>{},cp,{provider:'openai',model:'gpt-4.1-mini',apiKey:'test'}),/stop/);assert.equal(cp.chunks.length,0);assert.equal(count,1);assert.equal(cp.provider,'openai');
});
