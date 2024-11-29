import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // URL에서 파라미터를 받아옴

const SURL = import.meta.env.VITE_APP_URI; // 환경 변수에서 백엔드 서버 URL 가져오기

function UserReview() {
  // URL 파라미터에서 reviewId, userId, productId를 가져옴
  const { reviewid } = useParams();

  // 리뷰에 대한 상태를 정의 (백엔드에서 받아올 데이터)
  const [review, setReview] = React.useState(null);

  // 컴포넌트가 마운트될 때 리뷰 데이터를 받아옴
  React.useEffect(() => {
    // 리뷰 정보를 받아오는 API 호출
    const fetchReview = async () => {
      try {
        const response = await axios.get(`${SURL}/admin/reviews`);
        // 리뷰 데이터에서 reviewId에 맞는 것만 필터링
        const filteredReview = response.data.find(
          (r) => r.reviewId === parseInt(reviewid)
        );
        setReview(filteredReview); // 필터링된 리뷰를 상태에 저장
      } catch (error) {
        console.error('리뷰 데이터를 불러오는 데 실패했습니다:', error);
      }
    };

    fetchReview();
  }, [reviewid]); // reviewid가 변경될 때마다 데이터를 다시 가져옴

  // 버튼 클릭 시 처리할 함수
  const handleActionClick = async () => {
    // 리뷰 삭제 처리
    try {
      const response = await axios.delete(`${SURL}/admin/reviews/${reviewid}`);
      alert('리뷰 삭제 처리: ' + response.data.message);
    } catch (error) {
      console.error('리뷰 삭제 처리 실패:', error);
      alert('리뷰 삭제 처리에 실패했습니다.');
    }
  };

  // 리뷰 데이터가 아직 로드되지 않았으면 로딩 상태를 표시
  if (!review) {
    return <div>로딩 중...</div>;
  }

  return (
    <Container>
      <Content>
        <Details>
          <ReviewTitle>{review.reviewTitle}</ReviewTitle>
          <AuthorAndDate>
            <Author>{review.reviewAuthor}</Author>
            <Date>{review.createTime}</Date>
          </AuthorAndDate>
          <BottomBar />
          <div style={{ fontSize: '19px' }}>리뷰 내용</div>
          <BottomBar />
          <Description>{review.reviewContent}</Description>
          <ButtonContainer>
            <ActionButton onClick={handleActionClick}>리뷰 삭제</ActionButton>
          </ButtonContainer>
        </Details>
      </Content>
    </Container>
  );
}

const Container = styled.div`
  width: 1500px;
  margin-top: 20px;
  padding: 50px;
  margin-top: 0;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  display: flex;
  gap: 40px;
`;

const Details = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
`;

const ReviewTitle = styled.h2`
  font-size: 27px;
  color: #333;
  font-weight: 500;
`;

const AuthorAndDate = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px;
`;

const Author = styled.div`
  color: #777;
  font-size: 16px;
`;

const Date = styled.div`
  color: #777;
  font-size: 16px;
`;

const BottomBar = styled.div`
  height: 2px;
  width: 100%;
  background-color: #f0f0f0;
  margin: 20px 0px;
`;

const Description = styled.p`
  flex-grow: 1;
  margin-bottom: 100px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row; /* 가로로 버튼을 배치 */
  align-self: flex-end;
  gap: 15px;
  margin-top: 20px;
`;

const ActionButton = styled.div`
  padding: 10px 12px;
  background-color: #f4f4f4;
  border-radius: 5px;
  cursor: pointer;
  font-size: 17px;

  &:hover {
    background-color: #e0e0e0;
  }
`;

export default UserReview;
