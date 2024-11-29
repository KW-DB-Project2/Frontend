import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
// 아이콘
import { FaExclamationTriangle, FaSearch, FaUserCircle } from 'react-icons/fa';
import { FiLoader } from 'react-icons/fi';
// 컴포넌트 임포트
import { AuthContext } from '../context/AuthContext';

function Product() {
  const { user, token } = useContext(AuthContext);
  const { productid } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reportContent, setReportContent] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_URI}/product`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const selectedProduct = response.data.find(
          (product) => product.productId === parseInt(productid)
        );
        setProduct(selectedProduct);
      } catch (error) {
        console.error('상품 정보를 가져오는 중 오류 발생:', error);
        setProduct(null);
      }
    };

    fetchProduct();
  }, [productid, token]);

  const handleReportSubmit = async () => {
    if (!reportContent) {
      alert('신고 내용을 입력해주세요.');
      return;
    }

    try {
      const reportData = {
        userId: user.id,
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
            <ReportButton
              onClick={() => {
                console.log('신고하기 버튼 클릭');
                setIsModalOpen(true);
                console.log('isModalOpen:', isModalOpen);
              }}
            >
              <FaExclamationTriangle size={17} color="red" />
              신고하기
            </ReportButton>
          </PriceContainer>
          <BottomBar />
          <div style={{ fontSize: '19px' }}>상품정보</div>
          <BottomBar />
          <Description>{product.productContent}</Description>
          <ButtonContainer
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              width: '100%',
            }}
          >
            <QnAButton onClick={() => navigate(`/qna/${productid}`)}>
              문의하기
            </QnAButton>
            <BuyButton>구매하기</BuyButton>
          </ButtonContainer>
        </Details>
      </Content>
      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <Title>상품 신고</Title>
              <CloseButton onClick={() => setIsModalOpen(false)}>×</CloseButton>
            </ModalHeader>
            <Textarea
              placeholder="신고 내용을 입력해주세요."
              value={reportContent}
              onChange={(e) => setReportContent(e.target.value)}
            />
            <ButtonContainer>
              <SubmitButton onClick={handleReportSubmit}>제출</SubmitButton>
              <CancelButton onClick={() => setIsModalOpen(false)}>
                취소
              </CancelButton>
            </ButtonContainer>
          </ModalContent>
        </ModalOverlay>
      )}
      <br />
      <br />
      <BottomBar />
      <Review productid={productid} />
    </Container>
  );
}

export default Product;

const Container = styled.div`
  width: 1500px;
  margin-top: 20px;
  padding: 50px;
  margin-top: 0;
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

const ReportButton = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border: none;
  padding: 5px 10px;
  font-size: 16px;
  cursor: pointer;
  color: red;
  border-radius: 5px;

  svg {
    margin-right: 5px;
  }
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

const BoardContent = styled.div`
  display: flex;
  justify-content: space-between; /* 왼쪽은 BoardUser, 오른쪽은 ButtonContainer */
  align-items: center; /* 세로 정렬 */
  width: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px; /* 버튼들 사이 간격 */
`;

const BuyButton = styled.button`
  padding: 10px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 150px;
  font-size: 20px;

  &:hover {
    opacity: 0.9;
  }
`;

const QnAButton = styled.button`
  padding: 10px;
  background-color: white;
  color: #ccc;
  border: none;
  cursor: pointer;
  width: 150px;
  align-self: flex-end;
  font-size: 20px;
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

// 모달 스타일링
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 40px 30px;
  border-radius: 10px;
  width: 400px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: relative;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #333;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #555;

  &:hover {
    color: #000;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 120px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  resize: none;
  outline: none;

  &:focus {
    border-color: #333;
  }
`;

const SubmitButton = styled.button`
  padding: 12px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  flex: 1;

  &:hover {
    opacity: 0.9;
  }
`;

const CancelButton = styled.button`
  padding: 12px;
  background-color: white;
  color: #333;
  border: 1px solid #333;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  flex: 1;

  &:hover {
    background-color: #f5f5f5;
  }
`;
