import React from 'react';
import styled from 'styled-components';

const reviews = [
  {
    id: 1,
    title: '후기 1',
    content: '이 상품 너무 좋아요!',
    image: 'https://via.placeholder.com/50',
  },
  {
    id: 2,
    title: '후기 2',
    content: '아주 만족스럽습니다.',
    image: 'https://via.placeholder.com/50',
  },
  {
    id: 3,
    title: '후기 3',
    content: '가격 대비 품질이 좋습니다.',
    image: 'https://via.placeholder.com/50',
  },
  {
    id: 4,
    title: '후기 4',
    content: '정말 추천해요!',
    image: 'https://via.placeholder.com/50',
  },
  {
    id: 5,
    title: '후기 5',
    content: '생각보다 더 좋네요.',
    image: 'https://via.placeholder.com/50',
  },
  {
    id: 6,
    title: '후기 6',
    content: '만족스러운 구매였습니다.',
    image: 'https://via.placeholder.com/50',
  },
  {
    id: 7,
    title: '후기 7',
    content: '또 구매하고 싶어요.',
    image: 'https://via.placeholder.com/50',
  },
  {
    id: 8,
    title: '후기 8',
    content: '배송도 빠르고 좋아요.',
    image: 'https://via.placeholder.com/50',
  },
  {
    id: 9,
    title: '후기 9',
    content: '굿입니다.',
    image: 'https://via.placeholder.com/50',
  },
  {
    id: 10,
    title: '후기 10',
    content: '좋은 제품이에요.',
    image: 'https://via.placeholder.com/50',
  },
];

function ReviewList() {
  return (
    <Container>
      <Title>Review</Title>
      <ReviewTable>
        {reviews.map((review) => (
          <ReviewRow key={review.id}>
            <ReviewProfile>
              <ReviewTitle>{review.title}</ReviewTitle>
            </ReviewProfile>
            <ReviewContent>{review.content}</ReviewContent>
            <ActionButton>삭제</ActionButton>
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
