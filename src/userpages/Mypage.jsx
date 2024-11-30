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
        backgroundColor: 'rgba(54, 162, 235, 0.8)', // 청록색으로 수정
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        hoverBackgroundColor: 'rgba(54, 162, 235, 1)',
      },
    ],
  };

  const totalAmountChartData = {
    labels,
    datasets: [
      {
        label: '월별 판매 금액 (₩)',
        data: totalAmountData,
        fill: true,
        borderColor: '#FF6384', // 밝은 분홍색으로 수정
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.3,
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
        <Bar data={countChartData} options={options} />
        <Line data={totalAmountChartData} options={options} />
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
  justify-content: space-between;
  gap: 40px;
  width: 100%;
  margin-top: 30px;
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
  width: 100%;
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
    background-color: #ccc;
  }
`;

const AccountSection = styled.div`
  flex: 2;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const InfoTitle = styled.h3`
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const Label = styled.label`
  font-size: 16px;
  flex: 1;
`;

const Value = styled.div`
  font-size: 16px;
  flex: 2;
`;

const Input = styled.input`
  font-size: 16px;
  flex: 2;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ddd;
`;

const EditButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const Bottombar = styled.div`
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  text-align: center;
  color: white;
  font-size: 16px;
`;

const FooterLabel = styled.h3`
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin: 20px 0;
`;
