"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'ADMIN')) {
            router.push('/dashboard');
        }
    }, [user, isLoading, router]);

    if (isLoading || !user || user.role !== 'ADMIN') {
        return <div className="p-8">Loading Access...</div>;
    }

    return (
        <div className="flex min-h-screen">
            <aside className="w-64 bg-slate-900 text-white p-6 space-y-4">
                <h2 className="text-xl font-bold mb-8 italic">Admin Portal</h2>
                <nav className="space-y-2">
                    <Link href="/admin" className="block p-2 hover:bg-slate-800 rounded">Dashboard</Link>
                    <Link href="/admin/tests" className="block p-2 hover:bg-slate-800 rounded">Manage Tests</Link>
                    <Link href="/admin/questions" className="block p-2 hover:bg-slate-800 rounded">Manage Questions</Link>
                    <Link href="/admin/users" className="block p-2 hover:bg-slate-800 rounded">Manage Users</Link>
                    <Link href="/admin/announcements" className="block p-2 hover:bg-slate-800 rounded">Announcements</Link>
                    <Link href="/admin/reviews" className="block p-2 hover:bg-slate-800 rounded">Reviews</Link>
                    <Link href="/dashboard/leaderboard" className="block p-2 hover:bg-slate-800 rounded text-amber-400/80 hover:text-amber-400">🏆 Leaderboard</Link>
                    <hr className="border-slate-700 my-4" />
                    <Link href="/dashboard" className="block p-2 text-slate-400 hover:text-white">Back to User View</Link>
                </nav>
            </aside>
            <main className="flex-1 p-8 bg-slate-50">
                {children}
            </main>
        </div>
    );
}
