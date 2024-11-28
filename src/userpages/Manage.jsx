import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { FiLoader } from 'react-icons/fi';

// 컴포넌트 임포트
import { AuthContext } from '../context/AuthContext';

function Manage() {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const [selectedStatus, setSelectedStatus] = useState('전체');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 상품 데이터 가져오기
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_URI}/product`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // 로그인한 유저 ID에 맞는 상품 필터링
        const userProducts = response.data.filter(
          (product) => product.userId === user.id
        );
        setProducts(userProducts);
        setLoading(false);
      } catch (error) {
        console.error('상품 데이터를 가져오는 중 오류 발생:', error);
      }
    };

    fetchProducts();
  }, [token]);

  const handleDelete = async (productId) => {
    if (window.confirm('정말 이 리뷰를 삭제하시겠습니까?')) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_APP_URI}/product/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert('상품이 성공적으로 삭제되었습니다.');
        setProducts(
          products.filter((product) => product.productId !== productId)
        );
      } catch (error) {
        console.error('상품 삭제 중 오류 발생:', error);
        alert('상품 삭제에 실패했습니다.');
      }
    }
  };

  const handleStatus = async (productId) => {
    // 현재 상태를 찾음
    const product = products.find((product) => product.productId === productId);
    const newStatus = !product.productStatus; // 판매 상태 반전

    if (window.confirm('판매 상태를 변경하시겠습니까?')) {
      try {
        // PUT 요청을 통해 상태 변경
        await axios.put(
          `${import.meta.env.VITE_APP_URI}/product/${productId}`,
          {
            ...product,
            productStatus: newStatus, // 반전된 상태
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // 상태 변경 후, 상품 상태 업데이트
        setProducts((prevProducts) =>
          prevProducts.map((prod) =>
            prod.productId === productId
              ? { ...prod, productStatus: newStatus }
              : prod
          )
        );

        alert('판매 상태가 성공적으로 업데이트되었습니다.');
      } catch (error) {
        console.error('상품 상태 변경 중 오류 발생:', error);
        alert('상품 상태 변경에 실패했습니다.');
      }
    }
  };

  const filteredProducts = products.filter((product) => {
    const title = product.productTitle || '';
    const matchesStatus =
      selectedStatus === '전체' ||
      (selectedStatus === '판매중' && product.productStatus === true) ||
      (selectedStatus === '판매완료' && product.productStatus === false);
    const matchesKeyword = title
      .toLowerCase()
      .includes(searchKeyword.toLowerCase());
    return matchesStatus && matchesKeyword;
  });

  const goToAdd = () => {
    navigate('/add');
  };

  const handleStatusClick = (status) => {
    setSelectedStatus(status);
  };

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  // 수정 버튼 클릭 시 수정 페이지로 이동
  const handleEdit = (productId) => {
    navigate(`/add/${productId}`);
  };

  if (loading) {
    return (
      <LoadingContainer>
        <FiLoader size={40} className="loading-icon" />
        로딩 중...
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <ButtonContainer>
        <LeftDiv onClick={goToAdd}>상품 등록</LeftDiv>
        <VerticalBar />
        <RightDiv>상품 관리</RightDiv>
      </ButtonContainer>
      <Bottombar />
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="상품명을 입력하세요"
          value={searchKeyword}
          onChange={handleSearchChange}
        />
        <SearchButton>
          <FaSearch size={27} color="#333" />
        </SearchButton>
        <StatusContainer>
          <StatusButton
            onClick={() => handleStatusClick('전체')}
            selected={selectedStatus === '전체'}
          >
            전체
          </StatusButton>
          <StatusButton
            onClick={() => handleStatusClick('판매중')}
            selected={selectedStatus === '판매중'}
          >
            판매중
          </StatusButton>
          <StatusButton
            onClick={() => handleStatusClick('판매완료')}
            selected={selectedStatus === '판매완료'}
          >
            판매완료
          </StatusButton>
        </StatusContainer>
      </SearchContainer>
      <TitleBottombar />
      <Attribute>
        <AttributeItem width="150px">사진</AttributeItem>
        <AttributeItem width="200px">판매상태</AttributeItem>
        <AttributeItem width="150px">상품명</AttributeItem>
        <AttributeItem width="140px">가격</AttributeItem>
        <AttributeItem width="130px">기능</AttributeItem>
      </Attribute>
      <TitleBottombar />
      <ProductContainer>
        {filteredProducts.map((product) => (
          <ProductRow key={product.productId}>
            <ProductItem width="150px">
              <Image
                src={`data:image/png;base64,${product.productImg}`}
                alt={product.productTitle || '상품 이미지'}
              />
            </ProductItem>
            <ProductItem width="200px">
              {product.productStatus ? '판매중' : '판매완료'}
            </ProductItem>
            <ProductItem width="150px">{product.productTitle}</ProductItem>
            <ProductItem width="140px">
              {product.productPrice.toLocaleString()}원
            </ProductItem>
            <ProductItem width="130px">
              <Button onClick={() => handleEdit(product.productId)}>
                수정
              </Button>
              <Button onClick={() => handleDelete(product.productId)}>
                삭제
              </Button>
              <Button onClick={() => handleStatus(product.productId)}>
                상태변경
              </Button>
            </ProductItem>
          </ProductRow>
        ))}
      </ProductContainer>
    </Container>
  );
}

export default Manage;

const Container = styled.div`
  padding: 20px;
  margin-top: 0;
  position: fixed; /* 화면에 고정 */
  top: 23.8%;
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

