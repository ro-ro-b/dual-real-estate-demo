import { Bed, Bath, Maximize2 } from 'lucide-react';

interface PropertyPreviewProps {
  propertyData: any;
}

export function PropertyPreview({ propertyData }: PropertyPreviewProps) {
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      {/* Hero */}
      <div className="relative h-48 bg-gradient-to-br from-blue-400 to-blue-600 overflow-hidden flex items-center justify-center">
        {propertyData.imageUrl ? (
          <img
            src={propertyData.imageUrl}
            alt="preview"
            className="w-full h-full object-cover"
            onError={() => {}}
          />
        ) : (
          <div className="text-center">
            <p className="text-white/60 text-sm">Image Preview</p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-muted-foreground">
          {propertyData.city || 'City'}
        </p>
        <h3 className="font-semibold mt-1 line-clamp-2">
          {propertyData.address || 'Address'}
        </h3>

        {/* Price */}
        <p className="text-lg font-bold text-primary mt-2">
          {propertyData.price > 0
            ? `$${propertyData.price.toLocaleString()}`
            : '$0'}
        </p>

        {/* Status Badge */}
        <div className="mt-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              propertyData.status === 'available'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {propertyData.status.charAt(0).toUpperCase() +
              propertyData.status.slice(1)}
          </span>
        </div>

        {/* Details */}
        <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            {propertyData.bedrooms || 0}
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            {propertyData.bathrooms || 0}
          </div>
          <div className="flex items-center gap-1">
            <Maximize2 className="w-4 h-4" />
            {propertyData.squareMeters || 0}m²
          </div>
        </div>

        {/* Description Preview */}
        {propertyData.description && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground line-clamp-3">
              {propertyData.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
