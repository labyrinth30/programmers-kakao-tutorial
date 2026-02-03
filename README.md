# 🟡 Kakao Login OAuth 2.0 Tutorial (React + Express + Docker)

React와 Express를 사용하여 **카카오 로그인(OAuth 2.0)**의 전체 흐름을 밑바닥부터 구현해보는 실습 프로젝트입니다.
Passport 같은 라이브러리 없이 직접 REST API를 호출하며 인증 원리를 학습합니다.
**Docker Compose를 이용해 Frontend, Backend, DB, Redis를 한 번에 실행하는 환경으로 구성되었습니다.**

## 🎯 학습 목표 (Key Features)

- **OAuth 2.0 Flow 이해:** 인가 코드(Authorization Code) 발급부터 토큰 교환까지의 과정 학습
- **보안 (Security):** `HttpOnly Cookie`를 사용한 JWT 저장 방식
- **인프라 (Infra):** Docker Compose를 활용한 MSA(Microservices Architecture) 기초 환경 구성

## 🛠 Tech Stack

| Category | Technology |
| --- | --- |
| **Frontend** | React (Vite), Axios |
| **Backend** | Node.js, Express, MySQL2, JWT |
| **Database** | MySQL 8.0, Redis (Session/Caching) |
| **Infra** | Docker, Docker Compose |

## 📊 OAuth 2.0 Login Flow

이 프로젝트에서 구현된 카카오 로그인 시퀀스입니다.
![](https://velog.velcdn.com/images/ayeon0/post/53654399-0b06-4b35-93c6-f896059a3991/image.png)

## 🚀 Getting Started

이 프로젝트를 로컬 환경에서 실행하기 위한 가이드입니다. 모든 서비스는 Docker 컨테이너로 실행됩니다.

### 1. Prerequisites (사전 준비)
실행 전 다음 프로그램들이 설치되어 있어야 합니다.
* **Docker Desktop** (필수)
* **Kakao Developers 계정** (REST API 키 발급용)

### 2. Environment Setup (환경 변수 설정)
DB 연결 정보는 `docker-compose.yml`에 설정되어 있으며, **카카오 API 키와 보안 키**는 별도 설정이 필요합니다.

#### 📂 client/.env 생성
React 프로젝트(`client`) 폴더 안에 생성합니다.
```bash
# 카카오 개발자 센터 > 내 애플리케이션 > 앱 키 > REST API 키
VITE_REST_API_KEY=your_rest_api_key_here

# 카카오 개발자 센터 > 카카오 로그인 > Redirect URI (프론트엔드 주소)
VITE_REDIRECT_URI=http://localhost:5173/auth/kakao/callback

# 백엔드 API 주소 (브라우저가 접근하므로 localhost 사용)
VITE_API_URL=http://localhost:3001
```

#### 📂 server/.env 생성 (또는 docker-compose.yml 수정)
DB 및 Redis 연결 정보는 `docker-compose.yml`에 하드코딩 되어 있으므로, **인증 관련 키만 설정**하면 됩니다.
`server` 폴더 안에 `.env`를 생성하거나, `docker-compose.yml`의 `express` 서비스 `environment` 섹션에 아래 내용을 추가하세요.

**방법 A: server/.env 파일 생성 (권장)**
```bash
# 서버 포트
PORT=3001

# CORS 허용을 위한 클라이언트 주소
CLIENT_URL=http://localhost:5173

# 카카오 인증 설정
KAKAO_CLIENT_ID=your_rest_api_key_here
KAKAO_REDIRECT_URI=http://localhost:5173/auth/kakao/callback

# JWT 비밀키
JWT_SECRET=my_super_secret_key_1234
```

> **참고:** `docker-compose.yml`에서 DB 접속 정보(`DB_HOST=mysql`, `DB_USER=user` 등)는 이미 설정되어 있으므로 `.env`에 중복으로 적을 필요가 없습니다.

### 3. Run Project (실행)
Docker Compose를 사용하여 모든 서비스(MySQL, Redis, Backend, Frontend)를 한 번에 실행합니다.

```bash
# 프로젝트 루트 경로에서 실행
docker-compose up -d --build
```

실행이 완료되면 아래 주소로 접속할 수 있습니다.

* **Frontend**: http://localhost:5173
* **Backend**: http://localhost:3001
* **MySQL**: localhost:3306 (외부 접속 가능)

### 4. Stop Project (종료)
```bash
docker-compose down
```

## 📂 Project Structure

```bash
kakao-login-tutorial/
├── client/                 # React Frontend (Vite)
│   ├── Dockerfile          # Client 이미지 빌드 설정
│   ├── src/
│   └── .env                # 환경변수 (Git 제외)
├── server/                 # Express Backend
│   ├── Dockerfile          # Server 이미지 빌드 설정
│   ├── index.js            # 메인 로직
│   └── db.js               # MySQL 연결 설정
├── docker-compose.yml      # 전체 서비스 오케스트레이션 (Express, MySQL, Redis, Client)
└── package.json
```
