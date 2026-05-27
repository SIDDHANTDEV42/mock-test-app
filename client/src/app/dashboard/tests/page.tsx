"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function StudentTests() {
    const [tests, setTests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        try {
            const res = await api.get("/tests");
            setTests(res.data);
        } catch (error) {
            console.error("Failed to fetch tests");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="p-8">Loading tests...</div>;

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Available Mock Tests</h1>
                <Link href="/dashboard">
                    <Button variant="ghost">← Back to Home</Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tests.map(test => (
                    <div key={test.id} className="p-6 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-bold mb-2">{test.title}</h3>
                            <p className="text-sm text-slate-500 mb-4 line-clamp-2">{test.description}</p>
                            <div className="flex gap-4 text-xs font-semibold text-slate-400">
                                <span>⏱️ {test.duration} mins</span>
                                <span>📚 {test.questions.length} Questions</span>
                            </div>
                        </div>
                        <Link href={`/dashboard/tests/${test.id}`} className="mt-6">
                            <Button className="w-full">Start Test</Button>
                        </Link>
                    </div>
                ))}
            </div>

            {tests.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium">No tests are available at the moment. Please check back later.</p>
                </div>
            )}
        </div>
    );
}
