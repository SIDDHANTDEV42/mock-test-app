"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import { BookOpen, GraduationCap, Trophy, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            await login({ email, password });
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || "Login failed.";
            setError(errorMsg);
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050510]">
            {/* Animated Mesh Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] h-[60%] w-[60%] animate-pulse rounded-full bg-indigo-600/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] h-[60%] w-[60%] animate-pulse rounded-full bg-blue-600/10 blur-[120px] [animation-delay:2s]" />
                <div className="absolute top-1/2 left-1/2 h-[40%] w-[40%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/5 blur-[100px]" />
            </div>

            {/* Floating Decorative Icons */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                <div className="absolute top-[15%] left-[20%] animate-bounce [animation-duration:6s]">
                    <GraduationCap className="w-16 h-16 text-indigo-400" />
                </div>
                <div className="absolute bottom-[20%] right-[20%] animate-bounce [animation-duration:8s]">
                    <Trophy className="w-12 h-12 text-blue-400" />
                </div>
                <div className="absolute top-[65%] left-[15%] animate-bounce [animation-duration:7s]">
                    <BookOpen className="w-10 h-10 text-purple-400" />
                </div>
            </div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-lg p-6">
                <div className="backdrop-blur-3xl bg-white/[0.02] border border-white/10 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden">
                    <div className="p-10 md:p-14 space-y-10">
                        {/* Logo & Header */}
                        <div className="text-center space-y-6">
                            <div className="inline-flex items-center justify-center p-5 bg-indigo-600/20 rounded-3xl border border-indigo-500/30 mb-2 shadow-2xl shadow-indigo-500/20">
                                <GraduationCap className="w-12 h-12 text-indigo-400" />
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-4xl font-black text-white tracking-tight">Access Portal</h1>
                                <p className="text-slate-500 font-medium tracking-wide">Enter your credentials to continue your mission.</p>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs font-bold flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                                    <span className="text-lg">⚠️</span> {error}
                                </div>
                            )}

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Secure Email Address</label>
                                <Input
                                    type="email"
                                    placeholder="cadet@college.edu"
                                    className="h-16 rounded-[1.25rem] border-white/5 bg-white/[0.03] text-white placeholder:text-slate-700 focus:bg-white/[0.06] focus:border-indigo-500/50 focus:ring-8 focus:ring-indigo-500/5 transition-all font-bold px-8 text-base shadow-inner"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center ml-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Access Sequence</label>
                                    <button type="button" className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest transition-all">Forgot Key?</button>
                                </div>
                                <div className="relative group">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="h-16 rounded-[1.25rem] border-white/5 bg-white/[0.03] text-white placeholder:text-slate-700 focus:bg-white/[0.06] focus:border-indigo-500/50 focus:ring-8 focus:ring-indigo-500/5 transition-all font-bold px-8 pr-16 text-base shadow-inner"
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

                            <Button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full h-16 bg-white text-black hover:bg-slate-200 font-black text-lg rounded-2xl shadow-[0_20px_40px_-10px_rgba(255,255,255,0.15)] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 group"
                            >
                                {isLoading ? (
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                                ) : (
                                    <>
                                        Establish Connection 
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="text-center pt-6">
                            <p className="text-slate-500 font-bold text-sm">
                                New operative?{" "}
                                <Link href="/auth/register" className="text-white hover:text-indigo-400 transition-colors underline decoration-indigo-500/50 underline-offset-8">
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Footer Badges */}
                    <div className="px-12 py-8 bg-white/[0.01] border-t border-white/5">
                        <div className="flex justify-between items-center grayscale opacity-30 group-hover:opacity-100 transition-all">
                             <div className="flex items-center gap-2">
                                <Trophy className="w-4 h-4" />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Rank #1 Platform</span>
                             </div>
                             <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Verified Academic Engine</span>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
