import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';

/* 토큰 Context */
import { AuthContext } from '../context/AuthContext';

function Add() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { productId } = useParams(); // URL 파라미터로 상품 ID 받아오기
  const [image, setImage] = useState(null);
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const SURL = import.meta.env.VITE_APP_URI;

  // 상품 수정 시 기존 정보 불러오기
  useEffect(() => {
    if (productId) {
      // 모든 상품 정보 가져오기
      fetch(`${SURL}/product`)
        .then((response) => response.json())
        .then((data) => {
          // data는 모든 상품의 배열이므로, productId에 맞는 상품을 찾기
          const product = data.find(
            (item) => item.productId === parseInt(productId)
          );
          if (product) {
            setProductName(product.productTitle);
            setDescription(product.productContent);
            setPrice(product.productPrice);
            setImage(`data:image/jpeg;base64,${product.productImg}`); // 서버에서 base64로 이미지 데이터가 오면
          } else {
            alert('해당 상품을 찾을 수 없습니다.');
          }
        })
        .catch((error) => {
          console.error('상품 정보를 불러오는 중 오류 발생:', error);
          alert('상품 정보를 불러오는 중 오류가 발생했습니다.');
        });
    }
  }, [productId]);

  const handleImageClick = () => {
    document.getElementById('fileInput').click(); // 파일 입력을 클릭하게 만듦
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // 선택한 파일
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file); // 파일을 base64로 읽음
    }
  };

  const handleSubmit = async () => {
    if (
      !productName ||
      !description ||
      !price ||
      (productId && !image && !image.startsWith('data:image/jpeg;base64,'))
    ) {
      alert('상품 정보를 모두 입력해주세요');
      return;
    }

    const productDTO = {
      productId: productId ? parseInt(productId, 10) : null, // 수정 시 포함
      userId: user.id,
      productTitle: productName,
      productContent: description,
      productPrice: parseInt(price, 10),
      productStatus: true, // 등록 시 상태는 '판매중'으로 설정
      productImg: image && image.split(',')[1], // 수정할 때만 이미지가 없으면 기존 이미지 유지
    };
    console.log(productDTO);
    try {
      const response = await fetch(
        `${SURL}/product/${productId ? productId : 'add'}`,
        {
          method: productId ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`, // 추가된 Authorization 헤더
          },
          body: JSON.stringify(productDTO),
        }
      );

      if (response.ok) {
        alert(
          productId
            ? '상품이 성공적으로 수정되었습니다'
            : '상품이 성공적으로 등록되었습니다'
        );
        navigate('/'); // 홈 페이지로 리다이렉트
      } else {
        alert('상품 처리에 실패했습니다');
      }
    } catch (error) {
      console.error('상품 등록/수정 중 오류가 발생했습니다:', error);
      alert('상품 처리 중 오류가 발생했습니다');
    }
  };

  const goToManage = () => {
    navigate('/manage'); // 상품 관리 페이지로 이동
  };

  return (
    <Container>
      <ButtonContainer>
        <LeftDiv>{productId ? '상품 수정' : '상품 등록'}</LeftDiv>
        <VerticalBar />
        <RightDiv onClick={goToManage}>상품 관리</RightDiv>
      </ButtonContainer>
      <Bottombar />
      <Title>{productId ? '상품 수정' : '상품 정보'}</Title>
      <TitleBottombar />
      <InfoContainer>
        <InputContainer height="300px">
          <Label>상품 이미지</Label>
          <ImageUpload onClick={handleImageClick}>
            <input id="fileInput" type="file" onChange={handleImageChange} />
            {!image && <UploadText>이미지 등록</UploadText>}
            {image && <PreviewImage src={image} alt="상품 이미지 미리보기" />}
          </ImageUpload>
        </InputContainer>
        <Bottombar />
        <InputContainer>
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
      <Register>
        <RegisterButton onClick={handleSubmit}>
          {productId ? '수정하기' : '등록하기'}
        </RegisterButton>
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
