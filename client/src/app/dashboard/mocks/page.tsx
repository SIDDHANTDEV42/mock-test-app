"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function MockTestsPage() {
    const [tests, setTests] = useState<any[]>([]);

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        try {
            const res = await api.get("/tests");
            // Filter only official Mocks that are NOT custom
            setTests(res.data.filter((t: any) => t.type === 'MOCK' && !t.isCustom));
        } catch (error) {
            console.error("Failed to fetch tests");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 academic-bg p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-end">
                    <div>
                        <Link href="/dashboard" className="text-sm font-bold text-blue-600 hover:underline mb-2 block">← Back to Dashboard</Link>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Official Mock Tests</h1>
                        <p className="text-slate-500 mt-2 font-medium">Full-length exam simulations designed by experts.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tests.map((test) => (
                        <div key={test.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 transition-all group flex flex-col justify-between">
                            <div>
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                                    <span className="font-bold">📝</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{test.title}</h3>
                                <p className="text-slate-500 text-sm mb-6 line-clamp-2">{test.description}</p>
                                
                                <div className="flex flex-wrap gap-2 mb-8">
                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">⏱️ {test.duration}m</span>
                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">📚 {test.questions?.length || 0} Qs</span>
                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">
                                        {test.subjectMarks ? "Variable Marks" : `+${test.correctPoints ?? 4} / -${test.negativePoints ?? 1} Marks`}
                                    </span>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase">Official</span>
                                </div>
                            </div>

                            {test.isLocked && (!test.startTime || new Date(test.startTime) > new Date()) ? (
                                <Button disabled className="w-full bg-slate-200 text-slate-500 font-bold h-12 rounded-xl flex items-center justify-center gap-2">
                                    🔒 Locked {test.startTime ? `(Starts ${new Date(test.startTime).toLocaleString()})` : ''}
                                </Button>
                            ) : (
                                <Link href={`/dashboard/tests/${test.id}`} className="w-full">
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl">
                                        Start Mock Test
                                    </Button>
                                </Link>
                            )}
                        </div>
                    ))}
                </div>

                {tests.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-bold text-xl">No official mock tests available yet.</p>
                        <p className="text-slate-400">Check back later or try a custom exam!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
