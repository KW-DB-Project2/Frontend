import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiLoader } from 'react-icons/fi'; // 로딩 아이콘 import
import LoginModal from '../modal/Login'; // 로그인 모달 import

function Search() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
  const location = useLocation();
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅

  // 토큰 확인 (토큰이 없으면 모달 띄우기)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsModalOpen(true); // 모달 열기
    }
  }, []);

  // 쿼리 파라미터에서 'query' 값을 가져옵니다.
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query');

  useEffect(() => {
    if (query) {
      setLoading(true);

      // API 호출을 통해 상품 검색
      axios
        .get(`${import.meta.env.VITE_APP_URI}/product/search`, {
          params: { query }, // 쿼리 파라미터로 검색어를 전달
        })
        .then((response) => {
          console.log(response.data);
          setSearchResults(response.data); // 응답 데이터로 결과 업데이트
          setLoading(false);
        })
        .catch((error) => {
          console.error('상품 데이터를 가져오는 중 오류 발생:', error);
          setLoading(false);
        });
    } else {
      setSearchResults([]); // 검색어가 없으면 결과를 비웁니다.
      setLoading(false);
    }
  }, [query]); // query가 변경될 때마다 검색을 다시 실행

  // 상품 클릭 시 토큰 확인 후 처리
  const handleProductClick = (productId) => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate(`/product/${productId}`); // 토큰이 있으면 해당 상품 페이지로 이동
    } else {
      setIsModalOpen(true); // 토큰이 없으면 로그인 모달 띄우기
    }
  };

  return (
    <SearchContainer>
      {isModalOpen && <LoginModal closeModal={() => setIsModalOpen(false)} />}{' '}
      {/* 로그인 모달 */}
      <Title>검색 결과</Title>
      {loading ? (
        <LoadingContainer>
          <FiLoader size={40} className="loading-icon" />
          상품 검색 중...
        </LoadingContainer>
      ) : searchResults.length > 0 ? (
        <ResultsList>
          {searchResults.map((product) => (
            <ProductCard key={product.productId} status={product.productStatus}>
              <StyledLink
                to={`/product/${product.productId}`}
                onClick={() => handleProductClick(product.productId)}
              >
                <ProductImage
                  src={`data:image/jpeg;base64,${product.productImg}`}
                  alt={product.productTitle}
                />
                <ProductInfo>
                  <ProductTitle>{product.productTitle}</ProductTitle>
                  <Probottom>
                    <ProductPrice>
                      {product.productPrice.toLocaleString()}원
                    </ProductPrice>
                    <ProductTime>{product.productTime}</ProductTime>
                  </Probottom>
                </ProductInfo>
              </StyledLink>
              {!product.productStatus && (
                <StatusOverlay>판매완료</StatusOverlay>
              )}
            </ProductCard>
          ))}
        </ResultsList>
      ) : (
        <NoResultsMessage>검색 결과가 없습니다.</NoResultsMessage>
      )}
    </SearchContainer>
  );
}

const SearchContainer = styled.div`
  padding: 20px;
  margin-top: 0;
`;

const Title = styled.h1`
  font-size: 27px;
  color: #333;
  font-weight: 500;
`;

const ResultsList = styled.div`
  display: grid;
  gap: 20px;
  margin-top: 20px;
  grid-template-columns: repeat(4, 1fr);
`;

const ProductCard = styled.div`
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: relative;
  opacity: ${(props) =>
    props.status ? 1 : 0.5}; /* status가 false이면 흐리게 */
  transition: opacity 0.3s ease;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
`;

const ProductInfo = styled.div`
  padding: 15px;
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

const NoResultsMessage = styled.p`
  font-size: 23px;
  color: #666;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;

  &:hover {
    color: #333;
  }
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

const StatusOverlay = styled.div`
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

export default Search;
