# COZY 커피 주문 앱

커피 주문 및 관리자 화면을 제공하는 웹 애플리케이션입니다.

## 기술 스택

- React
- Vite
- JavaScript

## 개발 환경 실행

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

## GitHub Pages 배포

이 프로젝트는 GitHub Actions를 통해 자동으로 GitHub Pages에 배포됩니다.

### 배포 설정

1. GitHub 저장소의 Settings > Pages로 이동
2. Source를 "GitHub Actions"로 설정
3. `main` 브랜치에 푸시하면 자동으로 배포됩니다.

### 배포 URL

배포 후 다음 URL에서 확인할 수 있습니다:
`https://[사용자명].github.io/order-app/ui/`

## 프로젝트 구조

```
ui/
├── src/
│   ├── App.jsx       # 메인 앱 컴포넌트
│   ├── App.css       # 스타일시트
│   └── main.jsx       # 진입점
├── public/           # 정적 파일
├── index.html        # HTML 템플릿
└── vite.config.js    # Vite 설정
```
