import { MapPin, Calendar } from 'lucide-react';
import { PropertyData } from '@/types';

interface PropertyDetailsProps {
  propertyData: PropertyData;
}

export function PropertyDetails({ propertyData }: PropertyDetailsProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="text-lg font-semibold mb-4">Property Details</h2>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-muted-foreground">Address</label>
          <p className="font-medium mt-1">{propertyData.address}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground">City</label>
            <p className="font-medium mt-1">{propertyData.city}</p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Country</label>
            <p className="font-medium mt-1">{propertyData.country}</p>
          </div>
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Description</label>
          <p className="font-medium mt-1 text-sm leading-relaxed">
            {propertyData.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground">Bedrooms</label>
            <p className="font-medium text-lg mt-1">{propertyData.bedrooms}</p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Bathrooms</label>
            <p className="font-medium text-lg mt-1">{propertyData.bathrooms}</p>
          </div>
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Square Meters</label>
          <p className="font-medium text-lg mt-1">{propertyData.squareMeters}m²</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground">Latitude</label>
            <p className="font-mono text-sm mt-1">{propertyData.latitude.toFixed(4)}</p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Longitude</label>
            <p className="font-mono text-sm mt-1">{propertyData.longitude.toFixed(4)}</p>
          </div>
        </div>

        {propertyData.yearBuilt > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Built in {propertyData.yearBuilt}</span>
          </div>
        )}
      </div>
    </div>
  );
}
