// 내 상점 페이지
import React from 'react';
import styled from 'styled-components';

function Mypage() {
  return (
    <Container>
      <Title>내 상점 페이지</Title>
    </Container>
  );
}

export default Mypage;

const Container = styled.div`
  padding: 20px;
  margin-top: 0;
`;

const Title = styled.h1`
  font-size: 27px;
  color: #333;
  margin-bottom: 20px;
`;
