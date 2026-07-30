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

  const [searchMake, setSearchMake] = useState('');
  const [searchModel, setSearchModel] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const isAdmin = user?.role === 'admin';

  const fetchVehicles = async () => {
    setLoading(true);
    let query = supabase.from('vehicles').select('*').order('created_at', { ascending: false });
    const { data, error } = await query;
    if (error) toast.error('Failed to load vehicles: ' + error.message);
    else setVehicles(data || []);
    setLoading(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    let query = supabase.from('vehicles').select('*');
    if (searchMake) query = query.ilike('make', `%${searchMake}%`);
    if (searchModel) query = query.ilike('model', `%${searchModel}%`);
    if (searchCategory) query = query.ilike('category', `%${searchCategory}%`);
    if (minPrice) query = query.gte('price', parseFloat(minPrice));
    if (maxPrice) query = query.lte('price', parseFloat(maxPrice));
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) toast.error('Search failed');
    else setVehicles(data || []);
    setLoading(false);
  };

  const handleResetSearch = () => {
    setSearchMake(''); setSearchModel(''); setSearchCategory('');
    setMinPrice(''); setMaxPrice('');
    fetchVehicles();
  };

  const handlePurchase = async (vehicleId) => {
    const { error } = await supabase.rpc('purchase_vehicle', { _vehicle_id: vehicleId, _quantity: 1 });
    if (error) { toast.error(error.message); return; }
    toast.success('Purchase successful!');
    fetchVehicles();
  };

  const handleRestock = async (vehicleId) => {
    const { error } = await supabase.rpc('restock_vehicle', {
      _vehicle_id: vehicleId,
      _quantity: 1
    });
    if (error) { toast.error(error.message); return; }
    toast.success('Added 1 unit to stock!');
    fetchVehicles();
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
    const { error } = await supabase.from('vehicles').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Vehicle deleted');
    fetchVehicles();
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

      <div style={{ padding: '28px 32px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '6px' }}>Showroom overview</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px' }}>Welcome back, {user?.name?.split(' ')[0]} — here's how the lot is looking today.</p>
          
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

        <section style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', padding: '20px', marginBottom: '28px' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '12px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Search & Filter</p>
          <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', alignItems: 'end' }}>
            {[
              { label: 'Make', v: searchMake, s: setSearchMake, ph: 'e.g. BMW' },
              { label: 'Model', v: searchModel, s: setSearchModel, ph: 'e.g. M3' },
              { label: 'Category', v: searchCategory, s: setSearchCategory, ph: 'e.g. SUV' },
              { label: 'Min Price', v: minPrice, s: setMinPrice, ph: '0', t: 'number' },
              { label: 'Max Price', v: maxPrice, s: setMaxPrice, ph: '200000', t: 'number' },
            ].map(({ label, v, s, ph, t = 'text' }) => (
              <div key={label} className="formGroup" style={{ marginBottom: 0 }}>
                <label className="formLabel">{label}</label>
                <input type={t} className="formInput" placeholder={ph} value={v} onChange={e => s(e.target.value)} style={{ padding: '9px 12px' }} />
              </div>
            ))}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" className="authButton" style={{ padding: '9px 14px' }}><Search size={16} /></button>
              <button type="button" onClick={handleResetSearch} className="authButton" style={{ padding: '9px 14px', backgroundColor: 'var(--border-color)' }}><RefreshCw size={16} /></button>
            </div>
          </form>
        </section>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-secondary)' }}>Loading vehicles...</div>
        ) : (
          <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
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
