import React from 'react';
import styled from 'styled-components';
import { Line, Radar } from 'react-chartjs-2'; // Radar 차트 추가
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale, // Radar 차트를 위한 구성 요소
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
  RadialLinearScale, // Radar 구성 요소 등록
  ChartTitle,
  Tooltip,
  Legend
);

function SalesVolume() {
  // 첫 번째 그래프: 월별 거래량
  const volumeData = {
    labels: ['2024.09', '2024.10', '2024.11', '2024.12', '2025.01', '2025.02'],
    datasets: [
      {
        label: '월별 거래량',
        data: [12000, 15000, 20000, 18000, 22000, 17000],
        fill: false,
        borderColor: '#FFA500',
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 7,
        pointBackgroundColor: '#FFA500',
        pointBorderWidth: 2,
      },
    ],
  };

  // 두 번째 그래프: 레이더 차트 데이터
  const radarData = {
    labels: ['2024.09', '2024.10', '2024.11', '2024.12', '2025.01', '2025.02'],
    datasets: [
      {
        label: '거래량 분포',
        data: [12000, 15000, 20000, 18000, 22000, 17000],
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // 반투명한 채우기 색상
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 5000,
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
      <PageTitle>월별 거래량</PageTitle>
      <ChartWrapper>
        <Line data={volumeData} options={options} />
      </ChartWrapper>
      <PageTitle>거래량 분포</PageTitle>
      <ChartWrapper>
        <Radar data={radarData} />
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
