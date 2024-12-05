import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import axios from 'axios';
// 컴포넌트 임포트
import { AuthContext } from '../context/AuthContext';

function ReviewList() {
  const [reviews, setReviews] = useState([]); // 리뷰 목록 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const SURL = import.meta.env.VITE_APP_URI;
  const { token } = useContext(AuthContext);

  // 리뷰 목록 조회
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${SURL}/admin/reviews`, {
          headers: {
            Authorization: `Bearer ${token}`, // 인증 토큰
          },
        });
        setReviews(response.data); // 리뷰 목록 상태 업데이트
      } catch (err) {
        console.error('리뷰 조회 실패:', err);
        setError('리뷰를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false); // 로딩 상태 변경
      }
    };

    fetchReviews();
  }, []);

  // 리뷰 삭제
  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await axios.delete(`${SURL}/admin/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // 인증 토큰
        },
      });
      console.log('리뷰 삭제 성공:', response.data);
      setReviews((prevReviews) =>
        prevReviews.filter((review) => review.reviewId !== reviewId)
      ); // 삭제된 리뷰는 목록에서 제거
    } catch (err) {
      console.error('리뷰 삭제 실패:', err);
      setError('리뷰를 삭제하는 데 실패했습니다.');
    }
  };

  if (loading) return <Container>로딩 중...</Container>;
  if (error) return <Container>{error}</Container>;

  return (
    <Container>
      <Header>
        <Title>📋 Review 신고 목록</Title>
      </Header>
      <ReviewTable>
        {reviews.map((review) => (
          <ReviewRow key={review.reviewId}>
            <ReviewContentContainer>
              <ReviewTitle>{review.reviewTitle}</ReviewTitle>
              <ReviewContent>{review.reviewContent}</ReviewContent>
            </ReviewContentContainer>
            <ActionButton onClick={() => handleDeleteReview(review.reviewId)}>
              삭제
            </ActionButton>
          </ReviewRow>
        ))}
      </ReviewTable>
    </Container>
  );
}

export default ReviewList;

const Container = styled.div`
  width: 1500px;
  padding: 20px 40px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
  padding-right: 10px;
`;

const ReviewTable = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(1500px, 1fr));
  gap: 20px;
`;

const ReviewRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #ddd;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
`;

const ReviewContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
`;

const ReviewTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

const ReviewContent = styled.p`
  font-size: 14px;
  color: #555;
  line-height: 1.5;
  margin: 10px 0;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  background-color: #f4f4f4;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  color: #333;

  &:hover {
    background-color: #e0e0e0;
  }
`;
