"use client";

import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { KeyRound, CheckCircle2 } from "lucide-react";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long");
            setIsLoading(false);
            return;
        }

        if (!token) {
            setError("Invalid or missing reset token.");
            setIsLoading(false);
            return;
        }
        
        try {
            const res = await api.post('/auth/reset-password', { token, newPassword: password });
            setMessage(res.data.message);
            setIsSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to reset password. The link might be expired.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="text-center space-y-6">
                <div className="flex justify-center">
                    <CheckCircle2 className="w-20 h-20 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Password Reset Complete</h2>
                <p className="text-gray-400 text-sm">Your password has been successfully updated.</p>
                <Link href="/auth/login" className="block">
                    <Button className="w-full h-14 mt-4 bg-white hover:bg-gray-200 text-black font-black text-lg rounded-[1rem] transition-all">
                        Return to Login
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#fde09e]/10 mb-6 border border-[#fde09e]/20">
                    <KeyRound className="w-8 h-8 text-[#d39434]" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Create New Password</h2>
                <p className="text-gray-400 text-sm font-medium px-4">
                    Please enter your new password below. Make it strong!
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold text-center">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-2">New Password</label>
                    <Input
                        type="password"
                        placeholder="••••••••"
                        className="h-14 rounded-[1rem] bg-black/20 border-white/5 text-white placeholder:text-gray-600 focus:bg-black/30 focus:border-[#fde09e]/30 focus:ring-0 transition-all px-6"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-2">Confirm Password</label>
                    <Input
                        type="password"
                        placeholder="••••••••"
                        className="h-14 rounded-[1rem] bg-black/20 border-white/5 text-white placeholder:text-gray-600 focus:bg-black/30 focus:border-[#fde09e]/30 focus:ring-0 transition-all px-6"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full h-14 mt-4 bg-gradient-to-b from-[#fde09e] to-[#d39434] hover:from-[#fff0b5] hover:to-[#e6a540] text-[#4a2e00] font-black text-lg rounded-[1rem] shadow-[0_10px_30px_-10px_rgba(211,148,52,0.6)] transition-all hover:scale-[1.03] active:scale-95"
                >
                    {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
            </form>
        </>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#121417] p-4">
            <div className="w-full max-w-md relative z-10">
                <div className="backdrop-blur-2xl bg-white/[0.03] border border-white/10 p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]">
                    <Suspense fallback={<div className="text-white text-center">Loading...</div>}>
                        <ResetPasswordForm />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
