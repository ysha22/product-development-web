# 💊 PharmaDD Dashboard

Google Gemini AI 기반 의약품 개발 Due Diligence 보고서 자동 생성 웹앱

---

## 🚀 빠른 시작 (처음 클론하는 경우)

### 1. Node.js 설치

[nodejs.org](https://nodejs.org) 에서 **LTS 버전** 다운로드 후 설치

설치 확인:
```bash
node --version
npm --version
```

### 2. 프로젝트 클론

```bash
git clone https://github.com/ysha22/product-development-web.git
cd product-development-web
```

### 3. 의존성 설치

```bash
npm install
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 **http://localhost:5173** 접속

---

## 🔑 Gemini API Key 설정

1. [Google AI Studio](https://aistudio.google.com/apikey) 에서 API Key 발급 (무료)
2. 앱 실행 후 우측 상단 **🔑 API Key** 버튼 클릭
3. `AIza...` 형식의 Key 입력 후 저장

> Key는 브라우저 localStorage에만 저장되며, 외부로 전송되지 않습니다.

---

## 📦 주요 기술 스택

| 역할 | 라이브러리 |
|---|---|
| UI 프레임워크 | React 19 + TypeScript |
| 빌드 도구 | Vite 8 |
| 스타일 | Tailwind CSS |
| 차트 | Recharts |
| AI | Google Gemini 3.6 Flash |
| PDF 출력 | jsPDF + html2canvas |
| Excel 출력 | xlsx |

---

## 🛠️ 주요 스크립트

```bash
npm run dev      # 개발 서버 실행 (http://localhost:5173)
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 결과물 미리보기
```

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
