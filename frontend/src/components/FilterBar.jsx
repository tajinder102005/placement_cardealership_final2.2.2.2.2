import React from 'react';
import { Search, X } from 'lucide-react';

const FilterBar = ({
  searchTerm, setSearchTerm,
  category, setCategory,
  minPrice, setMinPrice,
  maxPrice, setMaxPrice,
  sortBy, setSortBy,
  availableOnly, setAvailableOnly,
  onClear,
  categories
}) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-dark-800 p-5">
      <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-12">
        <div className="md:col-span-4">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-gray-500">
            Search
          </label>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by make, model or category"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-dark-700 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-orange-500/50"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-gray-500">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full appearance-none rounded-xl border border-white/10 bg-dark-700 px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-orange-500/50"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-gray-500">
            Price range
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-dark-700 px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-orange-500/50"
            />
            <span className="text-gray-500">—</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-dark-700 px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-orange-500/50"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-gray-500">
            Sort
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full appearance-none rounded-xl border border-white/10 bg-dark-700 px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-orange-500/50"
          >
            <option value="newest">Newest first</option>
            <option value="price-asc">Price: low → high</option>
            <option value="price-desc">Price: high → low</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>

        <div className="md:col-span-1 flex justify-end">
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs font-medium text-gray-500 transition-colors hover:text-white"
          >
            <X size={14} />
            Clear filters
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={() => setAvailableOnly(!availableOnly)}
          className={`relative h-5 w-9 rounded-full transition-colors duration-200 ${
            availableOnly ? 'bg-orange-500' : 'bg-dark-500'
          }`}
        >
          <span
            className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform duration-200 ${
              availableOnly ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
        <span className="text-sm text-gray-400">Available only</span>
      </div>
    </div>
  );
};

export default FilterBar;
