import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import styled from 'styled-components';

// Navbar 컴포넌트
import Navbar from './navbar/Navbar';
import AdminNavbar from './navbar/AdminNavbar';

// adminpages
import ProductList from './adminpages/ProductList';
import ProductReports from './adminpages/ProductReports';
import ReviewList from './adminpages/ReviewList';
import SalesVolume from './adminpages/SalesVolume';
import UserList from './adminpages/UserList';
import UserProduct from './adminpages/UserProduct';
import UserReview from './adminpages/UserReview';
import ReviewReports from './adminpages/ReviewReports';

// userpages
import Add from './userpages/Add';
import Manage from './userpages/Manage';
import Mypage from './userpages/Mypage';
import Product from './userpages/Product';
import WriteQA from './userpages/WriteQA';
import WriteReview from './userpages/WriteReview';
import Home from './userpages/Home';
import Search from './userpages/Search';
import QnA from './userpages/QnA';
import WriteComment from './userpages/WriteComment';

// modal
import Login from './modal/Login';
import Signup from './modal/Signup';

//
import { AuthProvider } from './context/AuthContext';
import LoginHandler from './modal/LoginHandler';

// font
import GlobalStyle from './fontStyle/GlobalStyle';

function App() {
  return (
    <AuthProvider>
      <Router>
        <GlobalStyle />
        <NavbarWrapper />
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
            <Route
              path="/admin/user-product/:userid/:productid"
              element={<UserProduct />}
            />
            <Route
              path="/admin/user-review/:reviewid"
              element={<UserReview />}
            />
            <Route path="/admin/review-reports" element={<ReviewReports />} />
            {/* User Pages */}
            <Route path="/add" element={<Add />} />
            <Route path="/add/:productId" element={<Add />} />
            <Route path="/manage" element={<Manage />} />
            <Route path="/mypage" element={<Mypage />} />
            <Route path="/product/:productid" element={<Product />} />
            <Route path="/write-review/:productid" element={<WriteReview />} />
            <Route
              path="/write-review/:productid/:reviewid"
              element={<WriteReview />}
            />
            <Route
              path="/write-comment/:productid/:reviewid"
              element={<WriteComment />}
            />
            <Route
              path="/write-comment/:productid/:reviewid/:commentid"
              element={<WriteComment />}
            />
            <Route path="/qna/:productid" element={<QnA />} />
            <Route path="/write-qa/:productid" element={<WriteQA />} />
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

// Navbar와 AdminNavbar를 경로에 따라 조건부로 렌더링
const NavbarWrapper = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return isAdminPage ? <AdminNavbar /> : <Navbar />;
};

const Container = styled.div`
  margin: 160px 150px 0px 150px;
`;
