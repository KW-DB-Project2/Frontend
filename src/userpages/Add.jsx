import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

/* 토큰 Context */
import { AuthContext } from '../context/AuthContext';

function Add() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const SURL = import.meta.env.VITE_APP_URI;

  const handleImageClick = () => {
    document.getElementById('fileInput').click(); // 파일 입력을 클릭하게 만듦
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // 선택한 파일
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // 이미지 파일을 base64로 변환하여 상태에 저장
        setImage(reader.result);
      };
      reader.readAsDataURL(file); // 파일을 base64로 읽음
    }
  };

  const handleSubmit = async () => {
    // 필수 입력값 확인
    if (!image || !productName || !description || !price) {
      alert('상품 정보를 모두 입력해주세요');
      return; // 입력되지 않은 필드가 있으면 제출을 중단
    }

    // 상품 등록 요청을 위한 DTO 객체 생성
    const productDTO = {
      userId: user.id,
      productTitle: productName,
      productContent: description,
      productPrice: parseInt(price, 10),
      productStatus: true, // 등록 시 상태는 '판매중'으로 설정
      productImg: image.split(',')[1], // base64로 변환된 이미지 문자열만 추출
    };
    console.log(productDTO);

    try {
      // 서버에 상품 등록 요청
      const response = await fetch(`${SURL}/product/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productDTO), // DTO 객체를 JSON 형태로 요청 본문에 포함
      });

      if (response.ok) {
        alert('상품이 성공적으로 추가되었습니다');
        navigate('/'); // 등록 후 홈으로 리다이렉트
      } else {
        alert('상품 등록에 실패했습니다');
      }
    } catch (error) {
      console.error('상품 등록 중 오류가 발생했습니다:', error);
      alert('상품 등록 중 오류가 발생했습니다');
    }
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
                src={image} // base64로 인코딩된 이미지 표시
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
  margin-top: 20px;
`;

const RegisterButton = styled.button`
  font-size: 18px;
  padding: 15px 30px;
  color: white;
  background-color: red;
  border: none;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    background-color: darkred;
  }
`;
