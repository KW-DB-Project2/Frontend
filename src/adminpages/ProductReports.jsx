import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SURL = import.meta.env.VITE_APP_URI;

function ProductReports() {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

  // 제품 항목 클릭 시 해당 제품 상세 페이지로 이동
  const navigateToProductDetail = (userid, productid) => {
    navigate(`/admin/user-product/${userid}/${productid}`); // 클릭된 제품의 id와 userid를 URL에 전달
  };

  // Review 신고 목록으로 이동
  const navigateToUserReport = () => {
    navigate('/admin/review-reports');
  };

  useEffect(() => {
    // 제품 신고 목록을 API에서 가져오는 함수
    const fetchProductReports = async () => {
      try {
        const response = await axios.get(`${SURL}/admin/reports`);
        setReports(response.data); // 받아온 데이터로 상태 업데이트
      } catch (error) {
        console.error('상품 신고 목록을 가져오는 데 실패했습니다:', error);
      }
    };

    fetchProductReports();
  }, []);

  return (
    <Container>
      <TitleContainer>
        <Title>Product 신고 목록</Title>
        <VerticalBar />
        <PageTitle onClick={navigateToUserReport}>Review 신고 목록</PageTitle>
      </TitleContainer>

      {/* 제품 신고 목록 출력 */}
      <ProductList>
        {reports.map((report) => (
          <ProductItem
            key={report.productReportId}
            onClick={() =>
              navigateToProductDetail(report.userid, report.productId)
            }
          >
            <ProductName>{report.productId}</ProductName>
            <ProductDescription>
              {report.productReportContent}
            </ProductDescription>
          </ProductItem>
        ))}
      </ProductList>
    </Container>
  );
}

export default ProductReports;

const Container = styled.div`
  width: 1500px;
  padding: 20px 40px;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 27px;
  color: #333;
  margin-right: 20px;
`;

const VerticalBar = styled.div`
  width: 2px;
  height: 27px;
  background-color: #ccc;
  margin: 0 20px;
`;

const PageTitle = styled.h2`
  font-size: 22px;
  color: #777;
  cursor: pointer;
`;

const ProductList = styled.div`
  margin-top: 20px;
`;

const ProductItem = styled.div`
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #f4f4f4;
  }
`;

const ProductName = styled.h3`
  font-size: 18px;
  font-weight: bold;
`;

const ProductDescription = styled.p`
  font-size: 14px;
  color: #555;
`;
