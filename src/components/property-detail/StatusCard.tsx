import { Property } from '@/lib/demo-data';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

interface StatusCardProps {
  property: Property;
}

export function StatusCard({ property }: StatusCardProps) {
  const statusInfo = {
    available: { label: 'Available', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    reserved: { label: 'Reserved', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    sold: { label: 'Sold', color: 'bg-gray-100 text-gray-800', icon: XCircle },
  };

  const chainStatusInfo = {
    anchored: { label: 'Anchored', color: 'bg-green-50 border-green-200' },
    pending: { label: 'Pending Anchoring', color: 'bg-yellow-50 border-yellow-200' },
    failed: { label: 'Anchor Failed', color: 'bg-red-50 border-red-200' },
  };

  const status = statusInfo[property.propertyData.status];
  const chainStatus = chainStatusInfo[property.onChainStatus];
  const StatusIcon = status.icon;

  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="font-semibold mb-4">Status</h3>

      <div className={`${status.color} px-4 py-3 rounded-lg mb-4 flex items-center gap-2`}>
        <StatusIcon className="w-5 h-5" />
        <span className="font-semibold">{status.label}</span>
      </div>

      <div className={`${chainStatus.color} border px-4 py-3 rounded-lg`}>
        <p className="text-sm font-semibold">On-Chain Status</p>
        <p className="text-sm mt-1">{chainStatus.label}</p>
      </div>
    </div>
  );
}
