// 등록된 상품 리스트
import React from 'react';
import styled from 'styled-components';

function ProductList() {
  return (
    <Container>
      <Title>admin 등록된 상품 리스트 페이지</Title>
    </Container>
  );
}

export default ProductList;

const Container = styled.div`
  padding: 20px;
  margin-top: 0;
`;

const Title = styled.h1`
  font-size: 27px;
  color: #333;
  margin-bottom: 20px;
`;
