import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

function Add() {
  const navigate = useNavigate(); // navigate hook 사용

  const goToManage = () => {
    navigate('/manage'); // 상품 관리 페이지로 이동
  };

  return (
    <Container>
      <ButtonContainer>
        <LeftButton>상품 등록</LeftButton>
        <RightButton onClick={goToManage}>상품 관리</RightButton>
      </ButtonContainer>
      <Title>판매 등록 페이지</Title>
    </Container>
  );
}

export default Add;

const Container = styled.div`
  padding: 20px;
  margin-top: 0;
`;

const Title = styled.h1`
  font-size: 33px;
  color: #333;
  margin-bottom: 20px;
`;

const ButtonContainer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  padding-bottom: 30px;
  border-bottom: 1px solid #ccc;
`;

const LeftButton = styled.button`
  padding: 10px;
  background-color: white;
  color: red;
  border: none;
  cursor: pointer;
  font-size: 20px;
`;
const RightButton = styled.button`
  padding: 10px;
  background-color: white;
  color: #333;
  border: none;
  cursor: pointer;
  font-size: 20px;
  &:hover {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }
`;
