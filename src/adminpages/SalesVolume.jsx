import React from 'react';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';
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
  // 더미 데이터 (월별 거래량)
  const data = {
    labels: ['2024.09', '2024.10', '2024.11', '2024.12', '2025.01', '2025.02'], // 월별 라벨
    datasets: [
      {
        label: '월별 거래량',
        data: [12000, 15000, 20000, 18000, 22000, 17000], // 더미 거래량 데이터
        fill: false, // 그래프 영역 채우지 않음
        borderColor: '#FFA500', // 주황색 선
        tension: 0.4, // 선의 부드러움 정도
        borderWidth: 3, // 선 굵기
        pointRadius: 7, // 점 크기
        pointBackgroundColor: '#FFA500', // 점 색깔
        pointBorderWidth: 2, // 점 테두리 굵기
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true, // Y축 0부터 시작하도록 설정
        reverse: false, // Y축을 반대로 설정 (아래에서 위로 차오르도록)
        ticks: {
          stepSize: 5000, // Y축 눈금 간격
        },
        position: 'left',
      },
      x: {
        ticks: {
          maxRotation: 0, // X축 라벨 회전 제거
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `값: ${tooltipItem.raw.toLocaleString()}`, // 툴팁 값 형식화
        },
      },
    },
  };

  return (
    <Container>
      <PageTitle>월별 거래량</PageTitle>
      <ChartWrapper>
        <Line data={data} options={options} />
      </ChartWrapper>
    </Container>
  );
}

const Container = styled.div`
  width: 1500px; /* 더 넓게 */
  margin: 0 250px;
  padding: 30px;
`;

const PageTitle = styled.p`
  width: 300px; /* 더 넓게 */
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

const ChartWrapper = styled.div`
  width: 100%;
  height: 500px; /* 그래프 영역 높이 크게 */
  margin-top: 30px;
`;

export default SalesVolume;
