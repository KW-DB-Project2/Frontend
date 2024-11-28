import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
// 아이콘
import { FiLoader } from 'react-icons/fi';
// 컴포넌트 임포트
import { AuthContext } from '../context/AuthContext';
import Review from './Review'; // 분리한 리뷰 게시판 컴포넌트

function Product() {
  const { user, token } = useContext(AuthContext); // AuthContext에서 사용자 정보 가져오기
  const { productid } = useParams(); // URL 파라미터에서 productid 값을 받음
  const navigate = useNavigate(); // 네비게이션 훅
  const [product, setProduct] = useState(null);

  // 상품 정보 가져오기
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_URI}/product`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const products = response.data;
        const selectedProduct = products.find(
          (product) => product.productId === parseInt(productid)
        );
        setProduct(selectedProduct); // 실제 상품 데이터 사용
      } catch (error) {
        console.error('상품 정보를 가져오는 중 오류 발생:', error);
        setProduct(null); // 에러 발생 시 상품 정보 없다고 설정
      }
    };

    fetchProducts();
  }, [productid, token]);

  if (!product) {
    return (
      <LoadingContainer>
        <FiLoader size={40} className="loading-icon" />
        상품 정보를 불러오는 중...
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <Content>
        <Image
          src={`data:image/png;base64,${product.productImg}`}
          alt={product.productTitle || '상품 이미지'}
        />
        <Details>
          <ProductName>{product.productTitle}</ProductName>
          <PriceContainer>
            <Price>{product.productPrice.toLocaleString()}원</Price>
          </PriceContainer>
          <BottomBar />
          <Description>{product.productContent}</Description>
        </Details>
      </Content>
      <BottomBar />
      {/* 리뷰 게시판 부분을 분리한 Review 컴포넌트로 대체 */}
      <Review productid={productid} />
    </Container>
  );
}

export default Product;

// 스타일 컴포넌트
const Container = styled.div`
  width: 1500px;
  margin-top: 20px;
  padding: 50px;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  display: flex;
  gap: 40px;
`;

const Image = styled.img`
  width: 500px;
  height: auto;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Details = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
`;

const ProductName = styled.h2`
  font-size: 27px;
  color: #333;
  font-weight: 500;
`;

const PriceContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Price = styled.div`
  color: #333;
  font-size: 33px;
  font-weight: 500;
`;

const BottomBar = styled.div`
  height: 2px;
  width: 100%;
  background-color: #f0f0f0;
  margin: 20px 0px;
`;

const Description = styled.p`
  flex-grow: 1;
  margin-bottom: 100px;
`;

const LoadingContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
