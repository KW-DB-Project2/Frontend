import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

/* 토큰 Context */
import { AuthContext } from '../context/AuthContext';

/* 모달창 임포트 */
import LoginModal from '../modal/Login';

/* 아이콘 import*/
import { FaSearch, FaDollarSign, FaStore } from 'react-icons/fa';

function Navbar() {
  const { user, token, logout } = useContext(AuthContext); // token, logout 가져오기
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
      // 검색어가 있을 경우, 검색 결과 페이지로 이동
      navigate(`/search?query=${searchQuery}`);
    } else {
      // 검색어가 없을 경우, 홈으로 이동
      navigate('/');
    }
  };

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    try {
      await axios.post(
        `${SURL}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 로그아웃 성공 시 처리
      logout(); // Context에서 로그아웃 처리
      alert('로그아웃 완료');
      navigate('/');
    } catch (error) {
      console.error('로그아웃 중 오류 발생', error);
    }
  };

  // 판매하기/내상점 버튼 클릭 처리
  const handleButtonClick = (path) => {
    if (token) {
      navigate(path); // 로그인된 상태에서 페이지로 이동
    } else {
      openModal(); // 로그인 안된 상태면 로그인 모달 띄우기
    }
  };

  return (
    <NavbarContainer>
      <TopBar>
        {/* 관리자 로그인 버튼 */}
        <Left>
          {user && user.role === 'ADMIN' && (
            <TopButton as={Link} to="/admin/product-list">
              관리자 페이지
            </TopButton>
          )}
        </Left>
        {/* 로그인/회원가입 버튼, 판매하기, 내상점 */}
        <Right>
          {token ? (
            <>
              <TopButton onClick={handleLogout}>로그아웃</TopButton>
            </>
          ) : (
            <TopButton onClick={openModal}>로그인/회원가입</TopButton>
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
            <FaSearch size={27} color="#333" />
          </SearchButton>
        </SearchContainer>
        {/*판매하기, 내상점 */}
        <ButtonContainer>
          <NavButton onClick={() => handleButtonClick('/add')}>
            <FaDollarSign size={20} /> 판매하기
          </NavButton>
          <NavButton onClick={() => handleButtonClick('/mypage')}>
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
  padding: 15px 0;
  border-bottom: 3px solid #333;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
`;

// TopBar
const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  margin-bottom: 30px;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  margin-left: 20px;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  margin-right: 50px;
`;

const TopButton = styled.div`
  background: none;
  color: #333;
  border: none;
  padding: 0px 15px;
  margin: 0 10px;
  cursor: pointer;
  font-size: 17px;

  &:hover {
    color: #333;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const NavButton = styled.div`
  font-family: 'Do Hyeon', sans-serif;
  background: none;
  color: #333;
  border: none;
  padding: 8px 15px;
  margin: 0 10px;
  cursor: pointer;
  font-size: 23px;

  &:hover {
    color: #333;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const BottomBar = styled.div`
  text-align: center;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between; /* Market 이름과 검색창을 양쪽에 배치 */
  align-items: center;
  gap: 10px; /* 요소 간 간격 */
`;

const MarketName = styled(Link)`
  font-family: 'Bayon', sans-serif;
  font-size: 43px;
  color: #333;
  text-decoration: none;
  font-weight: 600;
  margin-left: 130px;

  &:hover {
    color: #333;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

/* 검색창 */
const SearchContainer = styled.div`
  display: flex;
  align-items: center;
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
/* 판매하기, 내상점 container*/
const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 130px;
`;

export default Navbar;
