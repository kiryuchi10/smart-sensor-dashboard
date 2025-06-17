export default function AlarmStatus({ status }) {
  return (
    <div className={`p-2 font-bold text-white ${status === 'Fault' ? 'bg-red-600' : 'bg-green-500'}`}>
      Alarm Status: {status}
    </div>
  );
}
