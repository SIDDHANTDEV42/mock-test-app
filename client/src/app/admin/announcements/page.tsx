"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Megaphone, Plus } from "lucide-react";

export default function AnnouncementManagement() {
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const res = await api.get("/announcements");
            setAnnouncements(res.data);
        } catch (error) {
            console.error("Failed to fetch announcements");
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post("/announcements", { title, content });
            setTitle("");
            setContent("");
            fetchAnnouncements();
        } catch (error) {
            alert("Failed to create announcement");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this announcement?")) return;
        try {
            await api.delete(`/announcements/${id}`);
            fetchAnnouncements();
        } catch (error) {
            alert("Failed to delete announcement");
        }
    };

    return (
        <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg">
                    <Megaphone className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Announcement Center</h1>
                    <p className="text-slate-500 font-medium tracking-wide italic">Broadcast important updates to all students.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Creation Form */}
                <div className="lg:col-span-1">
                    <form onSubmit={handleCreate} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-6">
                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                             <Plus className="w-5 h-5 text-indigo-500" /> New Broadcast
                        </h2>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
                            <Input 
                                value={title} 
                                onChange={e => setTitle(e.target.value)} 
                                placeholder="Exam Postponed, New Batch, etc."
                                className="h-12 rounded-xl border-2 border-slate-100 focus:border-indigo-600 font-bold"
                                required 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Message Content</label>
                            <textarea 
                                value={content} 
                                onChange={e => setContent(e.target.value)} 
                                placeholder="Type your announcement detail here..."
                                className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-indigo-600 font-medium min-h-[150px] outline-none"
                                required 
                            />
                        </div>
                        <Button 
                            type="submit" 
                            disabled={isLoading} 
                            className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-95"
                        >
                            {isLoading ? "Broadcasting..." : "POST ANNOUNCEMENT"}
                        </Button>
                    </form>
                </div>

                {/* History */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-black text-slate-900 ml-2">Recent Broadcasts</h2>
                    {announcements.length > 0 ? (
                        <div className="space-y-4">
                            {announcements.map((ann) => (
                                <div key={ann.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex justify-between items-start hover:shadow-md transition-all">
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-black text-slate-900">{ann.title}</h3>
                                        <p className="text-slate-600 font-medium text-sm leading-relaxed">{ann.content}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-2">
                                            Posted on {new Date(ann.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => handleDelete(ann.id)}
                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-20 bg-slate-100/50 rounded-[3rem] border-2 border-dashed border-slate-200 text-center flex flex-col items-center">
                             <Megaphone className="w-12 h-12 text-slate-200 mb-4" />
                             <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No announcements posted yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
