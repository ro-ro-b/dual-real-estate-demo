'use client';

type SortOption = 'price-asc' | 'price-desc' | 'newest' | 'oldest';
type StatusFilter = 'all' | 'available' | 'reserved' | 'sold';

interface PropertyFiltersProps {
  statusFilter: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  bedroomsFilter: number | 'all';
  onBedroomsChange: (bedrooms: number | 'all') => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function PropertyFilters({
  statusFilter,
  onStatusChange,
  bedroomsFilter,
  onBedroomsChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortChange,
}: PropertyFiltersProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-3">
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
            className="appearance-none px-4 py-2 pr-10 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 cursor-pointer focus:ring-2 focus:ring-primary-consumer/20 focus:border-primary-consumer"
          >
            <option value="all">Status</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
          </select>
          <span className="material-symbols-outlined text-lg absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">expand_more</span>
        </div>

        <div className="relative">
          <select
            value={bedroomsFilter}
            onChange={(e) =>
              onBedroomsChange(e.target.value === 'all' ? 'all' : parseInt(e.target.value))
            }
            className="appearance-none px-4 py-2 pr-10 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 cursor-pointer focus:ring-2 focus:ring-primary-consumer/20 focus:border-primary-consumer"
          >
            <option value="all">Bedrooms</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
          <span className="material-symbols-outlined text-lg absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">expand_more</span>
        </div>

        <div className="relative">
          <select
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'all') onPriceRangeChange([0, 25000000]);
              else if (val === 'under2m') onPriceRangeChange([0, 2000000]);
              else if (val === '2m-5m') onPriceRangeChange([2000000, 5000000]);
              else if (val === '5m-10m') onPriceRangeChange([5000000, 10000000]);
              else if (val === 'over10m') onPriceRangeChange([10000000, 25000000]);
            }}
            className="appearance-none px-4 py-2 pr-10 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 cursor-pointer focus:ring-2 focus:ring-primary-consumer/20 focus:border-primary-consumer"
          >
            <option value="all">Price Range</option>
            <option value="under2m">Under $2M</option>
            <option value="2m-5m">$2M - $5M</option>
            <option value="5m-10m">$5M - $10M</option>
            <option value="over10m">Over $10M</option>
          </select>
          <span className="material-symbols-outlined text-lg absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">expand_more</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500">Sort by:</span>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="appearance-none px-4 py-2 pr-10 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 cursor-pointer focus:ring-2 focus:ring-primary-consumer/20 focus:border-primary-consumer"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
          <span className="material-symbols-outlined text-lg absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">sort</span>
        </div>
      </div>
    </div>
  );
}
