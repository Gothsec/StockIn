import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <span className="text-9xl font-bold text-center text-blue-600">404</span>
      <span className="text-4xl font-bold text-center text-blue-600">
        Página no encontrada
      </span>
      <button
        onClick={() => navigate("/dashboard")}
        className="bg-blue-600 text-white rounded-lg px-4 py-2 mt-10 hover:bg-blue-700 transition-all duration-300 ease-in-out"
      >
        Volver al inicio
      </button>
    </div>
  );
}
