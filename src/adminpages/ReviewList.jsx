import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

function ReviewList() {
  const [reviews, setReviews] = useState([]); // 리뷰 목록 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const SURL = import.meta.env.VITE_APP_URI;
  // 리뷰 목록 조회
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${SURL}/admin/reviews`, {
          withCredentials: false,
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
        withCredentials: false,
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
      <Title>Review</Title>
      <ReviewTable>
        {reviews.map((review) => (
          <ReviewRow key={review.reviewId}>
            <ReviewProfile>
              <ReviewTitle>{review.reviewTitle}</ReviewTitle>
            </ReviewProfile>
            <ReviewContent>{review.reviewContent}</ReviewContent>
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

const Title = styled.h1`
  font-size: 24px;
  color: #333;
  font-weight: 500;
`;

const ReviewTable = styled.div`
  display: grid;
  width: 100%;
  gap: 20px;
  margin-top: 20px;
`;

const ReviewRow = styled.div`
  display: flex;
  justify-content: space-between; /* 양쪽 끝에 배치 */
  align-items: flex-start;
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 5px;
  background-color: #fff;
`;

const ReviewProfile = styled.div`
  display: flex;
  align-items: center;
`;

const ReviewTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const ReviewContent = styled.p`
  font-size: 14px;
  color: #555;
  margin-bottom: 15px;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  background-color: #f4f4f4;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 17px;

  &:hover {
    background-color: #e0e0e0;
  }
`;
