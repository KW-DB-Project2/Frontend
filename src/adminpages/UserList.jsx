import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { FaSearch, FaUserCircle } from 'react-icons/fa'; // Profile Icon으로 FaUserCircle 사용
import axios from 'axios'; // axios import
// 컴포넌트 임포트
import { AuthContext } from '../context/AuthContext';

function UserList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const { token } = useContext(AuthContext);
  const SURL = import.meta.env.VITE_APP_URI;

  // 백엔드에서 모든 유저 데이터 가져오기
  useEffect(() => {
    axios
      .get(`${SURL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`, // 인증 토큰
        },
      }) // 백엔드 URL로 사용자 목록 요청
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
    if (window.confirm('유저를 정지 하겠습니까?')) {
      axios
        .put(
          `${SURL}/admin/users/${userId}/suspend`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`, // 인증 토큰
            },
          }
        ) // 유저 정지 API 요청
        .then((response) => {
          alert('유저가 정지되었습니다.');
          // 정지 후 상태 업데이트 (예: 유저 목록에서 정지된 사용자 제거)
        })
        .catch((error) => {
          console.error('유저 정지에 실패했습니다:', error);
          alert('유저 정지에 실패했습니다.');
        });
    }
  };

  // 유저 탈퇴 함수
  const deleteUser = (userId) => {
    if (window.confirm('유저를 탈퇴시키겠습니까?')) {
      axios
        .delete(
          `${SURL}/admin/delete/${userId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`, // 인증 토큰
            },
          }
        ) // 유저 탈퇴 API 요청
        .then((response) => {
          alert('유저가 탈퇴 처리되었습니다.');
          // 탈퇴 후 유저 목록 상태 업데이트
          setUsers(users.filter((user) => user.id !== userId));
        })
        .catch((error) => {
          console.error('유저 탈퇴에 실패했습니다:', error);
          alert('유저 탈퇴에 실패했습니다.');
        });
    }
  };

  // 유저 등급 변경 함수
  const changeUserRank = (userId, userrole) => {
    console.log(userrole);
    const endpoint =
      userrole === 'ADMIN' // 등급 낮추기
        ? `${SURL}/admin/users/${userId}/rank/change`
        : userrole === 'USER' // 관리자로 올리기
        ? `${SURL}/admin/users/${userId}/rank/admin`
        : null;
    if (window.confirm('유저 등급 변경 하시겠습니까?')) {
      axios
        .put(
          endpoint,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`, // 인증 토큰
            },
          }
        ) // 유저 등급 변경 API 요청
        .then((response) => {
          alert('유저 등급이 변경되었습니다.');
        })
        .catch((error) => {
          console.error('유저 등급 변경에 실패했습니다:', error);
          alert('유저 등급 변경에 실패했습니다.');
        });
    }
  };

  return (
    <Container>
      <SearchBar>
        <Title>👥 유저 목록</Title>
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
              <UserInfo>
                <UserName>{user.username}</UserName>
                <UserRole>
                  {user.role === 'USER' ? '사용자' : '관리자'}
                </UserRole>
                <UserRole style={{ color: 'red' }}>
                  {user.role === 'BAN'
                    ? ' 유저 정지 상태입니다.'
                    : '정지 상태 아님'}
                </UserRole>
              </UserInfo>
            </UserProfile>
            <ActionButtons>
              <ActionButton onClick={() => suspendUser(user.id)}>
                유저 정지
              </ActionButton>
              <ActionButton onClick={() => deleteUser(user.id)}>
                유저 탈퇴
              </ActionButton>
              <ActionButton onClick={() => changeUserRank(user.id, user.role)}>
                등급 변경
              </ActionButton>
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
  font-weight: 600;
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

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserRole = styled.div`
  font-size: 14px;
  color: #666;
  margin-top: 5px;
  font-weight: normal;
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
