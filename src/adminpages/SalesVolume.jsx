import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
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

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const response = await axios.get(`${SURL}/admin/transactions/monthly`);
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
        label: '월별 판매량 (카운트)',
        data: counts,
        fill: false,
        borderColor: '#4CAF50',
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 5,
        pointBackgroundColor: '#4CAF50',
        pointBorderWidth: 2,
      },
    ],
  };

  // 월별 총판매량 (금액) 차트 데이터
  const totalAmountData = {
    labels: months,
    datasets: [
      {
        label: '월별 총판매량 (금액)',
        data: totalAmounts,
        fill: false,
        borderColor: '#FFA500',
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 5,
        pointBackgroundColor: '#FFA500',
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
        callbacks: {
          label: (tooltipItem) => `값: ${tooltipItem.raw.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <Container>
      <PageTitle>월별 판매량 (카운트)</PageTitle>
      <ChartWrapper>
        <Line data={countData} options={options} />
      </ChartWrapper>
      <PageTitle>월별 총판매량 (금액)</PageTitle>
      <ChartWrapper>
        <Line data={totalAmountData} options={options} />
      </ChartWrapper>
    </Container>
  );
}

const Container = styled.div`
  width: 1500px;
  margin: 0 auto;
  padding: 30px;
`;

const PageTitle = styled.p`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 20px 0;
  text-align: center;
`;

const ChartWrapper = styled.div`
  width: 100%;
  height: 500px;
`;

export default SalesVolume;
