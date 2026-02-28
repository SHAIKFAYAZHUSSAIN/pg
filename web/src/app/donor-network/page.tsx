"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Droplet, User, Loader2, Phone } from 'lucide-react';

interface Donor {
    name: string;
    blood_group: string;
    hemoglobin: number;
    phone_number: string;
    location: string;
    available: boolean;
}

export default function DonorNetwork() {
    const [donors, setDonors] = useState<Donor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState('');
    const [filterGroup, setFilterGroup] = useState('All');

    useEffect(() => {
        fetch('http://127.0.0.1:5000/emergency')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch donor list');
                return res.json();
            })
            .then(data => {
                setDonors(data);
                setError(null);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const bloodGroups = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    const filteredDonors = donors.filter(d => {
        const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase());
        const matchesGroup = filterGroup === 'All' || d.blood_group === filterGroup;
        return matchesSearch && matchesGroup;
    });

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-8"
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
                            <Droplet className="text-red-600" size={32} />
                            Donor Network
                        </h1>
                        <p className="text-sm text-slate-500 font-medium mt-1">
                            Active donor repository for emergency hemorrhage cases.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 flex-1 justify-end">
                        {/* Search */}
                        <div className="relative w-full sm:w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                className="floating-input pl-10 h-full"
                                placeholder="Search donors..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* Filter */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Filter className="h-4 w-4 text-slate-400" />
                            </div>
                            <select
                                className="floating-input pl-10 pr-8 appearance-auto bg-white/60 h-full"
                                value={filterGroup}
                                onChange={(e) => setFilterGroup(e.target.value)}
                            >
                                {bloodGroups.map(bg => (
                                    <option key={bg} value={bg}>{bg}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Grid */}
            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center items-center h-48">
                        <Loader2 className="animate-spin text-blue-600" size={48} />
                    </motion.div>
                ) : error ? (
                    <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center font-medium">
                        {error}
                    </motion.div>
                ) : filteredDonors.length === 0 ? (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white/50 p-12 rounded-2xl border border-dashed border-slate-300 text-center">
                        <p className="text-slate-500 font-medium">No donors found matching criteria.</p>
                    </motion.div>
                ) : (
                    <motion.div layout key="grid" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredDonors.map((donor, idx) => (
                                <motion.div
                                    key={idx}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                    className="glass-panel p-6 border border-white/60 flex flex-col justify-between hover:border-blue-200/50 hover:shadow-2xl transition-all group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-slate-100 text-slate-600 p-2.5 rounded-full group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800 text-lg">{donor.name}</h3>
                                                <p className={`text-xs font-bold uppercase ${donor.available ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                    {donor.available ? 'Available' : 'Unavailable'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className={`font-black text-xl py-1 px-3 rounded-lg shadow-sm border ${donor.blood_group.includes('-')
                                            ? 'bg-rose-100 text-rose-700 border-rose-200'
                                            : 'bg-indigo-100 text-indigo-700 border-indigo-200'
                                            }`}>
                                            {donor.blood_group}
                                        </div>
                                    </div>

                                    <div className="bg-white/60 p-3 rounded-xl border border-white/50 flex justify-between items-center text-sm font-semibold text-slate-600 mb-4">
                                        <span>Hemoglobin Level</span>
                                        <span className="text-slate-900 bg-white px-2 py-0.5 rounded shadow-sm">{donor.hemoglobin} g/dL</span>
                                    </div>

                                    <a
                                        href={donor.available ? `tel:${donor.phone_number}` : undefined}
                                        className={`w-full flex justify-center items-center gap-2 font-bold py-2.5 px-4 rounded-xl shadow-sm text-sm transition-all text-white ${donor.available ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-500/30' : 'bg-slate-300 shadow-none pointer-events-none cursor-not-allowed'}`}
                                    >
                                        <Phone size={16} />
                                        {donor.phone_number || "No Contact"}
                                    </a>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
