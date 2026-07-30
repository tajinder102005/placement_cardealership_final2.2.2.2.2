import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { LogOut, Plus, Trash2, Edit3, ShoppingBag, PlusCircle, Search, RefreshCw } from 'lucide-react';
import './AuthStyles.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [restockAmount, setRestockAmount] = useState(1);

  const [searchMake, setSearchMake] = useState('');
  const [searchModel, setSearchModel] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const [formData, setFormData] = useState({
    make: '',
    model: '',
    category: '',
    price: 0,
    quantity: 0
  });

  const isAdmin = user?.role === 'admin';

  const fetchVehicles = async () => {
    try {
      const response = await API.get('/vehicles');
      setVehicles(response.data.data);
    } catch (err) {
      toast.error('Failed to load vehicles');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const params = {};
      if (searchMake) params.make = searchMake;
      if (searchModel) params.model = searchModel;
      if (searchCategory) params.category = searchCategory;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const response = await API.get('/vehicles/search', { params });
      setVehicles(response.data.data);
    } catch (err) {
      toast.error('Search failed');
    }
  };

  const handleResetSearch = () => {
    setSearchMake('');
    setSearchModel('');
    setSearchCategory('');
    setMinPrice('');
    setMaxPrice('');
    fetchVehicles();
  };

  const handlePurchase = async (vehicleId) => {
    try {
      const response = await API.post(`/vehicles/${vehicleId}/purchase`);
      toast.success(response.data.message);
      fetchVehicles();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Purchase failed');
    }
  };

  const handleRestock = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post(`/vehicles/${selectedVehicle._id}/restock`, {
        quantity: parseInt(restockAmount)
      });
      toast.success(response.data.message);
      setIsRestockOpen(false);
      fetchVehicles();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Restock failed');
    }
  };

  const handleSaveVehicle = async (e) => {
    e.preventDefault();
    try {
      if (selectedVehicle) {
        await API.put(`/vehicles/${selectedVehicle._id}`, formData);
        toast.success('Vehicle updated successfully');
      } else {
        await API.post('/vehicles', formData);
        toast.success('Vehicle added successfully');
      }
      setIsModalOpen(false);
      fetchVehicles();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save vehicle');
    }
  };

  const handleDelete = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      await API.delete(`/vehicles/${vehicleId}`);
      toast.success('Vehicle deleted successfully');
      fetchVehicles();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Deletion failed');
    }
  };

  const openAddModal = () => {
    setSelectedVehicle(null);
    setFormData({ make: '', model: '', category: '', price: 0, quantity: 0 });
    setIsModalOpen(true);
  };

  const openEditModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setFormData({
      make: vehicle.make,
      model: vehicle.model,
      category: vehicle.category,
      price: vehicle.price,
      quantity: vehicle.quantity
    });
    setIsModalOpen(true);
  };

  const openRestockModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setRestockAmount(1);
    setIsRestockOpen(true);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <div style={{ padding: '24px', backgroundColor: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-primary)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Showroom Control</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome, {user?.name} ({user?.role})</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {isAdmin && (
            <button onClick={openAddModal} className="authButton" style={{ width: 'auto', padding: '10px 18px' }}>
              <Plus size={18} />
              Add Vehicle
            </button>
          )}
          <button onClick={logout} className="authButton" style={{ width: 'auto', padding: '10px 18px', backgroundColor: 'var(--border-color)' }}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      <section style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', padding: '24px', marginBottom: '32px' }}>
        <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'end' }}>
          <div className="formGroup" style={{ marginBottom: 0 }}>
            <label className="formLabel">Make</label>
            <input type="text" className="formInput" placeholder="Toyota, Ford..." value={searchMake} onChange={e => setSearchMake(e.target.value)} style={{ padding: '10px 12px' }} />
          </div>
          <div className="formGroup" style={{ marginBottom: 0 }}>
            <label className="formLabel">Model</label>
            <input type="text" className="formInput" placeholder="Camry, Mustang..." value={searchModel} onChange={e => setSearchModel(e.target.value)} style={{ padding: '10px 12px' }} />
          </div>
          <div className="formGroup" style={{ marginBottom: 0 }}>
            <label className="formLabel">Category</label>
            <input type="text" className="formInput" placeholder="Sedan, SUV..." value={searchCategory} onChange={e => setSearchCategory(e.target.value)} style={{ padding: '10px 12px' }} />
          </div>
          <div className="formGroup" style={{ marginBottom: 0 }}>
            <label className="formLabel">Min Price</label>
            <input type="number" className="formInput" placeholder="0" value={minPrice} onChange={e => setMinPrice(e.target.value)} style={{ padding: '10px 12px' }} />
          </div>
          <div className="formGroup" style={{ marginBottom: 0 }}>
            <label className="formLabel">Max Price</label>
            <input type="number" className="formInput" placeholder="100000" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} style={{ padding: '10px 12px' }} />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" className="authButton" style={{ padding: '10px' }}>
              <Search size={18} />
            </button>
            <button type="button" onClick={handleResetSearch} className="authButton" style={{ padding: '10px', backgroundColor: 'var(--border-color)' }}>
              <RefreshCw size={18} />
            </button>
          </div>
        </form>
      </section>

      <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {vehicles.length === 0 ? (
          <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-secondary)' }}>No vehicles matching your query</p>
        ) : (
          vehicles.map((v) => (
            <div key={v._id} className="authCard" style={{ padding: '24px', maxWidth: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '320px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--accent-color)', fontWeight: 600, letterSpacing: '0.05em' }}>{v.category}</span>
                  <span style={{ fontSize: '0.9rem', color: v.quantity > 0 ? 'var(--success-color)' : 'var(--error-color)', fontWeight: 600 }}>
                    {v.quantity > 0 ? `${v.quantity} in stock` : 'Out of stock'}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{v.make} {v.model}</h3>
                <p style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', margin: '16px 0' }}>${v.price.toLocaleString()}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button onClick={() => handlePurchase(v._id)} disabled={v.quantity <= 0} className="authButton" style={{ backgroundColor: v.quantity > 0 ? 'var(--accent-color)' : 'var(--border-color)' }}>
                  <ShoppingBag size={18} />
                  Purchase
                </button>

                {isAdmin && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '4px' }}>
                    <button onClick={() => openEditModal(v)} className="authButton" style={{ padding: '8px', backgroundColor: 'var(--border-color)' }}>
                      <Edit3 size={16} />
                    </button>
                    <button onClick={() => openRestockModal(v)} className="authButton" style={{ padding: '8px', backgroundColor: 'var(--border-color)' }}>
                      <PlusCircle size={16} />
                    </button>
                    <button onClick={() => handleDelete(v._id)} className="authButton" style={{ padding: '8px', backgroundColor: 'rgba(239, 68, 68, 0.2)', border: '1px solid var(--error-color)', color: 'var(--error-color)' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </main>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="authCard" style={{ width: '480px' }}>
            <h2 className="authTitle" style={{ marginBottom: '24px' }}>{selectedVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
            <form onSubmit={handleSaveVehicle}>
              <div className="formGroup">
                <label className="formLabel">Make</label>
                <input type="text" required className="formInput" placeholder="e.g. Ford" value={formData.make} onChange={e => setFormData({ ...formData, make: e.target.value })} style={{ padding: '10px 12px' }} />
              </div>
              <div className="formGroup">
                <label className="formLabel">Model</label>
                <input type="text" required className="formInput" placeholder="e.g. Focus" value={formData.model} onChange={e => setFormData({ ...formData, model: e.target.value })} style={{ padding: '10px 12px' }} />
              </div>
              <div className="formGroup">
                <label className="formLabel">Category</label>
                <input type="text" required className="formInput" placeholder="e.g. Hatchback" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={{ padding: '10px 12px' }} />
              </div>
              <div className="formGroup">
                <label className="formLabel">Price ($)</label>
                <input type="number" required className="formInput" value={formData.price} onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })} style={{ padding: '10px 12px' }} />
              </div>
              <div className="formGroup">
                <label className="formLabel">Quantity</label>
                <input type="number" required className="formInput" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })} style={{ padding: '10px 12px' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" className="authButton">Save</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="authButton" style={{ backgroundColor: 'var(--border-color)' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isRestockOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="authCard" style={{ width: '400px' }}>
            <h2 className="authTitle" style={{ marginBottom: '24px' }}>Restock Vehicle</h2>
            <form onSubmit={handleRestock}>
              <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>Restocking: <strong>{selectedVehicle?.make} {selectedVehicle?.model}</strong></p>
              <div className="formGroup">
                <label className="formLabel">Quantity to Add</label>
                <input type="number" required min="1" className="formInput" value={restockAmount} onChange={e => setRestockAmount(parseInt(e.target.value))} style={{ padding: '10px 12px' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" className="authButton">Restock</button>
                <button type="button" onClick={() => setIsRestockOpen(false)} className="authButton" style={{ backgroundColor: 'var(--border-color)' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
