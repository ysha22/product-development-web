const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
function loader(overrides = {}, globals = {}) {
  const cache = new Map();
  function load(file) {
    file = path.resolve(file);
    if (cache.has(file)) return cache.get(file).exports;
    const m = {exports:{}}; cache.set(file,m);
    const code = ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
    const localRequire = name => {
      if (name in overrides) return overrides[name];
      if (!name.startsWith('.')) return require(name);
      const base=path.resolve(path.dirname(file),name);
      const found=[base,base+'.ts',base+'.tsx',path.join(base,'index.ts')].find(p=>fs.existsSync(p)&&fs.statSync(p).isFile());
      if (found?.endsWith('.json')) return JSON.parse(fs.readFileSync(found,'utf8'));
      return load(found);
    };
    vm.runInNewContext(code,{module:m,exports:m.exports,require:localRequire,setTimeout,clearTimeout,console,structuredClone,Blob,AbortSignal,fetch:()=>{throw Error('Network disabled in tests');},...globals},{filename:file});
    return m.exports;
  }
  return load;
}
module.exports={loader};
