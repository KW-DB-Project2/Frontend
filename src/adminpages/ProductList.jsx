import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import axios from 'axios'; // axios import
import { FiLoader } from 'react-icons/fi'; // 로딩 아이콘 import

function AdminProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const SURL = import.meta.env.VITE_APP_URI;

  // 더미 데이터 (API 호출 대신 사용)
  const dummyData = [
    {
      productId: 1,
      productTitle: '상품1',
      productPrice: 10000,
      createTime: '2024-01-01T00:00:00Z',
      updateTime: '2024-01-02T00:00:00Z',
      productImg: '', // 이미지 없음
    },
    {
      productId: 2,
      productTitle: '상품2',
      productPrice: 15000,
      createTime: '2024-02-01T00:00:00Z',
      updateTime: '2024-02-02T00:00:00Z',
      productImg: '', // 이미지 없음
    },
    {
      productId: 3,
      productTitle: '상품3',
      productPrice: 20000,
      createTime: '2024-03-01T00:00:00Z',
      updateTime: '2024-03-02T00:00:00Z',
      productImg: '', // 이미지 없음
    },
  ];

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
        // 에러가 나면 더미 데이터 사용
        setProducts(dummyData);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <LoadingContainer>
        <FiLoader size={40} className="loading-icon" />
        로딩 중...
      </LoadingContainer>
    ); // 로딩 중일 때 아이콘 표시
  }

  return (
    <Container>
      <Title>등록된 상품</Title>
      <ProductList>
        {products.map((product) => (
          <ProductCard key={product.productId}>
            <StyledLink to={`/admin/user-product/${product.productId}`}>
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
                <Probottom>
                  <ProductPrice>
                    {product.productPrice.toLocaleString()}원
                  </ProductPrice>
                  <ProductTime>
                    {product.updateTime
                      ? new Date(product.updateTime).toLocaleDateString()
                      : new Date(product.createTime).toLocaleDateString()}
                  </ProductTime>
                </Probottom>
              </ProductInfo>
            </StyledLink>
          </ProductCard>
        ))}
      </ProductList>
    </Container>
  );
}

export default AdminProductList;

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
  text-align: left;
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
  font-size: 17px;
  color: #333;
  font-weight: 400;
  margin: 0px 20px;
`;

const Probottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center; /* 세로 정렬을 가운데로 맞춤 */
  margin: 0px 20px;
`;

const ProductPrice = styled.p`
  font-size: 25px;
  color: #333;
  font-weight: 500;
`;

const ProductTime = styled.p`
  font-size: 14px;
  color: #ccc;
  font-weight: 400;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;

  &:hover {
    color: #333;
  }
`;

const LoadingContainer = styled.div`
  position: fixed; /* 화면에 고정 */
  top: 50%; /* 화면의 세로 중앙 */
  left: 50%; /* 화면의 가로 중앙 */
  transform: translate(-50%, -50%); /* 정확히 중앙에 맞추기 위해 이동 */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .loading-icon {
    animation: rotate 1s linear infinite;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
