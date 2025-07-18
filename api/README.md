# API 서버 (NestJS)

NestJS와 Prisma, Passport, JWT를 기반으로 한 백엔드 인증 API 서버입니다.

## 주요 기능

- JWT 기반 인증 API 제공
- 로그인 및 토큰 발급, 검증 기능 구현
- DTO 구조와 이를 통한 유효성 검사 지원
- Prisma ORM을 활용한 DB 연동
- Swagger 서버 문서화
- 테스트 환경 구성

## 기술 스택

- **프레임워크**: NestJS 11
- **언어**: TypeScript
- **ORM**: Prisma 6
- **인증 및 보안**: JWT, Passport, Cookie-Parser
- **API 문서화**: Swagger
- **데이터 유효성 검사**: class-validator, class-transformer
- **테스트**: Jest

## 프로젝트 구조

```
record-to-webm/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── auth/
│   │   ├── dto/
│   │   ├── auth.controller.spec.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.spec.ts
│   │   ├── auth.service.ts
│   │   ├── jwt-auth.guard.ts
│   │   └── jwt.strategy.ts
│   ├── common/
│   │   ├── decorator/
│   │   └── type/
│   ├── prisma/
│   │   ├── dto/
│   │   ├── prisma.module.ts
│   │   ├── prisma.service.spec.ts
│   │   └── prisma.service.ts
│   ├── social-user/
│   │   ├── dto/
│   │   ├── social-user.module.ts
│   │   ├── social-user.service.spec.ts
│   │   └── social-user.service.ts
│   ├── user/
│   │   ├── dto/
│   │   ├── user.module.ts
│   │   ├── user.service.spec.ts
│   │   └── user.service.ts
│   ├── app.module.ts
│   └── main.ts
├── package.json
└── README.md
```

## 환경 변수

DB 접속과 토큰 발급을 위해 다음 값을 설정해야 합니다.

- `DATABASE_URL`
- `JWT_SECRET`

## 설치 및 실행

```bash
cd api
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

## 테스트

```bash
npm run test
npm run test:e2e
npm run test:cov
```
