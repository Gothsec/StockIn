import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

export default function App() {
  return (
  <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-in' element={<Home />} />
        <Route path='/about' element={<Home />} />
        <Route path='/' element={<Home />} />
      </Routes>

    </BrowserRouter>
  );
}
