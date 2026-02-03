FROM node:22-alpine

WORKDIR /app

# 의존성 설치 (pnpm을 사용하신다면 pnpm install로 변경 가능)
COPY package.json pnpm-lock.yaml ./
RUN npm install

# 소스 코드 복사
COPY . .

# Vite의 기본 포트는 5173입니다.
EXPOSE 5173

# 중요: Vite는 도커 환경에서 외부 접속을 허용하려면 --host 설정을 반드시 해야 합니다.
CMD ["npm", "run", "dev", "--", "--host"]
