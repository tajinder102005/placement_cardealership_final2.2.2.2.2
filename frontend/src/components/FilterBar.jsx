import React from 'react';
import { Search, X } from 'lucide-react';

const inputClass = "w-full rounded-lg border border-white/[0.08] bg-[#111] px-3 py-2 text-[13px] text-white placeholder-[#555] outline-none transition-colors duration-200 focus:border-orange-500/40 focus:bg-[#141414]";

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
    <div className="rounded-2xl border border-white/[0.06] bg-[#111] p-6">
      <div className="grid grid-cols-1 items-end gap-x-4 gap-y-4 md:grid-cols-12">
        <div className="md:col-span-4">
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#555]">
            Search
          </label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" />
            <input
              type="text"
              placeholder="Search by make, model or category"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-white/[0.08] bg-[#0c0c0c] py-2 pl-9 pr-3 text-[13px] text-white placeholder-[#444] outline-none transition-colors duration-200 focus:border-orange-500/40"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#555]">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3">
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#555]">
            Price range
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className={inputClass}
            />
            <span className="text-[13px] text-[#333]">—</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#555]">
            Sort
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={inputClass}
          >
            <option value="newest">Newest first</option>
            <option value="price-asc">Price: low → high</option>
            <option value="price-desc">Price: high → low</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>

        <div className="flex items-end justify-end md:col-span-1">
          <button
            onClick={onClear}
            className="flex items-center gap-1 whitespace-nowrap pb-0.5 text-[11px] font-medium text-[#555] transition-colors duration-200 hover:text-white"
          >
            <X size={12} />
            Clear filters
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2.5">
        <button
          onClick={() => setAvailableOnly(!availableOnly)}
          className={`relative h-[18px] w-8 shrink-0 rounded-full transition-colors duration-200 ${
            availableOnly ? 'bg-orange-500' : 'bg-[#2a2a2a]'
          }`}
        >
          <span
            className={`absolute left-[2px] top-[2px] h-[14px] w-[14px] rounded-full bg-white shadow-sm transition-transform duration-200 ${
              availableOnly ? 'translate-x-[14px]' : 'translate-x-0'
            }`}
          />
        </button>
        <span className="text-[13px] text-[#777]">Available only</span>
      </div>
    </div>
  );
};

export default FilterBar;
