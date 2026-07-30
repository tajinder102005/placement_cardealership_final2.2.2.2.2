import React, { useState, useRef } from 'react';
import { X, Upload, Link2 } from 'lucide-react';

const inputClass = "w-full rounded-lg border border-white/[0.08] bg-[#0c0c0c] px-3 py-2 text-[13px] text-white placeholder-[#444] outline-none transition-colors duration-200 focus:border-orange-500/40";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
          <h2 className="text-[15px] font-bold text-white">
            {isEdit ? 'Edit Vehicle' : 'Add New Vehicle'}
          </h2>
          <button onClick={onClose} className="text-[#555] transition-colors duration-200 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[72vh] overflow-y-auto p-6">
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
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#555]">
                  {label}
                </label>
                <input
                  type={type}
                  required
                  placeholder={ph}
                  value={formData[key]}
                  onChange={(e) => set(key, e.target.value)}
                  className={inputClass}
                />
              </div>
            ))}
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#555]">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Brief vehicle description..."
              value={formData.description}
              onChange={(e) => set('description', e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#555]">
              Vehicle Image
            </label>
            <div className="mb-3 flex gap-1.5">
              {[
                { mode: 'url', icon: Link2, label: 'URL' },
                { mode: 'file', icon: Upload, label: 'Upload' }
              ].map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setImageMode(mode)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold transition-colors duration-200 ${
                    imageMode === mode ? 'bg-orange-500 text-white' : 'bg-[#1a1a1a] text-[#666] hover:text-white'
                  }`}
                >
                  <Icon size={12} /> {label}
                </button>
              ))}
            </div>

            {imageMode === 'url' ? (
              <input
                type="url"
                placeholder="https://example.com/car.jpg"
                value={formData.image_url}
                onChange={(e) => { set('image_url', e.target.value); setPreview(e.target.value); }}
                className={inputClass}
              />
            ) : (
              <div
                onClick={() => fileRef.current?.click()}
                className="cursor-pointer rounded-xl border border-dashed border-white/[0.1] bg-[#0c0c0c] px-4 py-8 text-center transition-colors duration-200 hover:border-orange-500/30"
              >
                <Upload size={20} className="mx-auto mb-2 text-[#444]" />
                <p className="text-[12px] text-[#555]">
                  {imageFile ? imageFile.name : 'Click to choose image'}
                </p>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>
            )}

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-3 aspect-video w-full rounded-xl object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="h-10 flex-1 rounded-xl bg-orange-500 text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-orange-600 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Vehicle'}
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
};

export default VehicleModal;
