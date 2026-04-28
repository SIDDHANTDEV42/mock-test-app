"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function ManageQuestions() {
    const [questions, setQuestions] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [showBulk, setShowBulk] = useState(false);
    const [csvContent, setCsvContent] = useState("");
    const [formData, setFormData] = useState({
        text: "",
        subject: "Physics",
        chapter: "",
        level: "JEE", // Default level
        correctAnswer: 0,
        options: ["", "", "", ""],
        imageUrl: "",
        year: "",
        isPYQ: false
    });
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const [bulkConfig, setBulkConfig] = useState({ isPYQ: false, year: "", level: "" });

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const res = await api.get("/questions");
            setQuestions(res.data);
        } catch (error) {
            console.error("Failed to fetch questions");
        }
    };

    const handleBulkUpload = async () => {
        try {
            const res = await api.post("/questions/bulk", { 
                questions: csvContent, 
                isCSV: true,
                globalIsPYQ: bulkConfig.isPYQ,
                globalYear: bulkConfig.year,
                globalLevel: bulkConfig.level 
            });
            alert(`Bulk upload successful! ${res.data.count || ''} questions added.`);
            setShowBulk(false);
            setCsvContent("");
            setBulkConfig({ isPYQ: false, year: "", level: "" });
            fetchQuestions();
        } catch (error: any) {
            console.error("Bulk upload error:", error);
            const serverMsg = error.response?.data?.error;
            alert(serverMsg ? `Bulk upload failed:\n\n${serverMsg}` : "Bulk upload failed. Please check your format.");
        }
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData({ ...formData, options: newOptions });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log("Submitting question:", formData);
            await api.post("/questions", formData);
            setShowForm(false);
            setFormData({ text: "", subject: "Physics", chapter: "", level: "JEE", correctAnswer: 0, options: ["", "", "", ""], imageUrl: "", year: "", isPYQ: false });
            fetchQuestions();
        } catch (error) {
            alert("Failed to create question");
        }
    };

    const handleDelete = async (ids: string[]) => {
        if (!confirm(`Are you sure you want to delete ${ids.length} question(s)?`)) return;
        try {
            await api.delete("/questions", { data: { ids } });
            setSelectedIds([]);
            fetchQuestions();
        } catch (error) {
            alert("Failed to delete questions");
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 border-l-4 border-indigo-600 pl-4 uppercase tracking-tight">Question Bank</h1>
                    <p className="text-slate-500 text-sm mt-1 pl-4">Manage and organize your academic questions.</p>
                </div>
                <div className="flex gap-3">
                    {selectedIds.length > 0 && (
                        <Button variant="destructive" onClick={() => handleDelete(selectedIds)}>
                            Delete Selected ({selectedIds.length})
                        </Button>
                    )}
                    <Button variant="outline" onClick={() => { setShowBulk(!showBulk); setShowForm(false); }} className="hover:scale-105 transition-transform border-dashed border-2">
                        {showBulk ? "Cancel Bulk" : "Bulk Upload"}
                    </Button>
                    <Button variant="outline" onClick={() => { setShowForm(!showForm); setShowBulk(false); setFormData({...formData, isPYQ: true}); }} className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:scale-105 transition-all">
                        {showForm && formData.isPYQ ? "Cancel" : "Add PYQ"}
                    </Button>
                    <Button onClick={() => { setShowForm(!showForm); setShowBulk(false); setFormData({...formData, isPYQ: false}); }} className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 hover:scale-105 transition-transform">
                        {showForm && !formData.isPYQ ? "Cancel" : "Add New Question"}
                    </Button>
                </div>
            </div>

            {showBulk && (
                <div className="p-6 bg-white rounded-xl shadow-sm border space-y-4">
                    <h3 className="font-bold">Bulk upload via CSV</h3>
                    
                    <div className="bg-emerald-50 p-4 border border-emerald-100 rounded-xl space-y-4">
                        <div className="flex items-center gap-2">
                             <input type="checkbox" id="bulkIsPYQ" checked={bulkConfig.isPYQ} onChange={e => setBulkConfig({...bulkConfig, isPYQ: e.target.checked})} className="accent-emerald-600 w-5 h-5"/>
                             <label htmlFor="bulkIsPYQ" className="font-bold text-emerald-800">Mark all uploaded questions as PYQs</label>
                        </div>
                        {bulkConfig.isPYQ && (
                            <div className="grid grid-cols-2 gap-4">
                                 <div>
                                      <label className="block text-xs font-bold text-emerald-700 mb-1">Global Year (Optional)</label>
                                      <input type="number" className="w-full p-2 rounded border border-emerald-200" placeholder="e.g. 2024" value={bulkConfig.year} onChange={e => setBulkConfig({...bulkConfig, year: e.target.value})} />
                                 </div>
                                 <div>
                                      <label className="block text-xs font-bold text-emerald-700 mb-1">Global Exam Level (Optional)</label>
                                      <select className="w-full p-2 rounded border border-emerald-200" value={bulkConfig.level} onChange={e => setBulkConfig({...bulkConfig, level: e.target.value})}>
                                          <option value="">Don't strictly apply</option>
                                          <option value="JEE">JEE</option>
                                          <option value="CET">CET</option>
                                          <option value="NEET">NEET</option>
                                      </select>
                                 </div>
                            </div>
                        )}
                    </div>

                    <p className="text-xs text-slate-500">Format: text|opt1,opt2,opt3,opt4|correctIndex|subject|chapter|level|year|isPYQ</p>
                    <textarea 
                        className="w-full h-40 p-2 border rounded font-mono text-sm"
                        placeholder="What is 2+2?|3,4,5,6|1|Maths|Numbers|JEE|2024|true"
                        value={csvContent}
                        onChange={e => setCsvContent(e.target.value)}
                    />
                    <Button onClick={handleBulkUpload} disabled={!csvContent.trim()} className="bg-indigo-600 hover:bg-indigo-700">Process Bulk Upload</Button>
                </div>
            )}

            {showForm && (
                <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow-sm border space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Question Text</label>
                        <textarea 
                            className="w-full p-2 border rounded" 
                            value={formData.text} 
                            onChange={e => setFormData({...formData, text: e.target.value})}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Subject</label>
                            <select 
                                className="w-full p-2 border rounded"
                                value={formData.subject}
                                onChange={e => setFormData({...formData, subject: e.target.value})}
                            >
                                <option>Physics</option>
                                <option>Chemistry</option>
                                <option>Mathematics</option>
                                <option>Biology</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Chapter</label>
                            <input 
                                className="w-full p-2 border rounded"
                                value={formData.chapter}
                                onChange={e => setFormData({...formData, chapter: e.target.value})}
                                placeholder="e.g. Thermodynamics"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-emerald-600 font-bold">Year (PYQ Only)</label>
                            <input 
                                type="number"
                                className="w-full p-2 border rounded border-emerald-100 bg-emerald-50/30"
                                value={formData.year}
                                onChange={e => setFormData({...formData, year: e.target.value})}
                                placeholder="e.g. 2024"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Mark Correct Answer</label>
                            <div className="grid grid-cols-4 gap-2">
                                {[0, 1, 2, 3].map(i => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, correctAnswer: i })}
                                        className={`p-2 rounded-lg border-2 font-bold transition-all ${formData.correctAnswer === i ? 'bg-emerald-500 border-emerald-600 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-300'}`}
                                    >
                                        {String.fromCharCode(65 + i)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Exam Level</label>
                            <select 
                                className="w-full p-2.5 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                value={formData.level}
                                onChange={e => setFormData({...formData, level: e.target.value})}
                            >
                                <option>JEE</option>
                                <option>CET</option>
                                <option>NEET</option>
                                <option>Foundation</option>
                                <option>Advanced</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2 pt-8">
                            <input 
                                type="checkbox"
                                id="isPYQ"
                                className="w-5 h-5 accent-emerald-600"
                                checked={formData.isPYQ}
                                onChange={e => setFormData({...formData, isPYQ: e.target.checked})}
                            />
                            <label htmlFor="isPYQ" className="text-sm font-bold text-emerald-700">Mark as Previous Year Question (PYQ)</label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Image URL (Optional)</label>
                        <input 
                            className="w-full p-2 border rounded" 
                            placeholder="https://example.com/image.png"
                            value={formData.imageUrl} 
                            onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Options</label>
                        {formData.options.map((opt, i) => (
                            <input 
                                key={i}
                                placeholder={`Option ${i + 1}`}
                                className="w-full p-2 border rounded"
                                value={opt}
                                onChange={e => handleOptionChange(i, e.target.value)}
                                required
                            />
                        ))}
                    </div>
                    <Button type="submit">Save Question</Button>
                </form>
            )}

            <div className="grid gap-4">
                {questions.map((q) => (
                    <div 
                        key={q.id} 
                        onClick={() => toggleSelect(q.id)}
                        className={`group p-6 bg-white rounded-2xl border-2 transition-all flex justify-between items-start cursor-pointer ${selectedIds.includes(q.id) ? 'border-indigo-600 bg-indigo-50 shadow-indigo-100 shadow-xl' : 'border-slate-100 hover:border-indigo-200'}`}
                    >
                        <div className="flex gap-4">
                            <div className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${selectedIds.includes(q.id) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 group-hover:border-indigo-400'}`}>
                                {selectedIds.includes(q.id) && <div className="w-2 h-2 bg-white rounded-sm" />}
                            </div>
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                                        {q.subject}
                                    </span>
                                    {q.isPYQ && (
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white bg-emerald-600 px-2.5 py-1 rounded-full border border-emerald-700 shadow-sm">
                                            PYQ {q.year}
                                        </span>
                                    )}
                                    {q.level && (
                                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                                            {q.level}
                                        </span>
                                    )}
                                    {q.chapter && (
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                                            {q.chapter}
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-bold text-slate-900 leading-snug">{q.text}</h3>
                                <div className="grid grid-cols-2 gap-x-12 gap-y-2">
                                    {q.options.map((opt: string, i: number) => (
                                        <div key={i} className={`flex items-center gap-2 text-sm ${i === q.correctAnswer ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}>
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] border ${i === q.correctAnswer ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-slate-50 border-slate-100'}`}>
                                                {String.fromCharCode(65 + i)}
                                            </span>
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={(e) => { e.stopPropagation(); handleDelete([q.id]); }}
                            className="text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        >
                            Delete
                        </Button>
                    </div>
                ))}
                {questions.length === 0 && !showForm && (
                    <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-20 text-center">
                        <p className="text-slate-400 font-medium">No questions found in this bank.</p>
                        <Button variant="link" onClick={() => setShowForm(true)} className="text-indigo-600">Start by adding one manually</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
