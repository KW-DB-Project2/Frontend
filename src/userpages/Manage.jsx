// 상품 관리 페이지
import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

/* 아이콘 import*/
import { FaSearch } from 'react-icons/fa';

function Manage() {
  const navigate = useNavigate();

  const goToAdd = () => {
    navigate('/add'); // 상품 관리 페이지로 이동
  };

  return (
    <Container>
      <ButtonContainer>
        <LeftDiv onClick={goToAdd}>상품 등록</LeftDiv>
        <VerticalBar />
        <RightDiv>상품 관리</RightDiv>
      </ButtonContainer>
      <Bottombar />
      <SearchContainer>
        <SearchInput type="text" placeholder="상품명을 입력하세요" />
        <SearchButton>
          <FaSearch size={27} color="#333" />
        </SearchButton>
      </SearchContainer>
      <TitleBottombar />
      <Attribute></Attribute>
      <TitleBottombar />
    </Container>
  );
}
export default Manage;

const Container = styled.div`
  padding: 20px;
  margin-top: 0;
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
  height: 30px; /* 수직선의 높이를 설정 */
  background-color: #ccc; /* 수직선 색상 */
  margin: 10px 20px 0 20px; /* 버튼 간의 간격을 설정 */
`;

const Bottombar = styled.div`
  width: 1500px;
  height: 1px;
  background-color: #f0f0f0;
`;

/* 검색창 */
const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 40px 0px;
`;

const SearchInput = styled.input`
  padding: 8px 15px;
  border: 2px solid #ccc;
  margin-right: 10px;
  border-radius: 15px;
  width: 550px;
  height: 30px;
  font-size: 20px;
`;

const SearchButton = styled.button`
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

const Attribute = styled.div``;
