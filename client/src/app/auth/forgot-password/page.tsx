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
    const [resetLink, setResetLink] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setMessage("");
        setResetLink("");
        
        try {
            const res = await api.post('/auth/forgot-password', { email });
            setMessage(res.data.message || "Demo reset request processed. No real email is sent from this showcase app.");
            setResetLink(res.data.resetLink || "");
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to process request. The database or reset flow may not be configured yet.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#121417] p-4">
            <div className="w-full max-w-md relative z-10">
                <div className="backdrop-blur-2xl bg-white/[0.03] border border-white/10 p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]">
                    
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
                            This portfolio demo does not send real emails yet. Enter an email to generate a reset request; in local/demo mode the reset link appears here.
                        </p>
                    </div>

                    <div className="mb-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-xs font-bold leading-5 text-amber-200">
                        Demo notice: no real inbox message will be sent unless an email provider is added later.
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

                        {resetLink && (
                            <div className="rounded-2xl border border-[#fde09e]/20 bg-[#fde09e]/10 p-4 text-xs font-bold leading-5 text-[#fde09e]">
                                <p className="mb-2 text-white">Demo reset link:</p>
                                <Link href={resetLink} className="break-all underline underline-offset-4 hover:text-white">
                                    {resetLink}
                                </Link>
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
                            {isLoading ? "Generating..." : "Generate Reset Link"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
