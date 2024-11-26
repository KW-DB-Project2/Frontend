import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaExclamationTriangle } from 'react-icons/fa'; // 신고 아이콘
import axios from 'axios';
import { FiLoader } from 'react-icons/fi';
// 컴포넌트 임포트
import { AuthContext } from '../context/AuthContext';

function Product() {
  const { token } = useContext(AuthContext); // AuthContext에서 사용자 정보 가져오기
  const { productid } = useParams(); // URL 파라미터에서 productid 값을 받음
  const navigate = useNavigate(); // 네비게이션 훅
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([
    {
      user: 'Riia',
      text: '굿! 상품 너무 귀여워요!!',
      comments: [],
    },
    {
      user: 'Minji',
      text: '상품 너무 좋아요! 배송도 빨랐어요~',
      comments: [],
    },
  ]);
  const [qaItems, setQaItems] = useState([
    {
      user: 'Riia',
      question: '혹시 덤으로 스트커 하나 더 주실 수 있나요?',
      answer: '감자나눔님 죄송하지만 그 불가능할 것 같습니다 ㅠㅠ',
      comments: [],
    },
    {
      user: 'Minji',
      question: '상품이 언제 다시 입고되나요?',
      answer: '다음 주 월요일에 재입고 예정입니다!',
      comments: [],
    },
  ]);
  const [newComment, setNewComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(null); // 어떤 게시글에서 댓글을 쓸지 관리

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // axios를 사용해서 상품 목록을 가져오는 API 요청
        const response = await axios.get(
          `${import.meta.env.VITE_APP_URI}/product`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // 인증 토큰
            },
          }
        );
        console.log('response.data', response.data);
        console.log('productid', productid);
        const products = response.data; // 상품 목록을 응답에서 가져옴

        // id 값에 맞는 상품을 찾음
        const selectedProduct = products.find(
          (product) => product.productId === parseInt(productid)
        );

        // 상품을 상태로 설정
        setProduct(selectedProduct);
      } catch (error) {
        console.error('상품 정보를 가져오는 중 오류 발생:', error);
      }
    };

    fetchProducts();
  }, [productid, token]); // id 값이나 token 값이 바뀔 때마다 상품 정보를 다시 가져옴

  const handleAddComment = (index, type) => {
    if (newComment.trim() === '') return;

    const updatedData = type === 'review' ? [...reviews] : [...qaItems];
    const newCommentData = { user: 'A', text: newComment };

    if (type === 'review') {
      updatedData[index].comments.push(newCommentData);
      setReviews(updatedData);
    } else {
      updatedData[index].comments.push(newCommentData);
      setQaItems(updatedData);
    }

    setNewComment('');
    setIsCommenting(null); // 댓글 작성 완료 후 input 숨기기
  };

  const handleInputChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentToggle = (index) => {
    setIsCommenting(isCommenting === index ? null : index); // 댓글 창 토글
  };

  const handleWriteClick = (type) => {
    if (type === 'review') {
      navigate('/write-review');
    } else {
      navigate('/write-qa');
    }
  };

  if (!product) {
    return (
      <LoadingContainer>
        <FiLoader size={40} className="loading-icon" />
        상품 정보를 불러오는 중...
      </LoadingContainer>
    ); // 로딩 중일 때 아이콘 표시
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
          <BuyButton>구매하기</BuyButton>
        </Details>
      </Content>
      <br />
      <br />
      <BottomBar />

      {/* 리뷰 게시판 */}
      <BoardSection>
        <BoardTitle>
          REVIEW
          <RightAlign>
            <WriteButton onClick={() => handleWriteClick('review')}>
              글쓰기
            </WriteButton>
          </RightAlign>
        </BoardTitle>
        <BoardList>
          {reviews.map((review, index) => (
            <BoardItem key={index}>
              <BoardUser>{review.user}</BoardUser>
              <BoardText>{review.text}</BoardText>
              <CommentSection>
                {review.comments.map((comment, idx) => (
                  <Comment key={idx}>
                    <strong>{comment.user}: </strong>
                    {comment.text}
                  </Comment>
                ))}
                {/* 댓글 작성 입력 필드 토글 */}
                {isCommenting === index && (
                  <>
                    <CommentInput
                      type="text"
                      value={newComment}
                      onChange={handleInputChange}
                      placeholder="댓글을 작성하세요..."
                    />
                    <CommentButton
                      onClick={() => handleAddComment(index, 'review')}
                    >
                      댓글쓰기
                    </CommentButton>
                  </>
                )}
                <ToggleCommentButton onClick={() => handleCommentToggle(index)}>
                  {isCommenting === index ? '취소' : '댓글 쓰기'}
                </ToggleCommentButton>
              </CommentSection>
            </BoardItem>
          ))}
        </BoardList>
      </BoardSection>

      {/* Q&A 게시판 */}
      <BoardSection>
        <BoardTitle>
          Q&A
          <RightAlign>
            <WriteButton onClick={() => handleWriteClick('qa')}>
              글쓰기
            </WriteButton>
          </RightAlign>
        </BoardTitle>
        <BoardList>
          {qaItems.map((item, index) => (
            <BoardItem key={index}>
              <BoardUser>{item.user}</BoardUser>
              <BoardText>
                <strong>Q: </strong>
                {item.question}
              </BoardText>
              <BoardText>
                <strong>A: </strong>
                {item.answer}
              </BoardText>
              <CommentSection>
                {item.comments.map((comment, idx) => (
                  <Comment key={idx}>
                    <strong>{comment.user}: </strong>
                    {comment.text}
                  </Comment>
                ))}
                {/* 댓글 작성 입력 필드 토글 */}
                {isCommenting === index && (
                  <>
                    <CommentInput
                      type="text"
                      value={newComment}
                      onChange={handleInputChange}
                      placeholder="댓글을 작성하세요..."
                    />
                    <CommentButton
                      onClick={() => handleAddComment(index, 'qa')}
                    >
                      댓글쓰기
                    </CommentButton>
                  </>
                )}
                <ToggleCommentButton onClick={() => handleCommentToggle(index)}>
                  {isCommenting === index ? '취소' : '댓글 쓰기'}
                </ToggleCommentButton>
              </CommentSection>
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

const BuyButton = styled.button`
  padding: 10px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 150px;
  align-self: flex-end;
  font-size: 20px;
  &:hover {
    opacity: 0.9;
  }
`;

/* borad */

const BoardSection = styled.div`
  margin-top: 40px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
`;

const BoardTitle = styled.h3`
  font-size: 24px;
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
  padding: 10px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const BoardUser = styled.p`
  font-weight: bold;
  margin-bottom: 5px;
`;

const BoardText = styled.p`
  font-size: 16px;
  margin-bottom: 10px;
`;

const CommentSection = styled.div`
  margin-top: 10px;
`;

const Comment = styled.div`
  margin-top: 5px;
  font-size: 16px;
  color: #333;
`;

const CommentInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const CommentButton = styled.button`
  background-color: #333;
  color: white;
  border: none;
  padding: 10px 30px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;
  margin-top: 20px;
  align-self: flex-start;
  &:hover {
    opacity: 0.8;
  }
`;

const WriteButton = styled.button`
  background-color: #333;
  color: white;
  border: none;
  padding: 10px 30px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;
  margin-top: 20px;
  align-self: flex-start;
  &:hover {
    opacity: 0.8;
  }
`;

const ToggleCommentButton = styled.button`
  background-color: #333;
  color: white;
  border: none;
  padding: 10px 30px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;
  margin-top: 20px;
  align-self: flex-start;
  &:hover {
    opacity: 0.8;
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
