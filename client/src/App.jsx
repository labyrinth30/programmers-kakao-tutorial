// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login.jsx';
import KakaoCallback from './KakaoCallback';


function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* 1. 메인 화면 (로그인 버튼 있음) */}
                <Route path="/" element={<Login />} />

                {/* 2. 카카오가 리다이렉트 해주는 화면 (백엔드 통신 로직) */}
                <Route path="/auth/kakao/callback" element={<KakaoCallback />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;