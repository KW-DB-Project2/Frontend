import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function WriteComment({ initialContent = '' }) {
  const { user, token } = useContext(AuthContext);
  const [content, setContent] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { productid, commentid, reviewid } = useParams();
  const navigate = useNavigate();
  const SURL = import.meta.env.VITE_APP_URI;

  // 댓글 삭제 처리 함수
  const handleDelete = async () => {
    if (window.confirm('정말 이 댓글을 삭제하시겠습니까?')) {
      try {
        await axios.delete(`${SURL}/comments/${commentid}`, {
          params: {
            userId: user.id,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert('댓글이 성공적으로 삭제되었습니다!');
        navigate(`/product/${productid}`);
      } catch (error) {
        console.error('삭제 실패:', error);
        alert('댓글을 삭제할 권한이 없습니다.');
      }
    }
  };

  // 댓글 수정 시 기존 내용 불러오기
  useEffect(() => {
    if (commentid && productid) {
      const fetchComment = async () => {
        try {
          // API 호출
          const response = await axios.get(
            `${SURL}/comments/detail/${commentid}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const comment = response.data; // 단일 객체이므로 바로 사용

          if (comment && comment.commentId === Number(commentid)) {
            // 댓글이 존재하면 내용 설정
            setContent(comment.commentContent);
          } else {
            // 존재하지 않을 경우 경고 메시지
            alert('해당 댓글을 찾을 수 없습니다.');
          }
        } catch (error) {
          console.error('댓글 정보를 불러오는 중 오류 발생:', error);
          alert('댓글 정보를 불러오는 중 오류가 발생했습니다.');
        }
      };

      fetchComment();
    }
  }, [commentid, productid, token]);

  const handleContentChange = (e) => setContent(e.target.value);

  // 댓글 수정 및 작성 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content) {
      alert('내용을 작성해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        userId: user.id,
        productId: productid,
        reviewId: reviewid, // 이미 URL로 받아온 reviewId 추가
        commentContent: content,
      };

      if (commentid) {
        // 댓글 수정 요청
        await axios.put(
          `${SURL}/comments/${commentid}`,
          payload, // payload는 commentId를 별도로 포함하지 않아도 됨
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert('댓글이 성공적으로 수정되었습니다!');
      } else {
        // 댓글 작성 요청
        await axios.post(`${SURL}/comments`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert('댓글이 성공적으로 작성되었습니다!');
      }

      // 작성/수정 후 페이지 이동 및 입력 내용 초기화
      navigate(`/product/${productid}`);
      setContent('');
    } catch (error) {
      console.error('요청 실패:', error);
      alert('댓글을 작성/수정할 권한이 없습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>{commentid ? 'Comment 수정' : 'Comment 작성'}</Title>
        <BottomBar />
        <Label>내용</Label>
        <TextArea
          value={content}
          onChange={handleContentChange}
          placeholder="Comment 내용을 입력하세요"
          rows="6"
        />
        <ButtonContainer>
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? '작성 중...' : commentid ? '수정하기' : '제출하기'}
          </SubmitButton>
          {commentid && (
            <DeleteButton type="button" onClick={handleDelete}>
              삭제하기
            </DeleteButton>
          )}
        </ButtonContainer>
      </Form>
    </Container>
  );
}

export default WriteComment;

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
