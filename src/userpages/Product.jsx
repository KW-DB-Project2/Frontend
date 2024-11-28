import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
// 아이콘
import { FaExclamationTriangle, FaSearch, FaUserCircle } from 'react-icons/fa';
import { FiLoader } from 'react-icons/fi';
// 컴포넌트 임포트
import { AuthContext } from '../context/AuthContext';
import Review from './Review';

function Product() {
  const { user, token } = useContext(AuthContext);
  const { productid } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reportContent, setReportContent] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

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
        setProduct(selectedProduct);
      } catch (error) {
        console.error('상품 정보를 가져오는 중 오류 발생:', error);
        setProduct(null);
      }
    };

    fetchProducts();
  }, [productid, token]);

  const handleReportSubmit = async () => {
    if (!reportContent) {
      alert('신고 내용을 입력해주세요.');
      return;
    }

    try {
      const reportData = {
        userId: user.userId,
        productId: parseInt(productid),
        productReportContent: reportContent,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_APP_URI}/report/product`,
        reportData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        setReportSuccess(true);
        alert('상품 신고가 접수되었습니다.');
      }
    } catch (error) {
      console.error('상품 신고 중 오류 발생:', error);
      alert('상품 신고에 실패했습니다.');
    }
  };

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
      <Review productid={productid} />

      {/* 상품 신고 폼 */}
      <ReportSection>
        <h3>상품 신고하기</h3>
        <textarea
          placeholder="상품 신고 사유를 입력해주세요."
          value={reportContent}
          onChange={(e) => setReportContent(e.target.value)}
        />
        <button onClick={handleReportSubmit}>신고 제출</button>
        {reportSuccess && (
          <SuccessMessage>신고가 성공적으로 접수되었습니다.</SuccessMessage>
        )}
      </ReportSection>
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

const ReportSection = styled.div`
  margin-top: 40px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 5px;

  h3 {
    margin-bottom: 10px;
  }

  textarea {
    width: 100%;
    height: 100px;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }

  button {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background-color: #0056b3;
    }
  }
`;

const SuccessMessage = styled.p`
  color: green;
  margin-top: 10px;
  font-size: 14px;
`;
