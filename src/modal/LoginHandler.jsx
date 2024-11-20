//카카오 로그인
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// 컴포넌트 임포트
import { AuthContext } from '../context/AuthContext';
import SignupDetail from './SignupDetail';

const LoginHandler = () => {
  const navigate = useNavigate();
  const code = new URL(window.location.href).searchParams.get('code');
  const { login } = useContext(AuthContext); // AuthContext에서 login 함수 가져오기
  const SURL = import.meta.env.VITE_APP_URI;

  const [showSignupDetailModal, setShowSignupDetailModal] = useState(false); // 회원가입 상세 모달 상태 추가

  /* 회원가입 상세 모달창 띄우기 */
  const openSignupDetailModal = () => {
    setShowSignupDetailModal(true);
  };

  const closeSignupDetailModal = () => {
    setShowSignupDetailModal(false);
  };

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
        const isNewUser = res.data.newUser; // 서버에서 새 사용자 여부 반환

        if (jwt) {
          login(account, jwt); // 로그인 시 토큰을 전역 상태에 저장
          localStorage.setItem('refreshToken', res.data.refreshToken);
          navigate('/');
          console.log(isNewUser);
          if (isNewUser) {
            //새 사용자일 경우, 회원가입 상세 모달창 띄우기
            openSignupDetailModal();
          }
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

  return (
    <div>
      {' '}
      {showSignupDetailModal && (
        <SignupDetail
          showModal={showSignupDetailModal}
          closeModal={closeSignupDetailModal}
        />
      )}
    </div>
  );
};

export default LoginHandler;
