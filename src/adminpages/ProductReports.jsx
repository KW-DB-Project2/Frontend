import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const products = [
  { id: 1, name: '제품 1' },
  { id: 2, name: '제품 2' },
  { id: 3, name: '제품 3' },
  { id: 4, name: '제품 4' },
  { id: 5, name: '제품 5' },
];

function ProductReports() {
  const navigate = useNavigate();

  // 제품 항목 클릭 시 해당 제품 상세 페이지로 이동
  const navigateToProductDetail = (productId) => {
    navigate(`/admin/user-product/${productId}`); // 클릭된 제품의 id를 URL에 전달
  };

  // Review 신고 목록으로 이동
  const navigateToUserReport = () => {
    navigate('/admin/review-reports');
  };

  return (
    <Container>
      <TitleContainer>
        <Title>Product 신고 목록</Title>
        <VerticalBar />
        <PageTitle onClick={navigateToUserReport}>Review 신고 목록</PageTitle>
      </TitleContainer>

      {/* 제품 목록 출력 */}
      <ProductList>
        {products.map((product) => (
          <ProductItem
            key={product.id}
            onClick={() => navigateToProductDetail(product.id)}
          >
            <ProductName>{product.name}</ProductName>
            <ProductDescription>{product.description}</ProductDescription>
          </ProductItem>
        ))}
      </ProductList>
    </Container>
  );
}

export default ProductReports;

const Container = styled.div`
  width: 1500px;
  padding: 20px 40px;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 27px;
  color: #333;
  margin-right: 20px;
`;

const VerticalBar = styled.div`
  width: 2px;
  height: 27px;
  background-color: #ccc;
  margin: 0 20px;
`;

const PageTitle = styled.h2`
  font-size: 22px;
  color: #777;
  cursor: pointer;
`;

const ProductList = styled.div`
  margin-top: 20px;
`;

const ProductItem = styled.div`
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #f4f4f4;
  }
`;

const ProductName = styled.h3`
  font-size: 18px;
  font-weight: bold;
`;

const ProductDescription = styled.p`
  font-size: 14px;
  color: #555;
`;
