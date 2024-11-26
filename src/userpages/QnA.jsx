import React, { useState } from 'react';
import styled from 'styled-components';
import { FaUserCircle, FaSearch } from 'react-icons/fa';

const QnA = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleWriteClick = () => {
    // 글쓰기 로직 추가
    console.log('글쓰기 버튼 클릭');
  };

  const handleAddComment = (index) => {
    const updatedReviews = [...reviews];
    updatedReviews[index].comments.push({ commentContent: newComment });
    setReviews(updatedReviews);
    setNewComment('');
    setIsCommenting(null);
  };

  const handleCancelComment = () => {
    setNewComment('');
    setIsCommenting(null);
  };

  return (
    <QnASection>
      <QnATitle>
        문의하기
        <RightAlign>
          <WriteButton onClick={handleWriteClick}>글쓰기</WriteButton>
        </RightAlign>
      </QnATitle>
      <QnAList>
        {reviews.map((review, index) => (
          <QnAItem key={index}>
            <QnAUser>
              <ProfileIcon />
              사용자 이름
            </QnAUser>
            <QnATitleText>{review.reviewTitle}</QnATitleText>
            <QnAContent>{review.reviewContent}</QnAContent>
            <CommentSection>
              {review.comments &&
                review.comments.map((comment, idx) => (
                  <Comment key={idx}>
                    <strong>ㄴ </strong>
                    {comment.commentContent}
                  </Comment>
                ))}
              {isCommenting === index && (
                <>
                  <CommentInput
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <div>
                    <CommentButton onClick={() => handleAddComment(index)}>
                      작성
                    </CommentButton>
                    <CommentButton onClick={handleCancelComment}>
                      취소
                    </CommentButton>
                  </div>
                </>
              )}
              {isCommenting !== index && (
                <CommentButton onClick={() => setIsCommenting(index)}>
                  댓글 달기
                </CommentButton>
              )}
            </CommentSection>
          </QnAItem>
        ))}
      </QnAList>
      {loading && (
        <LoadingContainer>
          <div className="loading-icon">로딩 중...</div>
        </LoadingContainer>
      )}
    </QnASection>
  );
};

export default QnA;

// 스타일 정의
const QnASection = styled.div`
  margin-top: 40px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const QnATitle = styled.h3`
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

const WriteButton = styled.button`
  color: #333;
  border: 1px solid #333;
  padding: 10px 30px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;
  margin-top: 20px;

  &:hover {
    border: 1px solid #333;
    color: #aaa;
  }
`;

const QnAList = styled.div`
  margin-top: 20px;
`;

const QnAItem = styled.div`
  margin-bottom: 15px;
  padding: 10px 30px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #333;
`;

const ProfileIcon = styled(FaUserCircle)`
  color: #ccc;
  font-size: 25px;
  margin-right: 15px;
`;

const QnAUser = styled.div`
  font-weight: 500;
  color: #555;
  margin-bottom: 5px;
  font-size: 17px;
`;

const QnATitleText = styled.div`
  font-weight: 600;
  font-size: 17px;
  margin-bottom: 10px;
`;

const QnAContent = styled.div`
  font-size: 17px;
`;

const CommentSection = styled.div`
  margin-top: 10px;
`;

const Comment = styled.div`
  margin-top: 5px;
  font-size: 14px;
  color: #333;
`;

const CommentInput = styled.input`
  background-color: white;
  color: #333;
  border: 1px solid #ccc;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 12px;
  width: 300px;
`;

const CommentButton = styled.button`
  background-color: #333;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 12px;

  &:hover {
    opacity: 0.8;
  }
`;

const LoadingContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .loading-icon {
    animation: rotate 1s linear infinite;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
