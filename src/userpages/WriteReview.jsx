import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function WriteReview({ initialTitle = '', initialContent = '' }) {
  const { user, token } = useContext(AuthContext); // token을 AuthContext에서 가져옴
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { productid, reviewid } = useParams();
  const navigate = useNavigate();
  const SURL = import.meta.env.VITE_APP_URI;

  // 리뷰 삭제 처리 함수
  const handleDelete = async () => {
    if (window.confirm('정말 이 리뷰를 삭제하시겠습니까?')) {
      try {
        // 헤더에 Authorization 토큰 및 파라미터로 userId 추가
        await axios.delete(`${SURL}/reviews/${reviewid}`, {
          params: {
            userId: user.id, // 현재 로그인한 사용자의 ID
          },
          headers: {
            Authorization: `Bearer ${token}`, // Bearer 토큰 추가
          },
        });
        alert('리뷰가 성공적으로 삭제되었습니다!');
        navigate(`/product/${productid}`);
      } catch (error) {
        console.error('삭제 실패:', error);
        alert('리뷰 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  // 리뷰 수정 시 기존 내용 불러오기
  useEffect(() => {
    if (reviewid) {
      const fetchReview = async () => {
        try {
          // 헤더에 Authorization 토큰 추가
          const response = await axios.get(`${SURL}/reviews/${reviewid}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const review = response.data;
          setTitle(review.reviewTitle);
          setContent(review.reviewContent);
        } catch (error) {
          console.error('리뷰 정보를 불러오는 중 오류 발생:', error);
          alert('리뷰 정보를 불러오는 중 오류가 발생했습니다.');
        }
      };
      fetchReview();
    }
  }, [reviewid, token]); // token 의존성 추가

  // 제목, 내용 변경 처리 함수
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleContentChange = (e) => setContent(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert('제목과 내용을 모두 작성해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        userId: user.id,
        reviewTitle: title,
        reviewContent: content,
      };

      if (reviewid) {
        // 수정 요청
        await axios.put(
          `${SURL}/reviews`,
          {
            ...payload,
            reviewId: reviewid,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert('리뷰가 성공적으로 수정되었습니다!');
      } else {
        // 작성 요청
        await axios.post(
          `${SURL}/reviews`,
          {
            ...payload,
            productId: productid,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert('리뷰가 성공적으로 작성되었습니다!');
      }

      navigate(`/product/${productid}`);

      // 초기화
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('요청 실패:', error);
      alert('요청 처리 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>{reviewid ? 'Review 수정' : 'Review 작성'}</Title>
        <BottomBar />
        <Label>제목</Label>
        <Input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Review 제목을 입력하세요"
        />
        <Label>내용</Label>
        <TextArea
          value={content}
          onChange={handleContentChange}
          placeholder="Review 내용을 입력하세요"
          rows="6"
        />
        <ButtonContainer>
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? '작성 중...' : reviewid ? '수정하기' : '제출하기'}
          </SubmitButton>
          {reviewid && (
            <DeleteButton type="button" onClick={handleDelete}>
              삭제하기
            </DeleteButton>
          )}
        </ButtonContainer>
      </Form>
    </Container>
  );
}

export default WriteReview;

const Container = styled.div`
  width: 1500px;
  margin: 40px auto 0px auto;
  padding: 40px;
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
  color: #333;
  text-align: center;
`;

const BottomBar = styled.div`
  width: 1500px;
  height: 1px;
  background-color: #f0f0f0;
`;

const Label = styled.label`
  font-size: 18px;
  color: #555;
  margin-bottom: 8px;
`;

const Input = styled.input`
  padding: 14px;
  font-size: 17px;
  border: 1px solid #ddd;
  border-radius: 8px;
  outline: none;
  background-color: #fafafa;
  transition: all 0.3s ease;

  &:focus {
    border-color: #ccc;
    background-color: #fff;
  }
`;

const TextArea = styled.textarea`
  padding: 14px;
  font-size: 17px;
  border: 1px solid #ddd;
  border-radius: 8px;
  outline: none;
  background-color: #fafafa;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    border-color: #ccc;
    background-color: #fff;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const SubmitButton = styled.button`
  background-color: #333;
  color: white;
  border: none;
  padding: 10px 30px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 17px;
  margin-top: 20px;
  align-self: flex-start;

  &:hover {
    opacity: 0.8;
  }
`;

const DeleteButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 10px 30px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 17px;
  margin-top: 20px;
  margin-left: 10px;

  &:hover {
    opacity: 0.8;
  }
`;
