"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ManageTests() {
    const [tests, setTests] = useState<any[]>([]);
    const [questions, setQuestions] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        duration: 180,
        type: "MOCK",
        correctPoints: 4,
        negativePoints: 1,
        questionIds: [] as string[],
        startTime: "",
        endTime: "",
        isLocked: false,
        isAlwaysAvailable: true,
        useSubjectMarks: false,
        subjectMarks: {
            Physics: { correct: 4, negative: 1 },
            Chemistry: { correct: 4, negative: 1 },
            Maths: { correct: 4, negative: 1 },
            Biology: { correct: 4, negative: 1 }
        } as Record<string, { correct: number, negative: number }>
    });
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    
    // Advanced Creation Modes
    const [creationMode, setCreationMode] = useState<"MANUAL" | "BULK" | "RANDOM">("MANUAL");
    const [bulkFile, setBulkFile] = useState<File | null>(null);
    const [bulkFormat, setBulkFormat] = useState<"JSON" | "CSV">("JSON");
    const [randomConfig, setRandomConfig] = useState({ 
        subjects: [] as string[],
        chapters: [] as string[], 
        count: 10 
    });

    const [chapters, setChapters] = useState<string[]>([]);

    useEffect(() => {
        fetchTests();
        fetchQuestions();
        fetchChapters();
    }, []);

    const fetchChapters = async () => {
        try {
            const res = await api.get("/questions/chapters");
            setChapters(res.data);
        } catch (error) {
            console.error("Failed to fetch chapters");
        }
    };

    const fetchTests = async () => {
        try {
            const res = await api.get("/tests");
            setTests(res.data);
        } catch (error) {
            console.error("Failed to fetch tests");
        }
    };

    const fetchQuestions = async () => {
        try {
            const res = await api.get("/questions");
            setQuestions(res.data);
        } catch (error) {
            console.error("Failed to fetch questions");
        }
    };

    const toggleQuestionSelection = (id: string) => {
        const newIds = formData.questionIds.includes(id)
            ? formData.questionIds.filter(qId => qId !== id)
            : [...formData.questionIds, id];
        setFormData({ ...formData, questionIds: newIds });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let finalQuestionIds = formData.questionIds;

            if (creationMode === "BULK" && bulkFile) {
                try {
                    const text = await bulkFile.text();
                    if (bulkFormat === "JSON") {
                        const json = JSON.parse(text);
                        const questionsToUpload = Array.isArray(json) ? json : json.questions || [];
                        if (questionsToUpload.length === 0) throw new Error("No questions found in JSON");
                        const res = await api.post("/questions/bulk", { questions: questionsToUpload });
                        finalQuestionIds = res.data.ids;
                    } else {
                        // Send raw CSV text to backend
                        const res = await api.post("/questions/bulk", { questions: text, isCSV: true });
                        finalQuestionIds = res.data.ids;
                    }
                } catch (e: any) {
                    alert("Upload failed: " + (e.message || ""));
                    return;
                }
            } else if (creationMode === "RANDOM") {
                let pool = questions;
                if (randomConfig.subjects.length > 0) {
                    pool = pool.filter(q => randomConfig.subjects.includes(q.subject));
                }
                if (randomConfig.chapters.length > 0) {
                    pool = pool.filter(q => randomConfig.chapters.includes(q.chapter));
                }
                const shuffled = [...pool].sort(() => 0.5 - Math.random());
                finalQuestionIds = shuffled.slice(0, randomConfig.count).map(q => q.id);
            }

            if (formData.duration <= 0) {
                alert("Duration must be a positive number (minimum 1 minute).");
                return;
            }

            if (!finalQuestionIds || finalQuestionIds.length === 0) {
                alert("Cannot create test with 0 questions. Check filters or upload format.");
                return;
            }

            const payload: any = { ...formData, questionIds: finalQuestionIds };
            if (payload.startTime) payload.startTime = new Date(payload.startTime).toISOString();
            if (payload.endTime) payload.endTime = new Date(payload.endTime).toISOString();

            if (payload.useSubjectMarks) {
                payload.subjectMarks = JSON.stringify(payload.subjectMarks);
            } else {
                delete payload.subjectMarks;
            }

            await api.post("/tests", payload);
            setShowForm(false);
            setFormData({ 
                title: "", 
                description: "", 
                duration: 180, 
                type: "MOCK", 
                correctPoints: 4, 
                negativePoints: 1, 
                questionIds: [],
                startTime: "",
                endTime: "",
                isLocked: false,
                isAlwaysAvailable: true,
                useSubjectMarks: false,
                subjectMarks: {
                    Physics: { correct: 4, negative: 1 },
                    Chemistry: { correct: 4, negative: 1 },
                    Maths: { correct: 4, negative: 1 },
                    Biology: { correct: 4, negative: 1 }
                }
            });
            setBulkFile(null);
            fetchTests();
        } catch (error) {
            alert("Failed to create test. Ensure your JSON format is correct or connection is stable.");
        }
    };

    const handleDelete = async (ids: string[]) => {
        if (!confirm(`Are you sure you want to delete ${ids.length} test(s)?`)) return;
        try {
            await api.delete("/tests", { data: { ids } });
            setSelectedIds([]);
            fetchTests();
        } catch (error) {
            alert("Failed to delete tests");
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 border-l-4 border-indigo-600 pl-4 uppercase tracking-tight">Test Management</h1>
                    <p className="text-slate-500 text-sm mt-1 pl-4">Create and organize student mock exams.</p>
                </div>
                <div className="flex gap-3">
                    {selectedIds.length > 0 && (
                        <Button variant="destructive" onClick={() => handleDelete(selectedIds)}>
                            Delete Selected ({selectedIds.length})
                        </Button>
                    )}
                    <Button onClick={() => setShowForm(!showForm)} className={showForm ? "" : "bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100"}>
                        {showForm ? "Cancel" : "Create New Test"}
                    </Button>
                </div>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow-sm border space-y-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Test Title</label>
                            <input 
                                className="w-full p-2 border rounded" 
                                value={formData.title} 
                                onChange={e => setFormData({...formData, title: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea 
                                className="w-full p-2 border rounded" 
                                value={formData.description} 
                                onChange={e => setFormData({...formData, description: e.target.value})}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                                <input 
                                    type="number"
                                    className="w-full p-2 border rounded" 
                                    value={formData.duration} 
                                    onChange={e => setFormData({...formData, duration: parseInt(e.target.value)})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Test Type</label>
                                <select 
                                    className="w-full p-2 border rounded"
                                    value={formData.type}
                                    onChange={e => setFormData({...formData, type: e.target.value})}
                                >
                                    <option value="MOCK">Official Mock Test</option>
                                    <option value="PYQ">Previous Year Question (PYQ)</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                             <div className="flex justify-between items-center">
                                 <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Marking Scheme</label>
                                 <Button 
                                     type="button" 
                                     variant="outline" 
                                     size="sm" 
                                     onClick={() => setFormData({...formData, useSubjectMarks: !formData.useSubjectMarks})}
                                     className="h-8 text-xs font-bold"
                                 >
                                     {formData.useSubjectMarks ? "Use Basic Marks" : "Set Subject-Wise Marks"}
                                 </Button>
                             </div>
                             
                             {formData.useSubjectMarks ? (
                                 <div className="space-y-3">
                                     <div className="grid grid-cols-3 gap-4 mb-2">
                                         <span className="text-xs font-bold text-slate-500 uppercase">Subject</span>
                                         <span className="text-xs font-bold text-slate-500 uppercase">+ Points</span>
                                         <span className="text-xs font-bold text-slate-500 uppercase">- Points</span>
                                     </div>
                                     {['Physics', 'Chemistry', 'Maths', 'Biology'].map(subj => (
                                         <div key={subj} className="grid grid-cols-3 gap-4 items-center">
                                             <span className="text-sm font-bold text-slate-700">{subj}</span>
                                             <input type="number" placeholder="+ Pts" className="w-full p-2 bg-white border rounded-xl text-sm font-bold" 
                                                 value={formData.subjectMarks[subj]?.correct ?? 4} 
                                                 onChange={e => {
                                                     const val = parseInt(e.target.value);
                                                     setFormData(prev => ({...prev, subjectMarks: {...prev.subjectMarks, [subj]: {...prev.subjectMarks[subj], correct: isNaN(val) ? 0 : val}}}));
                                                 }} 
                                             />
                                             <input type="number" placeholder="- Pts" className="w-full p-2 bg-white border rounded-xl text-sm font-bold" 
                                                 value={formData.subjectMarks[subj]?.negative ?? 1} 
                                                 onChange={e => {
                                                     const val = parseInt(e.target.value);
                                                     setFormData(prev => ({...prev, subjectMarks: {...prev.subjectMarks, [subj]: {...prev.subjectMarks[subj], negative: isNaN(val) ? 0 : val}}}));
                                                 }} 
                                             />
                                         </div>
                                     ))}
                                 </div>
                             ) : (
                                 <div className="grid grid-cols-2 gap-4">
                                     <div>
                                         <label className="block text-xs font-bold text-slate-500 mb-1">Correct Answer Points</label>
                                         <input type="number" className="w-full p-2.5 border rounded-xl font-bold" value={formData.correctPoints} onChange={e => setFormData({...formData, correctPoints: parseInt(e.target.value)})} />
                                     </div>
                                     <div>
                                         <label className="block text-xs font-bold text-slate-500 mb-1">Negative Marking (Absolute)</label>
                                         <input type="number" className="w-full p-2.5 border rounded-xl font-bold" value={formData.negativePoints} onChange={e => setFormData({...formData, negativePoints: parseInt(e.target.value)})} />
                                     </div>
                                 </div>
                             )}
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Start Time (Optional)</label>
                                <input 
                                    type="datetime-local"
                                    className="w-full p-2 border rounded" 
                                    value={formData.startTime} 
                                    onChange={e => setFormData({...formData, startTime: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">End Time (Optional)</label>
                                <input 
                                    type="datetime-local"
                                    className="w-full p-2 border rounded" 
                                    value={formData.endTime} 
                                    onChange={e => setFormData({...formData, endTime: e.target.value})}
                                />
                            </div>
                            <div className="flex items-center gap-4 pt-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={formData.isLocked}
                                        onChange={e => setFormData({...formData, isLocked: e.target.checked})}
                                        className="rounded text-indigo-600"
                                    />
                                    <span className="text-sm font-medium">Lock until Start Time</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={formData.isAlwaysAvailable}
                                        onChange={e => setFormData({...formData, isAlwaysAvailable: e.target.checked})}
                                        className="rounded text-indigo-600"
                                    />
                                    <span className="text-sm font-medium">Always Available</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-4 border-t pt-6 mt-6">
                        <label className="block text-sm font-bold text-slate-800">Question Selection Strategy</label>
                        <div className="flex flex-wrap gap-4 mb-4">
                            <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors">
                                <input type="radio" checked={creationMode === 'MANUAL'} onChange={() => setCreationMode('MANUAL')} className="text-indigo-600" />
                                <span className="font-medium text-sm">Manual Selection</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors">
                                <input type="radio" checked={creationMode === 'BULK'} onChange={() => setCreationMode('BULK')} className="text-indigo-600" />
                                <span className="font-medium text-sm">Bulk Upload</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors">
                                <input type="radio" checked={creationMode === 'RANDOM'} onChange={() => setCreationMode('RANDOM')} className="text-indigo-600" />
                                <span className="font-medium text-sm">Random Generate</span>
                            </label>
                        </div>

                        {creationMode === 'MANUAL' && (
                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Select Questions ({formData.questionIds.length})</label>
                                <div className="max-h-60 overflow-y-auto border rounded-xl divide-y p-2 bg-slate-50">
                                    {questions.map(q => (
                                        <div key={q.id} className="flex items-center gap-3 p-2 hover:bg-white cursor-pointer rounded-lg transition-colors" onClick={() => toggleQuestionSelection(q.id)}>
                                            <input 
                                                type="checkbox" 
                                                checked={formData.questionIds.includes(q.id)}
                                                onChange={() => {}} 
                                                className="rounded text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <div className="text-sm text-slate-700">
                                                <span className="font-bold text-[10px] uppercase bg-blue-100 text-blue-700 px-2 py-0.5 rounded mr-2">{q.subject}</span>
                                                {q.text.substring(0, 100)}...
                                            </div>
                                        </div>
                                    ))}
                                    {questions.length === 0 && <p className="text-slate-400 text-center py-4 text-sm">No questions in database</p>}
                                </div>
                            </div>
                        )}

                        {creationMode === 'BULK' && (
                            <div className="space-y-4 bg-indigo-50/50 p-6 rounded-xl border border-indigo-100">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-bold text-indigo-900">Upload Questions File</label>
                                    <select 
                                        className="text-xs font-bold p-1 rounded border border-indigo-200"
                                        value={bulkFormat}
                                        onChange={e => setBulkFormat(e.target.value as any)}
                                    >
                                        <option value="JSON">JSON (.json)</option>
                                        <option value="CSV">CSV (.csv / .txt)</option>
                                    </select>
                                </div>
                                <p className="text-xs text-indigo-600 mb-4">
                                    {bulkFormat === 'JSON' 
                                        ? "Upload a JSON array of questions." 
                                        : "Format: text|opt1,opt2,opt3,opt4|correctIndex|subject|chapter|level|year|isPYQ"}
                                </p>
                                <input 
                                    type="file" 
                                    accept={bulkFormat === 'JSON' ? ".json" : ".csv,.txt"}
                                    onChange={(e) => setBulkFile(e.target.files?.[0] || null)}
                                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                                    required={creationMode === 'BULK'}
                                />
                            </div>
                        )}

                        {creationMode === 'RANDOM' && (
                            <div className="space-y-4 bg-purple-50/50 p-6 rounded-xl border border-purple-100">
                                <div>
                                    <label className="block text-sm font-bold text-purple-900 mb-2">Subject Filter (Optional)</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Physics', 'Chemistry', 'Maths', 'Biology'].map(subj => (
                                            <button 
                                                key={subj}
                                                type="button"
                                                onClick={() => setRandomConfig({
                                                    ...randomConfig, 
                                                    subjects: randomConfig.subjects.includes(subj) 
                                                        ? randomConfig.subjects.filter(s => s !== subj) 
                                                        : [...randomConfig.subjects, subj]
                                                })}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border transition-all",
                                                    randomConfig.subjects.includes(subj) ? "bg-purple-600 border-purple-600 text-white" : "bg-white border-purple-200 text-purple-400 hover:border-purple-400"
                                                )}
                                            >
                                                {subj}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-purple-900 mb-2">Chapter Filter (Optional)</label>
                                    <div className="max-h-40 overflow-y-auto border border-purple-200 rounded-xl p-3 bg-white space-y-2">
                                        {chapters.map(chap => (
                                            <label key={chap} className="flex items-center gap-2 cursor-pointer hover:bg-purple-50 p-1 rounded transition-colors">
                                                <input 
                                                    type="checkbox" 
                                                    checked={randomConfig.chapters.includes(chap)}
                                                    onChange={() => setRandomConfig({
                                                        ...randomConfig,
                                                        chapters: randomConfig.chapters.includes(chap)
                                                            ? randomConfig.chapters.filter(c => c !== chap)
                                                            : [...randomConfig.chapters, chap]
                                                    })}
                                                    className="rounded text-purple-600"
                                                />
                                                <span className="text-xs font-bold text-slate-700">{chap}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="block text-sm font-bold text-purple-900">Number of Questions to Pick</label>
                                    <div className="flex items-center gap-4">
                                        <input 
                                            type="number"
                                            className="w-32 p-2.5 border border-purple-200 rounded-lg text-center font-bold text-lg outline-none focus:border-purple-600"
                                            value={randomConfig.count}
                                            onChange={e => setRandomConfig({...randomConfig, count: parseInt(e.target.value) || 1})}
                                            min="1"
                                            required={creationMode === 'RANDOM'}
                                        />
                                        <p className="text-xs font-black text-purple-600 bg-purple-100 px-4 py-2 rounded-full uppercase tracking-widest">
                                            Pool: {(() => {
                                                let p = questions;
                                                if (randomConfig.subjects.length > 0) p = p.filter(q => randomConfig.subjects.includes(q.subject));
                                                if (randomConfig.chapters.length > 0) p = p.filter(q => randomConfig.chapters.includes(q.chapter));
                                                return p.length;
                                            })()} Qs available
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <Button type="submit" className="w-full bg-indigo-600 h-12 rounded-xl font-bold shadow-lg shadow-indigo-100">Save Test</Button>
                </form>
            )}

            <div className="grid grid-cols-1 gap-4">
                {tests.map(test => (
                    <div 
                        key={test.id} 
                        onClick={() => toggleSelect(test.id)}
                        className={`group p-6 bg-white rounded-2xl border-2 transition-all flex justify-between items-center cursor-pointer ${selectedIds.includes(test.id) ? 'border-indigo-600 bg-indigo-50 shadow-indigo-100 shadow-xl' : 'border-slate-100 hover:border-indigo-200'}`}
                    >
                        <div className="flex gap-4 items-center">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${selectedIds.includes(test.id) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 group-hover:border-indigo-400'}`}>
                                {selectedIds.includes(test.id) && <div className="w-2 h-2 bg-white rounded-sm" />}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">{test.title}</h3>
                                <p className="text-slate-500 text-sm">{test.description}</p>
                                <div className="mt-3 flex gap-4 text-xs font-bold items-center">
                                    <span className={cn(
                                        "px-2.5 py-1 rounded-full uppercase tracking-widest border",
                                        test.type === 'PYQ' ? "bg-orange-50 text-orange-600 border-orange-100" : "bg-blue-50 text-blue-600 border-blue-100"
                                    )}>
                                        {test.type}
                                    </span>
                                    <span className="flex items-center gap-1 text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100 uppercase tracking-widest">
                                        ⏱️ {test.duration} mins
                                    </span>
                                    <span className="flex items-center gap-1 text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 uppercase tracking-widest">
                                        📚 {test.questions.length} Questions
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 items-center">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    try {
                                        await api.patch(`/tests/${test.id}/start`);
                                        alert("✅ Test started successfully! Students can now access it.");
                                        fetchTests();
                                    } catch (err) {
                                        alert("❌ Failed to force start test. Check if you're logged in as admin.");
                                    }
                                }}
                                className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 rounded-xl font-bold px-3 py-1"
                            >
                                ▶ Start
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    if(!confirm("Are you sure you want to completely end this test? Active participants will be immediately submitted!")) return;
                                    try {
                                        await api.patch(`/tests/${test.id}/end`);
                                        alert("✅ Test ended successfully! All active students will be auto-submitted.");
                                        fetchTests();
                                    } catch (err) {
                                        alert("❌ Failed to force end test. Check if you're logged in as admin.");
                                    }
                                }}
                                className="text-red-600 border-red-200 hover:bg-red-50 rounded-xl font-bold px-3 py-1"
                            >
                                ⏹ End
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={(e) => { e.stopPropagation(); handleDelete([test.id]); }}
                                className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl px-3 py-1"
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
                {tests.length === 0 && !showForm && (
                     <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-20 text-center">
                        <p className="text-slate-400 font-medium pb-2">No tests created yet.</p>
                        <Button variant="link" onClick={() => setShowForm(true)} className="text-indigo-600">Click here to design your first mock exam</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
