// 로그인 모달창
import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 컴포넌트 임포트
import Signup from './Signup';
import { AuthContext } from '../context/AuthContext';

import KakaoLoginLogo from '../images/kakao_login.png'; //카카오로그인 이미지

function Login({ showModal, closeModal }) {
  const REST_API_KEY = import.meta.env.VITE_APP_REST_API_KEY_KAKAO;
  const REDIRECT_URI = import.meta.env.VITE_APP_REDIRECT_URI_KAKAO;
  const SURL = import.meta.env.VITE_APP_URI;
  const KAKAO_AUTH_URI = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  const navigate = useNavigate();

  const { login } = useContext(AuthContext); // AuthContext에서 login 함수 가져오기

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showSignupModal, setShowSignupModal] = useState(false); // 회원가입 모달 상태 추가

  // 오류 메시지 상태
  const [errors, setErrors] = useState({});

  // 모달이 열리면 body 스크롤을 고정하고, 닫히면 스크롤을 해제
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);

  /* 로그인 버튼 클릭 */
  const handleLogin = async (e) => {
    e.preventDefault();
    // 필수 입력값 체크
    let errorMessages = {};
    if (!username) errorMessages.username = '아이디를 입력해 주세요.';
    if (!password) errorMessages.password = '비밀번호를 입력해 주세요.';

    if (Object.keys(errorMessages).length > 0) {
      setErrors(errorMessages);
      return;
    }
    try {
      const response = await axios.post(
        `${SURL}/local/login`,
        {
          localId: username,
          password: password,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const jwt = res.data.jwtToken;
      const account = res.data.account;

      // 로그인 성공 시
      if (jwt) {
        alert('로그인 성공!');
        login(account, jwt); // 로그인 시 토큰을 전역 상태에 저장
        localStorage.setItem('refreshToken', response.data.refreshToken);
        handleCloseModal();
        navigate('/');
      } else {
        console.error('JWT token not found in response data');
      }
    } catch (error) {
      alert('로그인 실패');
      console.error('로그인 실패:', error);
      setErrors({ login: '로그인 정보가 틀립니다.' });
    }
  };

  /* 회원가입 모달창 띄우기 */
  const openSignupModal = () => {
    setShowSignupModal(true);
  };

  const closeSignupModal = () => {
    setShowSignupModal(false);
  };

  /* 카카오 로그인 페이지로 이동 */
  const openKakao = () => {
    window.open(KAKAO_AUTH_URI, '_self');
  };

  if (!showModal) return null; // 모달이 보여지지 않으면 null 리턴

  // 모달 닫을 때 입력값 초기화
  const handleCloseModal = () => {
    setUsername('');
    setPassword('');
    setErrors({});
    closeModal(); // 모달 닫기
  };

  return (
    <>
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>
            <Title>로그인</Title>
            <CloseButton onClick={handleCloseModal}>X</CloseButton>
          </ModalHeader>
          <Form onSubmit={handleLogin}>
            <Input
              type="text"
              placeholder="id"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}
            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
            <ButtonContainer>
              <SubmitButton type="submit">로그인</SubmitButton>
              <RegisterButton type="button" onClick={openSignupModal}>
                회원가입
              </RegisterButton>
            </ButtonContainer>
          </Form>
          {/* 카카오 로그인 이미지 */}
          <KakaoLoginWrapper>
            <KakaoLoginImg
              src={KakaoLoginLogo}
              alt="Kakao 로그인"
              onClick={openKakao}
            />
          </KakaoLoginWrapper>
        </ModalContent>
      </ModalOverlay>
      {showSignupModal && (
        <Signup showModal={showSignupModal} closeModal={closeSignupModal} />
      )}
    </>
  );
}

export default Login;

// 스타일링
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 50px 30px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  position: relative;
`;

const Title = styled.h1`
  font-size: 33px;
  color: #333;
  margin-bottom: 20px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 17px;
  cursor: pointer;
  color: #333;
  position: absolute;
  right: 0;
  top: -35px;
  right: -18px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 10px 15px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 17px;
`;

/* 로그인/회원가입 버튼 */
const ButtonContainer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  padding-bottom: 30px;
  border-bottom: 1px solid #ccc;
`;

const SubmitButton = styled.button`
  padding: 10px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 48%;

  &:hover {
    opacity: 0.9;
  }
`;

const RegisterButton = styled.button`
  padding: 10px;
  background-color: white;
  color: #333;
  border: 1px solid #333;
  border-radius: 4px;
  cursor: pointer;
  width: 48%;

  &:hover {
    background-color: #333;
    color: white;
    opacity: 0.9;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin: -10px 0 10px 0;
`;

// 카카오 로그인 이미지 스타일
const KakaoLoginWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
`;

const KakaoLoginImg = styled.img`
  width: 350px; /* 가로로 길게 설정 */
  height: 50px;
`;
