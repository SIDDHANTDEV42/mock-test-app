"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, BookOpen, GraduationCap, Calendar, ArrowLeft, PlayCircle } from "lucide-react";

export default function PYQArchive() {
    const [hierarchy, setHierarchy] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [path, setPath] = useState<string[]>([]); // [Subject, Chapter, Year]

    useEffect(() => {
        fetchPYQs();
    }, []);

    const fetchPYQs = async () => {
        try {
            const res = await api.get("/questions/pyq");
            setHierarchy(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch PYQs");
            setLoading(false);
        }
    };

    const currentLevel = () => {
        if (!hierarchy) return null;
        if (path.length === 0) return Object.keys(hierarchy); // Subjects
        if (path.length === 1) return Object.keys(hierarchy[path[0]] || {}); // Chapters
        if (path.length === 2) return Object.keys(hierarchy[path[0]]?.[path[1]] || {}); // Years
        if (path.length === 3) return hierarchy[path[0]]?.[path[1]]?.[path[2]]; // Questions list
        return null;
    };

    const handleSelect = (item: string) => {
        setPath([...path, item]);
    };

    const goBack = () => {
        setPath(path.slice(0, -1));
    };

    if (loading) return <div className="p-20 text-center font-bold text-slate-400">Loading Archive...</div>;

    const items = currentLevel();

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12 space-y-8">
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">PYQ ARCHIVE</h1>
                        <p className="text-slate-500 font-medium">Master the patterns of previous years.</p>
                    </div>
                    <Link href="/dashboard">
                        <Button variant="ghost" className="text-slate-400 font-bold hover:text-indigo-600 uppercase tracking-widest text-[10px]">
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>

                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm font-bold bg-white p-4 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
                    <button onClick={() => setPath([])} className={`hover:text-indigo-600 transition-colors uppercase tracking-widest text-[11px] ${path.length === 0 ? 'text-indigo-600' : 'text-slate-400'}`}>
                        All Subjects
                    </button>
                    {path.map((p, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <ChevronRight className="w-4 h-4 text-slate-300" />
                            <button 
                                onClick={() => setPath(path.slice(0, i + 1))}
                                className={`hover:text-indigo-600 transition-colors uppercase tracking-widest text-[11px] ${i === path.length - 1 ? 'text-indigo-600' : 'text-slate-400'}`}
                            >
                                {p}
                            </button>
                        </div>
                    ))}
                </div>

                {path.length < 3 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {path.length > 0 && (
                            <div 
                                onClick={goBack}
                                className="p-8 bg-white rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group"
                            >
                                <ArrowLeft className="w-8 h-8 text-slate-300 group-hover:text-indigo-400 mb-2 transition-transform group-hover:-translate-x-1" />
                                <span className="text-sm font-black text-slate-400 group-hover:text-indigo-500 uppercase tracking-widest">Go Back</span>
                            </div>
                        )}
                        {items && items.map((item: string) => (
                            <div 
                                key={item}
                                onClick={() => handleSelect(item)}
                                className="p-8 bg-white rounded-3xl border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-400 hover:scale-[1.02] transition-all cursor-pointer group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform" />
                                {path.length === 0 && <GraduationCap className="w-10 h-10 text-indigo-500 mb-4" />}
                                {path.length === 1 && <BookOpen className="w-10 h-10 text-blue-500 mb-4" />}
                                {path.length === 2 && <Calendar className="w-10 h-10 text-emerald-500 mb-4" />}
                                <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{item}</h3>
                                <p className="text-slate-400 text-sm font-bold mt-1 uppercase tracking-widest">
                                    {path.length === 0 ? "Subject" : path.length === 1 ? "Chapter" : "Year"}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-indigo-600 p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-200 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                            <div className="relative z-10 flex justify-between items-end">
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                         <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">{path[0]}</span>
                                         <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">{path[2]}</span>
                                    </div>
                                    <h2 className="text-4xl font-black tracking-tight uppercase">{path[1]}</h2>
                                    <p className="text-indigo-100 font-medium">Practice {items?.length || 0} essential questions from this session.</p>
                                </div>
                                <Button className="bg-white text-indigo-600 hover:bg-indigo-50 font-black px-8 py-6 rounded-2xl shadow-xl flex gap-2 items-center text-lg">
                                    <PlayCircle className="w-6 h-6" /> START PRACTICE
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            {items && items.map((q: any, idx: number) => (
                                <div key={q.id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-[11px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 uppercase tracking-widest">Question {idx + 1}</span>
                                        {q.level && <span className="text-[11px] font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 uppercase tracking-widest">{q.level}</span>}
                                    </div>
                                    <p className="text-xl font-bold text-slate-800 leading-relaxed mb-6">{q.text}</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {q.options.map((opt: string, i: number) => (
                                            <div key={i} className={`p-4 rounded-2xl border-2 font-bold transition-all flex items-center gap-4 ${i === q.correctAnswer ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs ${i === q.correctAnswer ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 border border-slate-200 shadow-sm'}`}>
                                                    {String.fromCharCode(65 + i)}
                                                </div>
                                                {opt}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {items?.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-medium">No PYQs found in this category yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
