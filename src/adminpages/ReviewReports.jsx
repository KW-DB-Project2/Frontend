import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// 환경 변수에서 서버 URL 가져오기
const SURL = import.meta.env.VITE_APP_URI; // 백엔드 URL

function ReviewReports() {
  const navigate = useNavigate();

  // 리뷰 목록 상태
  const [reviews, setReviews] = React.useState([]);

  // 컴포넌트가 마운트될 때 리뷰 데이터 로드
  React.useEffect(() => {
    // 백엔드에서 리뷰 데이터 가져오기
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${SURL}/admin/reviews`);
        setReviews(response.data); // 리뷰 목록 상태에 저장
      } catch (error) {
        console.error('리뷰 데이터를 불러오는 데 실패했습니다:', error);
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
    navigate(`/admin/user-review/${reviewid}`); // 클릭된 리뷰의 id를 URL에 전달
  };

  return (
    <Container>
      <TitleContainer>
        <Title>Review 신고 목록</Title>
        <VerticalBar />
        <PageTitle onClick={navigateToProductReport}>
          Product 신고 목록
        </PageTitle>
      </TitleContainer>

      {/* 리뷰 리스트 출력 */}
      <ReviewList>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewItem
              key={review.reviewId} // reviewId를 key로 사용
              onClick={() => navigateToReviewDetail(review.reviewId)} // 리뷰 클릭 시 상세 페이지로 이동
            >
              <ReviewTitle>{review.reviewTitle}</ReviewTitle>
              <ReviewContent>{review.reviewContent}</ReviewContent>
            </ReviewItem>
          ))
        ) : (
          <div>리뷰가 없습니다.</div>
        )}
      </ReviewList>
    </Container>
  );
}

export default ReviewReports;

const Container = styled.div`
  width: 1500px;
  padding: 20px 40px;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 27px;
  color: #333;
  margin-right: 20px;
`;

const VerticalBar = styled.div`
  width: 2px;
  height: 27px;
  background-color: #ccc;
  margin: 0 20px;
`;

const PageTitle = styled.h2`
  font-size: 22px;
  color: #777;
  cursor: pointer;
`;

const ReviewList = styled.div`
  margin-top: 20px;
`;

const ReviewItem = styled.div`
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #f4f4f4;
  }
`;

const ReviewTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
`;

const ReviewContent = styled.p`
  font-size: 14px;
  color: #555;
`;
