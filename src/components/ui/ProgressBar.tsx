interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  color?: 'purple' | 'cyan' | 'orange' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const colorStyles = {
  purple: 'bg-phoenix-purple-500',
  cyan: 'bg-phoenix-cyan-500',
  orange: 'bg-phoenix-orange-500',
  gradient: 'bg-gradient-to-r from-phoenix-purple-500 via-phoenix-cyan-500 to-phoenix-orange-500',
};

const sizeStyles = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

export function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  color = 'gradient',
  size = 'md',
  animated = false,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="w-full">
      <div className={`w-full bg-dark-800 rounded-full overflow-hidden ${sizeStyles[size]}`}>
        <div
          className={`
            ${sizeStyles[size]} rounded-full transition-all duration-500 ease-out
            ${colorStyles[color]}
            ${animated ? 'animate-pulse' : ''}
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1 text-xs text-dark-400">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
}
