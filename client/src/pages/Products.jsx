import { ProductFile } from "../components/Product-file"

const product = ["Gel rolda", "Minoxidil 5%", "Agiba n. 8", "Cera premium", "Trimmer", "Aceite Walh"]

export function ProductsPage() {
  return (
    <div className="p-10 w-full">
      <h1 className="font-bold text-4xl">Productos</h1>
      <input className="border border-black" type="search" name="" id="" />
      <button className="bg-slate-400 p-2">Buscar</button>
      <button className="bg-slate-400 p-2">Nuevo</button>

      <table className="w-full">
        <thead>
          <tr>
            <td>Nombre</td>
            <td>Accion</td>
          </tr>
        </thead>
        <tbody>
          {product.map((name, index) => (
            <ProductFile id={index} name={name}/>
          ))}
        </tbody>
      </table>

    </div>
  )
}