"use client";

import { useState, useEffect } from "react";
import { Star, MessageSquare, Clock, User, CheckCircle } from "lucide-react";
import api from "@/lib/api";

export default function AdminReviews() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const res = await api.get("/reviews");
            setReviews(res.data);
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 pb-32">
            <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-2xl relative">
                <div className="relative z-10 text-center">
                    <h1 className="text-3xl font-bold tracking-tight">Student Feedback & Reviews</h1>
                    <p className="mt-2 text-slate-400 uppercase tracking-widest text-xs font-bold">Monitor platform sentiment and test quality</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-20 text-slate-400">Loading reviews...</div>
            ) : reviews.length === 0 ? (
                <div className="bg-white rounded-2xl p-20 text-center border-2 border-dashed border-slate-200 text-slate-400">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-xl font-medium">No reviews found yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {reviews.map((r) => (
                        <div key={r.id} className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 hover:border-indigo-200 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold group-hover:scale-110 transition-transform">
                                        {(r.user?.name || 'U')[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{r.user?.name || 'Unknown'}</p>
                                        <p className="text-xs text-slate-500">{r.user?.email || ''}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1 text-amber-500">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < (r.rating || 0) ? 'fill-current' : 'text-slate-200'}`} />
                                    ))}
                                </div>
                            </div>
                            
                            <div className="bg-slate-50 rounded-xl p-4 mb-4 relative italic text-slate-700 min-h-[80px]">
                                <span className="absolute -top-2 -left-2 text-3xl text-indigo-200 opacity-50">"</span>
                                {r.content}
                                <span className="absolute -bottom-4 -right-2 text-3xl text-indigo-200 opacity-50">"</span>
                            </div>

                            <div className="flex flex-col gap-2 pt-4 border-t border-slate-50">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                    Test: <span className="text-slate-700">{r.test?.title || 'Deleted Test'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <Clock className="w-4 h-4" />
                                    {new Date(r.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
