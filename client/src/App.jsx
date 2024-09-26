import React, { useState } from 'react';
import Home from './pages/Home';
import Signin from './pages/Signin';

// Hola

function parseJwt(token) {
  if (!token) {
    return null;
  }

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
}

const token = localStorage.getItem('token');
const parsedToken = token ? parseJwt(token) : null;
const tokenExistAndStillValid = parsedToken && parsedToken.exp * 1000 > Date.now();

export default function App() {
  const [currentPage, setCurrentPage] = useState('products'); // Inicializa con la página deseada

  if (!tokenExistAndStillValid) {
    return <Signin />;
  }

  // Pasamos la función para navegar y el estado actual a Home
  return (
    <Home currentPage={currentPage} setCurrentPage={setCurrentPage} />
  );
}
