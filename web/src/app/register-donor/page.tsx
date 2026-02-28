"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Droplets, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

const API_URL = "http://127.0.0.1:5000";

interface FormInputProps {
    label: string;
    name: string;
    type?: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    options?: string[];
}

const FormField = ({ label, name, type = "text", value, onChange, options }: FormInputProps) => (
    <div className="relative z-0 w-full mb-6 group">
        {type === "select" ? (
            <select
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                className="block py-3 px-0 w-full text-sm text-slate-800 bg-transparent border-0 border-b-2 border-slate-300 appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                required
            >
                <option value="" disabled>Select Blood Group</option>
                {options?.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        ) : (
            <input
                type={type}
                name={name}
                id={name}
                className="block py-3 px-0 w-full text-sm text-slate-800 bg-transparent border-0 border-b-2 border-slate-300 appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                placeholder=" "
                required
                value={value}
                onChange={onChange}
                step={type === 'number' ? "0.1" : undefined}
            />
        )}
        <label
            htmlFor={name}
            className="peer-focus:font-medium absolute text-sm text-slate-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 flex items-center gap-1"
        >
            {label}
        </label>
    </div>
);

export default function RegisterDonor() {
    const [formData, setFormData] = useState({
        name: '',
        blood_group: '',
        hemoglobin: '',
        phone_number: '',
        location: '',
        available: true
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!/^[0-9]{10}$/.test(formData.phone_number)) {
            setError("Phone number must be exactly 10 digits.");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const resp = await fetch(`${API_URL}/register-donor`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    hemoglobin: Number(formData.hemoglobin)
                })
            });

            if (!resp.ok) throw new Error('Failed to register donor');

            setSuccess(true);
            setFormData({
                name: '',
                blood_group: '',
                hemoglobin: '',
                phone_number: '',
                location: '',
                available: true
            });

            setTimeout(() => setSuccess(false), 5000);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An error occurred during registration.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-3xl mx-auto z-10 glass-panel border border-white/60 p-0"
        >
            <div className="flex flex-col md:flex-row">

                {/* Left Visual Area */}
                <div className="w-full md:w-2/5 bg-gradient-to-br from-indigo-600 to-blue-700 text-white p-8 sm:p-12 border-r border-white/10 flex flex-col justify-between items-start pt-16">
                    <div className="bg-white/20 p-4 rounded-3xl shadow-lg backdrop-blur-md mb-8">
                        <Droplets size={48} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight mb-4">Save a Life Today.</h2>
                        <p className="text-indigo-100 font-medium text-sm leading-relaxed mb-4">
                            Join the PG PulseGuard donor network to provide emergency critical care.
                        </p>
                    </div>
                </div>

                {/* Right Form Area */}
                <div className="w-full md:w-3/5 p-8 sm:p-12 bg-white/40">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3 tracking-tight">
                            <UserPlus className="text-indigo-600" size={28} />
                            Register Donor
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FormField
                            label="Full Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                        <FormField
                            label="Blood Group"
                            name="blood_group"
                            type="select"
                            options={bloodGroups}
                            value={formData.blood_group}
                            onChange={handleInputChange}
                        />
                        <FormField
                            label="Hemoglobin Level (g/dL)"
                            name="hemoglobin"
                            type="number"
                            value={formData.hemoglobin}
                            onChange={handleInputChange}
                        />
                        <FormField
                            label="Phone Number"
                            name="phone_number"
                            type="tel"
                            value={formData.phone_number}
                            onChange={handleInputChange}
                        />
                        <FormField
                            label="Location (City)"
                            name="location"
                            type="text"
                            value={formData.location}
                            onChange={handleInputChange}
                        />

                        {/* Status Toggle */}
                        <div className="mb-6 group pt-2 px-1">
                            <label className="text-sm text-slate-500 mb-2 block peer-focus:text-indigo-600 transition-colors">Emergency Availability</label>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="available"
                                    checked={formData.available}
                                    onChange={handleInputChange}
                                    className="sr-only peer"
                                />
                                <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
                                <span className={`ml-3 text-sm font-bold ${formData.available ? 'text-emerald-600' : 'text-slate-400'}`}>
                                    {formData.available ? "Active/Available" : "Unavailable (Snoozed)"}
                                </span>
                            </label>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-center gap-2 overflow-hidden">
                                    <AlertCircle size={16} /> {error}
                                </motion.div>
                            )}
                            {success && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm border border-emerald-100 flex items-center gap-2 overflow-hidden shadow-emerald-500/20 shadow-sm">
                                    <CheckCircle size={16} /> Successfully registered donor to PulseGuard Network.
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={loading}
                            type="submit"
                            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4 border border-x-white/20 border-t-white/30 border-b-black/30"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <UserPlus size={18} />}
                            {loading ? 'Submitting...' : 'Complete Registration'}
                        </motion.button>
                    </form>
                </div>
            </div>
        </motion.div>
    );
}
