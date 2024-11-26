import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiLoader } from 'react-icons/fi'; // 로딩 아이콘 import

function Search() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

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

  return (
    <SearchContainer>
      <Title>검색 결과</Title>
      {loading ? (
        <LoadingContainer>
          <FiLoader size={40} className="loading-icon" />
          상품 검색 중...
        </LoadingContainer>
      ) : searchResults.length > 0 ? (
        <ResultsList>
          {searchResults.map((product) => (
            <ProductCard key={product.productId}>
              <StyledLink to={`/product/${product.productId}`}>
                <ProductImage
                  src={`data:image/jpeg;base64,${product.productImg}`} // 이미지 처리 방식
                  alt={product.productTitle}
                />
                <ProductInfo>
                  <h3>{product.productTitle}</h3>
                  <p>{product.productPrice}원</p>
                </ProductInfo>
              </StyledLink>
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
  gap: 10px;
  margin-top: 20px;
  grid-template-columns: repeat(5, 1fr);
`;

const ProductCard = styled.div`
  width: 300px;
  border: 1px solid #ccc;
  text-align: center;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const ProductImage = styled.img`
  width: 100%;
  height: auto;
`;

const ProductInfo = styled.div`
  margin-top: 10px;
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

export default Search;
