import React from 'react';
import { X } from 'lucide-react';

const RestockModal = ({ vehicle, restockAmount, setRestockAmount, onSubmit, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm" onClick={onClose}>
    <div className="w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#111]" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
        <h2 className="text-[15px] font-bold text-white">Restock Vehicle</h2>
        <button onClick={onClose} className="text-[#555] transition-colors duration-200 hover:text-white">
          <X size={18} />
        </button>
      </div>
      <form onSubmit={onSubmit} className="p-6">
        <p className="mb-4 text-[13px] text-[#888]">
          Restocking: <strong className="text-white">{vehicle?.make} {vehicle?.model}</strong>
        </p>
        <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#555]">
          Quantity to add
        </label>
        <input
          type="number"
          required
          min="1"
          value={restockAmount}
          onChange={(e) => setRestockAmount(parseInt(e.target.value))}
          className="w-full rounded-lg border border-white/[0.08] bg-[#0c0c0c] px-3 py-2 text-[13px] text-white outline-none transition-colors duration-200 focus:border-orange-500/40"
        />
        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            className="h-10 flex-1 rounded-xl bg-orange-500 text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-orange-600"
          >
            Restock
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-xl border border-white/[0.08] bg-[#1a1a1a] px-5 text-[13px] font-medium text-[#888] transition-colors duration-200 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
);

export default RestockModal;
