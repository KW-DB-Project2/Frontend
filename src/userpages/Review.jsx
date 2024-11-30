import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { FaExclamationTriangle, FaSearch, FaUserCircle } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

function Review({ productid }) {
  const [reviews, setReviews] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [reportContent, setReportContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductReviews = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_URI}/reviews/${productid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReviews(response.data);
      } catch (error) {
        console.error('리뷰를 가져오는 중 오류 발생:', error);
        setReviews([]);
      }
    };

    if (productid) {
      fetchProductReviews();
    }
  }, [productid, token]);

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

      // 특정 productId에 해당하는 리뷰만 필터링
      const filteredReviews = response.data.filter(
        (review) => review.productId === Number(productid)
      );

      setReviews(filteredReviews); // 필터링된 리뷰를 상태에 설정
    } catch (error) {
      console.error('리뷰 검색 중 오류 발생:', error);
    }
  };

  const handleSearchClick = () => {
    if (searchKeyword.trim() !== '') {
      fetchReviews(searchKeyword.trim());
    }
  };

  const handleEditClick = (reviewid) => {
    navigate(`/write-review/${productid}/${reviewid}`);
  };

  const reportReview = async () => {
    if (!selectedReviewId || !reportContent.trim()) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_URI}/report/review`,
        {
          userId: user.id,
          reviewId: selectedReviewId,
          reviewReportContent: reportContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('신고가 접수되었습니다.');
      setIsModalOpen(false);
    } catch (error) {
      console.error('리뷰 신고 중 오류 발생:', error);
    }
  };

  const handleReportClick = (reviewId) => {
    setSelectedReviewId(reviewId);
    setReportContent('');
    setIsModalOpen(true);
  };

  // 댓글 가져오기
  const fetchComments = async (reviewId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_URI}/comments/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`댓글 가져오기 실패 (reviewId: ${reviewId}):`, error);
      return [];
    }
  };

  const [commentsByReview, setCommentsByReview] = useState({});

  useEffect(() => {
    const fetchAllComments = async () => {
      const newComments = {};
      for (const review of reviews) {
        newComments[review.reviewId] = await fetchComments(review.reviewId);
      }
      setCommentsByReview(newComments);
    };

    if (reviews.length > 0) {
      fetchAllComments();
    }
  }, [reviews]);

  return (
    <BoardSection>
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
        {reviews.map((review) => (
          <BoardItem key={review.reviewId}>
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
            <BoardText>{review.reviewContent}</BoardText>

            {/* 댓글 작성 버튼 */}
            <Link to={`/write-comment/${review.productId}/${review.reviewId}`}>
              <CommentWriteButton>댓글 작성</CommentWriteButton>
            </Link>

            {/* 댓글 목록 */}
            <CommentList>
              {commentsByReview[review.reviewId]?.map((comment) => (
                <CommentItem key={comment.commentId}>
                  <CommentHeader>
                    <span>ㄴ{comment.username}</span>
                  </CommentHeader>
                  <CommentContent>{comment.commentContent}</CommentContent>
                  {/* 수정 버튼 추가 */}
                  <Link
                    to={`/write-comment/${review.productId}/${review.reviewId}/${comment.commentId}`}
                  >
                    <EditButton>댓글 수정</EditButton>
                  </Link>
                </CommentItem>
              ))}
            </CommentList>
          </BoardItem>
        ))}
      </BoardList>
    </BoardSection>
  );
}

export default Review;

const CommentList = styled.ul`
  margin-top: 10px;
  list-style: none;
  padding: 0;
`;

const CommentItem = styled.li`
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 5px;
  color: #333;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  font-weight: bold;
`;

const CommentContent = styled.p`
  font-size: 14px;
  color: #333;
  margin-top: 5px;
`;

const CommentWriteButton = styled.button`
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
  width: 90%;
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
