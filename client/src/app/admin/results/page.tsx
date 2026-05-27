"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Search, Filter, Calendar, Award, Clock, ClipboardCheck } from "lucide-react";

export default function AdminResults() {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const res = await api.get("/questions/admin-results"); // I'll need to create this endpoint
            setResults(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch results");
            setLoading(false);
        }
    };

    if (loading) return <div className="p-20 text-center font-bold text-slate-400 italic animate-pulse tracking-widest uppercase">Fetching Student Submissions...</div>;

    return (
        <div className="space-y-8 p-4 md:p-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">STUDENT SUBMISSIONS</h1>
                    <p className="text-slate-500 font-medium">Detailed tracking of all examination attempts.</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                        <input 
                            placeholder="Search by student or test..." 
                            className="pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64 md:w-80 transition-all font-medium"
                        />
                    </div>
                </div>
            </div>

            <div className="grid gap-4">
                {results.map((res) => (
                    <div key={res.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all flex flex-col md:flex-row justify-between items-center gap-6 group">
                        <div className="flex items-center gap-6 w-full">
                            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-slate-200 group-hover:rotate-3 transition-transform">
                                {res.score}
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold text-slate-900">{res.test?.title || "Mock Test"}</h3>
                                <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest">{res.user?.name}</p>
                                <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-400 uppercase tracking-tighter pt-2">
                                    <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(res.completedAt).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                                        <Clock className="w-3.5 h-3.5" />
                                        {Math.floor(res.spentTime / 60)}m {res.spentTime % 60}s
                                    </span>
                                    {res.test?.type && (
                                        <span className="flex items-center gap-1.5 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full border border-indigo-100">
                                            {res.test.type}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <Button variant="outline" className="flex-1 md:flex-none py-6 px-10 rounded-2xl font-black text-xs uppercase tracking-widest border-2 hover:bg-slate-50">
                                Details
                            </Button>
                        </div>
                    </div>
                ))}
                
                {results.length === 0 && (
                    <div className="bg-white p-20 rounded-[3rem] border-4 border-dashed border-slate-100 text-center space-y-4">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ClipboardCheck className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 uppercase">No Submissions Found</h3>
                        <p className="text-slate-400 font-medium max-w-sm mx-auto">Once students start taking tests, their results and performance analytics will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
