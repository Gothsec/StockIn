
export default function ReportMoveRow({ 
    name,
    quantity,
    date,
    type,
    warehouse,
    user,
    className,}) {
  return (
    <>
      <tr className={`${className} text-left border-b`}>
        <td className="p-3">{name}</td>
        <td className="p-3 text-center">{quantity}</td>
        <td className="p-3 text-center">{date}</td>
        <td className="p-3 text-center">{type}</td>
        <td className="p-3 text-center">{warehouse?.name || "Sin bodega"}</td>
        <td className="p-3 text-center">{user?.name || "Sin responsable"}</td>
      </tr>
    </>
  );
}
