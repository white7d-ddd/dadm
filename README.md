# DADMDESIGN (다듬디자인) Catalog Application

프리미엄 조경 시설물 및 야외 가구 카탈로그 웹 애플리케이션입니다.

## 🌟 주요 기능 (Key Features)

- **제품 카탈로그 & 카테고리 필터링**: 벤치, 파고라, 퍼니처 등 다양한 시설물 상세 스펙 및 이미지 제공
- **시공 사례 포트폴리오**: 현장 시공 사례 및 제원 정보 확인
- **견적 및 문의하기 시스템**: 실시간 견적 문의 및 관리 기능
- **시놀로지 NAS 이미지 프록시 (Synology NAS Proxy)**:
  - `gofile.me` 및 `/sharing/` 시놀로지 공유 링크의 이미지를 Express 서버 프록시(`/api/synology-proxy`)를 통해 직접 스트리밍 및 캐싱
- **관리자 패널 (Admin Panel)**: 제품 관리, 팝업 공지 관리, 메인 배너 및 브랜드 정보 실시간 편집

## 🛠 기술 스택 (Tech Stack)

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React, Motion
- **Backend**: Node.js, Express, tsx, esbuild
- **Build Tool**: Vite 6

## 🚀 시작하기 (Getting Started)

### 1. 의존성 설치 (Install Dependencies)

```bash
npm install
```

### 2. 개발 서버 실행 (Run Development Server)

Full-stack 개발 서버(Express + Vite)가 3000번 포트에서 실행됩니다.

```bash
npm run dev
```

웹 브라우저에서 `http://localhost:3000`으로 접속합니다.

### 3. 프로덕션 빌드 및 실행 (Build & Production Run)

```bash
# 빌드 (Vite 프론트엔드 + esbuild 서버 번들링)
npm run build

# 프로덕션 서버 실행
npm start
```

## 🌐 깃허브 페이지 배포 안내 (GitHub Pages Deployment)

깃허브 페이지(GitHub Pages)는 하위 경로(예: `https://white7d-ddd.github.io/dadm/`)에서 정적 파일만 호스팅하므로, Vite 설정에 `base: './'` 설정이 완료되어 있어야 흰 화면 없이 정상 작동합니다.

### 배포 방법 (`dist` 폴더 배포)
1. `npm run build` 명령어를 실행하여 `dist/` 폴더 생성
2. GitHub Repository **Settings > Pages** 이동
3. Source를 **Deploy from a branch**로 설정하고, `gh-pages` 브랜치 또는 `main` 브랜치의 `dist` (또는 root) 경로를 지정하거나, GitHub Actions를 통해 `dist/` 폴더를 자동으로 배포합니다.

## 📁 프로젝트 구조 (Project Structure)

```text
├── server.ts              # Express 서버 & 시놀로지 NAS 이미지 프록시 API
├── src/
│   ├── main.tsx           # React 엔트리포인트
│   ├── App.tsx            # 메인 애플리케이션
│   ├── components/        # UI 컴포넌트 (카탈로그, 관리자, 견적 문의 등)
│   ├── data/              # 초기 데모 데이터 및 스펙
│   └── utils/             # Synology 이미지 변환 및 아이콘 유틸리티
├── package.json
└── README.md
```

## 📄 라이선스 (License)

Private Repository / All rights reserved.
