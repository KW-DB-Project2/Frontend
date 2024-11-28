import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
// 아이콘
import { FaExclamationTriangle, FaSearch, FaUserCircle } from 'react-icons/fa';
import { FiLoader } from 'react-icons/fi';
// 컴포넌트 임포트
import { AuthContext } from '../context/AuthContext';

function Product() {
  const { user, token } = useContext(AuthContext); // AuthContext에서 사용자 정보 가져오기
  const { productid } = useParams(); // URL 파라미터에서 productid 값을 받음
  const navigate = useNavigate(); // 네비게이션 훅
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState(''); // 검색 키워드 관리

  // 더미 상품 데이터
  const dummyProduct = {
    productId: 1,
    productTitle: '예시 상품',
    productPrice: 10000,
    productContent: '이 상품은 예시 상품입니다. 상세 내용이 없습니다.',
    productImg: '', // 기본 이미지 경로 (이미지가 없으면 빈 문자열)
  };

  // 더미 리뷰 데이터
  const dummyReviews = [
    {
      reviewId: 1,
      reviewTitle: '예시 리뷰 1',
      reviewContent: '이 상품은 정말 좋습니다!',
    },
    {
      reviewId: 2,
      reviewTitle: '예시 리뷰 2',
      reviewContent: '가격 대비 품질이 우수합니다.',
    },
  ];

  // 상품 정보 가져오기
  useEffect(() => {
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
        const products = response.data;
        const selectedProduct = products.find(
          (product) => product.productId === parseInt(productid)
        );
        setProduct(selectedProduct || dummyProduct); // 상품이 없으면 더미 데이터 사용
      } catch (error) {
        console.error('상품 정보를 가져오는 중 오류 발생:', error);
        setProduct(dummyProduct); // 에러가 나면 더미 데이터 사용
      }
    };

    fetchProducts();
  }, [productid, token]);

  // 상품 리뷰를 가져오는 API 호출
  useEffect(() => {
    const fetchProductReviews = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_URI}/reviews/product/${productid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReviews(response.data.length ? response.data : dummyReviews); // 리뷰가 없으면 더미 데이터 사용
      } catch (error) {
        console.error('리뷰를 가져오는 중 오류 발생:', error);
        setReviews(dummyReviews); // 에러가 나면 더미 데이터 사용
      }
    };

    if (productid) {
      fetchProductReviews();
    }
  }, [productid, token]);

  // 리뷰 검색 API 호출
  const fetchReviews = async (keyword) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_URI}/reviews/search`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { keyword },
        }
      );

      setReviews(response.data);
    } catch (error) {
      console.error('리뷰 검색 중 오류 발생:', error);
    }
  };

  // 검색 키워드 입력 시 업데이트
  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  // 검색 버튼 클릭 시 호출
  const handleSearchClick = () => {
    if (searchKeyword.trim() !== '') {
      fetchReviews(searchKeyword.trim());
    }
  };

  // 리뷰 수정/삭제 버튼 클릭 시 해당 리뷰의 productid와 reviewid를 기반으로 이동
  const handleEditClick = (reviewid) => {
    navigate(`/write-review/${productid}/${reviewid}`);
  };

  if (!product) {
    return (
      <LoadingContainer>
        <FiLoader size={40} className="loading-icon" />
        상품 정보를 불러오는 중...
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <Content>
        <Image
          src={`data:image/png;base64,${product.productImg}`}
          alt={product.productTitle || '상품 이미지'}
        />
        <Details>
          <ProductName>{product.productTitle}</ProductName>
          <PriceContainer>
            <Price>{product.productPrice.toLocaleString()}원</Price>
            <ReportButton>
              <FaExclamationTriangle size={17} color="red" />
              신고하기
            </ReportButton>
          </PriceContainer>
          <BottomBar />
          <div style={{ fontSize: '19px' }}>상품정보</div>
          <BottomBar />
          <Description>{product.productContent}</Description>
          <ButtonContainer
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              width: '100%',
            }}
          >
            <QnAButton onClick={() => navigate(`/qna/${productid}`)}>
              문의하기
            </QnAButton>
            <BuyButton>구매하기</BuyButton>
          </ButtonContainer>
        </Details>
      </Content>
      <br />
      <br />
      <BottomBar />

      {/* 리뷰 게시판 */}
      <BoardSection>
        <BoardTitle>
          Review
          {/* 리뷰 검색 */}
          <SearchContainer>
            <SearchInput
              type="text"
              value={searchKeyword}
              onChange={handleSearchChange}
              placeholder="리뷰 검색어를 입력하세요..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearchClick();
                }
              }}
            />
            <SearchButton onClick={handleSearchClick}>
              <FaSearch size={23} color="#333" />
            </SearchButton>
          </SearchContainer>
          <RightAlign>
            {/* 글쓰기 버튼 */}
            <WriteButton onClick={() => navigate(`/write-review/${productid}`)}>
              글쓰기
            </WriteButton>
          </RightAlign>
        </BoardTitle>
        <BoardList>
          {reviews.map((review, index) => (
            <BoardItem key={index}>
              <BoardContent>
                <BoardUser>
                  <ProfileIcon />
                </BoardUser>
                <ButtonContainer>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      width: '100%',
                    }}
                  >
                    {/* 수정/삭제 버튼 */}
                    <EditButton
                      onClick={() => handleEditClick(review.reviewId)}
                    >
                      게시글 수정/삭제
                    </EditButton>
                    {/* 신고하기 버튼 */}
                    <ReportButton>
                      <FaExclamationTriangle size={17} color="red" />
                      신고하기
                    </ReportButton>
                  </div>
                </ButtonContainer>
              </BoardContent>
              <BottomBar />
              <BoardTt>{review.reviewTitle}</BoardTt>
              <BoardText>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {review.reviewContent}
                </div>
              </BoardText>
            </BoardItem>
          ))}
        </BoardList>
      </BoardSection>
    </Container>
  );
}

export default Product;

const Container = styled.div`
  width: 1500px;
  margin-top: 20px;
  padding: 50px;
  margin-top: 0;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  display: flex;
  gap: 40px;
