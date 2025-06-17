import { useEffect, useState } from "react";
import CellGrid from "./CellGrid";
import BatteryModule from "./BatteryModule";
import AlarmStatus from "./AlarmStatus";
import TempChart from "./TempChart";
import TimestampBar from "./TimestampBar";

export default function Dashboard() {
  const [cells, setCells] = useState([
    { id: "E1", soc: 66.7, voltage: 3.90 },
    { id: "E2", soc: 67.9, voltage: 3.91 },
    { id: "E3", soc: 69.0, voltage: 3.92 },
    { id: "E4", soc: 70.0, voltage: 3.90 },
    { id: "E5", soc: 79.8, voltage: 3.99 }
  ]);
  const [temps, setTemps] = useState([27.8, 26.6, 25.9, 18.5]);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCells(prev =>
        prev.map(c => ({
          ...c,
          soc: Math.min(100, Math.max(20, c.soc + (Math.random() * 2 - 1)))
        }))
      );
      setTemps(prev => [
        ...prev.slice(1),
        Math.random() * (35 - 20) + 20
      ]);
      setLastUpdate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 text-white bg-[#0a0f2c] min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Battery Management Dashboard</h1>
      <BatteryModule module={{ name: "M1 MOD_1", voltage: 47, soc: 66.7, temp: 25, imbalance: 13.1 }} />
      <div className="grid grid-cols-2 gap-8 my-4">
        <div>
          <h2 className="font-semibold mb-2">State of Charge per Cell</h2>
          <CellGrid cells={cells} />
        </div>
        <div>
          <h2 className="font-semibold mb-2">Temperature Timeline</h2>
          <TempChart temps={temps} />
        </div>
      </div>
      <AlarmStatus status="Fault" />
      <TimestampBar time={lastUpdate} />
    </div>
  );
}
