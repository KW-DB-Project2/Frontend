import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import axios from 'axios'; // axios import
import { FiLoader } from 'react-icons/fi'; // 로딩 아이콘 import
// 컴포넌트 임포트
import { AuthContext } from '../context/AuthContext';

function AdminProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const SURL = import.meta.env.VITE_APP_URI;
  const { token } = useContext(AuthContext);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${SURL}/admin/products`, {
          headers: {
            Authorization: `Bearer ${token}`, // 인증 토큰
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
            <StyledLink
              to={`/admin/user-product/${product.userId}/${product.productId}`}
            >
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
  font-weight: 600;
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
