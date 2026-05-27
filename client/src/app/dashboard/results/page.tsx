"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function StudentResults() {
    const [results, setResults] = useState<any[]>([]);

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const res = await api.get("/tests/results/me");
            setResults(res.data);
        } catch (error) {
            console.error("Failed to fetch results");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 academic-bg p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <Link href="/dashboard" className="text-sm font-bold text-blue-600 hover:underline mb-2 block">← Back to Dashboard</Link>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Your Performance</h1>
                    <p className="text-slate-500 mt-2 font-medium">Detailed breakdown of your mock test attempts.</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900 text-white">
                                <th className="p-6 text-sm font-bold uppercase tracking-widest">Test Name</th>
                                <th className="p-6 text-sm font-bold uppercase tracking-widest text-center">Score</th>
                                <th className="p-6 text-sm font-bold uppercase tracking-widest text-center">Time Spent</th>
                                <th className="p-6 text-sm font-bold uppercase tracking-widest text-right">Completed On</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {results.map((res) => (
                                <tr key={res.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => window.location.href = `/dashboard/results/${res.id}`}>
                                    <td className="p-6">
                                        <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{res.test?.title || 'Deleted Test'}</p>
                                        <p className="text-xs text-slate-400 font-medium">Full Length Mock</p>
                                    </td>
                                    <td className="p-6 text-center">
                                        <span className={cn(
                                            "inline-block px-4 py-1 rounded-full font-black text-lg",
                                            res.score >= 10 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                        )}>
                                            {res.score}
                                        </span>
                                    </td>
                                    <td className="p-6 text-center font-mono font-bold text-slate-500">
                                        {Math.floor(res.spentTime / 60)}m {res.spentTime % 60}s
                                    </td>
                                    <td className="p-6 text-right text-sm font-bold text-slate-400">
                                        {new Date(res.completedAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            {results.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-20 text-center text-slate-400 font-bold italic">
                                        No results found yet. Start your first mock test!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

