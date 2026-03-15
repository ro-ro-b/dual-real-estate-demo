import { Copy } from 'lucide-react';

interface OwnerCardProps {
  ownerWallet: string;
}

export function OwnerCard({ ownerWallet }: OwnerCardProps) {
  const displayWallet = `${ownerWallet.slice(0, 6)}...${ownerWallet.slice(-4)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(ownerWallet);
    alert('Wallet address copied!');
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="font-semibold mb-4">Owner</h3>

      <div className="bg-muted p-4 rounded-lg">
        <p className="text-xs text-muted-foreground mb-2">Wallet Address</p>
        <div className="flex items-center justify-between gap-2">
          <p className="font-mono text-sm font-semibold">{displayWallet}</p>
          <button
            onClick={handleCopy}
            className="p-1.5 hover:bg-background rounded transition-colors"
            title="Copy full address"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
