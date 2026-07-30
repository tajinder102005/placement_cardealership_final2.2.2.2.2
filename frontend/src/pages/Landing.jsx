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
      setStats({
        models: data.length,
        inStock: data.reduce((s, v) => s + v.quantity, 0),
        soldOut: data.filter((v) => v.quantity === 0).length,
        floorValue: `$${data.reduce((s, v) => s + Number(v.price) * v.quantity, 0).toLocaleString()}`
      });
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1800&q=60')] bg-cover bg-center opacity-[0.12]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/50 to-[#0a0a0a]" />
        </div>

        <div className="absolute right-[20%] top-0 h-[600px] w-px origin-top rotate-[20deg] bg-gradient-to-b from-orange-500/30 via-orange-500/5 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-24 md:pt-32">
          <div className="max-w-xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/[0.06] px-3.5 py-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500" />
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-orange-400">
                Live inventory
              </span>
            </div>

            <h1 className="mb-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-white md:text-[52px]">
              Every vehicle{' '}
              <span className="text-orange-400">on the floor,</span>
              <br />
              tracked in real time.
            </h1>

            <p className="mb-10 max-w-md text-[15px] leading-relaxed text-[#888]">
              Torque Motors keeps stock, pricing and sales in sync. Browse the
              showroom, filter down to the exact spec, and purchase the moment
              a unit is available.
            </p>

            <Link
              to="/showroom"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-orange-500 px-7 text-[13px] font-semibold text-white no-underline transition-all duration-200 hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/15 active:scale-[0.98]"
            >
              Browse inventory
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-2 gap-3 md:grid-cols-4">
            <StatCard label="Models" value={stats.models} />
            <StatCard label="Units in stock" value={stats.inStock} />
            <StatCard label="Sold out" value={stats.soldOut} />
            <StatCard label="Floor value" value={stats.floorValue} />
          </div>
        </div>
      </div>

      <footer className="border-t border-white/[0.04] py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 text-[11px] text-[#444]">
          <span>🚗 Torque Motors — dealership inventory system</span>
          <span>Built as a TDD kata · REST API + React SPA</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
