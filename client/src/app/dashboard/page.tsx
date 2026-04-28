"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function EnhancedDashboard() {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [announcements, setAnnouncements] = useState<any[]>([]);

    useEffect(() => {
        fetchStats();
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const res = await api.get("/announcements");
            setAnnouncements(res.data);
        } catch (error) {
            console.error("Failed to fetch announcements");
        }
    };

    const fetchStats = async () => {
        try {
            const res = await api.get("/questions/stats");
            setStats(res.data);
        } catch (error) {
            console.error("Dashboard stats failed");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 academic-bg">
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b p-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">M</div>
                        <h1 className="text-xl font-bold tracking-tight">EXAMPREP</h1>
                    </div>
                </div>
                <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                    <Link href="/dashboard/leaderboard" className="text-sm font-bold text-amber-600 hover:text-amber-700 flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200 transition-colors whitespace-nowrap">
                        🏆 Leaderboard
                    </Link>
                    <span className="text-sm font-medium text-slate-500">Welcome, <span className="text-slate-900">{user?.name}</span></span>
                    {user?.role === 'ADMIN' && (
                        <Link href="/admin">
                            <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">Admin Panel</Button>
                        </Link>
                    )}
                    <Button onClick={() => logout()} variant="ghost" className="text-red-500 hover:bg-red-50">Logout</Button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 md:space-y-8">
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    <div className="p-4 md:p-6 bg-white rounded-2xl shadow-sm border border-slate-100 group transition-all hover:border-blue-200">
                        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Avg. Score</p>
                        <h3 className="text-3xl font-bold text-blue-600">{stats?.averageScore != null ? stats.averageScore.toFixed(1) : '0'}</h3>
                        <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: `${(stats?.averageScore || 0) * 10}%` }}></div>
                        </div>
                    </div>
                    <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 group transition-all hover:border-green-200">
                        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Tests Completed</p>
                        <h3 className="text-3xl font-bold text-green-600">{stats?.testsCompleted || 0}</h3>
                    </div>
                    <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Mocks</p>
                        <h3 className="text-3xl font-bold text-slate-800">{stats?.totalTests || 0}</h3>
                    </div>
                    <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Avg. Time / Q</p>
                        <h3 className="text-3xl font-bold text-slate-800">{stats?.avgTimePerQuestion || 0}s</h3>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">Seconds per question</p>
                    </div>
                </section>

                <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-8">
                    <h2 className="text-2xl font-bold mb-6">Subject Performance (%)</h2>
                    <div className="h-64">
                        {stats?.subjectPerformance && stats.subjectPerformance.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.subjectPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                                    <Tooltip cursor={{fill: '#f8fafc'}} />
                                    <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400">No subject data available yet.</div>
                        )}
                    </div>
                </section>

                <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-8 overflow-hidden relative group">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Academic Announcements</h2>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    </div>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {announcements.length > 0 ? announcements.map((ann) => (
                            <div key={ann.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all">
                                <h4 className="font-black text-slate-900 mb-1">{ann.title}</h4>
                                <p className="text-slate-600 text-sm leading-relaxed">{ann.content}</p>
                                <p className="text-[10px] text-slate-400 font-black uppercase mt-3 tracking-widest">
                                    {new Date(ann.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                </p>
                            </div>
                        )) : (
                            <div className="text-center py-12 text-slate-400 font-medium bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100">
                                No announcements at the moment.
                            </div>
                        )}
                    </div>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                        <h2 className="text-xl md:text-2xl font-bold">Quick Start</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link href="/dashboard/mocks" className="p-6 bg-blue-600 rounded-xl text-white hover:bg-blue-700 hover:scale-[1.02] transition-all group">
                                <h4 className="font-bold text-lg mb-1">Full Mock Tests</h4>
                                <p className="text-blue-100 text-sm">Exam-style practice</p>
                                <div className="mt-4 text-white/50 group-hover:text-white transition-colors">→</div>
                            </Link>
                            <Link href="/dashboard/pyq" className="p-6 bg-slate-900 rounded-xl text-white hover:bg-black hover:scale-[1.02] transition-all group">
                                <h4 className="font-bold text-lg mb-1">PYQ Archive</h4>
                                <p className="text-slate-400 text-sm">Previous year papers</p>
                                <div className="mt-4 text-white/50 group-hover:text-white transition-colors">→</div>
                            </Link>
                            <Link href="/dashboard/mocks/custom" className="p-6 bg-purple-600 rounded-xl text-white hover:bg-purple-700 hover:scale-[1.02] transition-all group">
                                <h4 className="font-bold text-lg mb-1">Custom Exam</h4>
                                <p className="text-purple-100 text-sm">Create your own</p>
                                <div className="mt-4 text-white/50 group-hover:text-white transition-colors">→</div>
                            </Link>
                            <Link href="/dashboard/results" className="p-6 bg-white border-2 border-slate-100 rounded-xl hover:border-blue-200 transition-all group">
                                <h4 className="font-bold text-lg mb-1 text-slate-900">Analysis</h4>
                                <p className="text-slate-500 text-sm">View performance</p>
                                <div className="mt-4 text-slate-300 group-hover:text-blue-500 transition-colors">→</div>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Recent Activity</h2>
                            <Link href="/dashboard/results" className="text-sm font-bold text-blue-600 hover:underline">View All</Link>
                        </div>
                        <div className="space-y-4">
                            {(stats?.recentResults || []).map((res: any) => (
                                <div key={res.id} className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-blue-600 shadow-sm border border-slate-100">
                                            {res.score}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">{res.test?.title || "Mock Test"}</p>
                                            <p className="text-xs text-slate-500">{new Date(res.completedAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-xs font-bold px-3 py-1 bg-blue-100 text-blue-700 rounded-full uppercase">
                                        Completed
                                    </div>
                                </div>
                            ))}
                            {(!stats?.recentResults || stats.recentResults.length === 0) && (
                                <p className="text-center py-12 text-slate-400 font-medium">No recent activity found.</p>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
