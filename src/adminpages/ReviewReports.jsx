import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const reviews = [
  { id: 1, title: '후기 1', content: '이 상품 너무 좋아요!' },
  { id: 2, title: '후기 2', content: '아주 만족스럽습니다.' },
  { id: 3, title: '후기 3', content: '가격 대비 품질이 좋습니다.' },
  { id: 4, title: '후기 4', content: '정말 추천해요!' },
  { id: 5, title: '후기 5', content: '생각보다 더 좋네요.' },
];

function ReviewReports() {
  const navigate = useNavigate();

  // Product 신고 목록 페이지로 이동하는 함수
  const navigateToProductReport = () => {
    navigate('/admin/product-reports');
  };

  // 리뷰 항목 클릭 시 상세 페이지로 이동하는 함수
  const navigateToReviewDetail = (userid, reviewid) => {
    navigate(`/admin/user-review/${userid}/${reviewid}`); // 클릭된 리뷰의 id를 URL에 전달
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
        {reviews.map((review) => (
          <ReviewItem
            key={review.id}
            onClick={() =>
              navigateToReviewDetail(review.userId, review.reviewId)
            }
          >
            <ReviewTitle>{review.title}</ReviewTitle>
            <ReviewContent>{review.content}</ReviewContent>
          </ReviewItem>
        ))}
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
