import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import VehicleCard from '../components/VehicleCard';
import FilterBar from '../components/FilterBar';
import VehicleModal from '../components/VehicleModal';
import RestockModal from '../components/RestockModal';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';

const Showroom = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [availableOnly, setAvailableOnly] = useState(false);

  const [vehicleModal, setVehicleModal] = useState(null);
  const [restockModal, setRestockModal] = useState(null);
  const [restockAmount, setRestockAmount] = useState(1);

  const fetchVehicles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) toast.error('Failed to load vehicles');
    else setVehicles(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchVehicles(); }, []);

  const categories = useMemo(() => {
    return [...new Set(vehicles.map((v) => v.category))].sort();
  }, [vehicles]);

  const filtered = useMemo(() => {
    let result = [...vehicles];
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (v) =>
          v.make.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q)
      );
    }
    if (category) result = result.filter((v) => v.category === category);
    if (minPrice) result = result.filter((v) => Number(v.price) >= parseFloat(minPrice));
    if (maxPrice) result = result.filter((v) => Number(v.price) <= parseFloat(maxPrice));
    if (availableOnly) result = result.filter((v) => v.quantity > 0);
    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => Number(a.price) - Number(b.price)); break;
      case 'price-desc': result.sort((a, b) => Number(b.price) - Number(a.price)); break;
      case 'name': result.sort((a, b) => `${a.make} ${a.model}`.localeCompare(`${b.make} ${b.model}`)); break;
      default: break;
    }
    return result;
  }, [vehicles, searchTerm, category, minPrice, maxPrice, sortBy, availableOnly]);

  const clearFilters = () => {
    setSearchTerm(''); setCategory(''); setMinPrice(''); setMaxPrice('');
    setSortBy('newest'); setAvailableOnly(false);
  };

  const handlePurchase = async (vehicleId) => {
    if (!user) { toast.error('Please sign in to purchase'); return; }
    const { error } = await supabase.rpc('purchase_vehicle', { _vehicle_id: vehicleId, _quantity: 1 });
    if (error) { toast.error(error.message); return; }
    toast.success('Purchase successful!');
    fetchVehicles();
  };

  const handleSave = async (formData, imageFile) => {
    let imageUrl = formData.image_url;
    if (imageFile) {
      const ext = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${ext}`;
      const { data, error } = await supabase.storage
        .from('vehicle-images')
        .upload(fileName, imageFile, { cacheControl: '3600', upsert: false });
      if (error) { toast.error('Image upload failed: ' + error.message); return; }
      const { data: { publicUrl } } = supabase.storage.from('vehicle-images').getPublicUrl(data.path);
      imageUrl = publicUrl;
    }
    const payload = {
      make: formData.make, model: formData.model, category: formData.category,
      year: parseInt(formData.year), price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity), description: formData.description,
      image_url: imageUrl || null, created_by: user.id
    };
    let error;
    if (vehicleModal?.id) {
      ({ error } = await supabase.from('vehicles').update(payload).eq('id', vehicleModal.id));
    } else {
      ({ error } = await supabase.from('vehicles').insert(payload));
    }
    if (error) { toast.error(error.message); return; }
    toast.success(vehicleModal?.id ? 'Vehicle updated!' : 'Vehicle added!');
    setVehicleModal(null);
    fetchVehicles();
  };

  const handleRestock = async (e) => {
    e.preventDefault();
    const { error } = await supabase.rpc('restock_vehicle', {
      _vehicle_id: restockModal.id, _quantity: parseInt(restockAmount)
    });
    if (error) { toast.error(error.message); return; }
    toast.success('Vehicle restocked!');
    setRestockModal(null);
    fetchVehicles();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vehicle permanently?')) return;
    const { error } = await supabase.from('vehicles').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Vehicle deleted');
    fetchVehicles();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">Showroom</h1>
            <p className="mt-1 text-[13px] text-[#555]">
              {filtered.length} of {vehicles.length} vehicles shown
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setVehicleModal({})}
              className="flex h-10 items-center gap-2 rounded-xl bg-orange-500 px-5 text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-orange-600"
            >
              <Plus size={15} /> Add vehicle
            </button>
          )}
        </div>

        <div className="mb-8">
          <FilterBar
            searchTerm={searchTerm} setSearchTerm={setSearchTerm}
            category={category} setCategory={setCategory}
            minPrice={minPrice} setMinPrice={setMinPrice}
            maxPrice={maxPrice} setMaxPrice={setMaxPrice}
            sortBy={sortBy} setSortBy={setSortBy}
            availableOnly={availableOnly} setAvailableOnly={setAvailableOnly}
            onClear={clearFilters}
            categories={categories}
          />
        </div>

        {loading ? (
          <div className="py-24 text-center text-[13px] text-[#555]">Loading vehicles...</div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center text-[13px] text-[#555]">No vehicles match your filters.</div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((v) => (
              <VehicleCard
                key={v.id}
                vehicle={v}
                isAdmin={isAdmin}
                onPurchase={handlePurchase}
                onEdit={(veh) => setVehicleModal(veh)}
                onRestock={(veh) => { setRestockModal(veh); setRestockAmount(1); }}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <footer className="mt-16 border-t border-white/[0.04] py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 text-[11px] text-[#444]">
          <span>🚗 Torque Motors — dealership inventory system</span>
          <span>Built as a TDD kata · REST API + React SPA</span>
        </div>
      </footer>

      {vehicleModal !== null && (
        <VehicleModal
          vehicle={vehicleModal?.id ? vehicleModal : null}
          onSave={handleSave}
          onClose={() => setVehicleModal(null)}
        />
      )}

      {restockModal && (
        <RestockModal
          vehicle={restockModal}
          restockAmount={restockAmount}
          setRestockAmount={setRestockAmount}
          onSubmit={handleRestock}
          onClose={() => setRestockModal(null)}
        />
      )}
    </div>
  );
};

export default Showroom;
