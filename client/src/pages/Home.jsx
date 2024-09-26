import React from 'react';
import ProductsPage from '../pages/Products';
import OrdersPage from '../pages/Orders';
import Nav from "../components/Nav";

export default function Home({ currentPage, setCurrentPage }) {
  const renderPage = () => {
    switch (currentPage) {
      case 'products':
        return <ProductsPage />;
      case 'pedidos':
        return <OrdersPage />;
      default:
        return <div><h1>Página en desarrollo</h1></div>;
    }
  };

  return (
    <div className='flex h-screen'>
      <Nav onNavigate={setCurrentPage} />
      <div className="flex-grow">
        {renderPage()}
      </div>
    </div>
  );
}
