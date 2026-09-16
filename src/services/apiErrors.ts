import { PROVIDERS, type AIProvider } from './providers';
export function describeApiError(error: string, provider: AIProvider = 'gemini'): string {
  const label=PROVIDERS[provider].label;
  if (provider === 'gemini' && /GenerateRequestsPerDay|PerDayPerProject|requests.?per.?day/i.test(error)) {
    const limit = error.match(/quotaValue["\s:]+(\d+)/)?.[1] ?? error.match(/limit:\s*(\d+)/)?.[1];
    return `Gemini 프로젝트의 일일 요청 한도${limit ? ` (${limit}회)` : ''}를 소진했습니다. 미국 태평양 시간 자정에 초기화됩니다(한국 오후 4시, 겨울 오후 5시). 짧은 재시도 대기시간이 표시되어도 일일 한도는 초기화되지 않습니다. 같은 프로젝트의 API 키는 한도를 공유합니다.`;
  }
  if (/429|RESOURCE_EXHAUSTED|quota|rate.?limit/i.test(error)) return `${label} 요청 또는 사용량 한도에 도달했습니다. 제공사 대시보드에서 제한 종류와 사용량을 확인한 뒤 재시도하세요.`;
  if (/401|403|API_KEY_INVALID|Unauthorized|invalid.*key/i.test(error)) return `${label} API 키 또는 접근 권한을 확인하세요. 검색 화면에서 키를 다시 입력할 수 있습니다.`;
  if (/503|502|500|UNAVAILABLE/i.test(error)) return `${label} 서버에 일시적인 문제가 있습니다. 잠시 후 이어서 시도하세요.`;
  if (/network|fetch|CORS/i.test(error)) return '네트워크 연결과 방화벽 설정을 확인하세요.';
  if (/JSON/i.test(error)) return 'AI 응답의 필수 항목 또는 형식이 올바르지 않습니다. 완료된 단계는 유지하며 실패한 단계부터 재시도합니다.';
  return '보고서 생성 중 오류가 발생했습니다. 상세 내용을 확인하세요.';
}

export function redactApiError(message: string, apiKey: string): string {
  return (apiKey ? message.split(apiKey).join('[API KEY 숨김]') : message)
    .replace(/AIza[\w-]+|sk-[A-Za-z0-9_-]+/g, '[API KEY 숨김]');
}
