import React, { useState } from 'react';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';

// 더미 데이터 배열
const users = [
  { id: 1, name: '회원 1', image: 'https://via.placeholder.com/50' },
  { id: 2, name: '회원 2', image: 'https://via.placeholder.com/50' },
  { id: 3, name: '회원 3', image: 'https://via.placeholder.com/50' },
  { id: 4, name: '회원 4', image: 'https://via.placeholder.com/50' },
  { id: 5, name: '회원 5', image: 'https://via.placeholder.com/50' },
  { id: 6, name: '회원 6', image: 'https://via.placeholder.com/50' },
  { id: 3, name: '회원 3', image: 'https://via.placeholder.com/50' },
  { id: 4, name: '회원 4', image: 'https://via.placeholder.com/50' },
  { id: 5, name: '회원 5', image: 'https://via.placeholder.com/50' },
  { id: 6, name: '회원 6', image: 'https://via.placeholder.com/50' },
];

function UserList() {
  const [searchTerm, setSearchTerm] = useState('');

  // 검색 필터링 함수
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <SearchBar>
        <Title>회원 목록</Title>
        <SearchInput
          placeholder="회원 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <SearchButton>
          <FaSearch size={24} />
        </SearchButton>
      </SearchBar>

      <UserTable>
        {filteredUsers.map((user) => (
          <UserRow key={user.id}>
            <UserProfile>
              <UserImage src={user.image} alt="Profile" />
              <UserName>{user.name}</UserName>
            </UserProfile>
            <ActionButtons>
              <ActionButton>회원 정지</ActionButton>
              <ActionButton>회원 삭제</ActionButton>
              <ActionButton>등급 변경</ActionButton>
            </ActionButtons>
          </UserRow>
        ))}
      </UserTable>
    </Container>
  );
}

export default UserList;

const Container = styled.div`
  padding: 20px 40px;
  width: 1500px;
`;
const Title = styled.h1`
  font-size: 24px;
  color: #333;
  font-weight: 500;
  margin-right: 30px;
`;

const SearchBar = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  padding: 0px 20px;
  width: 500px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  item-self: flex-end;
`;

const SearchButton = styled.button`
  background-color: white;
  border: none;
  padding: 10px;
  margin-left: 10px;
  cursor: pointer;
  border-radius: 5px;
`;

const UserTable = styled.div`
  display: grid;
  width: 100%;
  gap: 20px;
  margin-top: 20px;
`;

const UserRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 5px;
  background-color: #fff;
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
`;

const UserImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
`;

const UserName = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  padding: 8px 12px;
  background-color: #f4f4f4;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #e0e0e0;
  }
`;
