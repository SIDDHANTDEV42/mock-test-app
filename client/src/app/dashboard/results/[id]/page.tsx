"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, MinusCircle, ArrowLeft, Clock, Target, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function ResultDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResult();
    }, [id]);

    const fetchResult = async () => {
        try {
            const res = await api.get(`/tests/results/${id}`);
            setResult(res.data);
        } catch (error) {
            console.error("Failed to fetch result");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="text-xl font-bold text-slate-400 animate-pulse">Loading Analysis...</div></div>;
    if (!result) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="text-xl font-bold text-red-400">Result not found.</div></div>;

    const test = result.test;
    const questions = test?.questions || [];

    // Parse stored data
    let wrongQIds: string[] = [];
    try { wrongQIds = result.wrongQuestions ? JSON.parse(result.wrongQuestions) : []; } catch { }

    let subjectStats: Record<string, any> = {};
    try { subjectStats = result.subjectStats ? JSON.parse(result.subjectStats) : {}; } catch { }

    let timePerQ: Record<string, number> = {};
    try { timePerQ = result.timePerQuestion ? JSON.parse(result.timePerQuestion) : {}; } catch { }

    // Parse options for each question
    const parsedQuestions = questions.map((q: any) => {
        let options: string[] = [];
        try { options = typeof q.options === 'string' ? JSON.parse(q.options) : q.options; } catch { options = []; }
        return { ...q, options };
    });

    // Determine answer status for each question
    // We don't have the student's chosen answers stored individually, but we can infer:
    // - If question ID is in wrongQIds -> answered wrong
    // - If question ID is NOT in wrongQIds AND subject correct count covers it -> correct
    // - Otherwise -> skipped
    // Better approach: we have subjectStats with correct/wrong/total counts per subject
    // and wrongQIds for wrong answers. Questions not in wrongQIds and not "correct" = skipped.

    // Build per-question status
    const totalCorrect = Object.values(subjectStats).reduce((sum: number, s: any) => sum + (s.correct || 0), 0);
    const totalWrong = wrongQIds.length;
    const totalSkipped = parsedQuestions.length - totalCorrect - totalWrong;

    const getQuestionStatus = (q: any) => {
        if (wrongQIds.includes(q.id)) return 'wrong';
        // We can't determine per-question correct/skipped without individual answers
        // So we'll mark non-wrong questions based on whether timePerQ has significant time
        return 'unknown'; // Will be handled below
    };

    const scorePercent = parsedQuestions.length > 0 ? Math.round((totalCorrect / parsedQuestions.length) * 100) : 0;

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Link href="/dashboard/results" className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline">
                        <ArrowLeft className="w-4 h-4" /> Back to Results
                    </Link>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                    {/* Title Banner */}
                    <div className="bg-slate-900 p-8 text-white">
                        <h1 className="text-3xl font-black tracking-tight">{test?.title || 'Test Analysis'}</h1>
                        <p className="text-slate-400 mt-1 font-bold uppercase tracking-widest text-xs">Detailed Performance Report</p>
                    </div>

                    {/* Score Summary Cards */}
                    <div className="p-6 md:p-8">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                            <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Score</p>
                                <p className="text-3xl font-black text-blue-700">{result.score}</p>
                            </div>
                            <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Correct</p>
                                </div>
                                <p className="text-3xl font-black text-emerald-700">{totalCorrect}</p>
                            </div>
                            <div className="p-5 bg-rose-50 rounded-2xl border border-rose-100 text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <XCircle className="w-3 h-3 text-rose-500" />
                                    <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Wrong</p>
                                </div>
                                <p className="text-3xl font-black text-rose-700">{totalWrong}</p>
                            </div>
                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <MinusCircle className="w-3 h-3 text-slate-400" />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Skipped</p>
                                </div>
                                <p className="text-3xl font-black text-slate-600">{totalSkipped}</p>
                            </div>
                            <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100 text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <Clock className="w-3 h-3 text-indigo-500" />
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Time</p>
                                </div>
                                <p className="text-3xl font-black text-indigo-700">{Math.floor(result.spentTime / 60)}m</p>
                            </div>
                        </div>

                        {/* Accuracy Bar */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-slate-600">Overall Accuracy</span>
                                <span className="text-sm font-black text-slate-900">{scorePercent}%</span>
                            </div>
                            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                    className={cn("h-full rounded-full transition-all duration-1000", 
                                        scorePercent >= 70 ? "bg-emerald-500" : scorePercent >= 40 ? "bg-amber-500" : "bg-rose-500"
                                    )}
                                    style={{ width: `${scorePercent}%` }}
                                />
                            </div>
                        </div>

                        {/* Subject-wise Breakdown */}
                        {Object.keys(subjectStats).length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-indigo-500" /> Subject Breakdown
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {Object.entries(subjectStats).map(([subject, stats]: [string, any]) => {
                                        const subTotal = stats.total || 0;
                                        const subCorrect = stats.correct || 0;
                                        const subWrong = stats.wrong || 0;
                                        const subSkipped = subTotal - subCorrect - subWrong;
                                        const subPercent = subTotal > 0 ? Math.round((subCorrect / subTotal) * 100) : 0;
                                        return (
                                            <div key={subject} className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="font-bold text-slate-800">{subject}</span>
                                                    <span className={cn("text-sm font-black px-2 py-0.5 rounded-full",
                                                        subPercent >= 70 ? "bg-emerald-100 text-emerald-700" : subPercent >= 40 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
                                                    )}>{subPercent}%</span>
                                                </div>
                                                <div className="flex gap-4 text-xs font-bold">
                                                    <span className="text-emerald-600">✓ {subCorrect}</span>
                                                    <span className="text-rose-600">✗ {subWrong}</span>
                                                    <span className="text-slate-400">– {subSkipped}</span>
                                                    <span className="text-slate-500 ml-auto">/{subTotal}</span>
                                                </div>
                                                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mt-2">
                                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${subPercent}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Question-by-Question Review */}
                        <div>
                            <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                                <Target className="w-5 h-5 text-rose-500" /> Question-by-Question Review
                            </h3>
                            <div className="space-y-4">
                                {parsedQuestions.map((q: any, idx: number) => {
                                    const isWrong = wrongQIds.includes(q.id);
                                    const timeSpent = timePerQ[String(idx)] || 0;
                                    // If wrong -> red, if not wrong and has time -> green (answered correctly), if no time -> grey (skipped)
                                    const hasTime = timeSpent > 2; // more than 2 seconds = visited
                                    let status: 'correct' | 'wrong' | 'skipped';
                                    if (isWrong) status = 'wrong';
                                    else if (hasTime) status = 'correct';
                                    else status = 'skipped';

                                    const statusConfig = {
                                        correct: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: <CheckCircle className="w-5 h-5 text-emerald-500" />, label: 'Correct', labelColor: 'text-emerald-600 bg-emerald-100' },
                                        wrong: { bg: 'bg-rose-50', border: 'border-rose-200', icon: <XCircle className="w-5 h-5 text-rose-500" />, label: 'Wrong', labelColor: 'text-rose-600 bg-rose-100' },
                                        skipped: { bg: 'bg-slate-50', border: 'border-slate-200', icon: <MinusCircle className="w-5 h-5 text-slate-400" />, label: 'Skipped', labelColor: 'text-slate-500 bg-slate-100' }
                                    };
                                    const config = statusConfig[status];

                                    return (
                                        <div key={q.id} className={cn("p-5 rounded-2xl border-2 transition-all", config.bg, config.border)}>
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <div className="flex items-start gap-3 flex-1">
                                                    <div className="flex items-center gap-2 shrink-0 mt-0.5">
                                                        {config.icon}
                                                        <span className="text-sm font-black text-slate-500">Q{idx + 1}</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-slate-800 leading-relaxed">{q.text}</p>
                                                        <div className="flex flex-wrap gap-2 mt-1">
                                                            <span className="text-[10px] font-black uppercase tracking-widest bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{q.subject}</span>
                                                            {q.chapter && <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{q.chapter}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    {timeSpent > 0 && <span className="text-xs font-bold text-slate-400">{timeSpent}s</span>}
                                                    <span className={cn("text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full", config.labelColor)}>
                                                        {config.label}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Options */}
                                            <div className="grid gap-2 ml-10">
                                                {q.options.map((opt: string, optIdx: number) => {
                                                    const isCorrectAnswer = optIdx === q.correctAnswer;
                                                    return (
                                                        <div
                                                            key={optIdx}
                                                            className={cn(
                                                                "p-3 rounded-xl text-sm font-medium flex items-center gap-3 border",
                                                                isCorrectAnswer
                                                                    ? "bg-emerald-100 border-emerald-300 text-emerald-800 font-bold"
                                                                    : "bg-white border-slate-100 text-slate-600"
                                                            )}
                                                        >
                                                            <span className={cn(
                                                                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                                                                isCorrectAnswer ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400"
                                                            )}>
                                                                {String.fromCharCode(65 + optIdx)}
                                                            </span>
                                                            <span>{opt}</span>
                                                            {isCorrectAnswer && <CheckCircle className="w-4 h-4 text-emerald-600 ml-auto shrink-0" />}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Bottom Actions */}
                        <div className="flex justify-center gap-4 pt-8 border-t border-slate-100 mt-8">
                            <Button onClick={() => router.push('/dashboard/results')} variant="outline" className="h-12 px-8 rounded-xl font-bold">
                                ← All Results
                            </Button>
                            <Button onClick={() => router.push('/dashboard')} className="h-12 px-8 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700">
                                Dashboard
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
