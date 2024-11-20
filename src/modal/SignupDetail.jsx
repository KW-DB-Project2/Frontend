// 회원가입 모달창
import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// 컴포넌트 임포트
import { AuthContext } from '../context/AuthContext';

function SignupDetail({ showModal, closeModal }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // AuthContext에서 사용자 정보 가져오기
  /* 회원 상세정보 상태 */
  const [phoneNumber, setPhoneNumber] = useState('');
  // 오류 메시지 상태
  const [errors, setErrors] = useState({});

  const handleSignup = async (e) => {
    e.preventDefault();

    // 필수 입력값 체크
    let errorMessages = {};
    if (!phoneNumber) errorMessages.phoneNumber = '전화번호를 입력해 주세요.';

    // 오류 메시지가 있으면 리턴하고 회원가입 처리 하지 않음
    if (Object.keys(errorMessages).length > 0) {
      setErrors(errorMessages);
      return;
    }
    // 회원가입 처리 로직
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_URI}/kakao/user/extra-info`,
        {
          loginId: user.loginId, // 로그인 ID (user 객체에서 가져옴)
          phoneNumber: phoneNumber, // 입력된 전화번호
        }
      );

      console.log('회원가입 상세 처리 결과', response.data);
      handleCloseModal(); // 회원가입 후 모달 닫기
      navigate('/');
    } catch (error) {
      console.error('회원가입 처리 중 오류 발생:', error);
      setErrors({ server: '서버에서 오류가 발생했습니다.' });
    }
  };

  // 모달 닫을 때 입력값 초기화
  const handleCloseModal = () => {
    setPhoneNumber('');
    setErrors({});
    closeModal(); // 모달 닫기
  };

  if (!showModal) return null; // 모달이 보여지지 않으면 null 리턴

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <Title>회원가입 상세</Title>
          <CloseButton onClick={handleCloseModal}>X</CloseButton>
        </ModalHeader>
        <Form onSubmit={handleSignup}>
          <Input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          {errors.phoneNumber && (
            <ErrorMessage>{errors.phoneNumber}</ErrorMessage>
          )}
          <SubmitButton type="submit">회원가입</SubmitButton>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
}

export default SignupDetail;

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
  font-size: 27px;
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

const SubmitButton = styled.button`
  margin-top: 20px;
  padding: 10px;
  background-color: #333;
  color: white;
  border: 1px solid #333;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;

  &:hover {
    opacity: 0.9;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin: -10px 0 10px 0;
`;
