import React, { useState, useRef } from 'react';
import { X, Upload, Link2 } from 'lucide-react';

const VehicleModal = ({ vehicle, onSave, onClose }) => {
  const isEdit = !!vehicle;
  const [formData, setFormData] = useState({
    make: vehicle?.make || '',
    model: vehicle?.model || '',
    category: vehicle?.category || '',
    year: vehicle?.year || new Date().getFullYear(),
    price: vehicle?.price || '',
    quantity: vehicle?.quantity || '',
    description: vehicle?.description || '',
    image_url: vehicle?.image_url || ''
  });
  const [imageMode, setImageMode] = useState('url');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(vehicle?.image_url || '');
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(formData, imageFile);
    setSaving(false);
  };

  const set = (key, val) => setFormData({ ...formData, [key]: val });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-dark-800">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 className="text-lg font-bold text-white">
            {isEdit ? 'Edit Vehicle' : 'Add New Vehicle'}
          </h2>
          <button onClick={onClose} className="text-gray-400 transition-colors hover:text-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[75vh] overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Make', key: 'make', ph: 'e.g. Porsche', type: 'text' },
              { label: 'Model', key: 'model', ph: 'e.g. 911', type: 'text' },
              { label: 'Category', key: 'category', ph: 'e.g. Sports', type: 'text' },
              { label: 'Year', key: 'year', ph: '2024', type: 'number' },
              { label: 'Price ($)', key: 'price', ph: '50000', type: 'number' },
              { label: 'Quantity', key: 'quantity', ph: '5', type: 'number' },
            ].map(({ label, key, ph, type }) => (
              <div key={key}>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-gray-500">
                  {label}
                </label>
                <input
                  type={type}
                  required
                  placeholder={ph}
                  value={formData[key]}
                  onChange={(e) => set(key, e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-dark-700 px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-orange-500/50"
                />
              </div>
            ))}
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-gray-500">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Brief vehicle description..."
              value={formData.description}
              onChange={(e) => set('description', e.target.value)}
              className="w-full resize-none rounded-xl border border-white/10 bg-dark-700 px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-orange-500/50"
            />
          </div>

          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-gray-500">
              Vehicle Image
            </label>
            <div className="mb-3 flex gap-2">
              <button
                type="button"
                onClick={() => setImageMode('url')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  imageMode === 'url' ? 'bg-orange-500 text-white' : 'bg-dark-600 text-gray-400'
                }`}
              >
                <Link2 size={13} /> URL
              </button>
              <button
                type="button"
                onClick={() => setImageMode('file')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  imageMode === 'file' ? 'bg-orange-500 text-white' : 'bg-dark-600 text-gray-400'
                }`}
              >
                <Upload size={13} /> Upload
              </button>
            </div>

            {imageMode === 'url' ? (
              <input
                type="url"
                placeholder="https://example.com/car.jpg"
                value={formData.image_url}
                onChange={(e) => { set('image_url', e.target.value); setPreview(e.target.value); }}
                className="w-full rounded-xl border border-white/10 bg-dark-700 px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-orange-500/50"
              />
            ) : (
              <div
                onClick={() => fileRef.current?.click()}
                className="cursor-pointer rounded-xl border-2 border-dashed border-white/10 bg-dark-700 p-6 text-center transition-colors hover:border-orange-500/30"
              >
                <Upload size={24} className="mx-auto mb-2 text-gray-500" />
                <p className="text-sm text-gray-500">
                  {imageFile ? imageFile.name : 'Click to choose image'}
                </p>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>
            )}

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-3 h-32 w-full rounded-xl object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl bg-orange-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Vehicle'}
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
};

export default VehicleModal;
