import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';

const Landing = () => {
  const [stats, setStats] = useState({ models: 0, inStock: 0, soldOut: 0, floorValue: '$0' });

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await supabase.from('vehicles').select('*');
      if (!data) return;
      const models = data.length;
      const inStock = data.reduce((s, v) => s + v.quantity, 0);
      const soldOut = data.filter((v) => v.quantity === 0).length;
      const floorValue = data.reduce((s, v) => s + Number(v.price) * v.quantity, 0);
      setStats({
        models,
        inStock,
        soldOut,
        floorValue: `$${floorValue.toLocaleString()}`
      });
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1800&q=60')] bg-cover bg-center opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/60 to-transparent" />

        <div className="absolute right-[15%] top-[10%] h-[500px] w-[1px] origin-top rotate-[25deg] bg-gradient-to-b from-orange-500/40 via-orange-500/10 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 md:pt-32">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/5 px-4 py-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-orange-500">
                Live inventory
              </span>
            </div>

            <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
              Every vehicle{' '}
              <span className="text-orange-500">on the floor,</span>
              <br />
              tracked in real time.
            </h1>

            <p className="mb-8 max-w-lg text-lg leading-relaxed text-gray-400">
              Torque Motors keeps stock, pricing and sales in sync. Browse the
              showroom, filter down to the exact spec, and purchase the moment
              a unit is available.
            </p>

            <Link
              to="/showroom"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-7 py-3.5 text-sm font-semibold text-white no-underline transition-all hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/20 active:scale-[0.98]"
            >
              Browse inventory
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            <StatCard label="Models" value={stats.models} />
            <StatCard label="Units in stock" value={stats.inStock} />
            <StatCard label="Sold out" value={stats.soldOut} />
            <StatCard label="Floor value" value={stats.floorValue} />
          </div>
        </div>
      </div>

      <footer className="border-t border-white/5 py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 text-xs text-gray-500">
          <span>🚗 Torque Motors — dealership inventory system</span>
          <span>Built as a TDD kata · REST API + React SPA</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
