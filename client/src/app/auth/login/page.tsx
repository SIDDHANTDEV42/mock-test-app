"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import { Eye, EyeOff, GraduationCap } from "lucide-react";

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
        <div className="min-h-screen flex bg-[#050510] overflow-x-hidden overflow-y-auto">
            {/* Left Decorative Panel — hidden on mobile */}
            <div className="hidden lg:flex lg:w-[45%] relative items-center justify-center">
                {/* Animated background blobs */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] rounded-full bg-cyan-500/15 blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-[100px] animate-pulse [animation-delay:2s]" />
                    <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-cyan-300/8 blur-[80px] animate-pulse [animation-delay:4s]" />
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-md px-12 space-y-8">
                    <div className="inline-flex items-center gap-3">
                        <div className="bg-cyan-400 p-3 rounded-2xl shadow-lg shadow-cyan-500/20">
                            <GraduationCap className="w-8 h-8 text-white" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-white uppercase">
                            EXAM<span className="text-cyan-300">PREP</span>
                        </span>
                    </div>
                    <h1 className="text-5xl font-black text-white leading-tight tracking-tight">
                        Welcome back,<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-sky-300">Champion.</span>
                    </h1>
                    <p className="text-slate-400 text-lg font-medium leading-relaxed">
                        Sign in to continue your preparation journey. Your progress awaits.
                    </p>
                    <div className="flex gap-6 pt-4">
                        <div className="space-y-1">
                            <div className="text-3xl font-black text-white">50k+</div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Students</div>
                        </div>
                        <div className="w-px bg-white/10" />
                        <div className="space-y-1">
                            <div className="text-3xl font-black text-white">98%</div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Success</div>
                        </div>
                        <div className="w-px bg-white/10" />
                        <div className="space-y-1">
                            <div className="text-3xl font-black text-white">24/7</div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Support</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Login Form Panel */}
            <div className="w-full lg:w-[55%] flex min-w-0 items-center justify-center overflow-hidden p-4 sm:p-8 py-8">
                <div className="w-full max-w-[calc(100vw-2rem)] sm:max-w-md min-w-0 space-y-6">
                    {/* Mobile-only logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-4 min-w-0">
                        <div className="bg-cyan-400 p-2.5 rounded-xl shadow-lg shadow-cyan-500/20">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tighter text-white uppercase truncate">
                            EXAM<span className="text-cyan-300">PREP</span>
                        </span>
                    </div>

                    {/* Card */}
                    <div className="w-full min-w-0 overflow-hidden backdrop-blur-2xl bg-white/[0.03] border border-white/10 p-5 sm:p-10 rounded-2xl sm:rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-black text-white tracking-tight mb-2">Sign In</h2>
                            <p className="text-slate-500 text-sm font-medium">Enter your credentials to continue</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold text-center animate-in fade-in zoom-in duration-300">
                                    ⚠️ {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-2">Email Address</label>
                                <Input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="h-14 rounded-[1rem] bg-white/[0.03] border-white/5 text-white placeholder:text-slate-700 focus:bg-white/[0.06] focus:border-cyan-400/50 focus:ring-4 focus:ring-cyan-400/10 transition-all px-5"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center gap-3 mx-2">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Password</label>
                                    <Link href="/auth/forgot-password" className="shrink-0 text-[11px] font-semibold text-cyan-300 hover:text-cyan-200 transition-colors">
                                        <span className="sm:hidden">Forgot?</span>
                                        <span className="hidden sm:inline">Forgot Password?</span>
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="h-14 rounded-[1rem] bg-white/[0.03] border-white/5 text-white placeholder:text-slate-700 focus:bg-white/[0.06] focus:border-cyan-400/50 focus:ring-4 focus:ring-cyan-400/10 transition-all px-5 pr-14"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-cyan-300 transition-colors p-1"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full h-14 mt-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-base rounded-[1rem] shadow-[0_10px_30px_-10px_rgba(34,211,238,0.4)] transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-3">
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        Signing In...
                                    </div>
                                ) : "Sign In"}
                            </Button>

                            <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 space-y-3">
                                <div>
                                    <p className="text-[11px] font-black uppercase tracking-widest text-cyan-300">Portfolio demo access</p>
                                    <p className="mt-1 text-xs font-semibold text-slate-400">Use these accounts to explore the full student and admin experience.</p>
                                </div>
                                <div className="grid min-w-0 gap-2 text-[11px] font-mono text-slate-300">
                                    <div className="rounded-xl bg-black/20 p-3 break-all">
                                        <span className="text-cyan-300">Admin:</span> demo.admin@siddhant.dev / DemoPass123!
                                    </div>
                                    <div className="rounded-xl bg-black/20 p-3 break-all">
                                        <span className="text-cyan-300">Student:</span> demo.student@siddhant.dev / DemoPass123!
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full border-white/10 text-slate-300 hover:text-white hover:bg-white/5 bg-transparent"
                                        onClick={() => {
                                            setEmail("demo.admin@siddhant.dev");
                                            setPassword("DemoPass123!");
                                        }}
                                    >
                                        Fill Admin
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full border-white/10 text-slate-300 hover:text-white hover:bg-white/5 bg-transparent"
                                        onClick={() => {
                                            setEmail("demo.student@siddhant.dev");
                                            setPassword("DemoPass123!");
                                        }}
                                    >
                                        Fill Student
                                    </Button>
                                </div>
                            </div>

                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-slate-500 text-sm font-medium">
                                Don&apos;t have an account?{" "}
                                <Link href="/auth/register" className="text-cyan-300 hover:text-cyan-200 font-bold transition-colors">
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
