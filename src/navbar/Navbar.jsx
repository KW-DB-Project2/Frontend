import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

/* 인증 관련 Context */
import { AuthContext } from '../context/AuthContext';

/* 모달창 임포트 */
import LoginModal from '../modal/Login';

/* 아이콘 import*/
import { FaSearch, FaDollarSign, FaStore } from 'react-icons/fa';

function Navbar() {
  const { token, logout } = useContext(AuthContext); // user, token, logout 가져오기
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태
  const navigate = useNavigate();
  const SURL = import.meta.env.VITE_APP_URI;

  // 모달 열기
  const openModal = () => setIsModalOpen(true);
  // 모달 닫기
  const closeModal = () => setIsModalOpen(false);

  // 검색어 변경 함수
  const handleSearchChange = (event) => setSearchQuery(event.target.value);

  //입력창 엔터 시 함수
  const handleSearchKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };
  // 검색 버튼 클릭 함수 (검색 동작 추가 가능)
  const handleSearch = () => {
    if (searchQuery) {
      console.log('검색어:', searchQuery);
      // 여기에 실제 검색 기능을 추가하거나, 검색 결과를 처리할 수 있음
      // 검색어를 쿼리 파라미터로 전달하여 / 경로로 이동
      navigate(`/search?query=${searchQuery}`);
    }
  };

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    try {
      await axios.get(`${SURL}/logout`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // 로그아웃 성공 시 처리
      logout(); // Context에서 로그아웃 처리
      alert('로그아웃 완료');
      navigate('/');
    } catch (error) {
      console.error('로그아웃 중 오류 발생', error);
    }
  };

  return (
    <NavbarContainer>
      <TopBar>
        {/* 관리자 로그인 버튼 */}
        <Left>
          <NavButton as={Link} to="/admin/product-list">
            관리자 페이지
          </NavButton>
        </Left>
        {/* 로그인/회원가입 버튼, 판매하기, 내상점 */}
        <Right>
          {token ? (
            <>
              <NavButton onClick={handleLogout}>로그아웃</NavButton>
            </>
          ) : (
            <NavButton onClick={openModal}>로그인/회원가입</NavButton>
          )}
          {/* 로그인 모달 */}
          <LoginModal showModal={isModalOpen} closeModal={closeModal} />
        </Right>
      </TopBar>
      <BottomBar>
        {/* Market 이름 */}
        <MarketName to="/">Market</MarketName>
        {/* 검색창 */}
        <SearchContainer>
          <SearchInput
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyPress={handleSearchKeyPress}
            placeholder="검색어를 입력하세요"
          />

          <SearchButton onClick={handleSearch}>
            <FaSearch size={25} color="#333" />
          </SearchButton>
        </SearchContainer>
        {/*판매하기, 내상점 */}
        <ButtonContainer>
          <NavButton as={Link} to="/add">
            <FaDollarSign size={15} /> 판매하기
          </NavButton>
          <NavButton as={Link} to="/mypage">
            <FaStore /> 내상점
          </NavButton>
        </ButtonContainer>
      </BottomBar>
    </NavbarContainer>
  );
}

// 스타일링
const NavbarContainer = styled.div`
  background-color: white;
  position: fixed; /* 고정 위치 */
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1000; /* 다른 요소보다 위에 나타나게 하기 */
  padding: 20px 0;
  border-bottom: 3px solid #333;
`;

// TopBar
const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 30px;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
`;

const NavButton = styled.button`
  color: #333;
  border: none;
  padding: 8px 15px;
  margin: 0 10px;
  cursor: pointer;
  font-size: 17px;

  &:hover {
    color: #333;
    font-weight: 600;
  }
`;

const BottomBar = styled.div`
  text-align: center;
  margin-bottom: 40px;
  display: flex;
  justify-content: space-between; /* Market 이름과 검색창을 양쪽에 배치 */
  align-items: center;
  gap: 30px; /* 요소 간 간격 */
`;

const MarketName = styled(Link)`
  font-size: 27px;
  color: #333;
  text-decoration: none;
  font-weight: 600;
  margin-left: 80px;
  &:hover {
    color: #333;
  }
`;

/* 검색창 */
const SearchContainer = styled.div`
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 8px 15px;
  font-size: 17px;
  border: 1px solid #ccc;
  margin-right: 10px;
  border-radius: 5px;
  width: 500px;
  height: 25px;
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
/* 판매하기, 내상점 container*/
const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 80px;
`;

export default Navbar;
