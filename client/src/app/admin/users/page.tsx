"use client";

import { useState, useEffect } from "react";
import { Users, Mail, User as UserIcon, Calendar, BarChart2, ChevronRight, Trash2, Eye, EyeOff, Shield } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function AdminUsers() {
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [userStats, setUserStats] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get("/users");
            setUsers(res.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserStats = async (user: any) => {
        setSelectedUser(user);
        try {
            const res = await api.get(`/users/${user.id}/stats`);
            setUserStats(res.data);
        } catch (error) {
            console.error("Failed to fetch user stats", error);
        }
    };

    const handleDelete = async (ids: string[]) => {
        if (!confirm(`Are you sure you want to delete ${ids.length} user(s)? This will also delete their test results and reviews.`)) return;
        try {
            await api.delete("/users", { data: { ids } });
            setSelectedIds([]);
            if (selectedUser && ids.includes(selectedUser.id)) {
                setSelectedUser(null);
                setUserStats(null);
            }
            fetchUsers();
        } catch (error) {
            alert("Failed to delete users");
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const togglePasswordVisibility = (userId: string) => {
        setVisiblePasswords(prev => ({ ...prev, [userId]: !prev[userId] }));
    };

    return (
        <div className="p-8 pb-32">
            <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-2xl relative">
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                        <p className="mt-2 text-slate-400">Monitor student performance and account details.</p>
                    </div>
                    {selectedIds.length > 0 && (
                        <Button 
                            variant="destructive" 
                            onClick={() => handleDelete(selectedIds)}
                            className="bg-red-600 hover:bg-red-700 font-bold shadow-lg"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Selected ({selectedIds.length})
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* User List */}
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50">
                        <h2 className="font-bold text-slate-800 flex items-center gap-2">
                            <Users className="w-5 h-5 text-indigo-600" />
                            All Students ({users.length})
                        </h2>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                        {users.map((u) => (
                            <div
                                key={u.id}
                                className={`p-4 hover:bg-indigo-50 transition-all flex items-center justify-between group ${selectedUser?.id === u.id ? 'bg-indigo-50 border-r-4 border-indigo-600' : ''}`}
                            >
                                <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => fetchUserStats(u)}>
                                    {/* Selection checkbox */}
                                    <div
                                        onClick={(e) => { e.stopPropagation(); toggleSelect(u.id); }}
                                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer shrink-0 ${selectedIds.includes(u.id) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 hover:border-indigo-400'}`}
                                    >
                                        {selectedIds.includes(u.id) && <div className="w-2 h-2 bg-white rounded-sm" />}
                                    </div>

                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors shrink-0">
                                        {u.name?.[0]?.toUpperCase() || '?'}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-slate-800 truncate">{u.name}</p>
                                            {u.role === 'ADMIN' && (
                                                <Shield className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 truncate">{u.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleDelete([u.id]); }}
                                        className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                        title="Delete user"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <ChevronRight className={`w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-all ${selectedUser?.id === u.id ? 'translate-x-1 text-indigo-600' : ''}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* User Details & Stats */}
                <div className="lg:col-span-2 space-y-8">
                    {selectedUser ? (
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Profile Header */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-200">
                                        {selectedUser.name?.[0]?.toUpperCase() || '?'}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900">{selectedUser.name}</h3>
                                        <div className="flex flex-wrap gap-4 mt-2">
                                            <span className="flex items-center gap-1 text-sm text-slate-500">
                                                <Mail className="w-4 h-4" /> {selectedUser.email}
                                            </span>
                                             <span className="flex items-center gap-1 text-sm text-slate-500">
                                                <Calendar className="w-4 h-4" /> Joined: {new Date(selectedUser.createdAt).toLocaleDateString()}
                                            </span>
                                            {selectedUser.stream && (
                                                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                                                    Stream: {selectedUser.stream}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${selectedUser.role === 'ADMIN' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                        {selectedUser.role}
                                    </span>
                                    <Button 
                                        variant="destructive" 
                                        size="sm"
                                        onClick={() => handleDelete([selectedUser.id])}
                                        className="rounded-xl"
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                                    </Button>
                                </div>
                            </div>

                            {/* Credentials Section */}
                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-widest">Account Credentials</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</label>
                                        <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-sm text-slate-700 select-all">
                                            {selectedUser.email}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                                        <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-sm text-slate-400 italic">
                                            Hashed &amp; Protected
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-400 italic">User ID: {selectedUser.id}</p>
                            </div>

                            {/* Analytics Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Weak Areas */}
                                <div className="space-y-4">
                                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                        <BarChart2 className="w-5 h-5 text-rose-500" />
                                        Potential Weak Areas
                                    </h4>
                                    <div className="space-y-3">
                                        {userStats?.weakAreas?.length > 0 ? (
                                            userStats.weakAreas.map((w: any, i: number) => (
                                                <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="font-medium text-slate-700">{w.subject}</span>
                                                        <span className="text-sm font-bold text-rose-600">{Math.round(w.average)}% Avg.</span>
                                                    </div>
                                                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                                        <div className="h-full bg-rose-500" style={{ width: `${w.average}%` }}></div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-slate-500 italic">No data yet.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="space-y-4">
                                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                        <Users className="w-5 h-5 text-indigo-500" />
                                        Performance Overview
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100 text-center">
                                            <p className="text-xs text-indigo-600 font-bold uppercase tracking-widest mb-1">Total Tests</p>
                                            <p className="text-3xl font-black text-indigo-900">{userStats?.results?.length || 0}</p>
                                        </div>
                                         <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                                            <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest mb-1">Best Score</p>
                                            <p className="text-3xl font-black text-emerald-900">
                                                {userStats?.results?.length > 0 ? Math.max(...userStats.results.map((r: any) => r.score)) : 0}
                                            </p>
                                        </div>
                                        <div className="p-6 rounded-2xl bg-slate-100 border border-slate-200 text-center col-span-2">
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Avg. Time per Question</p>
                                            <p className="text-3xl font-black text-slate-800">{userStats?.avgTimePerQuestion || 0}s</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Results Table */}
                            <div className="space-y-4">
                                <h4 className="font-bold text-slate-900">Recent Test History</h4>
                                <div className="overflow-x-auto rounded-xl border border-slate-100">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider">
                                            <tr>
                                                <th className="p-4 border-b">Test Title</th>
                                                <th className="p-4 border-b">Date</th>
                                                <th className="p-4 border-b text-center">Score</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50 text-sm">
                                            {userStats?.results?.map((r: any) => (
                                                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="p-4 font-medium text-slate-800">{r.test?.title || 'Deleted Test'}</td>
                                                    <td className="p-4 text-slate-500">{new Date(r.completedAt).toLocaleDateString()}</td>
                                                    <td className="p-4 text-center">
                                                        <span className={`px-3 py-1 rounded-lg font-bold ${r.score >= 50 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                                                            {r.score}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-[600px] bg-white rounded-2xl shadow-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                                <UserIcon className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-600">No Student Selected</h3>
                            <p className="max-w-xs mt-2">Select a student from the list to view their detailed performance analytics and test history.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
