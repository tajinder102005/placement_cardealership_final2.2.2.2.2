import React from 'react';

const StatCard = ({ label, value }) => (
  <div className="rounded-xl border border-white/[0.06] bg-[#111] px-5 py-4">
    <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#555]">
      {label}
    </p>
    <p className="text-xl font-bold tracking-tight text-white">{value}</p>
  </div>
);

export default StatCard;
