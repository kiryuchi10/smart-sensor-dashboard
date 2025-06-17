export default function BatteryModule({ module }) {
  return (
    <div className="p-4 bg-slate-800 rounded text-white w-full">
      <div className="text-xl font-bold">{module.name}</div>
      <div className="grid grid-cols-3 mt-2 gap-2">
        <div>Voltage: {module.voltage}V</div>
        <div>SoC: {module.soc}%</div>
        <div>Temp: {module.temp}°C</div>
      </div>
      <div className="text-sm mt-1">Imbalance: {module.imbalance}%</div>
    </div>
  );
}
