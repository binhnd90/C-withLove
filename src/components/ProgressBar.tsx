interface ProgressBarProps {
  percent: number;
  height?: string;
  showLabel?: boolean;
}

export default function ProgressBar({
  percent,
  height = "h-2.5",
  showLabel = true,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div className="flex items-center gap-3 w-full">
      <div className={`flex-1 bg-gray-200 rounded-full ${height} overflow-hidden`}>
        <div
          className={`${height} rounded-full transition-all duration-500 ${
            clamped === 100 ? "bg-success" : "bg-primary"
          }`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-semibold text-muted whitespace-nowrap">
          {clamped}%
        </span>
      )}
    </div>
  );
}
