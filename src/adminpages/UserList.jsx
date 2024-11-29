import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSearch, FaUserCircle } from 'react-icons/fa'; // Profile Icon으로 FaUserCircle 사용
import axios from 'axios'; // axios import

function UserList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);

  const SURL = import.meta.env.VITE_APP_URI;

  // 백엔드에서 모든 유저 데이터 가져오기
  useEffect(() => {
    axios
      .get(`${SURL}/admin/users`) // 백엔드 URL로 사용자 목록 요청
      .then((response) => {
        setUsers(response.data); // 응답받은 사용자 목록을 상태에 저장
      })
      .catch((error) => {
        console.error('유저 목록을 가져오는 데 실패했습니다:', error);
      });
  }, []);

  // 검색 필터링 함수
  const filteredUsers = users.filter(
    (user) => user.username.toLowerCase().includes(searchTerm.toLowerCase()) // 검색어에 맞는 사용자 필터링
  );

  // 유저 정지 함수
  const suspendUser = (userId) => {
    axios
      .put(`${SURL}/admin/users/${userId}/suspend`) // 유저 정지 API 요청
      .then((response) => {
        alert('유저가 정지되었습니다.');
        // 정지 후 상태 업데이트 (예: 유저 목록에서 정지된 사용자 제거)
      })
      .catch((error) => {
        console.error('유저 정지에 실패했습니다:', error);
        alert('유저 정지에 실패했습니다.');
      });
  };

  return (
    <Container>
      <SearchBar>
        <Title>유저 목록</Title>
        <SearchInput
          placeholder="유저 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // 검색어 상태 업데이트
        />
        <SearchButton>
          <FaSearch size={24} />
        </SearchButton>
      </SearchBar>
      <UserTable>
        {filteredUsers.map((user) => (
          <UserRow key={user.id}>
            <UserProfile>
              <ProfileIcon>
                <FaUserCircle size={50} color="#ccc" />
              </ProfileIcon>
              <UserName>{user.username}</UserName>
            </UserProfile>
            <ActionButtons>
              <ActionButton onClick={() => suspendUser(user.id)}>
                유저 정지
              </ActionButton>
              <ActionButton>유저 탈퇴</ActionButton>
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

const ProfileIcon = styled.div`
  width: 50px;
  height: 50px;
  margin-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: #f0f0f0;
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
