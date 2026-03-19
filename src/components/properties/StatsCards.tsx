interface StatsProps {
  totalProperties: number;
  available: number;
  reserved: number;
  sold: number;
  totalValue: number;
  totalValueChange: string;
  anchored?: number;
  pending?: number;
}

export function StatsCards(props: { stats: StatsProps }) {
  const { stats } = props;

  const cards = [
    {
      title: 'Total Assets',
      value: String(stats.totalProperties),
      trend: '+2 from last month',
      trendIcon: 'trending_up',
      trendColor: 'text-primary-consumer',
    },
    {
      title: 'Available',
      value: String(stats.available),
      valueColor: 'text-primary-consumer',
      subtitle: 'Ready for acquisition',
    },
    {
      title: 'Reserved',
      value: String(stats.reserved),
      valueColor: 'text-amber-500',
      subtitle: 'Under contract',
    },
    {
      title: 'Portfolio Value',
      value: `$${(stats.totalValue / 1000000).toFixed(1)}M`,
      subtitle: 'Net asset value',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-6">
      {cards.map((card) => (
        <div key={card.title} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500">{card.title}</p>
          <h3 className={`text-3xl font-bold mt-2 ${card.valueColor || ''}`}>{card.value}</h3>
          {card.trend && (
            <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
              <span className={`material-symbols-outlined text-xs ${card.trendColor}`}>{card.trendIcon}</span>
              <span>{card.trend}</span>
            </div>
          )}
          {card.subtitle && (
            <div className="mt-2 text-xs text-slate-400">{card.subtitle}</div>
          )}
        </div>
      ))}
    </div>
  );
}
