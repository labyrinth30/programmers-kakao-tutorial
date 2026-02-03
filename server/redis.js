// server/redis.js
const Redis = require('ioredis');

// 환경변수를 사용하여 Redis 클라이언트 생성
const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
});

redis.on('connect', () => {
    console.log('✅ Redis 연결 성공!');
});

redis.on('error', (err) => {
    console.error('❌ Redis 에러:', err);
});

module.exports = redis;
