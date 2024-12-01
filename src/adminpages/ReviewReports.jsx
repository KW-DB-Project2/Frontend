import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// 환경 변수에서 서버 URL 가져오기
const SURL = import.meta.env.VITE_APP_URI; // 백엔드 URL

function ReviewReports() {
  const navigate = useNavigate();

  // 리뷰 신고 목록 상태
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${SURL}/admin/reports`);

        // 중첩 배열 평탄화 후 reviewReportId가 있는 항목만 필터링
        const filteredReviews = response.data
          .flat() // 중첩 배열을 1차원 배열로 변환
          .filter((item) => item.reviewReportId); // reviewReportId 필터링

        setReviews(filteredReviews); // 상태 업데이트
      } catch (error) {
        console.error('리뷰 데이터를 불러오는 데 실패했습니다:', error);
      } finally {
        setLoading(false); // 로딩 완료 처리
      }
    };

    fetchReviews(); // 리뷰 데이터 가져오기
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  // Product 신고 목록 페이지로 이동하는 함수
  const navigateToProductReport = () => {
    navigate('/admin/product-reports');
  };

  // 리뷰 항목 클릭 시 상세 페이지로 이동하는 함수
  const navigateToReviewDetail = (reviewid) => {
    console.log(reviewid);
    navigate(`/admin/user-review/${reviewid}`);
  };

  return (
    <Container>
      <Header>
        <Title>📋 Review 신고 목록</Title>
        <PageTitle onClick={navigateToProductReport}>
          Product 신고 목록
        </PageTitle>
      </Header>

      {/* 로딩 상태 확인 */}
      {loading ? (
        <LoadingMessage>리뷰 신고 목록을 불러오는 중...</LoadingMessage>
      ) : (
        <ReviewList>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewCard
                key={review.reviewReportId}
                onClick={() => navigateToReviewDetail(review.reviewId)}
              >
                <ReviewTitle>신고 내용: </ReviewTitle>
                <ReviewContent>{review.reviewReportContent}</ReviewContent>
              </ReviewCard>
            ))
          ) : (
            <EmptyMessage>리뷰 신고가 없습니다.</EmptyMessage>
          )}
        </ReviewList>
      )}
    </Container>
  );
}

export default ReviewReports;

const Container = styled.div`
  width: 1500px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
  padding-right: 10px;
`;

const PageTitle = styled.h2`
  border-left: 2px solid #ccc;
  padding-left: 10px;
  font-size: 22px;
  color: #777;
  cursor: pointer;
  &:hover {
    color: #555;
  }
`;

const ReviewList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(1500px, 1fr));
  gap: 20px;
`;

const ReviewCard = styled.div`
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #f1f1f1;
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
  }
`;

const ReviewTitle = styled.p`
  color: #333;
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
`;

const ReviewContent = styled.p`
  font-size: 14px;
  color: #555;
  margin: 0;
`;

const EmptyMessage = styled.div`
  text-align: center;
  font-size: 16px;
  color: #999;
  margin-top: 20px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 18px;
  color: #007bff;
  margin-top: 40px;
`;
