"use client";

import { motion } from 'framer-motion';
import { Users, AlertTriangle, Droplets, Activity } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Donor {
  name: string;
  blood_group: string;
  hemoglobin: number;
  available: boolean;
}

export default function Dashboard() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [emergencyActive, setEmergencyActive] = useState(false);

  // Fake total risks since we don't have an endpoint for it
  const highRiskCount = 4;

  useEffect(() => {
    fetch('http://127.0.0.1:5000/emergency')
      .then(res => res.json())
      .then(data => {
        setDonors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const totalDonors = donors.length;
  const availableDonors = donors.filter(d => d.available).length;

  const cards = [
    { title: 'Total Registered Donors', value: loading ? '...' : totalDonors, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100', link: '/donor-network' },
    { title: 'High Risk Cases (Demo)', value: highRiskCount, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100', link: '/risk-assessment' },
    { title: 'Available Donors', value: loading ? '...' : availableDonors, icon: Droplets, color: 'text-emerald-600', bg: 'bg-emerald-100', link: '/donor-network' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">System Overview</h1>
          <p className="text-slate-500 font-medium mt-1">Monitor maternal risk factors and donor network in real-time.</p>
        </div>
        <Link
          href="/risk-assessment"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all hover:scale-105"
        >
          <Activity size={20} />
          New Assessment
        </Link>
      </motion.div>

      {/* Grid Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-panel p-6 flex flex-col justify-between h-40 group hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <span className="text-slate-600 font-bold uppercase tracking-wide text-xs">{card.title}</span>
              <div className={`p-2.5 rounded-xl ${card.bg} ${card.color}`}>
                <card.icon size={20} />
              </div>
            </div>
            <div className="flex justify-between items-end mt-4">
              <h2 className={`text-4xl font-black ${card.color} drop-shadow-sm`}>{card.value}</h2>
              <Link href={card.link} className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">View →</Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Hero Interactive */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="glass-panel p-8 mt-8 border-l-4 border-l-blue-600"
      >
        <h3 className="text-xl font-bold text-slate-800 mb-2">AI-Powered Predictions</h3>
        <p className="text-slate-600 leading-relaxed max-w-2xl text-sm">
          PG - PulseGuard relies on clinical metrics such as Blood Pressure, Glucose levels, and Heart Rate to dynamically estimate Hemorrhage and maternal risk levels. By connecting patients with an actively monitored, real-time donor network, we expedite emergency care protocols.
        </p>
      </motion.div>

      {/* Emergency Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-red-50/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-red-200 shadow-sm relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <AlertTriangle size={150} />
        </div>
        <div className="flex justify-between items-start mb-6 align-top">
          <div>
            <h2 className="text-2xl font-bold text-red-900 mb-1 flex items-center gap-2">
              <AlertTriangle size={24} className="text-red-600" /> Emergency Mode
            </h2>
            <p className="text-sm text-red-700/80">Activate in case of severe hemorrhage or urgent bleeding</p>
          </div>
        </div>

        <motion.button
          onClick={() => setEmergencyActive(!emergencyActive)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full font-bold py-4 px-6 rounded-xl shadow-[0_0_20px] transition-all flex items-center justify-center gap-3 relative z-10 text-white ${emergencyActive ? 'bg-slate-700 shadow-slate-500/40 hover:bg-slate-800' : 'bg-red-600 hover:bg-red-700 shadow-red-500/40 hover:shadow-red-500/60'}`}
        >
          {emergencyActive ? <Activity /> : <Droplets />}
          {emergencyActive ? 'Dismiss Emergency Mode' : 'Hemorrhage Alert! FIND DONORS NOW'}
        </motion.button>

        {emergencyActive && donors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6 space-y-3 relative z-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <div className="col-span-full">
              <h4 className="text-sm font-bold text-red-800 uppercase tracking-wider mb-1">Available Blood Donors: Urgent Dispatch</h4>
            </div>
            {donors.filter(d => d.available).slice(0, 6).map((donor, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-4 rounded-xl flex flex-col justify-between border border-red-100 shadow-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-base font-bold text-slate-800">{donor.name}</p>
                    <p className="text-xs text-slate-500">Hb: <span className="font-semibold text-slate-700">{donor.hemoglobin} g/dL</span></p>
                  </div>
                  <div className="bg-red-100 text-red-700 px-3 py-1 rounded-lg font-black text-sm text-center">
                    {donor.blood_group}
                  </div>
                </div>
                <button className="w-full text-sm font-semibold px-3 py-2 bg-red-50 text-red-600 rounded-lg border border-red-100/50 hover:bg-red-600 hover:text-white transition-colors">
                  Dispatch Contact
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.section>
    </div>
  );
}
