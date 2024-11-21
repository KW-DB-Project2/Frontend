// 상품 관리 페이지
import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

function Manage() {
  const navigate = useNavigate();

  const goToAdd = () => {
    navigate('/add'); // 상품 관리 페이지로 이동
  };

  return (
    <Container>
      <ButtonContainer>
        <LeftDiv onClick={goToAdd}>상품 등록</LeftDiv>
        <VerticalBar />
        <RightDiv>상품 관리</RightDiv>
      </ButtonContainer>
      <Bottombar />
      <Title>상품 관리 페이지</Title>
    </Container>
  );
}
export default Manage;

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

const RightDiv = styled.div`
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

const VerticalBar = styled.div`
  width: 1px;
  height: 30px; /* 수직선의 높이를 설정 */
  background-color: #ccc; /* 수직선 색상 */
  margin: 10px 20px 0 20px; /* 버튼 간의 간격을 설정 */
`;

const Bottombar = styled.div`
  width: 1000px;
  height: 1px;
  background-color: #ccc;
`;

const Title = styled.h1`
  font-size: 27px;
  color: #333;
  margin-bottom: 20px;
  font-weight: 500;
`;
