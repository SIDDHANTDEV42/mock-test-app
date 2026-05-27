"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle, Star } from "lucide-react";

export default function TakeTest() {
    const { id } = useParams();
    const router = useRouter();
    const [test, setTest] = useState<any>(null);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showReview, setShowReview] = useState(false);
    const [resultId, setResultId] = useState<string | null>(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [seen, setSeen] = useState<Set<number>>(new Set([0]));
    const [timePerQuestion, setTimePerQuestion] = useState<Record<number, number>>({});
    const [confirmedInstructions, setConfirmedInstructions] = useState(false);
    const [serverTime, setServerTime] = useState(new Date());

    useEffect(() => {
        setSeen(prev => new Set(prev).add(currentIdx));
    }, [currentIdx]);

    useEffect(() => {
        fetchTest();
    }, [id]);

    const fetchTest = async () => {
        try {
            const res = await api.get(`/tests/${id}`);
            const currentTest = res.data;
            if (currentTest) {
                setTest(currentTest);
                const sDate = new Date();
                setServerTime(sDate);
                
                if (currentTest.endTime) {
                    const diff = Math.floor((new Date(currentTest.endTime).getTime() - sDate.getTime()) / 1000);
                    setTimeLeft(Math.max(0, diff));
                } else {
                    setTimeLeft(Math.max(0, currentTest.duration * 60));
                }
            }
        } catch (error) {
            console.error("Failed to fetch test");
        }
    };

    const checkStatus = useCallback(async () => {
        try {
            const res = await api.get(`/tests/${id}`);
            const t = res.data;
            // If the test was explicitly locked or ended by admin while student was taking it
            if (t.isLocked || (t.endTime && new Date(t.endTime) <= new Date())) {
                setTimeLeft(0);
                setExamStarted(false); // Stop the local timer
            }
        } catch (e) {}
    }, [id]);

    useEffect(() => {
        if (test && !isSubmitting && timeLeft > 0) {
            const interval = setInterval(checkStatus, 5000);
            return () => clearInterval(interval);
        }
    }, [test, isSubmitting, timeLeft, checkStatus]);

    const submitReview = async () => {
        try {
            await api.post("/reviews", {
                testId: id,
                rating,
                content: comment
            });
            alert("Thank you for your review!");
            if (resultId) router.push(`/dashboard/results/${resultId}`);
            else router.push('/dashboard');
        } catch (error) {
            console.error("Failed to submit review");
            if (resultId) router.push(`/dashboard/results/${resultId}`);
            else router.push('/dashboard');
        }
    };

    const submitTest = useCallback(async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        
        try {
            let score = 0;
            const pos = test.correctPoints ?? 4;
            const neg = test.negativePoints ?? 1;
            const customMarks = test.subjectMarks ? JSON.parse(test.subjectMarks) : null;
            
            const detailedStats: any = {};
            const wrongQIds: string[] = [];

            test.questions.forEach((q: any, i: number) => {
                const sub = q.subject || "General";
                
                let qPos = pos;
                let qNeg = neg;
                if (customMarks && customMarks[sub]) {
                    qPos = customMarks[sub].correct ?? pos;
                    qNeg = customMarks[sub].negative ?? neg;
                }

                if (!detailedStats[sub]) detailedStats[sub] = { correct: 0, wrong: 0, total: 0 };
                detailedStats[sub].total++;

                if (answers[i] === q.correctAnswer) {
                    score += qPos;
                    detailedStats[sub].correct++;
                } else if (answers[i] !== undefined) {
                    score -= qNeg;
                    detailedStats[sub].wrong++;
                    wrongQIds.push(q.id);
                }
            });

            const resultRes = await api.post(`/tests/${id}/results`, {
                score,
                spentTime: Math.max(0, test.duration * 60 - timeLeft),
                wrongQuestions: JSON.stringify(wrongQIds),
                subjectStats: JSON.stringify(detailedStats),
                timePerQuestion: JSON.stringify(timePerQuestion)
            });

            setResultId(resultRes.data.id);
            setShowReview(true);
        } catch (error) {
            console.error("Submission Error:", error);
            alert("Failed to submit test. Please check your connection.");
            setIsSubmitting(false);
        }
    }, [test, answers, id, timeLeft, router, isSubmitting]);

    // Track whether the exam is actively in progress (questions are being shown)
    const [examStarted, setExamStarted] = useState(false);

    // When instructions are confirmed, mark exam as started only if timeLeft > 0
    useEffect(() => {
        if (confirmedInstructions && test && timeLeft > 0 && !examStarted) {
            setExamStarted(true);
        }
    }, [confirmedInstructions, test, timeLeft]);

    // Timer countdown - only runs when exam is actively started
    useEffect(() => {
        if (!examStarted || isSubmitting) return;
        
        if (timeLeft <= 0) {
            submitTest();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
            setTimePerQuestion(prev => ({
                ...prev,
                [currentIdx]: (prev[currentIdx] || 0) + 1
            }));
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, examStarted, submitTest, currentIdx, isSubmitting]);

    if (!test) return <div className="p-8 text-center text-xl">Loading test...</div>;
    
    if (!test.questions || test.questions.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="p-8 bg-white rounded-2xl shadow-sm border border-red-100 text-center space-y-4">
                    <h2 className="text-2xl font-bold text-red-600">Empty Test</h2>
                    <p className="text-slate-500">This test has no questions assigned to it.</p>
                    <Button onClick={() => router.push('/dashboard')}>Return to Dashboard</Button>
                </div>
            </div>
        );
    }

    const currentQuestion = test.questions[currentIdx];
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Strict Time Lock Check
    const isActuallyLocked = test.isLocked && (!test.startTime || new Date(test.startTime) > serverTime);

    if (isActuallyLocked) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-8 text-center">
                <div className="max-w-md space-y-6">
                    <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto border border-red-500/50">
                        <span className="text-4xl text-red-500">🔒</span>
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tight">Test is Locked</h2>
                    <p className="text-slate-400 font-medium">
                        This test is scheduled to start on <br />
                        <span className="text-white font-bold">{test.startTime ? new Date(test.startTime).toLocaleString() : "a later time"}</span>
                    </p>
                    <Button onClick={() => router.push('/dashboard')} variant="secondary" className="w-full h-12 rounded-xl font-bold">
                        Return to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    if (!confirmedInstructions) {
        return (
            <div className="min-h-screen bg-slate-50 p-4 md:p-12 overflow-y-auto">
                <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
                    <div className="bg-slate-900 p-8 text-white relative">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
                         <h1 className="text-3xl font-black uppercase tracking-tight">{test.title}</h1>
                         <p className="text-slate-400 mt-1 font-bold">PRE-EXAM INSTRUCTIONS & GUIDELINES</p>
                    </div>

                    <div className="p-8 md:p-12 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Duration</p>
                                <p className="text-2xl font-black text-slate-900">{test.duration} Minutes</p>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Questions</p>
                                <p className="text-2xl font-black text-slate-900">{test.questions.length} Objective Types</p>
                            </div>
                            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                                <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-1">Marking Scheme</p>
                                <p className="text-xl font-black text-blue-600">
                                    {test.subjectMarks 
                                        ? Object.entries(JSON.parse(test.subjectMarks)).map(([s, m]: any) => {
                                            const subMap: any = { Physics: "Phy", Chemistry: "Chem", Maths: "Maths", Biology: "Bio" };
                                            const name = subMap[s] || s;
                                            return `${name} +${m.correct ?? (test.correctPoints ?? 4)} -${m.negative ?? (test.negativePoints ?? 1)}`;
                                        }).join(", ")
                                        : `+${test.correctPoints ?? 4} / -${test.negativePoints ?? 1}`
                                    }
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4 text-slate-600 leading-relaxed font-medium">
                            <h3 className="text-xl font-black text-slate-900">General Instructions:</h3>
                            <ul className="list-disc pl-5 space-y-3">
                                <li>The clock will be set at the server. The countdown timer in the top right corner of screen will display the remaining time available for you to complete the examination.</li>
                                <li>The Question Palette displayed on the right side of screen will show the status of each question using color codes.</li>
                                <li>Click on the question number in the Question Palette to go to that question directly.</li>
                                <li>You can click on an option to select your answer. To change your answer, click on another option.</li>
                                <li>To save your answer, you MUST click on <b>'Next'</b>.</li>
                                <li>The test will automatically submit when the timer reaches zero. Do not refresh or close the tab during the exam.</li>
                            </ul>
                        </div>

                        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                            {timeLeft > 0 ? (
                                <>
                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" id="agree" className="w-5 h-5 rounded border-2 border-slate-200 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                                        <label htmlFor="agree" className="text-sm font-bold text-slate-500 cursor-pointer">I have read and understood the instructions.</label>
                                    </div>
                                    <Button 
                                        onClick={() => {
                                            if ((document.getElementById('agree') as HTMLInputElement)?.checked) {
                                                setConfirmedInstructions(true);
                                            } else {
                                                alert("Please agree to the instructions first.");
                                            }
                                        }}
                                        className="h-14 px-12 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 transition-all hover:scale-[1.05]"
                                    >
                                        I AM READY TO BEGIN
                                    </Button>
                                </>
                            ) : (
                                <div className="w-full p-6 bg-rose-50 border-2 border-rose-100 rounded-3xl text-center">
                                    <h3 className="text-xl font-black text-rose-600 uppercase mb-1">Test Period Expired</h3>
                                    <p className="text-rose-400 font-bold mb-4">This mock exam has already ended and is no longer accepting new submissions.</p>
                                    <Button onClick={() => router.push('/dashboard')} variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-100 rounded-xl">
                                        Return to Dashboard
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Main Question Area */}
            <div className="flex-1 flex flex-col h-full bg-white shadow-xl min-w-0">
                <header className="p-4 border-b flex justify-between items-center bg-slate-900 text-white">
                    <div className="flex flex-col">
                        <h1 className="text-xl font-bold leading-tight">{test.title}</h1>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-black uppercase text-blue-200">Question {currentIdx + 1}/{test.questions.length}</span>
                            <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded font-black uppercase text-emerald-400 border border-emerald-500/30">{test.subjectMarks ? "Variable per Subject" : `+${test.correctPoints ?? 4} / -${test.negativePoints ?? 1} Marks`}</span>
                        </div>
                    </div>
                    <div className="text-2xl font-mono font-bold text-red-400 bg-red-950/30 px-4 py-1 rounded border border-red-900/50 shadow-[inset_0_0_10px_rgba(239,68,68,0.2)]">
                        {formatTime(timeLeft)}
                    </div>
                </header>

                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-3xl mx-auto space-y-8">
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {currentQuestion.subject}
                                </span>
                                {currentQuestion.chapter && (
                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider">
                                        {currentQuestion.chapter}
                                    </span>
                                )}
                            </div>
                            <h2 className="text-2xl font-semibold leading-relaxed text-slate-900">
                                {currentQuestion.text}
                            </h2>
                            {currentQuestion.imageUrl && (
                                <div className="mt-4 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                                    <img 
                                        src={currentQuestion.imageUrl} 
                                        alt="Question Visual" 
                                        className="max-h-80 mx-auto object-contain"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="grid gap-4">
                            {currentQuestion.options.map((option: string, i: number) => (
                                <button
                                    key={i}
                                    onClick={() => setAnswers({...answers, [currentIdx]: i})}
                                    className={cn(
                                        "w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-4 group hover:scale-[1.02] hover:shadow-lg",
                                        answers[currentIdx] === i 
                                            ? "border-blue-600 bg-blue-50 text-blue-900 shadow-blue-100 shadow-xl" 
                                            : "border-slate-100 hover:border-blue-200 bg-white"
                                    )}
                                >
                                    <span className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                                        answers[currentIdx] === i 
                                            ? "bg-blue-600 text-white" 
                                            : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                                    )}>
                                        {String.fromCharCode(65 + i)}
                                    </span>
                                    <span className="font-medium">{option}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </main>

                <footer className="p-4 border-t flex justify-between items-center bg-slate-50">
                    <Button 
                        disabled={currentIdx === 0} 
                        onClick={() => setCurrentIdx(prev => prev - 1)}
                        variant="secondary"
                    >
                        ← Previous
                    </Button>
                    <div className="flex gap-4">
                        <Button 
                            variant="destructive"
                            onClick={() => {
                                if (confirm("Are you sure you want to end the test?")) submitTest();
                            }}
                        >
                            Submit Test
                        </Button>
                        <Button 
                            disabled={currentIdx === test.questions.length - 1} 
                            onClick={() => setCurrentIdx(prev => prev + 1)}
                        >
                            Next →
                        </Button>
                    </div>
                </footer>
            </div>

            {/* Sidebar Palette */}
            <aside className="w-72 bg-slate-900 border-l border-slate-800 flex flex-col h-full text-slate-300 shrink-0">
                <div className="p-4 border-b border-slate-800">
                    <h2 className="text-lg font-bold text-white tracking-wide">Question Palette</h2>
                    <div className="text-xs text-slate-400 mt-1">{test.questions.length} total questions · {test.questions.length - Object.keys(answers).length} remaining</div>
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                    <div className="grid grid-cols-4 gap-3">
                        {test.questions.map((_: any, idx: number) => {
                            const isAnswered = answers[idx] !== undefined;
                            const isSeen = seen.has(idx);
                            const isCurrent = currentIdx === idx;
                            
                            let btnClass = "bg-slate-700 text-slate-300 border-transparent hover:bg-slate-600"; // not seen
                            if (isAnswered) {
                                btnClass = "bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-900/50"; // answered
                            } else if (isSeen) {
                                btnClass = "bg-rose-500 border-rose-400 text-white shadow-md shadow-rose-900/50"; // seen but not answered
                            }

                            return (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIdx(idx)}
                                    className={cn(
                                        "w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all mx-auto",
                                        btnClass,
                                        isCurrent && "ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110 z-10"
                                    )}
                                >
                                    {idx + 1}
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div className="p-4 border-t border-slate-800 bg-slate-800/30 space-y-3 text-xs font-medium">
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-emerald-600 shadow-sm border border-emerald-500"></div> 
                        <span className="text-slate-300">Answered</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-rose-500 shadow-sm border border-rose-400"></div> 
                        <span className="text-slate-300">Not Answered</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-slate-700 shadow-sm border border-slate-600"></div> 
                        <span className="text-slate-400">Not Visited</span>
                    </div>
                </div>
            </aside>

            {/* Review Modal */}
            {showReview && (
                <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="text-center space-y-4">
                            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-10 h-10" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900">Test Submitted Successfully!</h2>
                            <p className="text-slate-500">Your results have been recorded. How was your experience with this test?</p>
                            
                            <div className="flex justify-center gap-2 py-4">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <button 
                                        key={s} 
                                        onClick={() => setRating(s)}
                                        className={`transition-all ${rating >= s ? 'text-amber-500 scale-125' : 'text-slate-200'}`}
                                    >
                                        <Star className={`w-8 h-8 ${rating >= s ? 'fill-current' : ''}`} />
                                    </button>
                                ))}
                            </div>

                            <textarea 
                                className="w-full p-4 border rounded-2xl bg-slate-50 min-h-[100px] outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                placeholder="Any feedback for us? (Optional)"
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                            />

                            <div className="flex gap-4 pt-4">
                                {resultId && (
                                    <Button variant="outline" className="flex-1 rounded-xl h-12 font-bold border-emerald-200 text-emerald-700 hover:bg-emerald-50" onClick={() => router.push(`/dashboard/results/${resultId}`)}>
                                        📊 View Analysis
                                    </Button>
                                )}
                                <Button variant="outline" className="flex-1 rounded-xl h-12 font-bold" onClick={() => router.push('/dashboard')}>
                                    Skip
                                </Button>
                                <Button className="flex-1 rounded-xl h-12 font-bold bg-indigo-600 hover:bg-indigo-700" onClick={submitReview}>
                                    Submit Review
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

