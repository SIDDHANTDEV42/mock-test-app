"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && (!user || user.role !== "ADMIN")) {
            router.push("/dashboard");
        }
    }, [user, isLoading, router]);

    if (isLoading || !user || user.role !== "ADMIN") {
        return <div className="p-4 sm:p-8">Loading Access...</div>;
    }

    return (
        <div className="flex min-h-screen flex-col lg:flex-row">
            <aside className="bg-slate-900 text-white p-4 lg:w-64 lg:p-6 lg:space-y-4">
                <h2 className="text-lg lg:text-xl font-bold mb-4 lg:mb-8 italic">Admin Portal</h2>
                <nav className="flex gap-2 overflow-x-auto pb-2 lg:block lg:space-y-2 lg:overflow-visible lg:pb-0">
                    <Link href="/admin" className="shrink-0 block p-2 hover:bg-slate-800 rounded">Dashboard</Link>
                    <Link href="/admin/tests" className="shrink-0 block p-2 hover:bg-slate-800 rounded">Tests</Link>
                    <Link href="/admin/questions" className="shrink-0 block p-2 hover:bg-slate-800 rounded">Questions</Link>
                    <Link href="/admin/users" className="shrink-0 block p-2 hover:bg-slate-800 rounded">Users</Link>
                    <Link href="/admin/announcements" className="shrink-0 block p-2 hover:bg-slate-800 rounded">Announcements</Link>
                    <Link href="/admin/reviews" className="shrink-0 block p-2 hover:bg-slate-800 rounded">Reviews</Link>
                    <Link href="/dashboard/leaderboard" className="shrink-0 block p-2 hover:bg-slate-800 rounded text-amber-400/80 hover:text-amber-400">Leaderboard</Link>
                    <Link href="/dashboard" className="shrink-0 block p-2 text-slate-400 hover:text-white lg:mt-4 lg:border-t lg:border-slate-700 lg:pt-4">User View</Link>
                </nav>
            </aside>
            <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-slate-50 min-w-0">
                {children}
            </main>
        </div>
    );
}
