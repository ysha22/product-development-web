# 💊 PharmaDD Dashboard

Google Gemini AI 기반 의약품 개발 Due Diligence 보고서 자동 생성 웹앱

---

## ⚡ 가장 쉬운 사용법 (Node.js 불필요)

1. 이 저장소에서 **`dist/index.html`** 파일 다운로드
2. 브라우저로 파일 열기 (더블클릭)
3. 우측 상단 **🔑 API Key** 버튼 → Gemini API Key 입력
4. 의약품 이름 검색 → 보고서 생성

> Node.js, npm, 서버 설치 불필요. 파일 하나로 어떤 컴퓨터에서도 동작해요.

---

## 🔑 Gemini API Key 발급 (무료)

1. [Google AI Studio](https://aistudio.google.com/apikey) 접속
2. Google 계정으로 로그인
3. **"Create API Key"** 클릭 → `AIza...` 형식의 키 복사
4. 앱에서 입력

---

## 🚀 개발자용 로컬 실행

### 1. Node.js 설치

[nodejs.org](https://nodejs.org) 에서 **LTS 버전** 다운로드 후 설치

### 2. 프로젝트 클론 및 실행

```bash
git clone https://github.com/ysha22/product-development-web.git
cd product-development-web
npm install
npm run dev
```

브라우저에서 **http://localhost:5173** 접속

### 3. 단일 HTML 파일 빌드

```bash
npm run build
# dist/index.html 생성됨
```

---

## 📦 주요 기술 스택

| 역할 | 라이브러리 |
|---|---|
| UI 프레임워크 | React 19 + TypeScript |
| 빌드 도구 | Vite 8 + vite-plugin-singlefile |
| 스타일 | Tailwind CSS |
| 차트 | Recharts |
| AI | Google Gemini 3.6 Flash |
| PDF 출력 | jsPDF + html2canvas |
| Excel 출력 | xlsx |

---

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── executive/   # 종합 요약 컴포넌트
│   ├── input/       # 검색폼, 로딩, 에러 화면
│   ├── layout/      # TopBar, Sidebar, RiskPanel
│   ├── parts/       # 보고서 Part 1~10
│   └── shared/      # 공통 컴포넌트 (Badge 등)
├── services/
│   └── aiService.ts # Gemini API 호출 및 보고서 조립
├── utils/
│   └── exportUtils.ts # PDF / Excel 다운로드
├── types/           # TypeScript 타입 정의
└── data/            # 데모 데이터
```
