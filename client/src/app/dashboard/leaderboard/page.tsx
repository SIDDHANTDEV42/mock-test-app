"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LeaderboardPage() {
    const [leaders, setLeaders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const res = await api.get("/users/leaderboard");
            setLeaders(res.data);
        } catch (error) {
            console.error("Failed to fetch leaderboard");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 academic-bg">
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b p-4 flex justify-between items-center px-8">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl hover:bg-blue-700 transition">
                        M
                    </Link>
                    <h1 className="text-xl font-bold tracking-tight">EXAMPREP</h1>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="outline" className="text-slate-600 border-slate-200 hover:bg-slate-50">Back to Dashboard</Button>
                    </Link>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
                <div className="text-center space-y-4 mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 text-amber-500 mb-4 shadow-inner">
                        <Trophy className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Global Leaderboard</h1>
                    <p className="text-slate-500 font-medium">Top performers ranked by total accumulated score</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden mt-8">
                    {isLoading ? (
                        <div className="p-12 text-center text-slate-400 font-medium animate-pulse">Loading rankings...</div>
                    ) : leaders.length === 0 ? (
                        <div className="p-12 text-center text-slate-400 font-medium">No one has taken any tests yet! Be the first.</div>
                    ) : (
                        <div className="p-6 md:p-10">
                            {/* Podium */}
                            {leaders.length > 0 && (
                                <div className="flex justify-center items-end gap-2 md:gap-8 mb-12 h-64 border-b border-slate-100 pb-8 mt-4 isolate">
                                    {/* 2nd Place */}
                                    {leaders.length > 1 && (
                                        <div className="flex flex-col items-center flex-1 max-w-[150px] animate-in slide-in-from-bottom-8 duration-700 fade-in delay-100 fill-mode-both">
                                            <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 rounded-full border-4 border-slate-300 flex items-center justify-center -mb-6 z-10 shadow-lg relative">
                                                <Medal className="w-8 h-8 text-slate-400" />
                                                <div className="absolute -top-3 -right-2 text-2xl font-black text-slate-400">#2</div>
                                            </div>
                                            <div className="w-full h-32 bg-gradient-to-t from-slate-200 to-slate-100 rounded-t-xl border border-slate-200 border-b-0 flex flex-col items-center justify-end p-4 pb-2 shadow-inner">
                                                <p className="font-bold text-center text-slate-800 text-sm md:text-base leading-tight truncate w-full">{leaders[1].name}</p>
                                                <p className="text-xs font-black text-slate-500 mt-1">{leaders[1].totalScore} pts</p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* 1st Place */}
                                    {leaders.length > 0 && (
                                        <div className="flex flex-col items-center flex-1 max-w-[170px] animate-in slide-in-from-bottom-12 duration-700 fade-in fill-mode-both">
                                            <div className="w-20 h-20 md:w-24 md:h-24 bg-amber-50 rounded-full border-4 border-amber-300 flex items-center justify-center -mb-8 z-20 shadow-xl shadow-amber-200/50 relative">
                                                <Trophy className="w-10 h-10 md:w-12 md:h-12 text-amber-500" />
                                                <div className="absolute -top-4 -right-1 text-3xl font-black text-amber-500 drop-shadow-sm">#1</div>
                                            </div>
                                            <div className="w-full h-40 bg-gradient-to-t from-amber-200 via-amber-100 to-amber-50 rounded-t-xl border-x-4 border-t-4 border-amber-200 border-b-0 flex flex-col items-center justify-end p-4 pb-2 shadow-inner">
                                                <p className="font-bold text-center text-amber-900 text-sm md:text-lg leading-tight truncate w-full">{leaders[0].name}</p>
                                                <p className="text-sm font-black text-amber-700 mt-1">{leaders[0].totalScore} pts</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* 3rd Place */}
                                    {leaders.length > 2 && (
                                        <div className="flex flex-col items-center flex-1 max-w-[150px] animate-in slide-in-from-bottom-4 duration-700 fade-in delay-200 fill-mode-both">
                                            <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-50 rounded-full border-4 border-orange-300 flex items-center justify-center -mb-6 z-10 shadow-lg relative">
                                                <Medal className="w-8 h-8 text-orange-500" />
                                                <div className="absolute -top-3 -right-2 text-2xl font-black text-orange-500">#3</div>
                                            </div>
                                            <div className="w-full h-24 bg-gradient-to-t from-orange-200/60 to-orange-100 rounded-t-xl border border-orange-200 border-b-0 flex flex-col items-center justify-end p-4 pb-2 shadow-inner">
                                                <p className="font-bold text-center text-orange-900 text-sm md:text-base leading-tight truncate w-full">{leaders[2].name}</p>
                                                <p className="text-xs font-black text-orange-700 mt-1">{leaders[2].totalScore} pts</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Runner Ups List */}
                            <div className="space-y-4">
                                {leaders.slice(3).map((user, idx) => {
                                    const rank = idx + 4;
                                    return (
                                        <div key={user.id} className="flex items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
                                            <div className="flex items-center justify-center w-12 shrink-0">
                                                <span className="text-lg font-black text-slate-400">#{rank}</span>
                                            </div>
                                            <div className="flex-1 px-4">
                                                <h3 className="text-lg font-bold text-slate-800">{user.name}</h3>
                                                <div className="flex items-center gap-3 text-xs md:text-sm text-slate-500 mt-1">
                                                    <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {user.testsTaken} tests taken</span>
                                                    <span>•</span>
                                                    <span>{user.avgScore} avg score</span>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0 pr-4">
                                                <div className="text-xl md:text-2xl font-black tracking-tight text-slate-700">
                                                    {user.totalScore}
                                                </div>
                                                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">
                                                    Total Score
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Academic Excellence Rewards Suggestion */}
                <div className="bg-indigo-50/50 p-8 md:p-10 rounded-[2.5rem] border border-indigo-100 shadow-sm relative overflow-hidden mt-12 mb-20 animate-in slide-in-from-bottom-8 duration-700 fade-in delay-300">
                    <div className="absolute -right-8 -bottom-8 opacity-[0.03] pointer-events-none">
                        <Trophy className="w-96 h-96 text-indigo-900" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 mb-8">
                         <div className="p-4 bg-indigo-100 text-indigo-600 rounded-2xl shadow-inner">
                              <Star className="w-8 h-8 fill-indigo-500 text-indigo-500" />
                         </div>
                         <div>
                            <h2 className="text-3xl font-black text-indigo-900 tracking-tight">Academic Excellence Rewards</h2>
                            <p className="text-indigo-600/80 font-medium text-sm mt-1 uppercase tracking-widest">Achieve greatness and get rewarded</p>
                         </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:border-amber-200 transition-all group">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                                     <Medal className="w-6 h-6 text-amber-500" />
                                </div>
                                <h4 className="font-extrabold text-slate-800 uppercase tracking-widest text-sm text-amber-600">Gold Tier</h4>
                            </div>
                            <p className="text-slate-600 text-sm font-medium leading-relaxed">Maintain <span className="text-amber-600 font-bold">Top 3</span> position for a full week (7 days) to unlock access to exclusive "Elite" level Custom Mock Tests.</p>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:border-slate-300 transition-all group">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                                     <Medal className="w-6 h-6 text-slate-500" />
                                </div>
                                <h4 className="font-extrabold text-slate-800 uppercase tracking-widest text-sm text-slate-500">Silver Tier</h4>
                            </div>
                            <p className="text-slate-600 text-sm font-medium leading-relaxed">Maintain <span className="text-slate-500 font-bold">Top 5</span> position for 5 days to earn a physical printable certificate of exam readiness achievement.</p>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:border-orange-200 transition-all group">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                                     <Medal className="w-6 h-6 text-orange-500" />
                                </div>
                                <h4 className="font-extrabold text-slate-800 uppercase tracking-widest text-sm text-orange-600">Bronze Tier</h4>
                            </div>
                            <p className="text-slate-600 text-sm font-medium leading-relaxed">Maintain <span className="text-orange-600 font-bold">Top 10</span> position for 3 days to display a special virtual student medal globally next to your name.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
