import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

function AdminNavbar() {
  return (
    <NavbarContainer>
      <MarketName to="/">
        Market <AdminText>관리자</AdminText>
      </MarketName>
      {/* MarketName 추가 */}
      <NavbarItem to="/admin/Product-List" active>
        등록된 상품
      </NavbarItem>
      <NavbarItem to="/admin/review-list">후기 게시판</NavbarItem>
      <NavbarItem to="/admin/product-reports">신고 목록</NavbarItem>
      <NavbarItem to="/admin/user-list">회원 목록</NavbarItem>
      <NavbarItem to="/admin/sales-volume">월별 거래량</NavbarItem>
    </NavbarContainer>
  );
}

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: white;
  padding: 30px 20px;
  border-bottom: 2px solid #333;
  width: 100%; /* 화면 전체 너비 */
  position: fixed; /* 화면 상단에 고정 */
  top: 0; /* 상단에서 0px */
  z-index: 1000; /* 다른 요소보다 위에 표시 */
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
`;

const MarketName = styled(Link)`
  font-family: 'Bayon', sans-serif;
  font-size: 43px;
  color: #333;
  text-decoration: none;
  font-weight: 600;

  &:hover {
    color: #333;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const AdminText = styled.span`
  font-size: 15px; /* 관리자 폰트 크기 */
  margin-left: 5px; /* Market과의 간격을 조정 */
  font-weight: 600;
  color: #555;
`;

const NavbarItem = styled(Link)`
  text-decoration: none;
  font-size: 17px;
  color: ${(props) => (props.active ? '#000' : '#555')};
  font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
  position: relative;

  &:hover {
    color: #000;
  }

  ${(props) =>
    props.active &&
    `&::after {
      content: "";
      position: absolute;
      width: 100%;
      height: 2px;
      background-color: #000;
      bottom: -5px;
      left: 0;
    }`}
`;

export default AdminNavbar;
