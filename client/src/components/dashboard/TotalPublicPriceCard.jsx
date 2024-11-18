export default function TotalPublicPriceCard({ totalPublicPrice, formatCurrency }) {
  const isLoading = totalPublicPrice === null;

  return (
    <div className="flex flex-col w-1/4 gap-2 p-4 bg-white border-2 border-slate-200 rounded-lg">
      <h3 className="text-lg sm:text-xl font-medium text-gray-600">
        Total Precio Público
      </h3>

      {isLoading ? (
        <div className="flex justify-center items-center h-12">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-500"></div>
        </div>
      ) : (
        <p className="text-2xl sm:text-3xl font-bold text-blue-500">
          {formatCurrency(totalPublicPrice)}
        </p>
      )}

      <span className="text-xs text-gray-500">Valor total de venta</span>
    </div>
  );
}
