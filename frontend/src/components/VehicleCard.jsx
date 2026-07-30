import React from 'react';
import { ShoppingCart, Pencil, Settings, Trash2, Car } from 'lucide-react';

const StockBadge = ({ quantity }) => {
  if (quantity === 0) {
    return (
      <span className="rounded-md bg-red-500/90 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
        Out of stock · 0
      </span>
    );
  }
  if (quantity <= 3) {
    return (
      <span className="rounded-md bg-amber-500/90 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
        Low stock · {quantity}
      </span>
    );
  }
  return (
    <span className="rounded-md border border-white/20 bg-black/60 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
      In stock · {quantity}
    </span>
  );
};

const VehicleCard = ({ vehicle, isAdmin, onPurchase, onEdit, onRestock, onDelete }) => {
  const isSoldOut = vehicle.quantity <= 0;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[#141414] transition-all duration-200 hover:border-white/[0.12] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0e0e0e]">
        {vehicle.image_url ? (
          <img
            src={vehicle.image_url}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            onError={(e) => { e.target.style.display = 'none'; if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex'; }}
          />
        ) : null}
        <div
          className={`${vehicle.image_url ? 'hidden' : 'flex'} h-full w-full items-center justify-center bg-[#111]`}
        >
          <Car size={40} className="text-[#2a2a2a]" />
        </div>
        <div className="absolute right-3 top-3">
          <StockBadge quantity={vehicle.quantity} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-1 flex items-baseline justify-between gap-3">
          <h3 className="truncate text-[15px] font-bold leading-snug text-white">
            {vehicle.make} {vehicle.model}
          </h3>
          <span className="shrink-0 text-[15px] font-bold text-orange-400">
            ${Number(vehicle.price).toLocaleString()}
          </span>
        </div>

        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#666]">
          {vehicle.category} · {vehicle.year}
        </p>

        {vehicle.description && (
          <p className="mb-4 line-clamp-2 text-[13px] leading-relaxed text-[#888]">
            {vehicle.description}
          </p>
        )}

        <div className="mt-auto flex items-center gap-2 pt-2">
          <button
            onClick={() => onPurchase(vehicle.id)}
            disabled={isSoldOut}
            className={`flex h-10 flex-1 items-center justify-center gap-2 rounded-xl text-[13px] font-semibold transition-all duration-200 ${
              isSoldOut
                ? 'cursor-not-allowed bg-[#1e1e1e] text-[#555]'
                : 'bg-orange-500 text-white hover:bg-orange-600 active:scale-[0.98]'
            }`}
          >
            <ShoppingCart size={14} />
            {isSoldOut ? 'Sold out' : 'Purchase'}
          </button>

          {isAdmin && (
            <>
              <button
                onClick={() => onEdit(vehicle)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-[#1a1a1a] text-[#777] transition-colors duration-200 hover:border-white/[0.15] hover:text-white"
                title="Edit"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => onRestock(vehicle)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-[#1a1a1a] text-[#777] transition-colors duration-200 hover:border-white/[0.15] hover:text-white"
                title="Restock"
              >
                <Settings size={14} />
              </button>
              <button
                onClick={() => onDelete(vehicle.id)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/[0.06] text-red-400/80 transition-colors duration-200 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
