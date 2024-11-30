import React, { useState, useEffect } from 'react';
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
      <ProductList>
        {products.map((product) => (
          <ProductCard key={product.productId}>
            <StyledLink
              to={`/product/${product.productId}`}
              onClick={(e) => handleProductClick(e, product.productId)} // 상품 클릭 시 로그인 확인
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
