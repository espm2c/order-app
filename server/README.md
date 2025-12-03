# 커피 주문 앱 백엔드 서버

Express.js를 사용한 RESTful API 서버입니다.

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 열어서 다음 정보를 수정하세요:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coffee-order-db
DB_USER=postgres
DB_PASSWORD=your_password_here
```

**중요**: `DB_PASSWORD`를 실제 PostgreSQL 비밀번호로 변경하세요!

### 3. 데이터베이스 생성 및 초기화

**데이터베이스 생성:**
```bash
npm run create-db
```

**데이터베이스 초기화 (테이블 생성 및 초기 데이터 삽입):**
```bash
npm run init-db
```

### 4. 서버 실행

**개발 모드 (nodemon 사용):**
```bash
npm run dev
```

**프로덕션 모드:**
```bash
npm start
```

## 프로젝트 구조

```
server/
├── src/
│   ├── index.js          # 서버 진입점
│   ├── routes/           # API 라우트
│   ├── controllers/      # 컨트롤러
│   ├── models/           # 데이터 모델 및 DB 연결
│   └── middleware/       # 커스텀 미들웨어
├── .env                  # 환경 변수 (git에 포함되지 않음)
├── .gitignore
├── package.json
└── README.md
```

## API 엔드포인트

### 기본
- `GET /` - 서버 정보
- `GET /health` - 헬스 체크

### 메뉴
- `GET /api/menus` - 메뉴 목록 조회

### 주문
- `POST /api/orders` - 주문 생성
- `GET /api/orders` - 주문 목록 조회
- `GET /api/orders/:orderId` - 주문 상세 조회
- `PATCH /api/orders/:orderId/status` - 주문 상태 변경
- `GET /api/orders/stats` - 주문 통계 조회

### 재고
- `PATCH /api/menus/:menuId/stock` - 재고 수정

## 기술 스택

- **Express.js** - 웹 프레임워크
- **PostgreSQL** - 데이터베이스
- **pg** - PostgreSQL 클라이언트
- **dotenv** - 환경 변수 관리
- **cors** - CORS 처리
- **nodemon** - 개발용 자동 재시작

## 개발 가이드

자세한 API 명세는 `docs/PRD.md` 파일의 "백엔드 개발 PRD" 섹션을 참고하세요.



