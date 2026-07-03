"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart3, ClipboardList, LogOut, ShieldCheck, Trophy } from "lucide-react";

export default function EnhancedDashboard() {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const [statsRes, announcementsRes] = await Promise.all([
                    api.get("/questions/stats"),
                    api.get("/announcements"),
                ]);
                setStats(statsRes.data);
                setAnnouncements(announcementsRes.data);
            } catch (error) {
                console.error("Dashboard failed to load");
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const statCards = [
        { label: "Average Score", value: stats?.averageScore != null ? stats.averageScore.toFixed(1) : "0", helper: "Across completed tests" },
        { label: "Tests Completed", value: stats?.testsCompleted || 0, helper: "Official and practice" },
        { label: "Available Tests", value: stats?.totalTests || 0, helper: "Seeded demo tests" },
        { label: "Avg. Time / Q", value: `${stats?.avgTimePerQuestion || 0}s`, helper: "Seconds per question" },
    ];

    return (
        <div className="min-h-screen academic-bg">
            <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/85 p-4 backdrop-blur-md md:px-8">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
                    <div className="flex w-full items-center justify-between gap-4 md:w-auto">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 text-slate-950">
                                <BarChart3 className="h-5 w-5" />
                            </div>
                            <div>
                                <h1 className="text-lg font-black uppercase tracking-tight text-slate-950">ExamPrep</h1>
                                <p className="hidden text-[10px] font-black uppercase tracking-[0.24em] text-cyan-700 sm:block">Student workspace</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex w-full items-center gap-3 overflow-x-auto pb-2 hide-scrollbar md:w-auto md:pb-0">
                        <Link href="/dashboard/leaderboard" className="flex shrink-0 items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-sm font-bold text-cyan-800 transition-colors hover:bg-cyan-100">
                            <Trophy className="h-4 w-4" />
                            Leaderboard
                        </Link>
                        <span className="shrink-0 text-sm font-medium text-slate-500">
                            Welcome, <span className="font-black text-slate-950">{user?.name}</span>
                        </span>
                        {user?.role === "ADMIN" && (
                            <Link href="/admin" className="shrink-0">
                                <Button variant="outline" className="border-cyan-200 text-cyan-800 hover:bg-cyan-50">
                                    <ShieldCheck className="mr-2 h-4 w-4" />
                                    Admin Panel
                                </Button>
                            </Link>
                        )}
                        <Button onClick={() => logout()} variant="ghost" className="shrink-0 text-slate-500 hover:bg-slate-100 hover:text-slate-950">
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl space-y-6 p-4 md:space-y-8 md:p-8">
                <section className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                    {statCards.map((card, index) => (
                        <div key={card.label} className="app-card p-4 md:p-6">
                            <p className="text-xs font-black uppercase tracking-widest text-slate-400">{card.label}</p>
                            <h3 className={index === 0 ? "mt-2 text-3xl font-black text-cyan-700" : "mt-2 text-3xl font-black text-slate-950"}>
                                {isLoading ? "..." : card.value}
                            </h3>
                            <p className="mt-2 text-xs font-bold text-slate-400">{card.helper}</p>
                        </div>
                    ))}
                </section>

                <section className="app-card min-w-0 p-5 md:p-8">
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <div>
                            <p className="app-eyebrow">Progress</p>
                            <h2 className="text-2xl font-black text-slate-950">Subject Performance</h2>
                        </div>
                    </div>
                    <div className="h-64 min-w-0">
                        {stats?.subjectPerformance?.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.subjectPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                                    <Tooltip cursor={{ fill: "#f8fafc" }} />
                                    <Bar dataKey="score" fill="#0891b2" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm font-bold text-slate-400">
                                Complete a test to unlock subject analytics.
                            </div>
                        )}
                    </div>
                </section>

                <section className="app-card p-5 md:p-8">
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <div>
                            <p className="app-eyebrow">Updates</p>
                            <h2 className="text-2xl font-black text-slate-950">Academic Announcements</h2>
                        </div>
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    </div>
                    <div className="max-h-[300px] space-y-4 overflow-y-auto pr-2">
                        {announcements.length > 0 ? announcements.map((ann) => (
                            <div key={ann.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-colors hover:border-cyan-200">
                                <h4 className="font-black text-slate-950">{ann.title}</h4>
                                <p className="mt-1 text-sm font-medium leading-6 text-slate-600">{ann.content}</p>
                                <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    {new Date(ann.createdAt).toLocaleDateString(undefined, { dateStyle: "long" })}
                                </p>
                            </div>
                        )) : (
                            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-center text-sm font-bold text-slate-400">
                                No announcements at the moment.
                            </div>
                        )}
                    </div>
                </section>

                <section className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
                    <div className="app-card space-y-6 p-6 md:p-8">
                        <h2 className="flex items-center gap-2 text-xl font-black text-slate-950 md:text-2xl">
                            <ClipboardList className="h-5 w-5 text-cyan-700" />
                            Quick Start
                        </h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {[
                                { href: "/dashboard/mocks", title: "Full Mock Tests", desc: "Exam-style practice", tone: "bg-cyan-700 hover:bg-cyan-800 text-white" },
                                { href: "/dashboard/pyq", title: "PYQ Archive", desc: "Previous year papers", tone: "bg-slate-950 hover:bg-slate-800 text-white" },
                                { href: "/dashboard/mocks/custom", title: "Custom Exam", desc: "Create your own", tone: "bg-slate-800 hover:bg-slate-900 text-white" },
                                { href: "/dashboard/results", title: "Analysis", desc: "View performance", tone: "bg-white border-2 border-slate-100 hover:border-cyan-200 text-slate-950" },
                            ].map((item) => (
                                <Link key={item.href} href={item.href} className={`rounded-xl p-6 transition-colors ${item.tone}`}>
                                    <h4 className="text-lg font-black">{item.title}</h4>
                                    <p className="mt-1 text-sm font-medium opacity-75">{item.desc}</p>
                                    <div className="mt-4 opacity-60">-&gt;</div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="app-card space-y-6 p-5 md:p-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black text-slate-950">Recent Activity</h2>
                            <Link href="/dashboard/results" className="text-sm font-bold text-cyan-700 hover:underline">View All</Link>
                        </div>
                        <div className="space-y-4">
                            {(stats?.recentResults || []).map((res: any) => (
                                <div key={res.id} className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                                    <div className="flex min-w-0 items-center gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-100 bg-white font-black text-cyan-700 shadow-sm">
                                            {res.score}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate font-black text-slate-800">{res.test?.title || "Mock Test"}</p>
                                            <p className="text-xs font-medium text-slate-500">{new Date(res.completedAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="shrink-0 rounded-full bg-cyan-100 px-3 py-1 text-xs font-black uppercase text-cyan-800">
                                        Done
                                    </div>
                                </div>
                            ))}
                            {(!stats?.recentResults || stats.recentResults.length === 0) && (
                                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-center text-sm font-bold text-slate-400">
                                    No recent activity yet.
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
