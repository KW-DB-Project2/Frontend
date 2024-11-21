import React from 'react';
import styled from 'styled-components';

function Mypage() {
  return (
    <Container>
      <AccountSection>
        <InfoRow>
          <Label>DB0000000</Label>
          <Button>상점명 수정</Button>
        </InfoRow>
        <InfoRow>
          <Label>개인정보</Label>
          <Button>수정</Button>
        </InfoRow>
        <InfoRow>
          <Label>Email@email.com</Label>
          <Button>수정</Button>
        </InfoRow>
        <InfoRow>
          <Label>010-0000-0000</Label>
          <Button>수정</Button>
        </InfoRow>
      </AccountSection>
    </Container>
  );
}

export default Mypage;

const Container = styled.div`
  padding: 20px;
  margin-top: 20px;
`;

const AccountSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.span`
  font-size: 16px;
  color: #333;
`;

const Button = styled.button`
  padding: 5px 10px;
  font-size: 14px;
  color: white;
  background-color: #f0f0f0;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #ccc;
  }
`;
