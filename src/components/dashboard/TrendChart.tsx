interface TrendChartProps {
  data: { date: string; count: number }[];
  title: string;
  color?: 'purple' | 'cyan' | 'orange';
}

const colorStyles = {
  purple: {
    stroke: '#a855f7',
    fill: 'rgba(168, 85, 247, 0.1)',
    dot: '#a855f7',
  },
  cyan: {
    stroke: '#06b6d4',
    fill: 'rgba(6, 182, 212, 0.1)',
    dot: '#06b6d4',
  },
  orange: {
    stroke: '#f97316',
    fill: 'rgba(249, 115, 22, 0.1)',
    dot: '#f97316',
  },
};

export function TrendChart({ data, title, color = 'cyan' }: TrendChartProps) {
  const maxValue = Math.max(...data.map((d) => d.count));
  const width = 280;
  const height = 120;
  const padding = 20;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    const y = height - padding - (d.count / maxValue) * chartHeight;
    return { x, y, value: d.count, label: d.date };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`;

  const colors = colorStyles[color];

  return (
    <div className="glass-card rounded-xl p-4">
      <h3 className="text-sm font-medium text-dark-300 mb-3">{title}</h3>
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.stroke} stopOpacity="0.3" />
            <stop offset="100%" stopColor={colors.stroke} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#gradient-${color})`} />
        <path d={pathD} fill="none" stroke={colors.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="3" fill={colors.dot} className="opacity-0 hover:opacity-100 transition-opacity" />
            <text x={p.x} y={height - 5} textAnchor="middle" className="text-[10px] fill-dark-500">
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
