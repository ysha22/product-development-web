const {test}=require('node:test');
const assert=require('node:assert/strict');
const {loader}=require('./loader.cjs');
const load=loader();
const {DEMO_REPORT:demo}=load('src/data/mockData.ts');
const {calculateFinancial}=load('src/utils/financial.ts');
const {validate,parseChunk}=load('src/services/validation.ts');
const {describeApiError,redactApiError}=load('src/services/apiErrors.ts');
const inputs=demo.part9.inputs;
test('Full costs accounted for, with no revenue or discount',()=>{
 const r=calculateFinancial({...inputs,expectedPrice:0,discountRate:0,developmentCost:100,clinicalCost:20,regulatoryCost:10,cmcCost:30,launchCost:40,marketingCost:100},2026);
 assert.equal(r.npv,-300); assert.equal(r.yearlyData[0].developmentCost,-160);
 assert.equal(r.irr,undefined);
});
test('Price, margin, discount and launch date affect NPV',()=>{
 const base=calculateFinancial(inputs,2026);
 for (const [key,value] of [['expectedPrice',inputs.expectedPrice*1.5],['grossMargin',inputs.grossMargin-20],['discountRate',inputs.discountRate+10],['launchYear',inputs.launchYear+2]]) {
   assert.notEqual(calculateFinancial({...inputs,[key]:value},2026).npv,base.npv,key);
 }
 assert.equal(base.scenarios.find(x=>x.name==='Base').npv,base.npv);
 assert.equal(base.inputs.manufacturingCostRatio,100-base.inputs.grossMargin);
});
test('Input bounds prevent invalid probabilities and infinite values',()=>{
 assert.throws(()=>calculateFinancial({...inputs,expectedPrice:Infinity}),/유한/);
 const r=calculateFinancial({...inputs,marketShare:150,grossMargin:-3,probabilityByStage:{...inputs.probabilityByStage,phase1:3}},2026);
 assert.equal(r.inputs.marketShare,100);assert.equal(r.inputs.grossMargin,0);assert.equal(r.inputs.probabilityByStage.phase1,1);
});
test('Malformed, empty, null and enum-invalid AI responses rejected',()=>{
 assert.throws(()=>parseChunk('null'),/JSON/);
 assert.throws(()=>validate('ProductInfo',{}),/JSON/);
 assert.throws(()=>validate('ProductInfo',{...demo.part2,patents:null}),/JSON/);
 assert.throws(()=>validate('Part10Conclusion',{...demo.part10,decision:'YES'}),/JSON/);
 assert.throws(()=>validate('Part11References',{references:[{id:1,category:'other',title:'x',source:'x',url:'javascript:alert(1)'}]}),/JSON/);
});
test('Daily quota explanation overrides short retry delay and hides key',()=>{
 const text=describeApiError('{"quotaId":"GenerateRequestsPerDayPerProjectPerModel-FreeTier","quotaValue":"20","retryDelay":"42s"}');
 assert.match(text,/일일/);assert.match(text,/20회/);assert.match(text,/초기화되지/);
 assert.equal(redactApiError('key=secret','secret'),'key=[API KEY 숨김]');
});
function responses() {
 return [{...demo.part2,innName:'Semaglutide',brandName:'New drug',part1:demo.part1},{part3:demo.part3,part4:demo.part4},{part5:demo.part5,part6:demo.part6},{part7:demo.part7,part8:demo.part8},{part9inputs:demo.part9.inputs,part10:demo.part10,part11:demo.part11,riskPanel:demo.riskPanel}];
}
test('Report assembly has no inherited demo sources, IRR or sensitivity',async()=>{
 const queue=responses();let calls=0;
 const service=loader({'@google/genai':{GoogleGenAI:class {models={generateContent:async()=>({text:JSON.stringify(queue[calls++])})};}}})('src/services/aiService.ts');
 const r=await service.fetchDrugReport('Semaglutide','generic','fake',()=>{});
 assert.equal(calls,5);assert.equal(r.part2.innName,'Semaglutide');assert.equal(r.isDemoData,false);
 assert.equal(r.part9.irr,undefined);assert.equal(Object.keys(r.sources).length,0);
 assert.equal(r.input.indication,r.part1.targetProductProfile.indication);
 assert.equal(r.part6.expectedLaunchYear,r.part9.inputs.launchYear);
 assert.equal(r.part4.trials[0].refIds.length,0);
 assert.notEqual(r.part5.globalMarketLatest.status,'actual');
});
test('429 in step 3 resumes only remaining requests',async()=>{
 const queue=responses();let calls=0;let fail=true;let index=0;
 const service=loader({'@google/genai':{GoogleGenAI:class {models={generateContent:async()=>{
   calls++;if(index===2&&fail){fail=false;throw new Error('429 GenerateRequestsPerDayPerProjectPerModel-FreeTier');}
   return {text:JSON.stringify(queue[index++])};
 }};}}})('src/services/aiService.ts');
 const cp={query:'drug',devType:'generic',chunks:[]};
 await assert.rejects(service.fetchDrugReport('drug','generic','fake',()=>{},cp),/429/);
 assert.equal(cp.chunks.length,2);assert.equal(calls,3);
 await service.fetchDrugReport('drug','generic','fake',()=>{},cp);
 assert.equal(calls,6);
});
test('Empty first response fails before report completion and is not cached',async()=>{
 let calls=0;const cp={query:'x',devType:'generic',chunks:[]};
 const service=loader({'@google/genai':{GoogleGenAI:class {models={generateContent:async()=>{calls++;return {text:'{}'};}};}}})('src/services/aiService.ts');
 await assert.rejects(service.fetchDrugReport('x','generic','fake',()=>{},cp),/JSON/);
 assert.equal(calls,1);assert.equal(cp.chunks.length,0);
});

