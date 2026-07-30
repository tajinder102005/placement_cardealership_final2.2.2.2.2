import React from 'react';

const StatCard = ({ label, value }) => (
  <div className="rounded-xl border border-white/10 bg-dark-800 px-5 py-4">
    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-500">
      {label}
    </p>
    <p className="text-2xl font-bold text-white">{value}</p>
  </div>
);

export default StatCard;
