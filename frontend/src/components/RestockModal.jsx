import React from 'react';
import { X } from 'lucide-react';

const RestockModal = ({ vehicle, restockAmount, setRestockAmount, onSubmit, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
    <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-dark-800">
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <h2 className="text-lg font-bold text-white">Restock Vehicle</h2>
        <button onClick={onClose} className="text-gray-400 transition-colors hover:text-white">
          <X size={20} />
        </button>
      </div>
      <form onSubmit={onSubmit} className="p-6">
        <p className="mb-4 text-sm text-gray-400">
          Restocking: <strong className="text-white">{vehicle?.make} {vehicle?.model}</strong>
        </p>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-gray-500">
          Quantity to add
        </label>
        <input
          type="number"
          required
          min="1"
          value={restockAmount}
          onChange={(e) => setRestockAmount(parseInt(e.target.value))}
          className="w-full rounded-xl border border-white/10 bg-dark-700 px-3 py-2.5 text-sm text-white outline-none focus:border-orange-500/50"
        />
        <div className="mt-5 flex gap-3">
          <button
            type="submit"
            className="flex-1 rounded-xl bg-orange-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
          >
            Restock
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-dark-700 px-5 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:text-white"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
);

export default RestockModal;
