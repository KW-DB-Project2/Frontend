import React, { useState } from 'react';
import styled from 'styled-components';

function WriteQA() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 제목과 내용 상태 관리 함수
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleContentChange = (e) => setContent(e.target.value);

  // 제출 함수
  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && content) {
      setIsSubmitting(true);
      // Q&A 제출 로직 (예: API 호출)
      setTimeout(() => {
        // 제출 완료 후 초기화
        setIsSubmitting(false);
        alert('Q&A가 성공적으로 작성되었습니다!');
        setTitle('');
        setContent('');
      }, 1000); // 잠시 후 알림
    } else {
      alert('제목과 내용을 모두 작성해주세요.');
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>Q&A</Title>
        <BottomBar />
        <Label>제목</Label>
        <Input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Q&A 제목을 입력하세요"
        />

        <Label>내용</Label>
        <TextArea
          value={content}
          onChange={handleContentChange}
          placeholder="Q&A 내용을 입력하세요"
          rows="6"
        />

        <ButtonContainer>
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? '작성 중...' : '제출하기'}
          </SubmitButton>
        </ButtonContainer>
      </Form>
    </Container>
  );
}

export default WriteQA;

const Container = styled.div`
  width: 1500px;
  margin: 40px auto;
  padding: 40px;
  background-color: #ffffff;
  border-radius: 12px;
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
