"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PYQsPage() {
    const [tests, setTests] = useState<any[]>([]);

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        try {
            const res = await api.get("/tests");
            // Filter only PYQs
            setTests(res.data.filter((t: any) => t.type === 'PYQ'));
        } catch (error) {
            console.error("Failed to fetch tests");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 academic-bg p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-end">
                    <div>
                        <Link href="/dashboard" className="text-sm font-bold text-slate-600 hover:underline mb-2 block">← Back to Dashboard</Link>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Previous Year Questions</h1>
                        <p className="text-slate-500 mt-2 font-medium">Practice with actual questions from past examinations.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tests.map((test) => (
                        <div key={test.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-orange-200 transition-all group flex flex-col justify-between">
                            <div>
                                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 mb-4 group-hover:scale-110 transition-transform">
                                    <span className="font-bold">📚</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{test.title}</h3>
                                <p className="text-slate-500 text-sm mb-6 line-clamp-2">{test.description}</p>
                                
                                <div className="flex flex-wrap gap-2 mb-8">
                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">⏱️ {test.duration}m</span>
                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">📚 {test.questions?.length || 0} Qs</span>
                                    <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full uppercase">PYQ</span>
                                </div>
                            </div>

                            <Link href={`/dashboard/tests/${test.id}`} className="w-full">
                                <Button className="w-full bg-slate-900 hover:bg-black text-white font-bold h-12 rounded-xl">
                                    Open Paper
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>

                {tests.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-bold text-xl">No PYQ papers available yet.</p>
                        <p className="text-slate-400">Administrators are working on adding them!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
