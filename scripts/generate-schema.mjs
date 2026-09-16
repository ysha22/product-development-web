import ts from 'typescript';
import fs from 'node:fs';
const file = 'src/types/index.ts';
const program = ts.createProgram([file], {strictNullChecks:true});
const checker = program.getTypeChecker();
const source = program.getSourceFile(file);
function schema(t) {
  if (t.isUnion()) {
    if (t.types.some(x=>x.flags & ts.TypeFlags.Null)) {
      const nonNull=t.types.filter(x=>!(x.flags & (ts.TypeFlags.Null | ts.TypeFlags.Undefined)));
      if(nonNull.length===1) return {...schema(nonNull[0]),nullable:true};
    }
    const members = t.types.filter(x => !(x.flags & ts.TypeFlags.Undefined));
    if (members.every(x => x.isStringLiteral())) return {type:'string',enum:members.map(x=>x.value)};
    if (members.every(x => x.flags & ts.TypeFlags.BooleanLiteral)) return {type:'boolean'};
    if (members.length === 1) return schema(members[0]);
    throw Error('Unsupported union '+checker.typeToString(t));
  }
  if (t.flags & ts.TypeFlags.StringLike) return {type:'string'};
  if (t.flags & ts.TypeFlags.NumberLike) return {type:'number'};
  if (t.flags & ts.TypeFlags.BooleanLike) return {type:'boolean'};
  if (checker.isArrayType(t)) return {type:'array',items:schema(checker.getTypeArguments(t)[0])};
  const index = t.getStringIndexType();
  if (index) return {type:'object',properties:{},required:[],additionalProperties:schema(index)};
  const properties = {}, required = [];
  for (const p of t.getProperties()) {
    properties[p.name] = schema(checker.getTypeOfSymbolAtLocation(p, p.valueDeclaration));
    if (!(p.flags & ts.SymbolFlags.Optional)) required.push(p.name);
  }
  return {type:'object',properties,required};
}
const names = ['ReportData','ProductInfo','Part1Overview','Part3Academic','Part4Clinical','Part5Market','Part6Patent','Part7Pricing','Part8Regulatory','NPVInputs','Part10Conclusion','Part11References','RiskPanel'];
const result = {};
for (const name of names) {
 const node = source.statements.find(n=>n.name?.text===name);
 result[name] = schema(checker.getTypeAtLocation(node));
}
fs.writeFileSync('src/services/reportSchema.json', JSON.stringify(result,null,2)+'\n');
