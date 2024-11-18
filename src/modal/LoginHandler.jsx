import React, { useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export const LoginHandler = () => {
  const navigate = useNavigate();
  const code = new URL(window.location.href).searchParams.get('code');
  const { login } = useContext(AuthContext); // AuthContext에서 login 함수 가져오기
  const SURL = import.meta.env.VITE_APP_URI;

  useEffect(() => {
    const kakaoLogin = async () => {
      if (!code) {
        console.error('Authorization code not found');
        return;
      }

      try {
        const res = await axios.get(`${SURL}/login/oauth2/code/kakao`, {
          params: { code: code },
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Access-Control-Allow-Origin': '*',
          },
        });

        const jwt = res.data.jwtToken;
        const account = res.data.account;
        //const isNewUser = res.data.isNewUser; // 서버에서 새 사용자 여부 반환

        if (jwt) {
          login(account, jwt); // 로그인 시 토큰을 전역 상태에 저장
          localStorage.setItem('refreshToken', res.data.refreshToken);
          navigate('/');
          // 새 사용자 여부에 따라 페이지 이동
          // if (isNewUser) {
          //   navigate('/signupdetail');
          // } else {
          //   navigate('/');
          // }
        } else {
          console.error('JWT token not found in response data');
        }
      } catch (error) {
        if (error.response) {
          console.error('Server responded with an error:', error.response.data);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error setting up the request:', error.message);
        }
      }
    };
    kakaoLogin();
  }, [navigate, code, login]);

  return <div></div>;
};
