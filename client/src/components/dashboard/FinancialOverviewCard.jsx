import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import TotalCostCard from "./TotalCostCard";
import TotalPublicPriceCard from "./TotalPublicPriceCard";
import TotalGainCard from "./TotalGainCard";

export default function FinancialOverviewCard() {
  const [totalCostPrice, setTotalCostPrice] = useState(null);
  const [totalPublicPrice, setTotalPublicPrice] = useState(null);
  const [totalGain, setTotalGain] = useState(null);

  useEffect(() => {
    const fetchFinancialData = async () => {
      const { data, error } = await supabase
        .from("product")
        .select("cost_price, public_price, gain, quantity");

      if (error) {
        console.error("Error fetching financial data:", error);
        return;
      }

      const costPriceTotal =
        data?.reduce(
          (acc, product) => acc + product.cost_price * product.quantity,
          0
        ) ?? 0;
      const publicPriceTotal =
        data?.reduce(
          (acc, product) => acc + product.public_price * product.quantity,
          0
        ) ?? 0;
      const gainTotal =
        data?.reduce((acc, product) => acc + product.gain * product.quantity, 0) ?? 0;

      setTotalCostPrice(costPriceTotal);
      setTotalPublicPrice(publicPriceTotal);
      setTotalGain(gainTotal);
    };

    fetchFinancialData();
  }, []);

  const formatCurrency = (amount) => {
    return (
      amount?.toLocaleString("es-ES", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }) ?? "..."
    );
  };

  return (
    <>
      <TotalCostCard totalCostPrice={totalCostPrice} formatCurrency={formatCurrency} />
      <TotalPublicPriceCard totalPublicPrice={totalPublicPrice} formatCurrency={formatCurrency} />
      <TotalGainCard totalGain={totalGain} formatCurrency={formatCurrency} />
    </>
  );
}
