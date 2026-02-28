"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertTriangle, Loader2, HeartPulse } from 'lucide-react';

interface PredictionRequest {
    Age: number | '';
    SystolicBP: number | '';
    DiastolicBP: number | '';
    "Blood glucose": number | '';
    BodyTemp: number | '';
    HeartRate: number | '';
}

interface PredictionResponse {
    risk: "Low Risk" | "Mid Risk" | "High Risk";
    confidence: number;
    top_factor: string;
}

const API_URL = "http://127.0.0.1:5000";

interface FormInputProps {
    label: string;
    name: string;
    type?: string;
    value: number | string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput = ({ label, name, type = "number", value, onChange }: FormInputProps) => (
    <div className="relative z-0 w-full mb-6 group">
        <input
            type={type}
            name={name}
            id={name}
            className="block py-3 px-0 w-full text-sm text-slate-800 bg-transparent border-0 border-b-2 border-slate-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            value={value}
            onChange={onChange}
            step="any"
        />
        <label
            htmlFor={name}
            className="peer-focus:font-medium absolute text-sm text-slate-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 flex items-center gap-1"
        >
            {label}
        </label>
    </div>
);

export default function RiskAssessment() {
    const [formData, setFormData] = useState<PredictionRequest>({
        Age: '',
        SystolicBP: '',
        DiastolicBP: '',
        "Blood glucose": '',
        BodyTemp: '',
        HeartRate: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [prediction, setPrediction] = useState<PredictionResponse | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value === '' ? '' : Number(value)
        }));
    };

    const handlePredict = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setPrediction(null);
        try {
            const resp = await fetch(`${API_URL}/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (!resp.ok) throw new Error('Failed to fetch prediction');
            const data = await resp.json();
            setPrediction(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An error occurred fetching the backend.");
        } finally {
            setLoading(false);
        }
    };

    const getRiskColor = (risk: string) => {
        if (risk === "Low Risk") return "text-emerald-500 bg-emerald-100/50 shadow-emerald-500/20 shadow-[0_0_30px]";
        if (risk === "Mid Risk") return "text-amber-500 bg-amber-100/50 shadow-[0_0_30px] shadow-amber-500/20";
        return "text-red-600 bg-red-100/50 shadow-[0_0_30px] shadow-red-500/30 border border-red-200/50";
    };

    const getRiskPulseColor = (risk: string) => {
        if (risk === "Low Risk") return "bg-emerald-400";
        if (risk === "Mid Risk") return "bg-amber-400";
        return "bg-red-500";
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-4xl mx-auto z-10 glass-panel p-8 sm:p-12 border border-white/60"
        >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-slate-200/50">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
                        <HeartPulse className="text-blue-600" size={32} />
                        Risk Assessment
                    </h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                        Input maternal health metrics to evaluate hemorrhage risk.
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
                {/* Form Section */}
                <section className="bg-white/40 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-sm border border-white/40">
                    <form onSubmit={handlePredict}>
                        <div className="grid sm:grid-cols-2 gap-x-6">
                            <FormInput label="Age (Years)" name="Age" value={formData.Age} onChange={handleInputChange} />
                            <FormInput label="Systolic BP" name="SystolicBP" value={formData.SystolicBP} onChange={handleInputChange} />
                            <FormInput label="Diastolic BP" name="DiastolicBP" value={formData.DiastolicBP} onChange={handleInputChange} />
                            <FormInput label="Blood Glucose" name="Blood glucose" value={formData["Blood glucose"]} onChange={handleInputChange} />
                            <FormInput label="Body Temp (°F)" name="BodyTemp" value={formData.BodyTemp} onChange={handleInputChange} />
                            <FormInput label="Heart Rate (bpm)" name="HeartRate" value={formData.HeartRate} onChange={handleInputChange} />
                        </div>

                        {error && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-center gap-2">
                                <AlertTriangle size={16} /> {error}
                            </motion.div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={loading}
                            type="submit"
                            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Activity />}
                            {loading ? 'Predicting...' : 'Predict Risk'}
                        </motion.button>
                    </form>
                </section>

                {/* Result Section */}
                <section className="flex flex-col justify-center min-h-[300px]">
                    <AnimatePresence mode='wait'>
                        {prediction ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, height: 0 }}
                                className={`relative flex-1 rounded-2xl p-8 border border-white/40 flex flex-col justify-center items-center text-center overflow-hidden ${getRiskColor(prediction.risk)}`}
                            >
                                <div className="absolute inset-0 overflow-hidden rounded-2xl z-0 pointer-events-none">
                                    <span className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full opacity-20 animate-ping ${getRiskPulseColor(prediction.risk)}`}></span>
                                </div>

                                <h3 className="text-xs font-bold uppercase tracking-widest mb-2 opacity-80 z-10 text-slate-800">Assessment Result</h3>
                                <div className="text-5xl font-extrabold mb-6 z-10 drop-shadow-sm tracking-tight text-slate-900">
                                    {prediction.risk}
                                </div>

                                <div className="w-full space-y-4 z-10 bg-white/40 p-4 rounded-xl border border-white/50 backdrop-blur-sm">
                                    <div className="flex justify-between items-center text-sm font-bold text-slate-800">
                                        <span className="uppercase tracking-wide opacity-80">Confidence</span>
                                        <span className="text-blue-900">{Math.round(prediction.confidence * 100)}%</span>
                                    </div>
                                    {/* Confidence Bar */}
                                    <div className="h-2 w-full bg-black/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.round(prediction.confidence * 100)}%` }}
                                            className="h-full bg-slate-900"
                                        />
                                    </div>

                                    <div className="flex justify-between items-center text-sm font-bold text-slate-800 pt-2 border-t border-black/10 mt-2">
                                        <span className="uppercase tracking-wide opacity-80">Top Factor</span>
                                        <span className="bg-white/60 px-2 py-0.5 rounded-md text-blue-900 border border-white/50">{prediction.top_factor}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="placeholder"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex-1 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center p-8 bg-white/20 hover:bg-white/30 transition-colors"
                                style={{ minHeight: '300px' }}
                            >
                                <div className="text-center text-slate-400 space-y-2">
                                    <Activity size={48} className="mx-auto text-slate-300 mb-4" />
                                    <p className="text-base font-semibold">Awaiting Data</p>
                                    <p className="text-sm">Submit the form to generate AI predictions.</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>
            </div>
        </motion.div>
    );
}
