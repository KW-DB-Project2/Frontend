import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProductReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true); // 로딩 상태
  const navigate = useNavigate();
  const SURL = import.meta.env.VITE_APP_URI;
  // Review 신고 목록으로 이동
  const navigateToUserReport = () => {
    navigate('/admin/review-reports');
  };

  useEffect(() => {
    // 제품 신고 목록을 API에서 가져오는 함수
    const fetchProductReports = async () => {
      try {
        const response = await axios.get(`${SURL}/admin/reports`); // URL 수정
        // API 호출이 성공하면 데이터를 설정
        const productReports = response.data
          .flat() // 중첩 배열을 1차원으로 펼침
          .filter((report) => report.productReportId); // productReportId가 있는 항목만 필터링
        setReports(productReports); // 필터링된 데이터로 상태 업데이트
      } catch (error) {
        console.error('상품 신고 목록을 가져오는 데 실패했습니다:', error);
      } finally {
        setLoading(false); // 로딩 완료 처리
      }
    };

    fetchProductReports();
  }, []); // 빈 배열로 한 번만 호출되도록 설정

  const navigateToProductDetail = (userid, productid) => {
    navigate(`/admin/user-product/${userid}/${productid}`);
  };

  return (
    <Container>
      <Header>
        <Title>📋 Product 신고 목록</Title>
        <PageTitle onClick={navigateToUserReport}>Review 신고 목록</PageTitle>
      </Header>

      {/* 로딩 상태 확인 */}
      {loading ? (
        <LoadingMessage>상품 신고 목록을 불러오는 중...</LoadingMessage>
      ) : (
        <ProductList>
          {reports.length > 0 ? (
            reports.map((report) => (
              <ProductCard
                key={report.productReportId}
                onClick={() =>
                  navigateToProductDetail(
                    report.reportedUserId,
                    report.productId
                  )
                }
              >
                <ProductName>📦 Product ID: {report.productId}</ProductName>
                <ProductDescription>
                  {report.productReportContent}
                </ProductDescription>
              </ProductCard>
            ))
          ) : (
            <EmptyMessage>상품 신고가 없습니다.</EmptyMessage>
          )}
        </ProductList>
      )}
    </Container>
  );
}

export default ProductReports;

const Container = styled.div`
  width: 1500px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;

  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
  padding-right: 10px;
`;

const PageTitle = styled.h2`
  border-left: 2px solid #ccc;
  padding-left: 10px;
  font-size: 22px;
  color: #777;
  cursor: pointer;
  &:hover {
    color: #555;
  }
`;

const ProductList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(1500px, 1fr));
  gap: 20px;
`;

const ProductCard = styled.div`
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #f1f1f1;
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
  }
`;

const ProductName = styled.p`
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
`;

const ProductDescription = styled.p`
  font-size: 14px;
  color: #555;
  margin: 0;
`;

const EmptyMessage = styled.div`
  text-align: center;
  font-size: 16px;
  color: #999;
  margin-top: 20px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 18px;
  color: #007bff;
  margin-top: 40px;
`;
