import type { Property } from '@/types';
import { Image } from 'lucide-react';

interface FacesCardProps {
  faces: Property['faces'];
}

export function FacesCard({ faces }: FacesCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Image className="w-5 h-5" />
        <h3 className="font-semibold">Faces</h3>
      </div>

      {faces.length === 0 ? (
        <p className="text-sm text-muted-foreground">No faces attached</p>
      ) : (
        <div className="space-y-3">
          {faces.map((face, index) => (
            <div key={`${face.type}-${index}`} className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {face.type}
                </span>
              </div>
              <p className="text-xs text-muted-foreground break-all">{face.url}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
