import { Badge } from './Badge';

type PropertyStatus = 'available' | 'reserved' | 'sold';

interface StatusBadgeProps {
  status: PropertyStatus;
  className?: string;
}

const statusConfig: Record<PropertyStatus, { variant: any; label: string }> = {
  available: { variant: 'success', label: 'Available' },
  reserved: { variant: 'warning', label: 'Reserved' },
  sold: { variant: 'info', label: 'Sold' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={className}>
      <span className="flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-current" />
        {config.label}
      </span>
    </Badge>
  );
}
