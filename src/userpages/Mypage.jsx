import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js';
import { AuthContext } from '../context/AuthContext';

// Chart.js 구성 요소 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend
);

function Mypage() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const SURL = import.meta.env.VITE_APP_URI;
  const [transactionData, setTransactionData] = useState([]);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phoneNumber: '',
  });
  const [isEditing, setIsEditing] = useState({
    name: false,
    email: false,
    phoneNumber: false,
  });

  const labels = transactionData.map((item) => `2024.${item.month}`);
  const countData = transactionData.map((item) => item.count);
  const totalAmountData = transactionData.map((item) => item.totalAmount);

  const countChartData = {
    labels,
    datasets: [
      {
        label: '월별 판매량 (건수)',
        data: countData,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const totalAmountChartData = {
    labels,
    datasets: [
      {
        label: '월별 판매 금액 (₩)',
        data: totalAmountData,
        fill: false,
        borderColor: '#FFA500',
        backgroundColor: 'rgba(255, 165, 0, 0.2)',
        tension: 0.4,
        borderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `₩${tooltipItem.raw.toLocaleString()}`,
        },
      },
    },
  };

  useEffect(() => {
    // 사용자별 월별 transaction 데이터 가져오기
    const fetchTransactionData = async () => {
      try {
        const response = await axios.get(
          `${SURL}/transactions/monthly/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTransactionData(response.data);
      } catch (error) {
        console.error('트랜잭션 데이터를 가져오는 중 오류 발생:', error);
        alert('트랜잭션 데이터를 불러오지 못했습니다.');
      }
    };

    fetchTransactionData();
  }, [token]);

  useEffect(() => {
    // 사용자 정보 가져오기
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`${SURL}/mypage`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('응답 데이터:', response.data); // 응답 데이터 확인

        // 응답 데이터에서 필요한 필드 추출
        const { name, email, phoneNumber } = response.data;
        setUserInfo({
          name: name,
          email: email,
          phoneNumber: phoneNumber,
        });
      } catch (error) {
        console.error('사용자 정보를 가져오는 중 오류 발생:', error);
        alert('사용자 정보를 불러오지 못했습니다. 다시 시도해주세요.');
      }
    };

    fetchUserInfo();
  }, [token]);

  const handleManageClick = () => {
    navigate('/manage');
  };

  const toggleEdit = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e, field) => {
    setUserInfo((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async (field) => {
    const data = {};
    if (field === 'name') {
      data.name = userInfo.name;
    } else if (field === 'email') {
      data.email = userInfo.email;
    } else if (field === 'phoneNumber') {
      data.phoneNumber = userInfo.phoneNumber;
    }

    try {
      const response = await axios.put(`${SURL}/edit/${field}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.message); // 성공 메시지 표시
      toggleEdit(field); // 수정 모드 종료
    } catch (error) {
      console.error('수정 중 오류 발생:', error);
      alert('수정에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <Container>
      <ContentWrapper>
        <ProfileCard>
          <ProfileImage>
            <Icon>🏠</Icon>
          </ProfileImage>
          <StoreName>{userInfo.name}</StoreName>
          <ManageButton onClick={handleManageClick}>내 상점 관리</ManageButton>
        </ProfileCard>
        <AccountSection>
          <InfoTitle>개인정보</InfoTitle>
          {['name', 'email', 'phoneNumber'].map((field) => (
            <EditableRow
              key={field}
              label={
                field === 'name'
                  ? '상점명'
                  : field === 'email'
                  ? '이메일'
                  : field === 'phoneNumber'
                  ? '전화번호'
                  : ''
              }
              value={userInfo[field]}
              isEditing={isEditing[field]}
              onEditClick={() => toggleEdit(field)}
              onChange={(e) => handleChange(e, field)}
              onSave={() => handleSave(field)}
            />
          ))}
        </AccountSection>
      </ContentWrapper>
      <Bottombar />
      <FooterLabel>판매 수익 조회</FooterLabel>
      <ChartSection>
        <BarChartWrapper>
          <Bar data={countChartData} options={options} />
        </BarChartWrapper>
        <LineChartWrapper>
          <Line data={totalAmountChartData} options={options} />
        </LineChartWrapper>
      </ChartSection>
    </Container>
  );
}

function EditableRow({
  label,
  value,
  isEditing,
  onEditClick,
  onChange,
  onSave,
}) {
  return (
    <Row>
      <Label>{label}</Label>
      {isEditing ? (
        <Input type="text" value={value} onChange={onChange} />
      ) : (
        <Value>{value}</Value>
      )}
      <EditButton onClick={isEditing ? onSave : onEditClick}>
        {isEditing ? '저장' : '수정'}
      </EditButton>
    </Row>
  );
}

export default Mypage;

const ChartSection = styled.div`
  display: flex;
  flex-direction: row; /* 가로로 나열 */
  gap: 30px;
  width: 100%;
  margin-top: 20px;
`;

const BarChartWrapper = styled.div`
  flex: 1;
  max-width: 50%; /* 각 그래프의 최대 너비를 50%로 설정 */
  height: 400px; /* 고정 높이 */
`;

const LineChartWrapper = styled.div`
  flex: 1;
  max-width: 50%;
  height: 400px; /* 고정 높이 */
`;

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 30px;
  width: 1500px; /* 더 넓게 */
`;

const ProfileCard = styled.div`
  flex: 1;
  background-color: #f7f7f7;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 50px 20px;
  text-align: center;
`;

const ProfileImage = styled.div`
  width: 100px;
  height: 100px;
  background-color: #ddd;
  border-radius: 50%;
  margin: 0 auto 20px auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Icon = styled.span`
  font-size: 40px;
`;

const StoreName = styled.h2`
  font-size: 18px;
  color: #333;
  margin: 10px 0;
`;

const ManageButton = styled.button`
  background-color: #ddd;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  font-size: 14px;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #ddd;
  }
`;

const AccountSection = styled.div`
  flex: 2;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const InfoTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #444;
  margin: 20px 0px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
`;

const Label = styled.span`
  font-size: 17px;
  font-weight: 500;
  color: #555;
  width: 80px;
`;

const Value = styled.span`
  font-size: 17px;
  color: #333;
  flex: 1;
`;

const Input = styled.input`
  flex: 1;
  padding: 5px;
  font-size: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 5px;
  margin-right: 50px;
  transition: width 0.3s ease;
  color: #333;
`;

const EditButton = styled.div`
  padding: 5px 10px;
  font-size: 14px;
  color: white;
  background-color: #ccc;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #ccc;
  }
`;

const Bottombar = styled.div`
  width: 1500px;
  height: 2px;
  background-color: #f0f0f0;
  margin-top: 20px;
`;

const FooterLabel = styled.div`
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
