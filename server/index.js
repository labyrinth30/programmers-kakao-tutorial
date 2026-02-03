const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const axios = require('axios');
require('dotenv').config();
const pool = require('./db');
const jwt = require('jsonwebtoken');
const redis = require('./redis');

console.log(process.env.KAKAO_CLIENT_ID);


const app = express();

// 1. JSON 파싱
app.use(express.json());
// 2. 쿠키 파싱 (HttpOnly 쿠키를 위해 필수!)
app.use(cookieParser());
// 3. CORS 설정 (프론트엔드와 쿠키를 주고받으려면 필수!)
app.use(cors({
    origin: 'http://localhost:5173', // 프론트엔드 주소 명시 (와일드카드 * 안됨)
    credentials: true, // 쿠키 허용
}));

app.listen(3001, () => console.log('Server running on 3001'));

app.get('/', (req, res) => res.send('Hello World!'));
// server/app.js

app.post('/login/kakao', async (req, res) => {
    const { code } = req.body;

    try {
        // 1. 인가 코드로 카카오 토큰 받기 (기존 동일)
        const tokenResponse = await axios.post(
            'https://kauth.kakao.com/oauth/token',
            new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: process.env.KAKAO_CLIENT_ID,
                redirect_uri: process.env.KAKAO_REDIRECT_URI,
                code: code,
                client_secret: process.env.KAKAO_REST_API_SECRET,
            }).toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                },
            }
        );
        const kakaoAccessToken = tokenResponse.data.access_token;
        console.log(`카카오 서버에서 전달받은 카카오 엑세스 토큰: ${kakaoAccessToken}`);

        // 2. 카카오 유저 정보 조회 (기존 동일)
        const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers: { Authorization: `Bearer ${kakaoAccessToken}` },
        });

        const kakaoUser = userResponse.data;
        console.log(`카카오 서버에서 전달받은 유저의 데이터: ${JSON.stringify(kakaoUser)}`)
        const kakaoId = String(kakaoUser.id); // 카카오 고유 ID (숫자인데 문자열로 저장 추천)
        const email = kakaoUser.kakao_account?.email || null;
        const nickname = kakaoUser.properties?.nickname || kakaoUser.kakao_account?.profile?.nickname || 'Unknown';

        // ============================================================
        // [변경] 3. DB 조회 및 회원가입 (Upsert 로직)
        // ============================================================

        let userId; // 우리 DB의 PK (primary key)

        // 3-1. 이미 가입한 유저인지 확인
        const [rows] = await pool.query('SELECT * FROM users WHERE kakao_id = ?', [kakaoId]);

        if (rows.length > 0) {
            // 이미 가입된 유저 -> 로그인 처리
            console.log('기존 유저 로그인:', nickname);
            userId = rows[0].id;
        } else {
            // 없는 유저 -> 회원가입 (INSERT)
            console.log('신규 유저 회원가입:', nickname);
            const [result] = await pool.query(
                'INSERT INTO users (kakao_id, email, nickname) VALUES (?, ?, ?)',
                [kakaoId, email, nickname]
            );
            userId = result.insertId; // 방금 생성된 id 가져오기
        }

        // 4. 우리 서비스 전용 JWT 토큰 발급
        // Payload에 'kakaoId'가 아니라 우리 DB의 'id'를 넣는 것이 핵심!
        const myServiceToken = jwt.sign({ id: userId, nickname }, process.env.JWT_SECRET);

        // 5. 쿠키 설정 및 응답 (기존 동일)
        res.cookie('accessToken', myServiceToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
        });

        res.json({ success: true, user: nickname });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '로그인 실패' });
    }
});
