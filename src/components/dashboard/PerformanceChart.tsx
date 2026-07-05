interface PerformanceChartProps {
  data: { date: string; avgDuration: number }[];
  title: string;
}

export function PerformanceChart({ data, title }: PerformanceChartProps) {
  const maxValue = Math.max(...data.map((d) => d.avgDuration));
  const width = 280;
  const height = 120;
  const padding = 20;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const barWidth = chartWidth / data.length - 8;

  return (
    <div className="glass-card rounded-xl p-4">
      <h3 className="text-sm font-medium text-dark-300 mb-3">{title}</h3>
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id="perf-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        {data.map((d, i) => {
          const barHeight = (d.avgDuration / maxValue) * chartHeight;
          const x = padding + i * (chartWidth / data.length) + 4;
          const y = height - padding - barHeight;

          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx="4"
                fill="url(#perf-gradient)"
                className="opacity-80 hover:opacity-100 transition-opacity"
              />
              <text x={x + barWidth / 2} y={height - 5} textAnchor="middle" className="text-[10px] fill-dark-500">
                {d.date}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
