import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Mock 데이터 또는 실제 API 호출
    const fetchProduct = () => {
      const dummyProducts = [
        {
          id: 1,
          name: '상품 1',
          price: '10,000원',
          imageUrl: 'https://via.placeholder.com/300?text=상품1',
          description: '상품 1의 상세 설명입니다.',
        },
        {
          id: 2,
          name: '상품 2',
          price: '20,000원',
          imageUrl: 'https://via.placeholder.com/300?text=상품2',
          description: '상품 2의 상세 설명입니다.',
        },
      ];

      // 상품 ID로 데이터 검색
      const selectedProduct = dummyProducts.find(
        (product) => product.id === parseInt(id)
      );
      setProduct(selectedProduct);
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <Container>
        <p>상품 정보를 불러오는 중입니다...</p>
      </Container>
    );
  }

  return (
    <Container>
      <Content>
        <Image src={product.imageUrl} alt={product.name} />

        <Details>
          <h2>{product.name}</h2>
          <p>가격: {product.price}</p>
          <p>{product.description}</p>
          <BuyButton>구매하기</BuyButton>
        </Details>
      </Content>
    </Container>
  );
}

const Container = styled.div`
  padding: 20px;
  margin-top: 0;
`;

const Content = styled.div`
  display: flex;
  gap: 20px;
`;

const Image = styled.img`
  width: 400px;
  height: auto;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const Details = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`;

const BuyButton = styled.button`
  padding: 10px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: auto;
  align-self: flex-end;

  &:hover {
    opacity: 0.9;
  }
`;

export default Product;
