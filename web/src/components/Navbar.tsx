"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Menu, X, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    // Auth Modal State
    const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
    const [mobileNo, setMobileNo] = useState('');
    const [mobileError, setMobileError] = useState('');

    const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (val === '' || /^[0-9]+$/.test(val)) {
            if (val.length <= 10) {
                setMobileNo(val);
                setMobileError('');
            }
        }
    };

    const handleAuthSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mobileNo.length !== 10) {
            setMobileError('Mobile number must be exactly 10 digits.');
            return;
        }
        setIsLoginOpen(false);
    };

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isLoginOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isLoginOpen]);

    const links = [
        { label: 'Dashboard', href: '/' },
        { label: 'Risk Assessment', href: '/risk-assessment' },
        { label: 'Donor Network', href: '/donor-network' },
        { label: 'Register Donor', href: '/register-donor' },
    ];

    return (
        <>
            <nav className="fixed w-full z-50 top-0 left-0 bg-white/70 backdrop-blur-xl border-b border-white/60 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2 rounded-xl shadow-lg shadow-blue-500/30 text-white">
                                <Activity size={24} />
                            </div>
                            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
                                PG – PulseGuard
                            </span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-6">
                            <div className="flex items-center space-x-1">
                                {links.map((link) => {
                                    const isActive = pathname === link.href;
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                                ? 'bg-blue-100/50 text-blue-700 shadow-sm border border-blue-200/50'
                                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                                                }`}
                                        >
                                            {link.label}
                                        </Link>
                                    );
                                })}
                            </div>

                            <div className="relative border-l border-slate-300 pl-6 flex items-center">
                                <button
                                    onClick={() => setIsLoginOpen(true)}
                                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                                        <User size={18} />
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex items-center md:hidden">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="text-slate-600 hover:text-slate-900 p-2"
                            >
                                {isOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-white/90 backdrop-blur-xl border-b border-slate-200/50 overflow-hidden"
                        >
                            <div className="px-4 pt-2 pb-6 space-y-1">
                                {links.map((link) => {
                                    const isActive = pathname === link.href;
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className={`block px-3 py-3 rounded-xl text-base font-medium transition-all ${isActive
                                                ? 'bg-blue-100/50 text-blue-700 font-bold border border-blue-200/50'
                                                : 'text-slate-600'
                                                }`}
                                        >
                                            {link.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Login Modal */}
            <AnimatePresence>
                {isLoginOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white/90 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl w-full max-w-md relative flex flex-col max-h-[90vh] overflow-hidden"
                        >
                            {/* Fixed Header */}
                            <div className="p-6 sm:p-8 pb-0 shrink-0">
                                <button
                                    onClick={() => setIsLoginOpen(false)}
                                    className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors z-10"
                                >
                                    <X size={20} />
                                </button>

                                {/* Tabs */}
                                <div className="flex gap-1 mb-6 bg-slate-100/50 p-1 rounded-xl">
                                    <button
                                        onClick={() => setAuthTab('login')}
                                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${authTab === 'login' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                            }`}
                                    >
                                        Log In
                                    </button>
                                    <button
                                        onClick={() => setAuthTab('signup')}
                                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${authTab === 'signup' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                            }`}
                                    >
                                        Sign Up
                                    </button>
                                </div>
                            </div>

                            {/* Scrollable Form Content */}
                            <div className="p-6 sm:p-8 pt-0 overflow-y-auto custom-scrollbar">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={authTab}
                                        initial={{ opacity: 0, x: authTab === 'login' ? -20 : 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: authTab === 'login' ? 20 : -20 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="mb-6">
                                            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                                                {authTab === 'login' ? 'Welcome Back' : 'Create Account'}
                                            </h2>
                                            <p className="text-sm text-slate-500 mt-1">
                                                {authTab === 'login' ? 'Please enter your details to sign in.' : 'Join the PulseGuard network today.'}
                                            </p>
                                        </div>

                                        <form onSubmit={handleAuthSubmit} className="space-y-4">
                                            {authTab === 'signup' && (
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                                    <input type="text" required placeholder="John Doe" className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium text-slate-800" />
                                                </div>
                                            )}

                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number <span className="text-red-500">*</span></label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-3.5 text-slate-500 font-medium">+91</span>
                                                    <input
                                                        type="tel"
                                                        required
                                                        value={mobileNo}
                                                        onChange={handleMobileChange}
                                                        placeholder="00000 00000"
                                                        className={`w-full pl-12 pr-4 py-3 bg-white/50 border ${mobileError ? 'border-red-400 focus:ring-red-500/50' : 'border-slate-200 focus:ring-blue-500/50'} rounded-xl focus:outline-none focus:ring-2 transition-all font-medium text-slate-800`}
                                                    />
                                                </div>
                                                {mobileError && <p className="text-xs text-red-500 mt-1.5 font-medium">{mobileError}</p>}
                                            </div>

                                            {authTab === 'signup' && (
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email <span className="text-slate-400 font-normal">(Optional)</span></label>
                                                    <input type="email" placeholder="hello@pulseguard.dev" className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium text-slate-800" />
                                                </div>
                                            )}

                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                                                <input type="password" required placeholder="••••••••" className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium text-slate-800" />
                                            </div>

                                            {authTab === 'signup' && (
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                                                    <input type="password" required placeholder="••••••••" className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium text-slate-800" />
                                                </div>
                                            )}

                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                type="submit"
                                                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl mt-6 shadow-lg shadow-blue-500/30 transition-all flex justify-center items-center"
                                            >
                                                {authTab === 'login' ? 'Sign In' : 'Create Account'}
                                            </motion.button>

                                            <div className="relative my-6 pt-2">
                                                <div className="absolute inset-0 flex items-center pt-2">
                                                    <div className="w-full border-t border-slate-200"></div>
                                                </div>
                                                <div className="relative flex justify-center text-sm pt-2">
                                                    <span className="px-2 bg-white/90 text-slate-500 backdrop-blur-sm">Or continue with</span>
                                                </div>
                                            </div>

                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                type="button"
                                                className="w-full py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-all flex justify-center items-center gap-3"
                                            >
                                                <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                                </svg>
                                                Google
                                            </motion.button>
                                        </form>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
