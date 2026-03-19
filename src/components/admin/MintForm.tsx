import { Template } from '@/types';

interface MintFormProps {
  formData: any;
  onFormChange: (field: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  isFormValid: boolean;
  template: Template;
}

export function MintForm({
  formData,
  onFormChange,
  onSubmit,
  isSubmitting,
  isFormValid,
  template,
}: MintFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Property Information</h2>

        {/* Address */}
        <div className="mb-4">
          <label className="text-sm font-medium block mb-2">
            Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => onFormChange('address', e.target.value)}
            placeholder="e.g., 123 Main Street"
            className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
            required
          />
        </div>

        {/* City and Country */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium block mb-2">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => onFormChange('city', e.target.value)}
              placeholder="e.g., New York"
              className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">
              Country <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => onFormChange('country', e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="text-sm font-medium block mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => onFormChange('description', e.target.value)}
            placeholder="Describe the property..."
            className="w-full px-3 py-2 border rounded-md bg-background text-foreground h-24"
            required
          />
        </div>

        {/* Price */}
        <div className="mb-4">
          <label className="text-sm font-medium block mb-2">
            Price (USD) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => onFormChange('price', parseFloat(e.target.value))}
            placeholder="0"
            className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
            required
          />
        </div>

        {/* Bedrooms, Bathrooms, Square Meters */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium block mb-2">Bedrooms</label>
            <input
              type="number"
              value={formData.bedrooms}
              onChange={(e) => onFormChange('bedrooms', parseInt(e.target.value))}
              min="0"
              className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Bathrooms</label>
            <input
              type="number"
              value={formData.bathrooms}
              onChange={(e) => onFormChange('bathrooms', parseInt(e.target.value))}
              min="0"
              className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Square Meters</label>
            <input
              type="number"
              value={formData.squareMeters}
              onChange={(e) => onFormChange('squareMeters', parseInt(e.target.value))}
              min="0"
              className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
            />
          </div>
        </div>

        {/* Coordinates */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium block mb-2">Latitude</label>
            <input
              type="number"
              value={formData.latitude}
              onChange={(e) => onFormChange('latitude', parseFloat(e.target.value))}
              step="0.0001"
              placeholder="0.0000"
              className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Longitude</label>
            <input
              type="number"
              value={formData.longitude}
              onChange={(e) => onFormChange('longitude', parseFloat(e.target.value))}
              step="0.0001"
              placeholder="0.0000"
              className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
            />
          </div>
        </div>

        {/* Image URL */}
        <div className="mb-4">
          <label className="text-sm font-medium block mb-2">Image URL</label>
          <input
            type="text"
            value={formData.imageUrl}
            onChange={(e) => onFormChange('imageUrl', e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
          />
        </div>

        {/* Status */}
        <div className="mb-4">
          <label className="text-sm font-medium block mb-2">Status</label>
          <select
            value={formData.status}
            onChange={(e) => onFormChange('status', e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
          >
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
          </select>
        </div>
      </div>

      {/* Template Info */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold mb-3">Template</h3>
        <div className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Name:</span>{' '}
            <span className="font-semibold">{template.name}</span>
          </p>
          <p>
            <span className="text-muted-foreground">Version:</span>{' '}
            <span className="font-semibold">{template.version}</span>
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isFormValid || isSubmitting}
        className="w-full py-3 px-4 rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Minting...' : 'Mint Property'}
      </button>
    </form>
  );
}
