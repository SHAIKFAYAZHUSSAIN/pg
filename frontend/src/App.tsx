import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertTriangle, Droplet, HeartPulse, Loader2 } from 'lucide-react';

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

interface Donor {
  name: string;
  blood_group: string;
  hemoglobin: number;
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
      className="block py-2.5 px-0 w-full text-sm text-slate-800 bg-transparent border-0 border-b-2 border-slate-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
      placeholder=" "
      required
      value={value}
      onChange={onChange}
      step="any"
    />
    <label htmlFor={name} className="peer-focus:font-medium absolute text-sm text-slate-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">{label}</label>
  </div>
);

function App() {
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

  const [emergencyLoading, setEmergencyLoading] = useState(false);
  const [emergencyError, setEmergencyError] = useState<string | null>(null);
  const [donors, setDonors] = useState<Donor[] | null>(null);

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
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleEmergency = async () => {
    setEmergencyLoading(true);
    setEmergencyError(null);
    setDonors(null);
    try {
      const resp = await fetch(`${API_URL}/emergency`);
      if (!resp.ok) throw new Error('Failed to fetch donor list');
      const data = await resp.json();
      setDonors(data);
    } catch (err: any) {
      setEmergencyError("Failed to reach emergency services");
    } finally {
      setEmergencyLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    if (risk === "Low Risk") return "text-emerald-500 bg-emerald-100/50 shadow-emerald-500/20 shadow-[0_0_20px]";
    if (risk === "Mid Risk") return "text-amber-500 bg-amber-100/50 shadow-[0_0_20px] shadow-amber-500/20";
    return "text-red-600 bg-red-100/50 shadow-[0_0_20px] shadow-red-500/30";
  };

  const getRiskPulseColor = (risk: string) => {
    if (risk === "Low Risk") return "bg-emerald-400";
    if (risk === "Mid Risk") return "bg-amber-400";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-red-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-[100px]" />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-rose-400/10 blur-[120px]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-purple-400/10 blur-[130px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-4xl w-full z-10 glass-panel p-8 sm:p-12 border border-white/60"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-xl shadow-blue-500/30 mb-6"
          >
            <Activity size={40} className="relative z-10" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-800 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
            PG – PulseGuard
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            AI-Powered Maternal Risk Protection System
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Section 1: Form */}
          <section className="bg-white/50 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-sm border border-white/40">
            <div className="flex items-center gap-3 mb-6">
              <HeartPulse className="text-blue-500" />
              <h2 className="text-xl font-bold text-slate-800">Risk Assessment</h2>
            </div>

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
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Activity />}
                {loading ? 'Predicting...' : 'Predict Risk'}
              </motion.button>
            </form>
          </section>

          {/* Right Column: Result & Emergency */}
          <div className="space-y-6 flex flex-col h-full">

            <AnimatePresence mode='wait'>
              {prediction ? (
                <motion.section
                  key="result"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`relative flex-1 rounded-2xl p-8 border border-white/40 flex flex-col justify-center items-center text-center ${getRiskColor(prediction.risk)}`}
                >
                  <div className="absolute inset-0 overflow-hidden rounded-2xl z-0">
                    <span className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full opacity-20 animate-ping ${getRiskPulseColor(prediction.risk)}`}></span>
                  </div>

                  <h3 className="text-sm font-bold uppercase tracking-wider mb-2 opacity-80 z-10">Assessment Result</h3>
                  <div className="text-4xl sm:text-5xl font-extrabold mb-4 z-10 drop-shadow-sm">
                    {prediction.risk}
                  </div>

                  <div className="flex gap-4 mb-4 z-10">
                    <div className="bg-white/40 backdrop-blur-sm px-4 py-2 rounded-lg ext-sm font-semibold border border-white/50">
                      <span className="block text-xs font-semibold opacity-70 uppercase tracking-wide">Confidence</span>
                      {Math.round(prediction.confidence * 100)}%
                    </div>
                    <div className="bg-white/40 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-semibold border border-white/50">
                      <span className="block text-xs font-semibold opacity-70 uppercase tracking-wide">Key Factor</span>
                      {prediction.top_factor}
                    </div>
                  </div>
                </motion.section>
              ) : (
                <div key="placeholder" className="flex-1 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center p-8 bg-white/20">
                  <p className="text-slate-400 text-center text-sm font-medium">Fill the form and predict to view the assessment result.</p>
                </div>
              )}
            </AnimatePresence>

            {/* Section 2: Emergency */}
            <section className="bg-red-50/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-red-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <AlertTriangle size={150} />
              </div>
              <div className="flex justify-between items-start mb-6 align-top">
                <div>
                  <h2 className="text-xl font-bold text-red-900 mb-1 flex items-center gap-2">
                    <AlertTriangle size={20} className="text-red-500" /> Emergency Mode
                  </h2>
                  <p className="text-sm text-red-700/80">Activate in case of severe hemorrhage</p>
                </div>
              </div>

              <motion.button
                onClick={handleEmergency}
                disabled={emergencyLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl shadow-[0_0_20px] shadow-red-500/40 hover:shadow-red-500/60 transition-all flex items-center justify-center gap-3 relative z-10"
              >
                {emergencyLoading ? <Loader2 className="animate-spin" /> : <Droplet />}
                Hemorrhage Alert
              </motion.button>

              {emergencyError && (
                <p className="text-red-600 text-sm mt-4 font-medium text-center">{emergencyError}</p>
              )}

              <AnimatePresence>
                {donors && donors.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6 space-y-3 relative z-10"
                  >
                    <h4 className="text-sm font-bold text-red-800 uppercase tracking-wider mb-3">Available Blood Donors</h4>
                    {donors.map((donor, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white/80 p-3 rounded-lg flex items-center justify-between border border-red-100/50 shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-red-100 text-red-700 p-2 rounded-md font-bold text-xs min-w-[40px] text-center">
                            {donor.blood_group}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{donor.name}</p>
                            <p className="text-xs text-slate-500">Hb: <span className="font-semibold text-slate-700">{donor.hemoglobin} g/dL</span></p>
                          </div>
                        </div>
                        <button className="text-xs font-semibold px-3 py-1.5 bg-slate-100 text-slate-600 rounded-md hover:bg-indigo-50 hover:text-indigo-600 transition-colors">Contact</button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default App;
