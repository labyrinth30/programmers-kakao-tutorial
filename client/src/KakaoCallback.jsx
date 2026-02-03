import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const KakaoCallback = () => {
    const navigate = useNavigate();
    const isCalled = useRef(false); // 중복 실행 방지 깃발

    useEffect(() => {
        const params = new URL(window.location.href).searchParams;
        const code = params.get('code');

        const login = async () => {
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/login/kakao`, // localhost:3001
                    { code },
                    { withCredentials: true }
                );

                if (response.data.success) {
                    alert(`${response.data.user}님 환영합니다!`);
                    navigate('/');
                }

            } catch (error) {
                console.error('로그인 에러:', error);

                // (선택사항) 이미 코드를 써서 나는 400 에러 말고, 진짜 서버 에러일 때만 알림
                if (error.response?.status !== 400) {
                    alert('로그인에 실패했습니다.');
                    navigate('/');
                }
            }
        };

        if (code) {
            // 🚩 isCalled가 false일 때만 실행 (Strict Mode 방어)
            if (!isCalled.current) {
                isCalled.current = true;
                login();
            }
        }
    }, []);

    return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h2>로그인 처리 중...</h2>
            <div className="spinner">🔄</div>
        </div>
    );
};

export default KakaoCallback;
