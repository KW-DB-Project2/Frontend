import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// 환경 변수에서 서버 URL 가져오기
const SURL = import.meta.env.VITE_APP_URI; // 백엔드 URL

function ReviewReports() {
  const navigate = useNavigate();

  // 리뷰 신고 목록 상태
  const [reviews, setReviews] = React.useState([]);

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
              key={review.reviewReportId} // reviewReportId를 key로 사용
              onClick={() => navigateToReviewDetail(review.reviewReportId)} // 리뷰 클릭 시 상세 페이지로 이동
            >
              <ReviewTitle>신고 내용: </ReviewTitle>
              <ReviewContent>{review.reviewReportContent}</ReviewContent>
            </ReviewItem>
          ))
        ) : (
          <div>리뷰 신고가 없습니다.</div>
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
  display: flex; /* 자식 요소들을 가로로 배치 */
  align-items: center; /* 세로 중앙 정렬 */
  justify-content: space-between; /* 필요 시 양 끝 정렬 */
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  gap: 20px; /* 자식 요소 간의 간격 설정 */

  &:hover {
    background-color: #f4f4f4;
  }
`;

const ReviewTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin: 0; /* 기본 마진 제거 */
  display: flex; /* 필요 시 내용 정렬 */
  align-items: center; /* 텍스트 세로 중앙 정렬 */
`;

const ReviewContent = styled.p`
  font-size: 14px;
  color: #555;
  margin: 0; /* 기본 마진 제거 */
  display: flex; /* 필요 시 내용 정렬 */
  align-items: center; /* 텍스트 세로 중앙 정렬 */
`;
