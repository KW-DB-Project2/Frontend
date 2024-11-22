import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import axios from 'axios'; // axios import

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const SURL = import.meta.env.VITE_APP_URI;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${SURL}/product`, {
          withCredentials: false, // 쿠키를 포함시키지 않음
          headers: {
            // 불필요한 헤더를 포함시키지 않도록 주의
            Authorization: '', // Authorization 헤더가 필요 없다면 삭제
          },
        });
        setProducts(response.data); // 받아온 데이터를 상태에 저장
      } catch (error) {
        console.error('상품 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>로딩 중...</div>; // 로딩 중일 때 표시할 내용
  }

  return (
    <Container>
      <Title>상품 리스트</Title>
      <ProductList>
        {products.map((product) => (
          <ProductCard key={product.productId}>
            <StyledLink to={`/product/${product.productId}`}>
              <ProductImage
                src={
                  product.productImg
                    ? `data:image/jpeg;base64,${product.productImg}` // base64 이미지 데이터 처리
                    : 'https://via.placeholder.com/300x300?text=No+Image'
                }
                alt={product.productTitle}
              />
              <ProductInfo>
                <ProductTitle>{product.productTitle}</ProductTitle>
                <ProductPrice>{product.productPrice}</ProductPrice>
              </ProductInfo>
            </StyledLink>
          </ProductCard>
        ))}
      </ProductList>
    </Container>
  );
}

const Container = styled.div`
  padding: 20px;
  margin-top: 0;
`;

const Title = styled.h1`
  font-size: 27px;
  color: #333;
  font-weight: 500;
`;

const ProductList = styled.div`
  display: grid;
  gap: 10px;
  margin-top: 20px;
  grid-template-columns: repeat(5, 1fr);
`;

const ProductCard = styled.div`
  width: 300px;
  border: 1px solid #ccc;
  text-align: center;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const ProductImage = styled.img`
  width: 100%;
  height: 300px;
`;

const ProductInfo = styled.div`
  margin-top: 10px;
`;

const ProductTitle = styled.h3`
  font-size: 20px;
  color: #333;
  font-weight: 600;
  margin: 20px 0;
`;

const ProductPrice = styled.p`
  font-size: 17px;
  color: #333;
  font-weight: 500;
  margin: 20px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;

  &:hover {
    color: #333;
  }
`;

export default Home;
