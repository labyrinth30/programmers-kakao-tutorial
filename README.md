# 🟡 Kakao Login OAuth 2.0 Tutorial (React + Express)

React와 Express를 사용하여 **카카오 로그인(OAuth 2.0)**의 전체 흐름을 밑바닥부터 구현해보는 실습 프로젝트입니다.
Passport 같은 라이브러리 없이 직접 REST API를 호출하며 인증 원리를 학습합니다.

## 🎯 학습 목표 (Key Features)

- **OAuth 2.0 Flow 이해:** 인가 코드(Authorization Code) 발급부터 토큰 교환까지의 과정 학습
- **보안 (Security):** `HttpOnly Cookie`를 사용한 JWT 저장 방식

## 🛠 Tech Stack

| Category | Technology |
| --- | --- |
| **Frontend** | React (Vite), React Router Dom, Axios |
| **Backend** | Node.js, Express, MySQL2, JWT (JsonWebToken) |
| **Database** | MySQL (Docker Compose) |
| **Infra** | Docker, Concurrently |

## 📊 OAuth 2.0 Login Flow

이 프로젝트에서 구현된 카카오 로그인 시퀀스입니다.
![](https://velog.velcdn.com/images/ayeon0/post/53654399-0b06-4b35-93c6-f896059a3991/image.png)

## 🚀 Getting Started

이 프로젝트를 로컬 환경에서 실행하기 위한 가이드입니다.

### 1. Prerequisites (사전 준비)
실행 전 다음 프로그램들이 설치되어 있어야 합니다.
* **Node.js** (v18 이상 권장)
* **Docker Desktop** (MySQL 컨테이너 실행용)
* **Kakao Developers 계정** (REST API 키 발급용)

### 2. Installation (설치)
프로젝트 루트에서 명령어를 실행하여 Frontend와 Backend의 의존성을 한 번에 설치합니다.

```bash
# 루트 폴더에서 실행
npm run install:all

# 만약 install:all 스크립트가 없다면 각각 설치
# cd client && npm install
# cd server && npm install
```
### 3. Environment Setup (환경 변수 설정)
보안을 위해 .env 파일은 깃허브에 올라가지 않습니다. 아래 양식에 맞춰 직접 생성해주세요.

📂 client/.env 생성
React 프로젝트(client) 폴더 안에 생성합니다.
```bash
# 카카오 개발자 센터 > 내 애플리케이션 > 앱 키 > REST API 키
VITE_REST_API_KEY=your_rest_api_key_here

# 카카오 개발자 센터 > 카카오 로그인 > Redirect URI (프론트엔드 주소)
VITE_REDIRECT_URI=http://localhost:5173/auth/kakao/callback

# 백엔드 API 주소
VITE_API_URL=http://localhost:3001
```
📂 server/.env 생성
```bash
# 서버 포트
PORT=3001

# CORS 허용을 위한 클라이언트 주소
CLIENT_URL=http://localhost:5173

# 카카오 인증 설정 (프론트엔드와 키가 동일해야 함)
KAKAO_CLIENT_ID=your_rest_api_key_here
KAKAO_REDIRECT_URI=http://localhost:5173/auth/kakao/callback

# JWT 비밀키 (임의의 문자열 입력)
JWT_SECRET=my_super_secret_key_1234

# MySQL DB 설정 (docker-compose.yml과 일치해야 함)
DB_HOST=127.0.0.1
DB_USER=user
DB_PASSWORD=root
DB_NAME=mydb
DB_PORT=3306
```

### 4. Run Project (실행)
데이터베이스를 먼저 띄우고, 서버와 클라이언트를 동시에 실행합니다.
```bash
# 1. MySQL 실행 (Docker)
docker-compose up -d

# 2. 프로젝트 실행 (Client + Server 동시 실행)
npm start
```
* **Frontend**: http://localhost:5173

* **Backend**: http://localhost:3001

```bash
kakao-login-tutorial/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── Login.jsx       # 로그인 버튼 (인가 코드 요청)
│   │   └── KakaoCallback.jsx # 리다이렉트 핸들러 (백엔드 통신 & 중복 방지)
│   └── .env                # 환경변수 (Git 제외)
├── server/                 # Express Backend
│   ├── index.js            # 메인 로직 (토큰 교환 & 쿠키 발급)
│   ├── db.js               # MySQL 연결 설정
│   └── .env                # 환경변수 (Git 제외)
├── docker-compose.yml      # MySQL 컨테이너 설정
└── package.json            # Monorepo 실행 스크립트
```