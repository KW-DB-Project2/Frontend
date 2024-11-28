import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
// 컴포넌트 임포트
import { AuthContext } from '../context/AuthContext';

function Review({ productid }) {
  const [reviews, setReviews] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const { token } = useContext(AuthContext); // AuthContext에서 사용자 정보 가져오기
  const navigate = useNavigate(); // 네비게이션 훅

  // 상품 리뷰를 가져오는 API 호출
  useEffect(() => {
    const fetchProductReviews = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_URI}/reviews/product/${productid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReviews(response.data); // 실제 리뷰 데이터 사용
      } catch (error) {
        console.error('리뷰를 가져오는 중 오류 발생:', error);
        setReviews([]); // 에러 발생 시 리뷰 없다고 설정
      }
    };

    if (productid) {
      fetchProductReviews();
    }
  }, [productid, token]);

  // 리뷰 검색 API 호출
  const fetchReviews = async (keyword) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_URI}/reviews/search`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { keyword },
        }
      );
      setReviews(response.data); // 검색된 리뷰 데이터 사용
    } catch (error) {
      console.error('리뷰 검색 중 오류 발생:', error);
    }
  };

  // 검색 키워드 입력 시 업데이트
  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  // 검색 버튼 클릭 시 호출
  const handleSearchClick = () => {
    if (searchKeyword.trim() !== '') {
      fetchReviews(searchKeyword.trim());
    }
  };

  // 리뷰 수정/삭제 버튼 클릭 시 해당 리뷰의 reviewid를 기반으로 이동
  const handleEditClick = (reviewid) => {
    navigate(`/write-review/${productid}/${reviewid}`);
  };

  return (
    <BoardSection>
      <BoardTitle>
        Review
        {/* 리뷰 검색 */}
        <SearchContainer>
          <SearchInput
            type="text"
            value={searchKeyword}
            onChange={handleSearchChange}
            placeholder="리뷰 검색어를 입력하세요..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearchClick();
              }
            }}
          />
          <SearchButton onClick={handleSearchClick}>
            <FaSearch size={23} color="#333" />
          </SearchButton>
        </SearchContainer>
        <RightAlign>
          {/* 글쓰기 버튼 */}
          <WriteButton onClick={() => navigate(`/write-review/${productid}`)}>
            글쓰기
          </WriteButton>
        </RightAlign>
      </BoardTitle>
      <BoardList>
        {reviews.map((review, index) => (
          <BoardItem key={index}>
            <BoardContent>
              <BoardUser>{review.username}</BoardUser>
              <ButtonContainer>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    width: '100%',
                  }}
                >
                  {/* 수정/삭제 버튼 */}
                  <EditButton onClick={() => handleEditClick(review.reviewId)}>
                    게시글 수정/삭제
                  </EditButton>
                </div>
              </ButtonContainer>
            </BoardContent>
            <BottomBar />
            <BoardTt>{review.reviewTitle}</BoardTt>
            <BoardText>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {review.reviewContent}
              </div>
            </BoardText>
          </BoardItem>
        ))}
      </BoardList>
    </BoardSection>
  );
}

export default Review;

const BoardSection = styled.div`
  width: 100%;
  padding: 20px;
`;

const BoardTitle = styled.div`
  font-size: 24px;
  font-weight: bold;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 200px;
  padding: 8px;
`;

const SearchButton = styled.button`
  margin-left: 10px;
  background-color: transparent;
  border: none;
`;

const WriteButton = styled.button`
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
`;

const BoardList = styled.div`
  margin-top: 20px;
`;

const BoardItem = styled.div`
  margin-bottom: 20px;
`;

const BoardContent = styled.div`
  display: flex;
  justify-content: space-between;
`;

const BoardUser = styled.div`
  font-weight: bold;
`;

const ButtonContainer = styled.div`
  display: flex;
`;

const EditButton = styled.button`
  margin-left: 10px;
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

const BoardTt = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const BoardText = styled.div`
  font-size: 16px;
`;

const BottomBar = styled.div`
  border-bottom: 1px solid #ddd;
  margin-top: 10px;
`;

const RightAlign = styled.div`
  display: flex;
  justify-content: flex-end;
`;
