import schemas from './reportSchema.json';

interface Schema {
  type: string;
  nullable?: boolean;
  enum?: string[];
  properties?: Record<string, Schema>;
  required?: string[];
  items?: Schema;
  additionalProperties?: Schema;
}

function check(value: unknown, schema: Schema, path: string): unknown {
  if (value === null && schema.nullable) return null;
  const fail = () => { throw new Error(`AI 응답 JSON 형식 오류: ${path}`); };
  if (schema.type === 'array') {
    if (!Array.isArray(value)) return fail();
    return value.map((item, i) => check(item, schema.items!, `${path}[${i}]`));
  }
  if (schema.type === 'object') {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return fail();
    const input = value as Record<string, unknown>;
    const output: Record<string, unknown> = {};
    for (const [key, child] of Object.entries(schema.properties!)) {
      if (input[key] == null && !schema.required!.includes(key)) continue;
      output[key] = check(input[key], child, `${path}.${key}`);
    }
    if (schema.additionalProperties) {
      for (const [key, item] of Object.entries(input)) {
        if (['__proto__','constructor','prototype'].includes(key)) continue;
        output[key] = check(item, schema.additionalProperties, `${path}.${key}`);
      }
    }
    return output;
  }
  if (typeof value !== schema.type || (schema.enum && !schema.enum.includes(value as string))) return fail();
  if (typeof value === 'number' && !Number.isFinite(value)) return fail();
  if (typeof value === 'string' && /(?:url)$/i.test(path) && value && !/^https?:\/\//i.test(value)) return fail();
  return value;
}

export function validate<T>(name: keyof typeof schemas, value: unknown): T {
  return check(value, schemas[name], name) as T;
}

export function parseChunk(raw: string): Record<string, unknown> {
  const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  let value: unknown;
  try { value = JSON.parse(cleaned); }
  catch { throw new Error('AI 응답 JSON을 해석할 수 없습니다.'); }
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('AI 응답 JSON은 객체여야 합니다.');
  return value as Record<string, unknown>;
}
