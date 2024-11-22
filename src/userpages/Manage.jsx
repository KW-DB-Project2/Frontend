import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

function Manage() {
  const navigate = useNavigate();

  const goToAdd = () => {
    navigate('/add'); // 상품 등록 페이지로 이동
  };

  const [selectedStatus, setSelectedStatus] = useState('전체'); // 선택된 상태 관리
  const [searchKeyword, setSearchKeyword] = useState(''); // 검색어 상태 관리

  const handleStatusClick = (status) => {
    setSelectedStatus(status); // 상태 버튼 클릭 시 선택 상태 업데이트
  };

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value); // 검색 입력값 업데이트
  };

  const products = [
    {
      id: 1,
      image: 'https://via.placeholder.com/50',
      status: '판매중',
      name: '스마트폰',
      price: '1,000,000원',
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/50',
      status: '판매완료',
      name: '노트북',
      price: '2,000,000원',
    },
    {
      id: 3,
      image: 'https://via.placeholder.com/50',
      status: '판매중',
      name: '태블릿',
      price: '800,000원',
    },
    {
      id: 4,
      image: 'https://via.placeholder.com/50',
      status: '판매중',
      name: '무선 이어폰',
      price: '200,000원',
    },
    {
      id: 5,
      image: 'https://via.placeholder.com/50',
      status: '판매완료',
      name: '스마트 워치',
      price: '300,000원',
    },
    {
      id: 6,
      image: 'https://via.placeholder.com/50',
      status: '판매중',
      name: '모니터',
      price: '500,000원',
    },
    {
      id: 7,
      image: 'https://via.placeholder.com/50',
      status: '판매완료',
      name: '키보드',
      price: '150,000원',
    },
    {
      id: 8,
      image: 'https://via.placeholder.com/50',
      status: '판매중',
      name: '마우스',
      price: '50,000원',
    },
  ];

  // 검색과 상태에 따른 상품 필터링
  const filteredProducts = products.filter((product) => {
    const matchesStatus =
      selectedStatus === '전체' || product.status === selectedStatus; // 상태 필터링
    const matchesKeyword = product.name
      .toLowerCase()
      .includes(searchKeyword.toLowerCase()); // 검색어 필터링
    return matchesStatus && matchesKeyword;
  });

  return (
    <Container>
      <ButtonContainer>
        <LeftDiv onClick={goToAdd}>상품 등록</LeftDiv>
        <VerticalBar />
        <RightDiv>상품 관리</RightDiv>
      </ButtonContainer>
      <Bottombar />
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="상품명을 입력하세요"
          value={searchKeyword}
          onChange={handleSearchChange}
        />
        <SearchButton>
          <FaSearch size={27} color="#333" />
        </SearchButton>
        <StatusContainer>
          <StatusButton
            onClick={() => handleStatusClick('전체')}
            selected={selectedStatus === '전체'}
          >
            전체
          </StatusButton>
          <StatusButton
            onClick={() => handleStatusClick('판매중')}
            selected={selectedStatus === '판매중'}
          >
            판매중
          </StatusButton>
          <StatusButton
            onClick={() => handleStatusClick('판매완료')}
            selected={selectedStatus === '판매완료'}
          >
            판매완료
          </StatusButton>
        </StatusContainer>
      </SearchContainer>
      <TitleBottombar />
      <Attribute>
        <AttributeItem width="150px">사진</AttributeItem>
        <AttributeItem width="200px">판매상태</AttributeItem>
        <AttributeItem width="150px">상품명</AttributeItem>
        <AttributeItem width="140px">가격</AttributeItem>
        <AttributeItem width="130px">기능</AttributeItem>
      </Attribute>
      <TitleBottombar />
      <ProductContainer>
        {/* 필터링된 상품 렌더링 */}
        {filteredProducts.map((product) => (
          <ProductRow key={product.id}>
            <ProductItem width="150px">
              <Image src={product.image} alt={product.name} />
            </ProductItem>
            <ProductItem width="200px">{product.status}</ProductItem>
            <ProductItem width="150px">{product.name}</ProductItem>
            <ProductItem width="150px">{product.price}</ProductItem>
            <ProductItem width="100px">
              <Button>수정</Button>
              <Button>삭제</Button>
            </ProductItem>
          </ProductRow>
        ))}
      </ProductContainer>
    </Container>
  );
}

export default Manage;

const Container = styled.div`
  padding: 20px;
  margin-top: 0;
  position: fixed; /* 화면에 고정 */
  top: 23.8%;
`;

const ButtonContainer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  padding-bottom: 30px;
  width: 240px;
`;

const LeftDiv = styled.div`
  background-color: white;
  color: #333;
  display: inline-block;
  padding: 10px;
  font-size: 17px;
  cursor: pointer;
  text-align: center;

  &:hover {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }
`;

const RightDiv = styled.div`
  background-color: white;
  color: red;
  display: inline-block;
  padding: 10px;
  font-size: 17px;
  cursor: pointer;
  text-align: center;

  &:hover {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const VerticalBar = styled.div`
  width: 1px;
  height: 30px;
  background-color: #ccc;
  margin: 10px 20px 0 20px;
`;

const Bottombar = styled.div`
  width: 1500px;
  height: 1px;
  background-color: #f0f0f0;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0px;
`;

const SearchInput = styled.input`
  padding: 8px 15px;
  border: 2px solid #ccc;
  margin-right: 10px;
  border-radius: 15px;
  width: 550px;
  height: 30px;
  font-size: 17px;
`;

const SearchButton = styled.div`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 10px;

  &:hover {
    opacity: 0.7;
  }
`;

const TitleBottombar = styled.div`
  width: 1500px;
  height: 3px;
  background-color: #333;
`;

const StatusContainer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: flex-end; /* 오른쪽 정렬 */
  width: 100%; /* 전체 너비 차지 */
`;

const StatusButton = styled.div`
  color: ${(props) =>
    props.selected ? 'red' : '#333'}; // isSelected 대신 selected 사용
  display: inline-block;
  padding: 10px;
  font-size: 17px;
  cursor: pointer;
  text-align: center;
  margin-left: 10px;
  border-radius: 5px;

  &:hover {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const Attribute = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px 50px;
`;

const AttributeItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: ${(props) => props.width || 'auto'};
  text-align: center;
  font-weight: 500;
  color: #333;
  font-size: 17px;
`;

/* 상품 리스트 */
const ProductContainer = styled.div`
  max-height: 380px; /* 컨테이너 최대 높이 지정 */
  overflow-y: auto; /* 수직 스크롤 활성화 */
`;

const ProductRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 50px;
  border-bottom: 1px solid #ddd;
`;

const ProductItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* 수직 방향으로도 가운데 정렬 */
  width: ${(props) => props.width || 'auto'};
  height: ${(props) => props.height || 'auto'}; /* 필요하다면 높이 지정 */
  text-align: center;
  color: #333;
  font-size: 17px;
`;

const Image = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
`;

const Button = styled.div`
  background-color: white;
  border: 1px solid #ccc;
  padding: 5px 30px;
  cursor: pointer;
  font-size: 15px;
  border-radius: 5px;
  margin: 5px;
  color: red;
  &:hover {
    border: 1px solid red;
  }
`;
