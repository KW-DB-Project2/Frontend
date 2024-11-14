import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

function Search() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // 쿼리 파라미터에서 'query' 값을 가져옵니다.
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query');

  // 상품 목록 예시
  const dummyProducts = [
    {
      id: 1,
      name: '상품 1',
      price: '10,000원',
      imageUrl: 'https://via.placeholder.com/150?text=상품1',
    },
    {
      id: 2,
      name: '상품 2',
      price: '20,000원',
      imageUrl: 'https://via.placeholder.com/150?text=상품2',
    },
    {
      id: 3,
      name: '상품 3',
      price: '30,000원',
      imageUrl: 'https://via.placeholder.com/150?text=상품3',
    },
    {
      id: 4,
      name: '상품 4',
      price: '40,000원',
      imageUrl: 'https://via.placeholder.com/150?text=상품4',
    },
    {
      id: 5,
      name: '상품 5',
      price: '50,000원',
      imageUrl: 'https://via.placeholder.com/150?text=상품5',
    },
    {
      id: 6,
      name: '상품 6',
      price: '60,000원',
      imageUrl: 'https://via.placeholder.com/150?text=상품6',
    },
    {
      id: 7,
      name: '상품 7',
      price: '70,000원',
      imageUrl: 'https://via.placeholder.com/150?text=상품7',
    },
    {
      id: 8,
      name: '상품 8',
      price: '80,000원',
      imageUrl: 'https://via.placeholder.com/150?text=상품8',
    },
    {
      id: 9,
      name: '상품 9',
      price: '90,000원',
      imageUrl: 'https://via.placeholder.com/150?text=상품9',
    },
    {
      id: 10,
      name: '상품 10',
      price: '100,000원',
      imageUrl: 'https://via.placeholder.com/150?text=상품10',
    },
  ];

  useEffect(() => {
    // 검색어가 있으면 검색 결과를 가져옵니다.
    if (query) {
      const fetchResults = async () => {
        setLoading(true);

        // query와 일치하는 상품을 필터링
        const filteredResults = dummyProducts.filter((product) =>
          product.name.toLowerCase().includes(query.toLowerCase())
        );

        setSearchResults(filteredResults);
        setLoading(false);
      };
      fetchResults();
    } else {
      setSearchResults([]); // 검색어가 없으면 결과를 비웁니다.
      setLoading(false);
    }
  }, [query]); // query가 바뀔 때마다 검색 결과를 새로 가져옵니다.

  return (
    <SearchContainer>
      <Title>검색 결과</Title>
      {loading ? (
        <LoadingMessage>검색 중...</LoadingMessage>
      ) : searchResults.length > 0 ? (
        <ResultsList>
          {searchResults.map((product) => (
            <ResultItem key={product.id}>
              <ProductImage src={product.imageUrl} alt={product.name} />
              <ProductInfo>
                <h3>{product.name}</h3>
                <p>{product.price}</p>
              </ProductInfo>
            </ResultItem>
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
  margin-bottom: 20px;
`;

const LoadingMessage = styled.p`
  font-size: 17px;
  color: #333;
`;

const ResultsList = styled.div`
  display: grid;
  gap: 10px;
  margin-top: 20px;
  grid-template-columns: repeat(5, 1fr);
`;

const ResultItem = styled.div`
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
  font-size: 17px;
  color: #666;
`;

export default Search;
