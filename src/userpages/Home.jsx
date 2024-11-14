import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = () => {
      const dummyProducts = [
        {
          id: 1,
          name: '상품 1',
          price: '10,000원',
          imageUrl: 'https://via.placeholder.com/150?text=상품1',
        },
        {
          id: 2,
          name: '상품 2',
          price: '20,000원',
          imageUrl: 'https://via.placeholder.com/150?text=상품2',
        },
        {
          id: 3,
          name: '상품 3',
          price: '30,000원',
          imageUrl: 'https://via.placeholder.com/150?text=상품3',
        },
        {
          id: 4,
          name: '상품 4',
          price: '40,000원',
          imageUrl: 'https://via.placeholder.com/150?text=상품4',
        },
        {
          id: 5,
          name: '상품 5',
          price: '50,000원',
          imageUrl: 'https://via.placeholder.com/150?text=상품5',
        },
        {
          id: 6,
          name: '상품 6',
          price: '60,000원',
          imageUrl: 'https://via.placeholder.com/150?text=상품6',
        },
        {
          id: 7,
          name: '상품 7',
          price: '70,000원',
          imageUrl: 'https://via.placeholder.com/150?text=상품7',
        },
        {
          id: 8,
          name: '상품 8',
          price: '80,000원',
          imageUrl: 'https://via.placeholder.com/150?text=상품8',
        },
        {
          id: 9,
          name: '상품 9',
          price: '90,000원',
          imageUrl: 'https://via.placeholder.com/150?text=상품9',
        },
        {
          id: 10,
          name: '상품 10',
          price: '100,000원',
          imageUrl: 'https://via.placeholder.com/150?text=상품10',
        },
        {
          id: 11,
          name: '상품 11',
          price: '110,000원',
          imageUrl: 'https://via.placeholder.com/150?text=상품11',
        },
        {
          id: 12,
          name: '상품 12',
          price: '120,000원',
          imageUrl: 'https://via.placeholder.com/150?text=상품12',
        },
        {
          id: 13,
          name: '상품 13',
          price: '130,000원',
          imageUrl: 'https://via.placeholder.com/150?text=상품13',
        },
        {
          id: 14,
          name: '상품 14',
          price: '140,000원',
          imageUrl: 'https://via.placeholder.com/150?text=상품14',
        },
      ];
      setProducts(dummyProducts);
    };

    fetchProducts();
  }, []);

  return (
    <Container>
      <Title>상품 리스트</Title>
      <ProductList>
        {products.map((product) => (
          <ProductCard key={product.id}>
            <ProductImage src={product.imageUrl} alt={product.name} />
            <ProductInfo>
              <h3>{product.name}</h3>
              <p>{product.price}</p>
            </ProductInfo>
          </ProductCard>
        ))}
      </ProductList>
    </Container>
  );
}

const Container = styled.div`
  padding: 20px;
  margin-top: 0;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
`;

const ProductList = styled.div`
  display: grid;
  gap: 10px;
  margin-top: 20px;
  grid-template-columns: repeat(5, 1fr);
`;

const ProductCard = styled.div`
  width: 300px;
  border: 1px solid #ccc;
  text-align: center;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const ProductImage = styled.img`
  width: 100%;
  height: auto;
`;

const ProductInfo = styled.div`
  margin-top: 10px;
`;

export default Home;
