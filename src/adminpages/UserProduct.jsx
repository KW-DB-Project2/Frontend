import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

function UserProduct() {
  const { productid } = useParams(); // URL에서 productid 파라미터 추출
  const [product, setProduct] = useState(null); // 상품 데이터 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  useEffect(() => {
    // API 호출
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_URI}/admin/user-product/${productid}`
        );
        setProduct(response.data);
      } catch (err) {
        console.error(err);
        setError('상품 정보를 불러오는 중 문제가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productid]);

  const handleActionClick = (action) => {
    switch (action) {
      case 'block':
        alert('유저 정지 처리');
        break;
      case 'withdraw':
        alert('유저 탈퇴 처리');
        break;
      case 'delete':
        alert('상품 삭제 처리');
        break;
      default:
        break;
    }
  };

  if (loading) return <Container>로딩 중...</Container>;
  if (error) return <Container>{error}</Container>;
  return (
    <Container>
      <Content>
        <Image
          src={product.productImg || 'https://via.placeholder.com/500x500'}
          alt={product.productTitle || '상품 이미지'}
        />
        <Details>
          <ProductName>{product.productTitle}</ProductName>
          <PriceContainer>
            <Price>{product.productPrice.toLocaleString()}원</Price>
          </PriceContainer>
          <BottomBar />
          <div style={{ fontSize: '19px' }}>상품정보</div>
          <BottomBar />
          <Description>{product.productContent}</Description>
          <ButtonContainer>
            <ActionButton onClick={() => handleActionClick('block')}>
              유저 정지
            </ActionButton>
            <ActionButton onClick={() => handleActionClick('withdraw')}>
              유저 탈퇴
            </ActionButton>
            <ActionButton onClick={() => handleActionClick('delete')}>
              상품 삭제
            </ActionButton>
          </ButtonContainer>
        </Details>
      </Content>
    </Container>
  );
}
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

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row; /* 가로로 버튼을 배치 */
  align-self: flex-end;
  gap: 15px;
  margin-top: 20px;
`;

const ActionButton = styled.div`
  padding: 10px 12px;
  background-color: #f4f4f4;

  border-radius: 5px;
  cursor: pointer;
  font-size: 17px;

  &:hover {
    background-color: #e0e0e0;
  }
`;

export default UserProduct;
