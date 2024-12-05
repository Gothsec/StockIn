export default function ReportProductsRow({
  name,
  quantity,
  costPrice,
  publicPrice,
  gain,
  generado,
  flujo,
  rentabilidad,
  className,
}) {
  return (
    <>
      <tr className={`${className} text-left border-b`}>
        <td className="p-3">{name}</td>
        <td className="p-3 text-center">{quantity}</td>
        <td className="p-3 text-center">{costPrice}</td>
        <td className="p-3 text-center">{publicPrice}</td>
        <td className="p-3 text-center">{gain} $</td>
        <td className="p-3 text-center">{generado} $</td>
        <td className="p-3 text-center">{rentabilidad} %</td>
        <td className="p-3 text-center">{flujo}</td>
      </tr>
    </>
  );
}
