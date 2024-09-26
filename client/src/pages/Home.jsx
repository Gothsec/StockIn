import ProductsPage from '../pages/Products';
import Nav from "../components/Nav";

export default function Home() {
  return (
    <div className='flex h-screen'>
      <Nav /> 
      <div className="flex-grow">
        <ProductsPage />
      </div>
    </div>
  );
}
