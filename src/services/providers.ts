import { GoogleGenAI } from '@google/genai';

export type AIProvider = 'gemini' | 'openai' | 'anthropic';
export interface AISettings { provider: AIProvider; model: string; apiKey: string }
export const PROVIDERS = {
  gemini: { label:'Gemini (Google)', model:'gemini-3.6-flash', keyUrl:'https://aistudio.google.com/apikey', usageUrl:'https://ai.dev/rate-limit' },
  openai: { label:'GPT (OpenAI)', model:'gpt-4.1-mini', keyUrl:'https://platform.openai.com/api-keys', usageUrl:'https://platform.openai.com/usage' },
  anthropic: { label:'Claude (Anthropic)', model:'claude-sonnet-4-6', keyUrl:'https://platform.claude.com/settings/keys', usageUrl:'https://platform.claude.com/settings/usage' },
} as const;

interface TextBlock { type?: string; text?: string }
interface APIResponse {
  status?: string;
  stop_reason?: string;
  output?: { type?: string; content?: TextBlock[] }[];
  content?: TextBlock[];
}

export async function callProvider(settings: AISettings, system: string, prompt: string): Promise<string> {
  const { provider, model, apiKey } = settings;
  if (!Object.hasOwn(PROVIDERS, provider) || !apiKey.trim() || !model.trim()) throw new Error('API 제공사·모델·키를 확인하세요.');
  if (provider === 'gemini') {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({ model, contents: `${system}\n\n${prompt}`,
      config: { maxOutputTokens: 8192, responseMimeType:'application/json', httpOptions:{ timeout:180000, retryOptions:{ attempts:1 } } } });
    if (response.candidates?.[0]?.finishReason === 'MAX_TOKENS') throw new Error('AI 응답 JSON이 출력 한도로 잘렸습니다.');
    if (!response.text) throw new Error('AI 응답이 비어 있습니다.');
    return response.text;
  }
  const isOpenAI = provider === 'openai';
  const endpoint = isOpenAI ? 'https://api.openai.com/v1/responses' : 'https://api.anthropic.com/v1/messages';
  const headers: Record<string,string> = { 'Content-Type':'application/json' };
  if (isOpenAI) headers.Authorization = `Bearer ${apiKey}`;
  else {
    headers['x-api-key'] = apiKey;
    headers['anthropic-version'] = '2023-06-01';
    headers['anthropic-dangerous-direct-browser-access'] = 'true';
  }
  const body = isOpenAI
    ? { model, instructions:system, input:prompt, max_output_tokens:8192, store:false, text:{ format:{ type:'json_object' } } }
    : { model, system, messages:[{ role:'user', content:prompt }], max_tokens:8192 };
  let response: Response;
  try { response = await fetch(endpoint, { method:'POST', headers, body:JSON.stringify(body), signal:AbortSignal.timeout(180000) }); }
  catch { throw new Error(`${PROVIDERS[provider].label} 네트워크/CORS 또는 요청 시간 초과 오류입니다. 연결 상태와 제공사 계정의 브라우저 접근 허용 여부를 확인하세요.`); }
  if (!response.ok) throw new Error(`${PROVIDERS[provider].label} HTTP ${response.status}: ${await response.text()}`);
  const data = await response.json() as APIResponse;
  if (data.status === 'incomplete' || data.stop_reason === 'max_tokens') throw new Error('AI 응답 JSON이 출력 한도로 잘렸습니다.');
  if (isOpenAI && data.status !== 'completed') throw new Error('GPT 응답이 완료되지 않았습니다.');
  const blocks = isOpenAI ? (data.output ?? []).flatMap(item => item.type === 'message' ? item.content ?? [] : []) : data.content ?? [];
  const text = blocks.filter(block => block.type === (isOpenAI ? 'output_text' : 'text')).map(block => block.text ?? '').join('\n');
  if (!text.trim()) throw new Error('AI 응답이 비어 있거나 요청이 거절되었습니다.');
  return text;
}
