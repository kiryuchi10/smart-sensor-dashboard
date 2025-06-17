export default function TemperatureBar({ min, max, temps }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-sm">Temp Range: {min}°C - {max}°C</div>
      <div className="flex gap-2 mt-1">
        {temps.map((t, i) => (
          <div key={i} className={`text-sm p-1 ${t > 27 ? 'bg-red-500' : 'bg-blue-400'}`}>
            {t.toFixed(1)}°C
          </div>
        ))}
      </div>
    </div>
  );
}
