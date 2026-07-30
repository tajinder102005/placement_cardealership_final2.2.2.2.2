import React from 'react';
import { ShoppingCart, Pencil, Settings, Trash2 } from 'lucide-react';
import { Car } from 'lucide-react';

const StockBadge = ({ quantity }) => {
  if (quantity === 0) {
    return (
      <span className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-semibold text-white">
        Out of stock · 0
      </span>
    );
  }
  if (quantity <= 3) {
    return (
      <span className="rounded-md bg-amber-600 px-2.5 py-1 text-xs font-semibold text-white">
        Low stock · {quantity}
      </span>
    );
  }
  return (
    <span className="rounded-md border border-white/20 bg-dark-700/80 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
      In stock · {quantity}
    </span>
  );
};

const VehicleCard = ({ vehicle, isAdmin, onPurchase, onEdit, onRestock, onDelete }) => {
  const isSoldOut = vehicle.quantity <= 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-dark-800 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
      <div className="relative h-52 overflow-hidden bg-dark-700">
        {vehicle.image_url ? (
          <img
            src={vehicle.image_url}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
          />
        ) : null}
        <div
          className={`${vehicle.image_url ? 'hidden' : 'flex'} h-full w-full items-center justify-center bg-dark-700`}
        >
          <Car size={48} className="text-dark-500" />
        </div>
        <div className="absolute right-3 top-3">
          <StockBadge quantity={vehicle.quantity} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold text-white">
            {vehicle.make} {vehicle.model}
          </h3>
          <span className="shrink-0 text-lg font-bold text-orange-500">
            ${Number(vehicle.price).toLocaleString()}
          </span>
        </div>

        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
          {vehicle.category} · {vehicle.year}
        </p>

        {vehicle.description && (
          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-400">
            {vehicle.description}
          </p>
        )}

        <div className="mt-auto flex items-center gap-2">
          <button
            onClick={() => onPurchase(vehicle.id)}
            disabled={isSoldOut}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${
              isSoldOut
                ? 'cursor-not-allowed bg-dark-600 text-gray-500'
                : 'bg-orange-500 text-white hover:bg-orange-600 active:scale-[0.98]'
            }`}
          >
            <ShoppingCart size={15} />
            {isSoldOut ? 'Sold out' : 'Purchase'}
          </button>

          {isAdmin && (
            <>
              <button
                onClick={() => onEdit(vehicle)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-dark-700 text-gray-400 transition-colors hover:border-white/20 hover:text-white"
                title="Edit"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => onRestock(vehicle)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-dark-700 text-gray-400 transition-colors hover:border-white/20 hover:text-white"
                title="Restock"
              >
                <Settings size={15} />
              </button>
              <button
                onClick={() => onDelete(vehicle.id)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 transition-colors hover:border-red-500/40 hover:bg-red-500/20 hover:text-red-300"
                title="Delete"
              >
                <Trash2 size={15} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
