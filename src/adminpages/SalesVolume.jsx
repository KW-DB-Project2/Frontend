import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
// 컴포넌트 임포트
import { AuthContext } from '../context/AuthContext';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js';

// Chart.js 구성 요소 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend
);

function SalesVolume() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const SURL = import.meta.env.VITE_APP_URI;
  const { token } = useContext(AuthContext);
  useEffect(() => {
    // 실제 API 호출을 주석 처리하고, 더미 데이터로 대체
    const fetchMonthlyData = async () => {
      try {
        const response = await axios.get(`${SURL}/admin/transactions/monthly`, {
          headers: {
            Authorization: `Bearer ${token}`, // 인증 토큰
          },
        });
        setMonthlyData(response.data); // API에서 데이터를 가져와 상태에 저장
      } catch (error) {
        console.error('월별 데이터 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyData();
  }, []);

  if (loading) {
    return <p>로딩 중...</p>;
  }

  // 데이터 변환
  const months = monthlyData.map((data) => `${data.month}월`);
  const counts = monthlyData.map((data) => data.count);
  const totalAmounts = monthlyData.map((data) => data.totalAmount);

  // 월별 판매량 (카운트) 차트 데이터
  const countData = {
    labels: months,
    datasets: [
      {
        label: '월별 판매량 (건수)',
        data: counts,
        fill: false,
        borderColor: '#1ABC9C', // 심플한 민트
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#1ABC9C', // 심플한 민트
        pointBorderWidth: 2,
      },
    ],
  };

  // 월별 총판매량 (금액) 차트 데이터
  const totalAmountData = {
    labels: months,
    datasets: [
      {
        label: '월별 총판매량 (₩)',
        data: totalAmounts,
        fill: false,
        borderColor: '#2980B9', // 클래식한 블루
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#2980B9', // 클래식한 블루
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 10000, // Y축 간격 설정
        },
      },
    },
    plugins: {
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // 툴팁 배경 색상
        titleColor: '#fff', // 툴팁 제목 색상
        bodyColor: '#fff', // 툴팁 본문 색상
        callbacks: {
          label: (tooltipItem) => `값: ${tooltipItem.raw.toLocaleString()}`,
        },
      },
    },
    animation: {
      duration: 1500, // 애니메이션 지속 시간
      easing: 'easeOutQuart', // 애니메이션의 easing 함수
    },
  };

  return (
    <Container>
      <PageTitle>월별 판매량</PageTitle>
      <ChartsWrapper>
        <ChartWrapper>
          <Line data={countData} options={options} />
        </ChartWrapper>
        <ChartWrapper>
          <Line data={totalAmountData} options={options} />
        </ChartWrapper>
      </ChartsWrapper>
    </Container>
  );
}

const Container = styled.div`
  width: 1500px;
  padding: 20px 40px;
`;

const PageTitle = styled.div`
  margin-bottom: 50px;
  width: 300px;
  margin-top: 10px;
  font-size: 20px;
  font-weight: 600;
  color: #333;
  border: 2px solid #f0f0f0;
  padding: 5px 20px;
  border-radius: 5px;
  text-align: center;
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.1);
`;

const ChartsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 30px;
`;

const ChartWrapper = styled.div`
  width: 48%; // 차트 크기 조정
  height: 400px; // 차트 높이 조정
`;

export default SalesVolume;
