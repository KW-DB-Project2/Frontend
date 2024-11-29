import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
// 아이콘
import { FaExclamationTriangle, FaSearch, FaUserCircle } from 'react-icons/fa';
import { FiLoader } from 'react-icons/fi';
// 컴포넌트 임포트
import { AuthContext } from '../context/AuthContext';

function Review({ productid }) {
  const [reviews, setReviews] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const { token, user } = useContext(AuthContext); // AuthContext에서 사용자 정보 가져오기
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

  // 리뷰 신고 API 호출
  const reportReview = async (reviewId, reviewContent) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_URI}/report/review`,
        {
          userId: user.id, // AuthContext에서 가져온 userId
          productId: productid, // 현재 상품의 productid
          reviewReportContent: reviewContent, // 신고 내용
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('신고가 접수되었습니다.');
      console.log(response.data); // 서버의 응답을 확인
    } catch (error) {
      console.error('리뷰 신고 중 오류 발생:', error);
    }
  };

  // 신고 버튼 클릭 시 모달 열기
  const handleReportClick = (reviewId) => {
    setSelectedReviewId(reviewId);
    setReportContent('');
    setIsModalOpen(true);
  };

  return (
    <BoardSection>
      {/* 모달 */}
      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <Title>리뷰 신고</Title>
              <CloseButton onClick={() => setIsModalOpen(false)}>×</CloseButton>
            </ModalHeader>
            <Textarea
              placeholder="신고 내용을 입력하세요."
              value={reportContent}
              onChange={(e) => setReportContent(e.target.value)}
            />
            <ButtonContainer>
              <SubmitButton onClick={reportReview}>제출</SubmitButton>
              <CancelButton onClick={() => setIsModalOpen(false)}>
                취소
              </CancelButton>
            </ButtonContainer>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* 리뷰 목록 */}
      <BoardTitle>
        Review
        <SearchContainer>
          <SearchInput
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
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
          <WriteButton onClick={() => navigate(`/write-review/${productid}`)}>
            글쓰기
          </WriteButton>
        </RightAlign>
      </BoardTitle>
      <BoardList>
        {reviews.map((review, index) => (
          <BoardItem key={index}>
            <BoardContent>
              <BoardUser>
                <ProfileIcon />
                {review.username}
              </BoardUser>
              <ButtonContainer>
                <EditButton onClick={() => handleEditClick(review.reviewId)}>
                  게시글 수정/삭제
                </EditButton>
                <ReportButton
                  onClick={() => handleReportClick(review.reviewId)}
                >
                  <FaExclamationTriangle size={17} color="red" />
                  신고하기
                </ReportButton>
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

const ReportButton = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border: none;
  padding: 5px 10px;
  font-size: 16px;
  cursor: pointer;
  color: red;
  border-radius: 5px;
  svg {
    margin-right: 5px;
  }
`;

const BottomBar = styled.div`
  height: 2px;
  width: 100%;
  background-color: #f0f0f0;
  margin: 20px 0px;
`;

const BoardContent = styled.div`
  display: flex;
  justify-content: space-between; /* 왼쪽은 BoardUser, 오른쪽은 ButtonContainer */
  align-items: center; /* 세로 정렬 */
  width: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px; /* 버튼들 사이 간격 */
`;

const BoardSection = styled.div`
  margin-top: 40px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const BoardTitle = styled.h3`
  font-size: 33px;
  color: #333;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RightAlign = styled.div`
  margin-left: auto;
`;

const BoardList = styled.div`
  margin-top: 10px;
`;

const BoardItem = styled.div`
  margin-bottom: 15px;
  padding: 10px 30px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #333;
`;

const ProfileIcon = styled(FaUserCircle)`
  margin-right: 10px;
`;

const BoardUser = styled.div`
  display: flex;
  align-items: center;
  font-size: 17px;
  color: #333;
  font-weight: 500;
`;

const BoardTt = styled.h4`
  font-size: 20px;
  color: #333;
  font-weight: 500;
`;

const BoardText = styled.p`
  font-size: 16px;
  color: #666;
  line-height: 1.5;
  margin-top: 10px;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0px 20px 50px;
`;

const SearchInput = styled.input`
  padding: 8px 15px;
  border: 2px solid #ccc;
  margin-right: 10px;
  border-radius: 15px;
  width: 300px;
  height: 20px;
  font-size: 17px;
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

const WriteButton = styled.button`
  color: #333;
  border: 1px solid #333;
  padding: 10px 30px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;
  margin-top: 20px;
  align-self: flex-start;
  &:hover {
    border: 1px solid #333;
    color: #aaa;
  }
`;

const EditButton = styled.button`
  background-color: white;
  color: #666;
  font-size: 14px;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 8px;
  width: 400px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h3`
  font-size: 20px;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 100px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  font-size: 14px;
  resize: none;
`;

const SubmitButton = styled.button`
  background-color: #333;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #555;
  }
`;

const CancelButton = styled.button`
  background-color: #fff;
  color: #333;
  border: 1px solid #ccc;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;
