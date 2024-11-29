import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

function UserProduct() {
  const { productid, userid } = useParams(); // URL에서 productid, userid 파라미터 추출
  const [product, setProduct] = useState(null); // 상품 데이터 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [message, setMessage] = useState(''); // 메시지 상태

  const SURL = import.meta.env.VITE_APP_URI;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${SURL}/admin/products`, {
          withCredentials: false,
        });
        const filteredProducts = response.data.filter(
          (product) => product.productId === parseInt(productid)
        );
        setProduct(filteredProducts[0]); // 첫 번째 상품만 설정
      } catch (error) {
        console.error('상품 조회 실패:', error);
        setError('상품 조회에 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productid]);

  // 액션 클릭 처리
  const handleActionClick = async (action) => {
    try {
      let response;
      switch (action) {
        case 'block':
          // 유저 계정 정지 API 호출
          response = await axios.put(
            `${SURL}/admin/users/${userid}/suspend`,
            {},
            { withCredentials: false }
          );
          setMessage('유저가 정지되었습니다.');
          break;
        case 'withdraw':
          alert('유저 탈퇴 처리');
          break;
        case 'delete':
          // 상품 삭제 API 호출
          response = await axios.delete(`${SURL}/admin/products/${productid}`, {
            withCredentials: false,
          });
          setMessage('상품이 삭제되었습니다.');
          // 삭제 후 /admin/product-list 페이지로 이동
          window.location.href = '/admin/product-list';
          break;
        default:
          break;
      }
      // API 호출 후 성공 메시지 처리
      if (response && response.data) {
        console.log(response.data);
      }
    } catch (error) {
      console.error('API 요청 실패:', error);
      setMessage('요청 처리에 실패했습니다.');
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
          {message && <Message>{message}</Message>}
        </Details>
      </Content>
    </Container>
  );
}

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

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
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

const Message = styled.div`
  margin-top: 20px;
  padding: 10px;
  color: #333;
  background-color: #f4f4f4;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

export default UserProduct;
