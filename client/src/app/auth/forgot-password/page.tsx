"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import api from '@/lib/api';
import { ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setMessage("");
        
        try {
            const res = await api.post('/auth/forgot-password', { email });
            setMessage(res.data.message || "Password reset link sent! Please check your email (or server console for local dev).");
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to process request. Ensure the email is correct.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#121417] p-4">
            <div className="w-full max-w-md relative z-10">
                <div className="backdrop-blur-2xl bg-white/[0.03] border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]">
                    
                    <Link href="/auth/login" className="inline-flex items-center text-gray-500 hover:text-white transition-colors text-sm font-semibold mb-8 group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Login
                    </Link>

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#fde09e]/10 mb-6 border border-[#fde09e]/20">
                            <Mail className="w-8 h-8 text-[#d39434]" />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Forgot Password?</h2>
                        <p className="text-gray-400 text-sm font-medium px-4">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold text-center">
                                {error}
                            </div>
                        )}
                        
                        {message && (
                            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 text-xs font-bold text-center">
                                {message}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-2">Email Address</label>
                            <Input
                                type="email"
                                placeholder="name@example.com"
                                className="h-14 rounded-[1rem] bg-black/20 border-white/5 text-white placeholder:text-gray-600 focus:bg-black/30 focus:border-[#fde09e]/30 focus:ring-0 transition-all px-6"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <Button 
                            type="submit" 
                            disabled={isLoading || !!message}
                            className="w-full h-14 mt-4 bg-gradient-to-b from-[#fde09e] to-[#d39434] hover:from-[#fff0b5] hover:to-[#e6a540] text-[#4a2e00] font-black text-lg rounded-[1rem] shadow-[0_10px_30px_-10px_rgba(211,148,52,0.6)] transition-all hover:scale-[1.03] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {isLoading ? "Sending..." : "Send Reset Link"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
