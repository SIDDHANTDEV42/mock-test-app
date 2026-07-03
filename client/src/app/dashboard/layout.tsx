"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace("/auth/login");
        }
    }, [isLoading, router, user]);

    if (isLoading || !user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-center">
                <div className="space-y-3">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-cyan-300/20 border-t-cyan-300" />
                    <p className="text-sm font-bold text-cyan-100">Checking your session...</p>
                </div>
            </div>
        );
    }

    return children;
}
