import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import supabase from "../../utils/supabase";
import { format, parseISO, startOfWeek, endOfWeek, isToday } from "date-fns";
import { es } from "date-fns/locale";

export default function MovesBarChart() {
  const [chartData, setChartData] = useState([]);
  const [groupByPeriod, setGroupByPeriod] = useState("day");
  const [loading, setLoading] = useState(true);

  const fetchMovesData = async () => {
    const { data, error } = await supabase
      .from("move")
      .select("quantity, date, type, state");

    if (error) {
      console.error("Error fetching moves data:", error);
      return [];
    }

    return data;
  };

  const processMovesData = (data) => {
    const filteredData = data.filter((item) => item.state);

    const formatDate = (dateString) => {
      const currentDate = parseISO(dateString);

      if (isToday(currentDate)) {
        return "Hoy";
      }

      if (groupByPeriod === "week") {
        const start = startOfWeek(currentDate, { weekStartsOn: 1 });
        const end = endOfWeek(currentDate, { weekStartsOn: 1 });

        return `${format(start, "d MMM", { locale: es })} - ${format(
          end,
          "d MMM yyyy",
          { locale: es }
        )}`;
      }

      if (groupByPeriod === "month") {
        return format(currentDate, "MMMM yyyy", { locale: es });
      }

      return format(currentDate, "d MMM yyyy", { locale: es });
    };

    const grouped = filteredData.reduce((acc, item) => {
      const period = formatDate(item.date);
      if (!acc[period]) {
        acc[period] = {
          entradas: 0,
          salidas: 0,
          period,
          total: 0,
          fecha: parseISO(item.date),
        };
      }
      if (item.type === "Entrada") {
        acc[period].entradas += item.quantity;
        acc[period].total += item.quantity;
      }
      if (item.type === "Salida") {
        acc[period].salidas += item.quantity;
        acc[period].total -= item.quantity;
      }
      return acc;
    }, {});

    return Object.values(grouped).sort((a, b) => a.fecha - b.fecha);
  };

  const loadData = async () => {
    setLoading(true);
    const data = await fetchMovesData();
    const processedData = processMovesData(data);
    setChartData(processedData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [groupByPeriod]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-600 mb-2">{label}</p>
          <p className="text-blue-600">
            Entradas: {payload[0].value.toLocaleString()}
          </p>
          <p className="text-red-400">
            Salidas: {payload[1].value.toLocaleString()}
          </p>
          <p className="text-gray-600 mt-2 font-medium">
            Balance: {(payload[0].value - payload[1].value).toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 mt-6">
      <div className="flex justify-between items-center pb-4">
        <h3 className="text-2xl font-semibold mb-4 text-slate-600">
          Movimientos
        </h3>
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded transition-colors ${
              groupByPeriod === "day"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setGroupByPeriod("day")}
          >
            Día
          </button>
          <button
            className={`px-4 py-2 rounded transition-colors ${
              groupByPeriod === "week"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setGroupByPeriod("week")}
          >
            Semana
          </button>
          <button
            className={`px-4 py-2 rounded transition-colors ${
              groupByPeriod === "month"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setGroupByPeriod("month")}
          >
            Mes
          </button>
        </div>
      </div>

      {loading ? (
                <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-sm">

                <div className="relative h-64">
                  <div className="absolute left-0 top-0 h-full w-12 flex flex-col justify-between">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="h-3 w-8 bg-gray-200 rounded animate-pulse"
                      />
                    ))}
                  </div>
      
                  <div className="ml-12 h-full flex items-end justify-around gap-4">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="w-full flex flex-col items-center gap-2"
                      >
                        <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
      ) : (
        <div style={{ width: "100%", height: 460 }}>
          <ResponsiveContainer>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="period"
                angle={-45}
                textAnchor="end"
                height={70}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis tickFormatter={(value) => value.toLocaleString()} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="entradas"
                fill="#3B82F6"
                name="Entradas"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="salidas"
                fill="#ff6b6b"
                name="Salidas"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
