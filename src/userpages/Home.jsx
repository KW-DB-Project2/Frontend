import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // axios import
import { FiLoader } from 'react-icons/fi'; // 로딩 아이콘 import
import { AuthContext } from '../context/AuthContext';
import LoginModal from '../modal/Login'; // 로그인 모달 import

function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const SURL = import.meta.env.VITE_APP_URI;
  const { token } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false); // 로그인 모달 상태
  const [sortOrder, setSortOrder] = useState('전체'); // 정렬 상태

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let response;
        // '전체'일 경우와 'desc'/'asc' 값에 따라 분기 처리
        if (sortOrder === '전체') {
          response = await axios.get(`${SURL}/product/mypage`, {
            withCredentials: false, // 쿠키를 포함시키지 않음
            headers: {
              Authorization: '', // 불필요한 헤더를 포함시키지 않도록 주의
            },
          });
        } else {
          response = await axios.get(`${SURL}/product/order`, {
            params: {
              descOrAsc: sortOrder, // 정렬 순서 파라미터
            },
            withCredentials: false,
          });
        }
        // 첫 번째 useEffect에서 상품 데이터 받아올 때
        const sortedProducts = response.data.sort((a, b) => {
          // 판매 중인 상품이 먼저 오도록 정렬
          return b.productStatus - a.productStatus;
        });

        setProducts(sortedProducts);
      } catch (error) {
        console.error('상품 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [sortOrder]); // sortOrder가 변경될 때마다 상품을 새로 fetch

  if (loading) {
    return (
      <LoadingContainer>
        <FiLoader size={40} className="loading-icon" />
        로딩 중...
      </LoadingContainer>
    ); // 로딩 중일 때 아이콘 표시
  }

  // 상품 클릭 시 token이 없으면 로그인 모달을 연다
  const handleProductClick = (e, productId) => {
    if (!token) {
      e.preventDefault(); // 클릭 이벤트 취소
      setIsModalOpen(true); // 로그인 모달 띄우기
    } else {
      navigate(`/product/${productId}`); // 로그인된 상태에서 상품 상세 페이지로 이동
    }
  };

  return (
    <Container>
      {/* 로그인 모달 */}
      <LoginModal
        showModal={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
      />
      <Title>상품 리스트</Title>
      {/* 정렬 드롭다운 추가 */}
      <SortSelect
        value={sortOrder} // 현재 정렬 순서에 맞게 선택된 값 표시
        onChange={(e) => setSortOrder(e.target.value)} // 정렬 상태 업데이트
      >
        <option value="전체">전체</option>
        <option value="desc">내림차순</option>
        <option value="asc">오름차순</option>
      </SortSelect>
      <span style={{ color: '#ccc' }}> * 5개만 정렬 *</span>

      <ProductList>
        {products.map((product) => (
          <ProductCard
            key={product.productId}
            status={product.productStatus} // 상태값 전달
          >
            <StyledLink
              to={`/product/${product.productId}`}
              onClick={(e) => handleProductClick(e, product.productId)}
            >
              <ProductImageWrapper>
                <ProductImage
                  src={
                    product.productImg
                      ? `data:image/jpeg;base64,${product.productImg}`
                      : 'https://via.placeholder.com/300x300?text=No+Image'
                  }
                  alt={product.productTitle}
                />
                {!product.productStatus && (
                  <SoldOutOverlay>판매 완료</SoldOutOverlay> // 상태가 0일 때 "판매 완료" 표시
                )}
              </ProductImageWrapper>
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

export default Home;

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
  opacity: ${(props) =>
    props.status ? 1 : 0.5}; /* status가 false이면 흐리게 */
  position: relative;
  transition: opacity 0.3s ease;
`;

const ProductImageWrapper = styled.div`
  position: relative;
`;

const SoldOutOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  border-radius: 5px;
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

const SortSelect = styled.select`
  color: #333;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  margin-top: 10px;
  padding: 5px 10px;
  align-self: flex-start;
  cursor: pointer;

  &:hover {
    border-color: #666;
  }
`;