test('App financial edit updates report passed to summary, charts and Excel',async()=>{
 const React=require('react');const slots=[];let cursor=0;let exported;
 const fakeReact={...React,
   useState(initial){const i=cursor++;if(!(i in slots))slots[i]=typeof initial==='function'?initial():initial;return [slots[i],v=>{slots[i]=typeof v==='function'?v(slots[i]):v;}];},
   useRef(initial){const i=cursor++;return slots[i]??(slots[i]={current:initial});},useCallback:fn=>fn};
 const App=loader({'react':fakeReact,'./utils/exportUtils':{exportPDF:()=>{},exportExcel:r=>{exported=r;}}})('src/App.tsx').default;
 const render=()=>{cursor=0;return App();};
 function find(node,name){if(!node||typeof node!=='object')return; if(node.type?.name===name)return node;for(const child of [node.props?.children].flat(Infinity)){const match=find(child,name);if(match)return match;}}
 render().props.onLoadDemo();
 let tree=render();const before=find(tree,'Part9Financial').props.report.part9.npv;
 find(tree,'Part9Financial').props.onInputChange({...inputs,expectedPrice:inputs.expectedPrice*2});
 tree=render();const updated=find(tree,'Part9Financial').props.report;
 assert.notEqual(updated.part9.npv,before);
 assert.equal(find(tree,'ExecutiveSummary').props.report.part9.npv,updated.part9.npv);
 find(tree,'TopBar').props.onExportExcel();assert.equal(exported.part9.npv,updated.part9.npv);
});

test('Excel workbook contains recalculated NPV and cashflows',async()=>{
 const XLSX=require('xlsx');let workbook;
 const {exportExcel}=loader({'xlsx':{...XLSX,writeFile:wb=>{workbook=wb;}}})('src/utils/exportUtils.ts');
 const report={...demo,part9:calculateFinancial({...inputs,expectedPrice:inputs.expectedPrice*2},2026)};
 await exportExcel(report);
 const rows=XLSX.utils.sheet_to_json(workbook.Sheets['Executive Summary'],{header:1});
 assert.equal(rows.find(r=>r[0]==='NPV (Base):')[1],`₩${report.part9.npv.toLocaleString()}억`);
 const cash=XLSX.utils.sheet_to_json(workbook.Sheets['NPV Model'],{header:1});
 assert.equal(cash.at(-1).at(-1),report.part9.npv);
});
