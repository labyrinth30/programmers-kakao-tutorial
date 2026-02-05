// src/Login.jsx
import React from 'react';

const Login = () => {
    // 카카오 개발자 센터에서 설정한 내용
    const REST_API_KEY = import.meta.env.VITE_REST_API_KEY;
    const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

    // 카카오 로그인 URL (카카오 문법)
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

    const handleLogin = () => {
        // 유저를 카카오 인증 서버로 이동
        window.location.href = KAKAO_AUTH_URL;
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>React + Express 로그인 실습</h1>
            <p>로그인 버튼을 누르면 카카오로 이동합니다.</p>
            <button
                onClick={handleLogin}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#FEE500', // 카카오 노란색
                    color: '#000000',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                }}
            >
                카카오 로그인
            </button>
        </div>
    );
};

export default Login;
