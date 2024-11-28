import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // useNavigate 사용
import { AuthContext } from '../context/AuthContext'; // 사용자 정보를 AuthContext에서 가져옴

function WriteQA() {
  const { user } = useContext(AuthContext); // 사용자 정보 가져오기
  const [content, setContent] = useState(''); // Q&A 내용 상태 관리
  const [isSubmitting, setIsSubmitting] = useState(false); // 제출 상태 관리

  const { productid } = useParams(); // URL에서 productid를 가져옴
  const navigate = useNavigate(); // 페이지 이동을 위한 hook

  // 내용이 변경될 때마다 상태 업데이트
  const handleContentChange = (e) => setContent(e.target.value);

  // 폼 제출 함수
  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 제출 동작 방지

    // 내용이 비어있으면 경고
    if (!content) {
      alert('내용을 작성해주세요.');
      return;
    }

    setIsSubmitting(true); // 제출 중 상태로 변경

    // 서버에 보낼 데이터 준비
    const askDTO = {
      userId: user.id, // 사용자 ID (AuthContext에서 가져온 값)
      productId: productid, // URL에서 가져온 productId
      askContent: content, // 작성한 Q&A 내용
    };

    try {
      // Q&A 데이터 서버에 POST 요청
      await axios.post(`${import.meta.env.VITE_APP_URI}/ask`, askDTO);
      alert('Q&A가 성공적으로 작성되었습니다!');
      setContent(''); // 제출 후 내용 초기화

      // 제출 성공 후 Q&A 페이지로 이동
      navigate(`/qna/${productid}`);
    } catch (error) {
      console.error('Q&A 제출 실패:', error); // 에러 로그
      alert('Q&A 제출 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false); // 제출 상태 종료
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>Q&A</Title>
        <BottomBar />

        <Label>내용</Label>
        <TextArea
          value={content} // 현재 내용 값
          onChange={handleContentChange} // 내용 변경 시 처리
          placeholder="Q&A 내용을 입력하세요" // 내용 입력 안내
          rows="6"
        />

        <ButtonContainer>
          <SubmitButton type="submit" disabled={isSubmitting}>
            {/* 제출 중이면 버튼 비활성화 */}
            {isSubmitting ? '작성 중...' : '제출하기'}
          </SubmitButton>
        </ButtonContainer>
      </Form>
    </Container>
  );
}

export default WriteQA;

// 스타일 컴포넌트들
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
