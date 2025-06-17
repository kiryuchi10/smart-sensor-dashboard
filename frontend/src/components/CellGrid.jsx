export default function CellGrid({ cells }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {cells.map((cell, i) => (
        <div key={i} className="p-2 rounded shadow text-center text-white" style={{ backgroundColor: cell.soc > 70 ? "#4ade80" : "#f87171" }}>
          <img
            src={cell.soc > 70 ? "/assets/battery_green.svg" : "/assets/battery_red.svg"}
            alt="battery icon"
            className="mx-auto w-6 h-6"
          />
          <div className="text-sm font-bold">{cell.id}</div>
          <div>{cell.voltage?.toFixed(2)}V</div>
          <div>SoC: {cell.soc.toFixed(1)}%</div>
        </div>
      ))}
    </div>
  );
}
