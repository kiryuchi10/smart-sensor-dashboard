export default function TimestampBar({ time }) {
  return (
    <div className="text-sm text-center text-gray-300 mt-4">
      Last Updated: {time.toLocaleTimeString()}
    </div>
  );
}
