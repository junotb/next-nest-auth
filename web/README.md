# 웹 클라이언트 (Next.js)

Next.js 15을 기반으로 한 API 서버와 연동되는 프론트엔드 서버입니다.

## 주요 기능

- 사용자 로그인/로그아웃
- JWT 토큰 저장 및 자동 인증 헤더 처리
- Zustand로 전역 사용자 인증 정보 관리
- Zod와 React Hook Form를 활용한 폼 데이터 입력 및 검증
- Axios와 SWR을 통한 서버 데이터 통신, 클라이언트 측 캐싱 및 데이터 동기화

## 기술 스택

- **프레임워크**: Next.js 15.3.3
- **언어**: TypeScript
- **스타일**: Tailwind CSS, clsx
- **상태 관리**: Zustand, SWR
- **폼 유효성 검사**: Zod, React Hook Form
- **API 통신**: Axios

## 프로젝트 구조

```
record-to-webm/
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   ├── hooks/
│   ├── libs/
│   ├── schemas/
│   ├── stores/
│   └── types/
├── public/
├── package.json
└── README.md
```

## 환경 변수

소셜 로그인 기능을 사용하려면 다음 값을 설정해야 합니다.

- `NAVER_AUTH_URL`, `NAVER_TOKEN_URL`, `NAVER_INFO_URL`
- `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET`, `NAVER_REDIRECT_URI`
- `KAKAO_AUTH_URL`, `KAKAO_TOKEN_URL`, `KAKAO_INFO_URL`
- `KAKAO_CLIENT_ID`, `KAKAO_CLIENT_SECRET`, `KAKAO_REDIRECT_URI`
- `GOOGLE_AUTH_URL`, `GOOGLE_TOKEN_URL`, `GOOGLE_INFO_URL`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`

## 설치 및 실행

```bash
cd web
npm install
npm run dev
```

## 테스트

```bash
npm run lint
```
