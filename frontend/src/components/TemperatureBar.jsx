const TemperatureBar = ({ temperatureData, minTemp, maxTemp }) => {
  const data = temperatureData || [];

  return (
    <div className="temperature-bar">
      {data.map((temp, idx) => (
        <div key={idx} className="temp-bar-segment">
          <div className="temp-value">{temp.toFixed(1)}°C</div>
        </div>
      ))}
    </div>
  );
};

export default TemperatureBar;