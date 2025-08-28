export default function SensitivityScore({ score }) {
  const getColor = () => {
    if (score > 80) return 'bg-red-500';
    if (score > 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="flex items-center mt-4">
      <div className={`w-4 h-4 rounded-full ${getColor()}`} />
      <span className="ml-2 text-sm text-gray-700">Sensitivity Score: {score}</span>
    </div>
  );
}
