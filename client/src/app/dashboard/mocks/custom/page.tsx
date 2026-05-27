"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdvancedCustomTest() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [chapters, setChapters] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        subjects: [] as string[],
        chapters: [] as string[],
        questionCount: 10,
        title: "My Custom Exam",
        duration: 30,
        level: "",
        isPYQOnly: false,
        priority: "RANDOM" as "RANDOM" | "NEWEST" | "OLDEST"
    });

    const allSubjects = ["Physics", "Chemistry", "Maths", "Biology"];

    useEffect(() => {
        if (formData.subjects.length > 0) {
            fetchChapters();
        } else {
            setChapters([]);
        }
    }, [formData.subjects]);

    const fetchChapters = async () => {
        try {
            // Fetch chapters for all selected subjects
            const chapterProms = formData.subjects.map(s => api.get(`/questions/chapters?subject=${s}`));
            const results = await Promise.all(chapterProms);
            const flatChapters = results.flatMap(r => r.data);
            setChapters(Array.from(new Set(flatChapters)) as string[]);
        } catch (error) {
            console.error("Failed to fetch chapters");
        }
    };

    const toggleSubject = (subj: string) => {
        const newSubjects = formData.subjects.includes(subj)
            ? formData.subjects.filter(s => s !== subj)
            : [...formData.subjects, subj];
        setFormData({ ...formData, subjects: newSubjects, chapters: [] });
    };

    const toggleChapter = (chap: string) => {
        const newChaps = formData.chapters.includes(chap)
            ? formData.chapters.filter(c => c !== chap)
            : [...formData.chapters, chap];
        setFormData({ ...formData, chapters: newChaps });
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.subjects.length === 0) {
            alert("Please select at least one subject");
            return;
        }
        setLoading(true);
        try {
            const res = await api.post("/tests/custom", formData);
            router.push(`/dashboard/tests/${res.data.id}`);
        } catch (error) {
            alert("Failed to generate test. Ensure there are enough questions in selected chapters.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 academic-bg p-8 flex items-center justify-center">
            <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-[2rem] shadow-2xl border border-slate-100">
                <div className="text-center">
                    <div className="inline-block p-4 bg-indigo-50 rounded-2xl text-indigo-600 mb-4">
                        <span className="text-3xl font-bold">⚡</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Advanced Custom Exam</h1>
                    <p className="text-slate-500 mt-2 font-medium">Multi-subject practice with chapter control.</p>
                </div>

                <form onSubmit={handleCreate} className="space-y-8">
                    <div className="space-y-4">
                        <label className="text-sm font-black text-slate-400 uppercase tracking-widest block">1. Exam Details</label>
                        <div className="grid grid-cols-2 gap-4">
                            <input 
                                className="p-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold col-span-2"
                                value={formData.title}
                                onChange={e => setFormData({...formData, title: e.target.value})}
                                placeholder="Exam Title"
                                required
                            />
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 ml-1">Questions</label>
                                <input 
                                    type="number"
                                    className="w-full p-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold"
                                    value={formData.questionCount}
                                    onChange={e => setFormData({...formData, questionCount: parseInt(e.target.value)})}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 ml-1">Time (min)</label>
                                <input 
                                    type="number"
                                    className="w-full p-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold"
                                    value={formData.duration}
                                    onChange={e => setFormData({...formData, duration: parseInt(e.target.value)})}
                                    required
                                />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <label className="text-xs font-bold text-slate-500 ml-1">Exam Level</label>
                                <div className="flex gap-2">
                                    {["Any", "JEE", "CET", "NEET"].map(lvl => (
                                        <button
                                            key={lvl}
                                            type="button"
                                            onClick={() => setFormData({...formData, level: lvl === "Any" ? "" : lvl})}
                                            className={cn(
                                                "flex-1 p-3 rounded-xl font-bold transition-all border-2",
                                                (formData.level === lvl || (lvl === "Any" && formData.level === ""))
                                                    ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                                                    : "bg-white text-slate-400 border-slate-100 hover:border-slate-300"
                                            )}
                                        >
                                            {lvl}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-black text-slate-400 uppercase tracking-widest block">2. Select Subjects</label>
                        <div className="flex flex-wrap gap-3">
                            {allSubjects.map(subj => (
                                <button
                                    key={subj}
                                    type="button"
                                    onClick={() => toggleSubject(subj)}
                                    className={cn(
                                        "px-6 py-3 rounded-2xl font-bold transition-all border-2",
                                        formData.subjects.includes(subj)
                                            ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100 scale-105"
                                            : "bg-white text-slate-500 border-slate-100 hover:border-indigo-200"
                                    )}
                                >
                                    {subj}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-black text-slate-400 uppercase tracking-widest block">3. PYQ & Priority Filters</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div 
                                onClick={() => setFormData({...formData, isPYQOnly: !formData.isPYQOnly})}
                                className={cn(
                                    "p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between",
                                    formData.isPYQOnly ? "bg-emerald-50 border-emerald-500 shadow-lg" : "bg-white border-slate-100 hover:border-emerald-200"
                                )}
                            >
                                <div className="space-y-1">
                                    <h4 className="font-bold text-slate-900">Include PYQs Only</h4>
                                    <p className="text-xs text-slate-500">Pick from Previous Year Questions only.</p>
                                </div>
                                <div className={cn("w-6 h-6 rounded-full border-2", formData.isPYQOnly ? "bg-emerald-500 border-emerald-500" : "border-slate-200")} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Selection Priority</label>
                                <div className="flex bg-slate-100 p-1 rounded-xl">
                                    {["RANDOM", "NEWEST", "OLDEST"].map(p => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setFormData({...formData, priority: p as any})}
                                            className={cn(
                                                "flex-1 py-2 rounded-lg text-xs font-black transition-all",
                                                formData.priority === p ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                            )}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {chapters.length > 0 && (
                    <div className="space-y-4">
                        <label className="text-sm font-black text-slate-400 uppercase tracking-widest block">4. Select Chapters (Optional)</label>
                            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                {chapters.map(chap => (
                                    <button
                                        key={chap}
                                        type="button"
                                        onClick={() => toggleChapter(chap)}
                                        className={cn(
                                            "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                                            formData.chapters.includes(chap)
                                                ? "bg-slate-900 text-white"
                                                : "bg-white text-slate-500 border border-slate-100 hover:bg-slate-50"
                                        )}
                                    >
                                        {chap}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <Button 
                        type="submit" 
                        disabled={loading}
                        className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xl rounded-2xl shadow-xl shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-95"
                    >
                        {loading ? "Generating..." : "Launch Custom Exam →"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
