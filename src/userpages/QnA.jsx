import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { FaUserCircle } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
// 컴포넌트 임포트
import { AuthContext } from '../context/AuthContext';

const QnA = () => {
  const { user } = useContext(AuthContext); // AuthContext에서 사용자 정보 가져오기
  const { productid } = useParams(); // URL에서 productid 추출
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate
  const [reviews, setReviews] = useState([]); // Q&A 목록 저장

  // 더미 데이터
  const dummyData = [
    { askId: 1, askContent: '이 제품은 언제 배송되나요?' },
    { askId: 2, askContent: '제품 사용법에 대한 안내가 필요해요.' },
    { askId: 3, askContent: '제품 색상은 어떤 색상들이 있나요?' },
  ];

  // Q&A 목록 가져오기 (백엔드에서 데이터 가져오기)
  useEffect(() => {
    // 만약 백엔드에서 데이터를 가져오지 못하면 더미 데이터를 사용
    if (productid) {
      axios
        .get(`${import.meta.env.VITE_APP_URI}/ask/${productid}`) // 환경 변수 사용
        .then((response) => setReviews(response.data))
        .catch((error) => {
          console.error('Q&A 조회 실패:', error);
          setReviews(dummyData); // 백엔드 조회 실패 시 더미 데이터 사용
        });
    }
  }, [productid]);

  // Q&A 글쓰기 페이지로 이동
  const handleWrite = () => {
    navigate(`/write-qa/${productid}`);
  };

  // Q&A 삭제 요청
  const handleDelete = (askId) => {
    if (window.confirm('정말 이 리뷰를 삭제하시겠습니까?')) {
      const userId = user.id;
      const askContent = reviews.find(
        (review) => review.askId === askId
      ).askContent;

      axios
        .delete(`${import.meta.env.VITE_APP_URI}/ask/${askId}`, {
          data: {
            userId,
            productId: productid,
            askContent,
          },
        })
        .then((response) => {
          if (response.data === 'delete success') {
            setReviews(reviews.filter((review) => review.askId !== askId)); // 삭제 후 리뷰 목록 업데이트
          }
        })
        .catch((error) => {
          console.error('Q&A 삭제 실패:', error);
          alert('삭제 실패');
        });
    }
  };

  return (
    <Container>
      <QnASection>
        <QnATitle>Q&A</QnATitle>
        <WriteButton onClick={handleWrite}>글쓰기</WriteButton>

        <QnAList>
          {reviews.length === 0 ? (
            <NoQnA>문의를 작성해주세요...</NoQnA> // 리뷰 목록이 없으면 "문의가 없습니다." 메시지 표시
          ) : (
            reviews.map((review) => (
              <QnAItem key={review.askId}>
                <UserContainer>
                  <QnAUser>
                    <ProfileIcon />
                    {review.username}
                  </QnAUser>
                </UserContainer>
                <QnAContent>{review.askContent}</QnAContent>
                <DeleteButton onClick={() => handleDelete(review.askId)}>
                  삭제
                </DeleteButton>
              </QnAItem>
            ))
          )}
        </QnAList>
      </QnASection>
    </Container>
  );
};

export default QnA;

// 스타일 정의
const Container = styled.div`
  width: 900px;
  margin: 0 300px;
  padding: 20px;
`;

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

const NoQnA = styled.div`
  text-align: center;
  color: #ccc;
  font-size: 20px;
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

const QnAContent = styled.div`
  font-size: 17px;
`;

const DeleteButton = styled.button`
  background-color: #f4f4f4;
  color: #333;
  border: 1px solid #ccc;
  padding: 5px 15px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;
  margin-top: 10px;

  &:hover {
    background-color: #e4e4e4;
  }
`;

const UserContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 16px;
  margin-top: 10px;
`;
