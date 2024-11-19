import TotalUnitsCard from "../components/dashboard/TotalUnitsCard";
import FinancialOverviewGroup from "../components/dashboard/FinancialOverviewGroup";

export default function Dashboard() {

  return (
    <div className="flex max-h-screen overflow-hidden">
      <div className="py-6 px-10 w-full flex flex-col">
        <div className="flex justify-between items-center pb-8">
          <h1 className="font-bold text-4xl">Vista general</h1>
        </div>
        <div className="flex gap-3">
          <TotalUnitsCard />
          <FinancialOverviewGroup />
        </div>
      </div>
    </div>
  );
}