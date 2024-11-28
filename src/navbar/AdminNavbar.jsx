import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

function AdminNavbar() {
  // 선택된 버튼 상태 관리
  const [activeItem, setActiveItem] = useState('/admin/Product-List');

  return (
    <NavbarContainer>
      <MarketName to="/">
        Market <AdminText>관리자</AdminText>
      </MarketName>

      <NavbarItem
        to="/admin/Product-List"
        active={activeItem === '/admin/Product-List'}
        onClick={() => setActiveItem('/admin/Product-List')}
      >
        등록된 상품
      </NavbarItem>
      <NavbarItem
        to="/admin/review-list"
        active={activeItem === '/admin/review-list'}
        onClick={() => setActiveItem('/admin/review-list')}
      >
        후기 게시판
      </NavbarItem>
      <NavbarItem
        to="/admin/product-reports"
        active={activeItem === '/admin/product-reports'}
        onClick={() => setActiveItem('/admin/product-reports')}
      >
        신고 목록
      </NavbarItem>
      <NavbarItem
        to="/admin/user-list"
        active={activeItem === '/admin/user-list'}
        onClick={() => setActiveItem('/admin/user-list')}
      >
        회원 목록
      </NavbarItem>
      <NavbarItem
        to="/admin/sales-volume"
        active={activeItem === '/admin/sales-volume'}
        onClick={() => setActiveItem('/admin/sales-volume')}
      >
        월별 거래량
      </NavbarItem>
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
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 1000;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
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
  font-size: 15px;
  margin-left: 5px;
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
