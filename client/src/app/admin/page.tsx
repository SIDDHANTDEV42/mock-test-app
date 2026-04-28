"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { FileQuestion, BookOpen, Users, ClipboardCheck, TrendingUp, Award } from "lucide-react";

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [announcements, setAnnouncements] = useState<any[]>([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get("/questions/admin-stats");
                setStats(res.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats");
            }
        };
        const fetchAnnouncements = async () => {
            try {
                const res = await api.get("/announcements");
                setAnnouncements(res.data.slice(0, 3));
            } catch (error) {}
        };
        fetchStats();
        fetchAnnouncements();
    }, []);

    const statCards = [
        { label: "Total Questions", value: stats?.questionCount || 0, icon: <FileQuestion className="w-8 h-8 text-indigo-600" />, color: "bg-indigo-50" },
        { label: "Active Tests", value: stats?.testCount || 0, icon: <BookOpen className="w-8 h-8 text-emerald-600" />, color: "bg-emerald-50" },
        { label: "Students", value: stats?.userCount || 0, icon: <Users className="w-8 h-8 text-blue-600" />, color: "bg-blue-50" },
        { label: "Submissions", value: stats?.resultCount || 0, icon: <ClipboardCheck className="w-8 h-8 text-amber-600" />, color: "bg-amber-50", link: "/admin/results" },
    ];

    return (
        <div className="space-y-8 p-4">
            <div className="bg-slate-900 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <TrendingUp className="w-64 h-64" />
                </div>
                <div className="relative z-10">
                    <h1 className="text-4xl font-black tracking-tight mb-2">Platform Overview</h1>
                    <p className="text-slate-400 font-medium">Welcome back, <span className="text-white border-b-2 border-indigo-500">{user?.name}</span>. Here's how the students are performing today.</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, i) => {
                    const CardContent = (
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all group h-full">
                            <div className={`w-16 h-16 ${card.color} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform`}>
                                {card.icon}
                            </div>
                            <h3 className="font-bold text-slate-500 uppercase tracking-widest text-xs mb-1">{card.label}</h3>
                            <p className="text-4xl font-black text-slate-900">{card.value}</p>
                        </div>
                    );

                    return card.link ? (
                        <Link key={i} href={card.link}>
                            {CardContent}
                        </Link>
                    ) : (
                        <div key={i}>{CardContent}</div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
                    <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-indigo-600" />
                        Announcement Center
                    </h3>
                    <div className="space-y-4">
                        {announcements.length === 0 ? (
                            <div className="p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center">
                                <p className="text-slate-400 font-medium italic">No recent announcements from global admins.</p>
                            </div>
                        ) : (
                            announcements.map(a => (
                                <div key={a.id} className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                                    <h4 className="font-bold text-indigo-900">{a.title}</h4>
                                    <p className="text-sm text-indigo-700/80 mt-1 line-clamp-2">{a.content}</p>
                                    <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mt-2">{new Date(a.createdAt).toLocaleDateString()}</p>
                                </div>
                            ))
                        )}
                        <Link href="/admin/announcements" className="block text-center text-sm font-bold text-indigo-600 hover:text-indigo-700 mt-2">Manage All →</Link>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
                    <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                        <Award className="w-6 h-6 text-amber-500" />
                        System Health
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-slate-500">Database Status</span>
                            <span className="text-emerald-500 flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Operational</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-slate-500">Mail Server</span>
                            <span className="text-emerald-500 flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Operational</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-slate-500">Storage</span>
                            <span className="text-indigo-500">92% Free</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
