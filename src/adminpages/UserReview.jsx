import React from 'react';
import styled from 'styled-components';

function UserReview() {
  // 더미 데이터 (리뷰 관련 데이터)
  const review = {
    reviewTitle: '훌륭한 제품',
    reviewContent:
      '이 제품은 정말 좋습니다. 품질이 뛰어나고 사용하기 쉽습니다.',
    reviewAuthor: '김철수',
    reviewDate: '2024-11-28',
  };

  // 버튼 클릭 시 처리할 함수
  const handleActionClick = (action) => {
    switch (action) {
      case 'block':
        alert('유저 정지 처리');
        break;
      case 'withdraw':
        alert('유저 탈퇴 처리');
        break;
      case 'delete':
        alert('리뷰 삭제 처리');
        break;
      default:
        break;
    }
  };

  return (
    <Container>
      <Content>
        <Details>
          <ReviewTitle>{review.reviewTitle}</ReviewTitle>
          <AuthorAndDate>
            <Author>{review.reviewAuthor}</Author>
            <Date>{review.reviewDate}</Date>
          </AuthorAndDate>
          <BottomBar />
          <div style={{ fontSize: '19px' }}>리뷰 내용</div>
          <BottomBar />
          <Description>{review.reviewContent}</Description>
          <ButtonContainer>
            <ActionButton onClick={() => handleActionClick('block')}>
              유저 정지
            </ActionButton>
            <ActionButton onClick={() => handleActionClick('withdraw')}>
              유저 탈퇴
            </ActionButton>
            <ActionButton onClick={() => handleActionClick('delete')}>
              리뷰 삭제
            </ActionButton>
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
