"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { BarChart3, Bell, BookOpenCheck, ClipboardList, LayoutDashboard, MessageSquareText, Trophy, Users, UserRound } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && (!user || user.role !== "ADMIN")) {
            router.push("/dashboard");
        }
    }, [user, isLoading, router]);

    if (isLoading || !user || user.role !== "ADMIN") {
        return <div className="min-h-screen bg-slate-950 p-4 text-sm font-bold text-cyan-200 sm:p-8">Checking admin access...</div>;
    }

    const navItems = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/tests", label: "Tests", icon: ClipboardList },
        { href: "/admin/questions", label: "Questions", icon: BookOpenCheck },
        { href: "/admin/users", label: "Users", icon: Users },
        { href: "/admin/announcements", label: "Announcements", icon: Bell },
        { href: "/admin/reviews", label: "Reviews", icon: MessageSquareText },
        { href: "/dashboard/leaderboard", label: "Leaderboard", icon: Trophy },
        { href: "/dashboard", label: "User View", icon: UserRound },
    ];

    return (
        <div className="flex min-h-screen flex-col bg-slate-100 lg:flex-row">
            <aside className="border-b border-white/10 bg-slate-950 p-4 text-white lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r lg:p-6">
                <div className="mb-5 flex items-center gap-3 lg:mb-8">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 text-slate-950">
                        <BarChart3 className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black uppercase tracking-tight">ExamPrep</h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">Admin console</p>
                    </div>
                </div>
                <nav className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isSecondary = item.href.startsWith("/dashboard");
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition-colors lg:w-full ${
                                    isSecondary
                                        ? "text-slate-400 hover:bg-white/5 hover:text-cyan-200 lg:mt-3"
                                        : "text-slate-200 hover:bg-white/10 hover:text-cyan-200"
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
            <main className="min-w-0 flex-1 bg-slate-100 p-4 sm:p-6 lg:p-8">
                {children}
            </main>
        </div>
    );
}
