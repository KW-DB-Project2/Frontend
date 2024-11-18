import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';

// Navbar 컴포넌트
import Navbar from './navbar/Navbar';

// adminpages
import ProductList from './adminpages/ProductList';
import ProductReports from './adminpages/ProductReports';
import ReviewList from './adminpages/ReviewList';
import SalesVolume from './adminpages/SalesVolume';
import UserList from './adminpages/UserList';
import UserProduct from './adminpages/UserProduct';
import UserReview from './adminpages/UserReview';
import UserRpt from './adminpages/UserRpt';

// userpages
import Add from './userpages/Add';
import Manage from './userpages/Manage';
import Mypage from './userpages/Mypage';
import Product from './userpages/Product';
import WriteQA from './userpages/WriteQA';
import WriteReview from './userpages/WriteReview';
import Home from './userpages/Home';
import Search from './userpages/Search';

// modal
import Login from './modal/Login';
import Signup from './modal/Signup';

//
import { AuthProvider } from './context/AuthContext';
import LoginHandler from './modal/LoginHandler';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Container>
          <Routes>
            {/* 루트 경로에 상품 리스트 추가 */}
            <Route path="/" element={<Home />} />{' '}
            {/* 상품 리스트를 루트 경로에 표시 */}
            {/* Admin Pages */}
            <Route path="/admin/product-list" element={<ProductList />} />
            <Route path="/admin/product-reports" element={<ProductReports />} />
            <Route path="/admin/review-list" element={<ReviewList />} />
            <Route path="/admin/sales-volume" element={<SalesVolume />} />
            <Route path="/admin/user-list" element={<UserList />} />
            <Route path="/admin/user-product" element={<UserProduct />} />
            <Route path="/admin/user-review" element={<UserReview />} />
            <Route path="/admin/user-rpt" element={<UserRpt />} />
            {/* User Pages */}
            <Route path="/add" element={<Add />} />
            <Route path="/manage" element={<Manage />} />
            <Route path="/mypage" element={<Mypage />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/write-qa" element={<WriteQA />} />
            <Route path="/write-review" element={<WriteReview />} />
            <Route path="/Search" element={<Search />} />
            {/* Modal Pages */}
            <Route path="/login" element={<Login />} />
            <Route
              path="/login/oauth2/code/kakao/"
              element={<LoginHandler />}
            />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;

const Container = styled.div`
  margin: 200px 150px 0px 150px;

  @media (max-width: 480px) {
    margin: 0px 50px; /* 작은 화면에서는 더 좁은 여백 */
  }
`;
