import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios'; // Axios 추가

function Signup({ showModal, closeModal }) {
  /* 회원정보 상태 */
  const [localId, setLocalId] = useState(''); // 아이디는 localId로
  const [username, setUsername] = useState(''); // 닉네임은 username으로
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  // 오류 메시지 상태
  const [errors, setErrors] = useState({});

  const handleSignup = async (e) => {
    e.preventDefault();

    // 필수 입력값 체크
    let errorMessages = {};
    if (!localId) errorMessages.localId = '아이디를 입력해 주세요.'; // localId 체크
    if (!username) errorMessages.username = '닉네임을 입력해 주세요.'; // username 체크
    if (!email) errorMessages.email = '이메일을 입력해 주세요.';
    if (!phoneNumber) errorMessages.phoneNumber = '전화번호를 입력해 주세요.';
    if (!password) errorMessages.password = '비밀번호를 입력해 주세요.';
    if (password !== confirmPassword)
      errorMessages.confirmPassword = '비밀번호가 일치하지 않습니다.';
    if (!confirmPassword)
      errorMessages.confirmPassword = '비밀번호 확인을 입력해 주세요.';

    // 오류 메시지가 있으면 리턴하고 회원가입 처리 하지 않음
    if (Object.keys(errorMessages).length > 0) {
      setErrors(errorMessages);
      return;
    }
    const SURL = import.meta.env.VITE_APP_URI;
    // 회원가입 처리 로직
    try {
      const response = await axios.post(`${SURL}/register`, {
        localId,
        username,
        email,
        password,
        phoneNumber,
      });
      console.log('회원가입 성공:', response.data);
      handleCloseModal(); // 회원가입 후 모달 닫기
    } catch (error) {
      console.error('회원가입 실패:', error);
      // 서버 오류 메시지 처리
      if (error.response) {
        setErrors({ server: error.response.data.message });
      }
    }
  };

  if (!showModal) return null; // 모달이 보여지지 않으면 null 리턴

  // 모달 닫을 때 입력값 초기화
  const handleCloseModal = () => {
    setLocalId('');
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setPhoneNumber('');
    setErrors({});
    closeModal(); // 모달 닫기
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <Title>회원가입</Title>
          <CloseButton onClick={handleCloseModal}>X</CloseButton>
        </ModalHeader>
        <Form onSubmit={handleSignup}>
          <Input
            type="text"
            placeholder="id"
            value={localId}
            onChange={(e) => setLocalId(e.target.value)}
          />
          {errors.localId && <ErrorMessage>{errors.localId}</ErrorMessage>}
          <Input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}
          <Input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          <Input
            type="text"
            placeholder="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          {errors.phoneNumber && (
            <ErrorMessage>{errors.phoneNumber}</ErrorMessage>
          )}
          <Input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          <Input
            type="password"
            placeholder="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && (
            <ErrorMessage>{errors.confirmPassword}</ErrorMessage>
          )}
          {errors.server && <ErrorMessage>{errors.server}</ErrorMessage>}
          <SubmitButton type="submit">회원가입</SubmitButton>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
}

export default Signup;

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
