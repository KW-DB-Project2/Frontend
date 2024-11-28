function Product() {
  const { user, token } = useContext(AuthContext);
  const { productid } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reportContent, setReportContent] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_URI}/product`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const selectedProduct = response.data.find(
          (product) => product.productId === parseInt(productid)
        );
        setProduct(selectedProduct);
      } catch (error) {
        console.error('상품 정보를 가져오는 중 오류 발생:', error);
        setProduct(null);
      }
    };

    fetchProduct();
  }, [productid, token]);

  const handleReportSubmit = async () => {
    if (!reportContent) {
      alert('신고 내용을 입력해주세요.');
      return;
    }

    try {
      const reportData = {
        userId: user.userId,
        productId: parseInt(productid),
        productReportContent: reportContent,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_APP_URI}/report/product`,
        reportData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        setReportSuccess(true);
        alert('상품 신고가 접수되었습니다.');
      }
    } catch (error) {
      console.error('상품 신고 중 오류 발생:', error);
      alert('상품 신고에 실패했습니다.');
    }
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
            <ReportButton onClick={handleReportSubmit}>
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
      <Review productid={productid} />
    </Container>
  );
}