const RightDiv = styled.div`
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

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0px;
`;

const SearchInput = styled.input`
  padding: 8px 15px;
  border: 2px solid #ccc;
  margin-right: 10px;
  border-radius: 15px;
  width: 550px;
  height: 30px;
  font-size: 17px;
`;

const SearchButton = styled.div`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 10px;

  &:hover {
    opacity: 0.7;
  }
`;

const TitleBottombar = styled.div`
  width: 1500px;
  height: 3px;
  background-color: #333;
`;

const StatusContainer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: flex-end; /* 오른쪽 정렬 */
  width: 100%; /* 전체 너비 차지 */
`;

const StatusButton = styled.div`
  color: ${(props) =>
    props.selected ? 'red' : '#333'}; // isSelected 대신 selected 사용
  display: inline-block;
  padding: 10px;
  font-size: 17px;
  cursor: pointer;
  text-align: center;
  margin-left: 10px;
  border-radius: 5px;

  &:hover {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const Attribute = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px 50px;
`;

const AttributeItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: ${(props) => props.width || 'auto'};
  text-align: center;
  font-weight: 500;
  color: #333;
  font-size: 17px;
`;

/* 상품 리스트 */
const ProductContainer = styled.div`
  max-height: 380px; /* 컨테이너 최대 높이 지정 */
  overflow-y: auto; /* 수직 스크롤 활성화 */
`;

const ProductRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 50px;
  border-bottom: 1px solid #ddd;
`;

const ProductItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* 수직 방향으로도 가운데 정렬 */
  width: ${(props) => props.width || 'auto'};
  height: ${(props) => props.height || 'auto'}; /* 필요하다면 높이 지정 */
  text-align: center;
  color: #333;
  font-size: 17px;
`;

const Image = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
`;

const Button = styled.div`
  background-color: white;
  border: 1px solid #ccc;
  padding: 5px 30px;
  cursor: pointer;
  font-size: 15px;
  border-radius: 5px;
  margin: 5px;
  color: red;
  &:hover {
    border: 1px solid red;
  }
`;

const LoadingContainer = styled.div`
  position: fixed; /* 화면에 고정 */
  top: 50%; /* 화면의 세로 중앙 */
  left: 50%; /* 화면의 가로 중앙 */
  transform: translate(-50%, -50%); /* 정확히 중앙에 맞추기 위해 이동 */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .loading-icon {
    animation: rotate 1s linear infinite;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
