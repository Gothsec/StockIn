import { ProductFile } from "../components/Product-file";
import Nav from "../components/Nav";

const product = [
  "Gel rolda",
  "Minoxidil 5%",
  "Agiba n. 8",
  "Cera premium",
  "Trimmer",
  "Aceite Walh",
];

export function ProductsPage() {
  return (
    <div className="flex">
      <Nav />
      <div className="p-10 w-full">
        <header className="flex mb-5 justify-between items-baseline border-b border-black pb-8">
          <h1 className="font-bold text-4xl">Productos</h1>
          <div className="flex gap-4">
            <input
              className="border border-black w-96 pl-2"
              type="search"
              placeholder="Buscar producto"
              name=""
              id=""
            />
            <button className="bg-slate-400 py-1 px-2 rounded-sm">Buscar</button>
          </div>
          <button className="bg-slate-400 py-1 px-2 rounded-sm">Nuevo</button>
        </header>

        <table className="w-full">
          <thead>
            <tr>
              <th className="py-2 text-left">Nombre</th>
              <th className="py-2 text-left">Accion</th>
            </tr>
          </thead>
          <tbody className="w-full">
            {product.map((name, index) => (
              <ProductFile key={index} id={index} name={name} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
