import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

function Add() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const handleImageClick = () => {
    document.getElementById('fileInput').click(); // 파일 입력을 클릭하게 만듦
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // 이미지 파일 상태 업데이트
  };

  const handleSubmit = () => {
    // 필수 입력값 확인
    if (!image || !productName || !description || !price) {
      alert('상품 정보를 모두 입력해주세요');
      return; // 입력되지 않은 필드가 있으면 제출을 중단
    }

    // 상품 등록 로직 구현
    console.log({
      image,
      productName,
      description,
      price,
    });

    // 등록 후 관리 페이지로 이동
    navigate('/');
  };

  const goToManage = () => {
    navigate('/manage'); // 상품 관리 페이지로 이동
  };

  return (
    <Container>
      <ButtonContainer>
        <LeftDiv>상품 등록</LeftDiv>
        <VerticalBar />
        <RightDiv onClick={goToManage}>상품 관리</RightDiv>
      </ButtonContainer>
      <Bottombar />
      <Title>상품 정보</Title>
      <TitleBottombar />
      <InfoContainer>
        <InputContainer height="300px">
          {/* 상품 이미지 업로드 */}
          <Label>상품 이미지</Label>
          <ImageUpload onClick={handleImageClick}>
            <input id="fileInput" type="file" onChange={handleImageChange} />
            {!image && <UploadText>이미지 등록</UploadText>}
            {image && (
              <PreviewImage
                src={URL.createObjectURL(image)}
                alt="상품 이미지 미리보기"
              />
            )}
          </ImageUpload>
        </InputContainer>
        <Bottombar />
        <InputContainer>
          {/* 상품명 입력 */}
          <Label>상품명</Label>
          <Input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="상품명을 입력하세요"
          />
        </InputContainer>
        <Bottombar />
        <InputContainer>
          {/* 상품 설명 입력 */}
          <Label>상품 설명</Label>
          <TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="상품에 대한 설명을 입력하세요"
          />
        </InputContainer>
        <Bottombar />
      </InfoContainer>

      <Title>가격</Title>
      <TitleBottombar />
      {/* 가격 입력 */}
      <PriceContainer>
        <Label>가격</Label>
        <Input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="가격을 입력하세요"
        />
      </PriceContainer>
      <Bottombar />
      {/* 등록 버튼 */}
      <Register>
        <RegisterButton onClick={handleSubmit}>등록하기</RegisterButton>
      </Register>
    </Container>
  );
}

export default Add;

const Container = styled.div`
  padding: 20px;
  margin-top: 0;
`;

const ButtonContainer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  padding-bottom: 30px;
  width: 240px;
`;

const LeftDiv = styled.div`
  background-color: white;
  color: red;
  display: inline-block;
  padding: 10px;
  font-size: 17px;
  cursor: pointer;
  text-align: center;

  &:hover {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const RightDiv = styled.div`
  background-color: white;
  color: #333;
  display: inline-block;
  padding: 10px;
  font-size: 17px;
  cursor: pointer;
  text-align: center;

  &:hover {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }
`;

const VerticalBar = styled.div`
  width: 1px;
  height: 30px;
  background-color: #ccc;
  margin: 10px 20px 0 20px;
`;

const Bottombar = styled.div`
  width: 1500px;
  height: 1px;
  background-color: #f0f0f0;
`;

const Title = styled.h1`
  font-size: 27px;
  color: #333;
  margin: 40px 0px;
  font-weight: 500;
`;

const TitleBottombar = styled.div`
  width: 1500px;
  height: 3px;
  background-color: #333;
`;

/* 상품 정보 입력 */
const InfoContainer = styled.div`
  margin-top: 20px;
`;

const PriceContainer = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: row; /* 가로로 나열 */
  justify-content: space-between; /* 각 항목 사이 공간 균등 배치 */
  align-items: center; /* 세로 중앙 정렬 */
  margin-bottom: 20px;
  padding: 20px 20px;
`;

const Label = styled.label`
  font-size: 17px;
  color: #333;
  margin-bottom: 10px;
  display: block;
  text-align: center; /* Label 텍스트 가운데 정렬 */
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: row; /* 가로로 나열 */
  justify-content: space-between;
  align-items: center; /* 세로 중앙 정렬 */
  height: ${(props) => props.height || 'auto'};
  padding: 20px 20px;
`;

const Input = styled.input`
  padding: 8px 15px;
  border: 2px solid #ccc;
  margin: 20px;
  border-radius: 10px;
  width: 1050px;
  height: 40px;
  font-size: 17px;
`;

const TextArea = styled.textarea`
  padding: 15px 20px;
  border: 2px solid #ccc;
  margin: 20px;
  border-radius: 10px;
  width: 1038px;
  height: 100px;
  font-size: 17px;
`;

const ImageUpload = styled.div`
  width: 200px;
  height: 200px;
  border: 2px solid #ccc; // 점선 테두리
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: #f9f9f9;
  margin: 20px 900px 20px 20px;

  input[type='file'] {
    display: none; // 기본 파일 입력을 숨김
  }

  &:hover {
    background-color: #f1f1f1;
  }
`;
const UploadText = styled.p`
  font-size: 16px;
  color: #aaa;
  margin: 0;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover; // 이미지 비율을 유지하며 박스를 채우기
  border-radius: 10px;
`;

const Register = styled.div`
  display: flex;
  justify-content: flex-end; // 오른쪽 정렬
  margin: 40px;
`;

const RegisterButton = styled.button`
  background-color: #b30000;
  color: white;
  padding: 12px 60px;
  font-size: 23px;
  font-weight: 500;
  border: none;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    opacity: 0.6;
  }
`;
