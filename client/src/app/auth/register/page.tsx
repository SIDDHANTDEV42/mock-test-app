"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import { BookOpen, GraduationCap, Trophy, ArrowRight, Eye, EyeOff, Sparkles } from "lucide-react";

export default function RegisterPage() {
    const { register } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [stream, setStream] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            await register({ name, email, password, stream });
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || "Registration failed.";
            setError(errorMsg);
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050510]">
            {/* Animated Mesh Background (Consistent with Login) */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] right-[-10%] h-[60%] w-[60%] animate-pulse rounded-full bg-indigo-600/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] h-[60%] w-[60%] animate-pulse rounded-full bg-blue-600/10 blur-[120px] [animation-delay:2s]" />
                <div className="absolute top-1/2 left-1/2 h-[40%] w-[40%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/5 blur-[100px]" />
            </div>

            {/* Floating Decorative Icons */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                <div className="absolute top-[10%] right-[15%] animate-bounce [animation-duration:9s]">
                    <Sparkles className="w-12 h-12 text-amber-400" />
                </div>
                <div className="absolute bottom-[15%] left-[15%] animate-bounce [animation-duration:10s]">
                    <GraduationCap className="w-14 h-14 text-indigo-400" />
                </div>
            </div>

            {/* Register Card */}
            <div className="relative z-10 w-full max-w-xl p-6">
                <div className="backdrop-blur-3xl bg-white/[0.02] border border-white/10 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden">
                    <div className="p-10 md:p-14 space-y-8">
                        {/* Header */}
                        <div className="text-center space-y-4">
                            <div className="inline-flex items-center justify-center p-4 bg-indigo-600/20 rounded-2xl border border-indigo-500/30 mb-2 shadow-xl">
                                <Sparkles className="w-8 h-8 text-indigo-400" />
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-4xl font-black text-white tracking-tight">Join the Elite</h1>
                                <p className="text-slate-500 font-medium tracking-wide">Register to start your journey to the top.</p>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs font-bold flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                                    <span className="text-lg">⚠️</span> {error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Display Name</label>
                                    <Input
                                        type="text"
                                        placeholder="John Doe"
                                        className="h-14 rounded-[1.25rem] border-white/5 bg-white/[0.03] text-white placeholder:text-slate-700 focus:bg-white/[0.06] focus:border-indigo-500/50 focus:ring-8 focus:ring-indigo-500/5 transition-all font-bold px-6 shadow-inner"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Email Address</label>
                                    <Input
                                        type="email"
                                        placeholder="name@college.edu"
                                        className="h-14 rounded-[1.25rem] border-white/5 bg-white/[0.03] text-white placeholder:text-slate-700 focus:bg-white/[0.06] focus:border-indigo-500/50 focus:ring-8 focus:ring-indigo-500/5 transition-all font-bold px-6 shadow-inner"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center ml-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Create Access Sequence</label>
                                </div>
                                <div className="relative group">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Min. 8 characters"
                                        className="h-14 rounded-[1.25rem] border-white/5 bg-white/[0.03] text-white placeholder:text-slate-700 focus:bg-white/[0.06] focus:border-indigo-500/50 focus:ring-8 focus:ring-indigo-500/5 transition-all font-bold px-8 pr-16 shadow-inner"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 hover:text-indigo-400 transition-colors p-2"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Academic Concentration</label>
                                <select
                                    className="w-full h-14 rounded-[1.25rem] border-white/5 bg-white/[0.03] text-white focus:bg-white/[0.06] focus:border-indigo-500/50 focus:ring-8 focus:ring-indigo-500/5 transition-all font-bold px-6 outline-none appearance-none cursor-pointer"
                                    value={stream}
                                    onChange={(e) => setStream(e.target.value)}
                                    required
                                >
                                    <option value="" disabled className="bg-[#0a0a0f]">Select your stream</option>
                                    <option value="PCM" className="bg-[#0a0a0f]">PCM (Physics, Chemistry, Maths)</option>
                                    <option value="PCB" className="bg-[#0a0a0f]">PCB (Physics, Chemistry, Biology)</option>
                                    <option value="PCMB" className="bg-[#0a0a0f]">PCMB (All Subjects)</option>
                                    <option value="OTHER" className="bg-[#0a0a0f]">Other / General</option>
                                </select>
                            </div>

                            <Button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full h-16 bg-white text-black hover:bg-slate-200 font-black text-lg rounded-2xl shadow-[0_20px_40px_-10px_rgba(255,255,255,0.15)] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 group mt-4"
                            >
                                {isLoading ? (
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                                ) : (
                                    <>
                                        Authorize Operative 
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="text-center pt-4">
                            <p className="text-slate-500 font-bold text-sm">
                                Already established?{" "}
                                <Link href="/auth/login" className="text-white hover:text-indigo-400 transition-colors underline decoration-indigo-500/50 underline-offset-8">
                                    Access Portal
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
