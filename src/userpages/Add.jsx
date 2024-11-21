// 판매 등록 페이지
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
        <LeftDiv>상품 등록</LeftDiv>
        <VerticalBar />
        <RightDiv onClick={goToManage}>상품 관리</RightDiv>
      </ButtonContainer>
      <Bottombar />
      <Title>상품 정보</Title>
      <TitleBottombar />
    </Container>
  );
}

export default Add;

const Container = styled.div`
  padding: 20px;
  margin-top: 0;
`;

const ButtonContainer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  padding-bottom: 30px;
  width: 240px;
`;

const LeftDiv = styled.div`
  background-color: white;
  color: red;
  display: inline-block;
  padding: 10px;
  font-size: 17px;
  cursor: pointer;
  text-align: center;

  &:hover {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const RightDiv = styled.div`
  background-color: white;
  color: #333;
  display: inline-block;
  padding: 10px;
  font-size: 17px;
  cursor: pointer;
  text-align: center;

  &:hover {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }
`;

const VerticalBar = styled.div`
  width: 1px;
  height: 30px;
  background-color: #ccc;
  margin: 10px 20px 0 20px;
`;

const Bottombar = styled.div`
  width: 1500px;
  height: 1px;
  background-color: #f0f0f0;
`;

const Title = styled.h1`
  font-size: 27px;
  color: #333;
  margin: 40px 0px;
  font-weight: 500;
`;

const TitleBottombar = styled.div`
  width: 1500px;
  height: 3px;
  background-color: #333;
`;