`;

const Image = styled.img`
  width: 500px;
  height: auto;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Details = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
`;

const ProductName = styled.h2`
  font-size: 27px;
  color: #333;
  font-weight: 500;
`;

const PriceContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Price = styled.div`
  color: #333;
  font-size: 33px;
  font-weight: 500;
`;

const ReportButton = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border: none;
  padding: 5px 10px;
  font-size: 16px;
  cursor: pointer;
  color: red;
  border-radius: 5px;
  svg {
    margin-right: 5px;
  }
`;

const BottomBar = styled.div`
  height: 2px;
  width: 100%;
  background-color: #f0f0f0;
  margin: 20px 0px;
`;

const Description = styled.p`
  flex-grow: 1;
  margin-bottom: 100px;
`;

const BoardContent = styled.div`
  display: flex;
  justify-content: space-between; /* 왼쪽은 BoardUser, 오른쪽은 ButtonContainer */
  align-items: center; /* 세로 정렬 */
  width: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px; /* 버튼들 사이 간격 */
`;

const BuyButton = styled.button`
  padding: 10px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 150px;

  font-size: 20px;
  &:hover {
    opacity: 0.9;
  }
`;

const QnAButton = styled.button`
  padding: 10px;
  background-color: white;
  color: #ccc;
  border: none;

  cursor: pointer;
  width: 150px;
  align-self: flex-end;
  font-size: 20px;
`;

/* board */
const BoardSection = styled.div`
  margin-top: 40px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const BoardTitle = styled.h3`
  font-size: 33px;
  color: #333;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RightAlign = styled.div`
  margin-left: auto;
`;

const BoardList = styled.div`
  margin-top: 10px;
`;

const BoardItem = styled.div`
  margin-bottom: 15px;
  padding: 10px 30px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #333;
`;

const ProfileIcon = styled(FaUserCircle)`
  margin-right: 10px;
`;

const BoardUser = styled.div`
  display: flex;
  align-items: center;
`;

const BoardTt = styled.h4`
  font-size: 20px;
  color: #333;
  font-weight: 500;
`;

const BoardText = styled.p`
  font-size: 16px;
  color: #666;
  line-height: 1.5;
  margin-top: 10px;
`;

/* 검색창 */
const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0px 20px 50px;
`;

const SearchInput = styled.input`
  padding: 8px 15px;
  border: 2px solid #ccc;
  margin-right: 10px;
  border-radius: 15px;
  width: 300px;
  height: 20px;
  font-size: 17px;
`;

const SearchButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 10px;

  &:hover {
    opacity: 0.7;
`;

const WriteButton = styled.button`
  color: #333;
  border: 1px solid #333;
  padding: 10px 30px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;
  margin-top: 20px;
  align-self: flex-start;
  &:hover {
    border: 1px solid #333;
    color: #aaa;
  }
`;

const EditButton = styled.button`
  background-color: white;
  color: #666;
  font-size: 14px;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
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
