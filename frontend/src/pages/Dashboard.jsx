import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import {
  LogOut, Plus, Trash2, Edit3, ShoppingBag, PackagePlus,
  Search, RefreshCw, Car, Upload, Link2, Layers, Package, AlertTriangle, DollarSign
} from 'lucide-react';
import './AuthStyles.css';

const CATEGORY_COLORS = {
  Sports: '#f59e0b', SUV: '#10b981', Sedan: '#6366f1',
  Electric: '#06b6d4', Truck: '#8b5cf6', Hatchback: '#ec4899',
  Convertible: '#f97316'
};

const EMPTY_FORM = { make: '', model: '', category: '', year: new Date().getFullYear(), price: '', quantity: '', description: '', image_url: '' };

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [imageMode, setImageMode] = useState('url');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [availableOnly, setAvailableOnly] = useState(false);

  const isAdmin = user?.role === 'admin';

  const fetchVehicles = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);
    let query = supabase.from('vehicles').select('*');
    
    if (searchQuery) query = query.or(`make.ilike.%${searchQuery}%,model.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`);
    if (searchCategory) query = query.ilike('category', `%${searchCategory}%`);
    if (minPrice) query = query.gte('price', parseFloat(minPrice));
    if (maxPrice) query = query.lte('price', parseFloat(maxPrice));
    if (availableOnly) query = query.gt('quantity', 0);

    if (sortOrder === 'newest') query = query.order('created_at', { ascending: false });
    else if (sortOrder === 'price-asc') query = query.order('price', { ascending: true });
    else if (sortOrder === 'price-desc') query = query.order('price', { ascending: false });

    const { data, error } = await query;
    if (error) toast.error('Search failed: ' + error.message);
    else setVehicles(data || []);
    setLoading(false);
  };
  const handleSearch = fetchVehicles;

  useEffect(() => {
    const delay = setTimeout(() => { fetchVehicles(); }, 400);
    return () => clearTimeout(delay);
  }, [searchQuery, searchCategory, minPrice, maxPrice, sortOrder, availableOnly]);

  const handleResetSearch = () => {
    setSearchQuery(''); setSearchCategory('');
    setMinPrice(''); setMaxPrice('');
    setSortOrder('newest'); setAvailableOnly(false);
  };

  const handlePurchase = async (vehicleId) => {
    setVehicles(prev => prev.map(v => v.id === vehicleId ? { ...v, quantity: Math.max(0, (v.quantity || 0) - 1) } : v));
    const { error } = await supabase.rpc('purchase_vehicle', { _vehicle_id: vehicleId, _quantity: 1 });
    if (error) { toast.error(error.message); fetchVehicles(); return; }
    toast.success('Purchase successful!');
  };

  const handleRestock = async (vehicleId) => {
    setVehicles(prev => prev.map(v => v.id === vehicleId ? { ...v, quantity: (v.quantity || 0) + 1 } : v));
    const { error } = await supabase.rpc('restock_vehicle', { _vehicle_id: vehicleId, _quantity: 1 });
    if (error) { toast.error(error.message); fetchVehicles(); return; }
    toast.success('Added 1 unit to stock!');
  };

  const uploadImage = async () => {
    if (!imageFile) return formData.image_url;
    setUploading(true);
    const ext = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage
      .from('vehicle-images')
      .upload(fileName, imageFile, { cacheControl: '3600', upsert: false });
    setUploading(false);
    if (error) { toast.error('Image upload failed: ' + error.message); return formData.image_url; }
    const { data: { publicUrl } } = supabase.storage.from('vehicle-images').getPublicUrl(data.path);
    return publicUrl;
  };

  const handleSaveVehicle = async (e) => {
    e.preventDefault();
    const imageUrl = await uploadImage();
    const payload = {
      make: formData.make, model: formData.model, category: formData.category,
      year: parseInt(formData.year), price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity), description: formData.description,
      image_url: imageUrl || null,
      created_by: user.id
    };

    let error;
    if (selectedVehicle) {
      ({ error } = await supabase.from('vehicles').update(payload).eq('id', selectedVehicle.id));
    } else {
      ({ error } = await supabase.from('vehicles').insert(payload));
    }
    if (error) { toast.error(error.message); return; }
    toast.success(selectedVehicle ? 'Vehicle updated!' : 'Vehicle added!');
    setIsModalOpen(false);
    fetchVehicles();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vehicle permanently?')) return;
    setVehicles(prev => prev.filter(v => v.id !== id));
    const { error } = await supabase.from('vehicles').delete().eq('id', id);
    if (error) { toast.error(error.message); fetchVehicles(); return; }
    toast.success('Vehicle deleted');
  };

  const openAdd = () => {
    setSelectedVehicle(null);
    setFormData(EMPTY_FORM);
    setImageFile(null); setImagePreview(''); setImageMode('url');
    setIsModalOpen(true);
  };

  const openEdit = (v) => {
    setSelectedVehicle(v);
    setFormData({ make: v.make, model: v.model, category: v.category, year: v.year, price: v.price, quantity: v.quantity, description: v.description || '', image_url: v.image_url || '' });
    setImageFile(null); setImagePreview(v.image_url || ''); setImageMode('url');
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  useEffect(() => { fetchVehicles(); }, []);

  const modelsListed = vehicles.length;
  const unitsInStock = vehicles.reduce((sum, v) => sum + (v.quantity || 0), 0);
  const soldOut = vehicles.filter(v => v.quantity <= 0).length;
  const rawFloorValue = vehicles.reduce((sum, v) => sum + (v.price * (v.quantity || 0)), 0);
  const floorValue = rawFloorValue >= 1000000 
    ? '$' + (rawFloorValue / 1000000).toFixed(2) + 'M' 
    : rawFloorValue >= 1000 
      ? '$' + (rawFloorValue / 1000).toFixed(1) + 'k' 
      : '$' + rawFloorValue;

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-primary)' }}>

      <header style={{ padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-secondary)', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(10px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Car size={28} style={{ color: 'var(--accent-color)' }} />
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(135deg, #d4af37, #fcd555)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>AutoDrive Showroom</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: 0 }}>Welcome, <strong style={{ color: 'var(--text-secondary)' }}>{user?.name}</strong> · <span style={{ color: user?.role === 'admin' ? '#f59e0b' : 'var(--accent-color)', textTransform: 'capitalize' }}>{user?.role}</span></p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {isAdmin && (
            <button onClick={openAdd} className="authButton" style={{ width: 'auto', padding: '9px 18px', fontSize: '0.88rem' }}>
              <Plus size={16} /> Add Vehicle
            </button>
          )}
          <button onClick={logout} className="authButton" style={{ width: 'auto', padding: '9px 18px', fontSize: '0.88rem', backgroundColor: 'transparent', border: '1px solid var(--border-color)' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <div style={{
        position: 'relative',
        padding: '60px 32px 40px',
        backgroundImage: 'url("https://f1rst-motors.s3.me-central-1.amazonaws.com/cars/1749892604112-_DSC0296.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.70) 0%, rgba(17,14,5,0.80) 100%)',
          zIndex: 0
        }} />
        
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '40px', maxWidth: '700px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--accent-color)', letterSpacing: '0.03em', marginBottom: '16px', background: 'rgba(20,17,10,0.6)', padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-color)' }}></span> Torque Motors Showroom
            </div>
            <h1 style={{ fontSize: '3.2rem', fontWeight: 700, margin: '0 0 16px', lineHeight: 1.1, fontFamily: 'Oswald, sans-serif', textTransform: 'uppercase' }}>
              Every vehicle <span style={{ color: 'var(--accent-color)' }}>on the floor</span>, tracked in real time.
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, margin: 0 }}>
              Torque Motors keeps stock, pricing and sales in sync. Browse the showroom, filter down to the exact spec, and purchase the moment a unit is available.
            </p>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '16px' }}>Showroom overview</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'rgba(212, 175, 55, 0.1)', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)' }}>
                <Layers size={18} />
              </div>
              <div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: 1 }}>{modelsListed}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '8px' }}>Models listed</div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'rgba(212, 175, 55, 0.1)', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)' }}>
                <Package size={18} />
              </div>
              <div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: 1 }}>{unitsInStock}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '8px' }}>Units in stock</div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'rgba(212, 175, 55, 0.1)', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)' }}>
                <AlertTriangle size={18} />
              </div>
              <div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: 1 }}>{soldOut}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '8px' }}>Sold out</div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'rgba(212, 175, 55, 0.1)', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)' }}>
                <DollarSign size={18} />
              </div>
              <div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: 1 }}>{floorValue}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '8px' }}>Floor value</div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '60px 32px 32px' }}>
        <section style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', marginBottom: '28px', maxWidth: '1200px', margin: '0 auto 28px' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Top Row */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div className="formGroup" style={{ flex: '2', minWidth: '280px', marginBottom: 0 }}>
                <label className="formLabel" style={{ fontSize: '0.75rem' }}>SEARCH</label>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="text" className="formInput" placeholder="Search by make, model or category" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ padding: '9px 12px 9px 36px' }} />
                </div>
              </div>

              <div className="formGroup" style={{ flex: '1', minWidth: '160px', marginBottom: 0 }}>
                <label className="formLabel" style={{ fontSize: '0.75rem' }}>CATEGORY</label>
                <select className="formInput" value={searchCategory || ''} onChange={e => setSearchCategory(e.target.value)} style={{ padding: '9px 12px', cursor: 'pointer', appearance: 'auto' }}>
                  <option value="">All categories</option>
                  <option value="Sports">Sports</option>
                  <option value="SUV">SUV</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Electric">Electric</option>
                  <option value="Truck">Truck</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Convertible">Convertible</option>
                  <option value="Hypercar">Hypercar</option>
                </select>
              </div>

              <div className="formGroup" style={{ flex: '1.2', minWidth: '200px', marginBottom: 0 }}>
                <label className="formLabel" style={{ fontSize: '0.75rem' }}>PRICE RANGE</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="number" className="formInput" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} style={{ padding: '9px 12px' }} />
                  <span style={{ color: 'var(--text-muted)' }}>-</span>
                  <input type="number" className="formInput" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} style={{ padding: '9px 12px' }} />
                </div>
              </div>

              <div className="formGroup" style={{ flex: '1', minWidth: '140px', marginBottom: 0 }}>
                <label className="formLabel" style={{ fontSize: '0.75rem' }}>SORT</label>
                <select className="formInput" value={sortOrder} onChange={e => setSortOrder(e.target.value)} style={{ padding: '9px 12px', cursor: 'pointer', appearance: 'auto' }}>
                  <option value="newest">Newest first</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Bottom Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <input type="checkbox" checked={availableOnly} onChange={e => setAvailableOnly(e.target.checked)} style={{ appearance: 'none', width: '40px', height: '22px', backgroundColor: availableOnly ? 'var(--accent-color)' : 'var(--bg-tertiary)', borderRadius: '20px', position: 'relative', outline: 'none', cursor: 'pointer', transition: 'background-color 0.2s', padding: 0, margin: 0, border: '1px solid var(--border-color)' }} className="toggleSwitch" />
                Available only
              </label>

              <button type="button" onClick={handleResetSearch} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>
                <span style={{ fontSize: '1.2rem', lineHeight: 0, marginTop: '-2px' }}>&times;</span> Clear filters
              </button>
            </div>
            
            <style>{`.toggleSwitch::after { content: ''; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; background-color: ${availableOnly ? '#1a0d02' : 'var(--text-muted)'}; border-radius: 50%; transition: transform 0.2s; transform: translateX(${availableOnly ? '18px' : '0'}); }`}</style>
          </form>
        </section>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-secondary)' }}>Loading vehicles...</div>
        ) : (
          <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            {vehicles.length === 0 ? (
              <p style={{ textAlign: 'center', gridColumn: '1/-1', color: 'var(--text-muted)', padding: '60px 0' }}>No vehicles found.</p>
            ) : vehicles.map((v) => {
              const catColor = CATEGORY_COLORS[v.category] || 'var(--accent-color)';
              return (
                <div key={v.id} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.5)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>

                  {v.image_url ? (
                    <div style={{ height: '180px', overflow: 'hidden' }}>
                      <img src={v.image_url} alt={`${v.make} ${v.model}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
                    </div>
                  ) : (
                    <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-tertiary)' }}>
                      <Car size={48} style={{ color: 'var(--border-color)' }} />
                    </div>
                  )}

                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: catColor, fontWeight: 700, letterSpacing: '0.08em', background: `${catColor}18`, padding: '3px 10px', borderRadius: '999px' }}>{v.category}</span>
                        <span style={{ fontSize: '0.8rem', color: v.quantity > 0 ? 'var(--success-color)' : 'var(--error-color)', fontWeight: 600 }}>
                          {v.quantity > 0 ? `${v.quantity} in stock` : 'Out of stock'}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 2px' }}>{v.make} {v.model}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '10px' }}>{v.year}</p>
                      {v.description && <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '12px', lineHeight: 1.5 }}>{v.description}</p>}
                      <p style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 16px' }}>${Number(v.price).toLocaleString()}</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <button onClick={() => handlePurchase(v.id)} disabled={v.quantity <= 0} className="authButton"
                        style={{ backgroundColor: v.quantity > 0 ? 'var(--accent-color)' : 'var(--border-color)', cursor: v.quantity <= 0 ? 'not-allowed' : 'pointer' }}>
                        <ShoppingBag size={16} /> {v.quantity <= 0 ? 'Out of Stock' : 'Purchase'}
                      </button>
                      {isAdmin && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                          <button onClick={() => openEdit(v)} className="authButton" style={{ padding: '7px', backgroundColor: 'var(--border-color)', fontSize: '0.78rem' }} title="Edit"><Edit3 size={13} /></button>
                          <button onClick={() => handleRestock(v.id)} className="authButton" style={{ padding: '7px', backgroundColor: 'var(--border-color)', fontSize: '0.78rem' }} title="Instant Restock (+1)"><PackagePlus size={13} /></button>
                          <button onClick={() => handleDelete(v.id)} className="authButton" style={{ padding: '7px', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid var(--error-color)', color: 'var(--error-color)', fontSize: '0.78rem' }} title="Delete"><Trash2 size={13} /></button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </main>
        )}
      </div>

      <footer style={{ 
        borderTop: '1px solid var(--border-color)', 
        padding: '32px 24px', 
        marginTop: '20px',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'var(--bg-secondary)',
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        fontWeight: 600
      }}>
        Made by TAJINDER SINGH (THE IMMACULATE DEVELOPER)
      </footer>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(6px)', padding: '20px' }}>
          <div className="authCard" style={{ width: '520px', maxHeight: '92vh', overflowY: 'auto' }}>
            <h2 className="authTitle" style={{ marginBottom: '24px' }}>{selectedVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
            <form onSubmit={handleSaveVehicle}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  { label: 'Make', key: 'make', ph: 'e.g. Porsche', t: 'text' },
                  { label: 'Model', key: 'model', ph: 'e.g. 911', t: 'text' },
                  { label: 'Category', key: 'category', ph: 'e.g. Sports', t: 'text' },
                  { label: 'Year', key: 'year', ph: '2024', t: 'number' },
                  { label: 'Price ($)', key: 'price', ph: '50000', t: 'number' },
                  { label: 'Quantity', key: 'quantity', ph: '5', t: 'number' },
                ].map(({ label, key, ph, t }) => (
                  <div className="formGroup" key={key} style={{ marginBottom: 0 }}>
                    <label className="formLabel">{label}</label>
                    <input type={t} required className="formInput" placeholder={ph} value={formData[key]}
                      onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                      style={{ padding: '9px 12px' }} />
                  </div>
                ))}
              </div>

              <div className="formGroup" style={{ marginTop: '16px' }}>
                <label className="formLabel">Description</label>
                <textarea className="formInput" placeholder="Brief vehicle description..." rows={2}
                  value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                  style={{ padding: '9px 12px', resize: 'vertical', minHeight: '64px' }} />
              </div>

              <div className="formGroup" style={{ marginTop: '8px' }}>
                <label className="formLabel">Vehicle Image</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  <button type="button" onClick={() => setImageMode('url')} style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, background: imageMode === 'url' ? 'var(--accent-color)' : 'var(--border-color)', color: 'white' }}>
                    <Link2 size={13} style={{ marginRight: 5 }} />URL
                  </button>
                  <button type="button" onClick={() => setImageMode('file')} style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, background: imageMode === 'file' ? 'var(--accent-color)' : 'var(--border-color)', color: 'white' }}>
                    <Upload size={13} style={{ marginRight: 5 }} />Upload File
                  </button>
                </div>
                {imageMode === 'url' ? (
                  <input type="url" className="formInput" placeholder="https://example.com/car.jpg"
                    value={formData.image_url} onChange={e => { setFormData({ ...formData, image_url: e.target.value }); setImagePreview(e.target.value); }}
                    style={{ padding: '9px 12px' }} />
                ) : (
                  <div style={{ border: '2px dashed var(--border-color)', borderRadius: 'var(--border-radius)', padding: '20px', textAlign: 'center', cursor: 'pointer', backgroundColor: 'var(--bg-tertiary)' }}
                    onClick={() => fileRef.current?.click()}>
                    <Upload size={24} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>{imageFile ? imageFile.name : 'Click to choose image file'}</p>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                  </div>
                )}
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" style={{ marginTop: '10px', width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px' }} onError={e => e.target.style.display = 'none'} />
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" className="authButton" disabled={uploading}>{uploading ? 'Uploading...' : 'Save Vehicle'}</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="authButton" style={{ backgroundColor: 'var(--border-color)' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
