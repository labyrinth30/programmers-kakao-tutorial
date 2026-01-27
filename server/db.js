// server/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

// 1. 커넥션 풀 생성 (한 번 연결해두고 계속 재사용)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// 2. 테이블 자동 생성 (강의용 꿀팁)
const initDB = async () => {
    try {
        const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        kakao_id VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100),
        nickname VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
        await pool.query(createTableQuery);
        console.log('✅ Users 테이블 준비 완료!');
    } catch (err) {
        console.error('❌ DB 테이블 생성 에러:', err);
    }
};

initDB(); // 파일이 로드될 때 실행

module.exports = pool;