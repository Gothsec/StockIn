import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Signin from './pages/Signin';

export default function App() {
  return (
  <BrowserRouter>
      <Routes>
        <Route path='/' element={<Signin />} />
        <Route path='/sign-in' element={<Signin />} />
        <Route path='/home' element={<Home />} />
        <Route path='/about' element={<About />} />
      </Routes>

    </BrowserRouter>
  );
}
