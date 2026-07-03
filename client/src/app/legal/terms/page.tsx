import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms and Copyright",
    description: "Terms, demo disclaimer, and copyright notice for ExamPrep Showcase.",
};

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-[#07111f] px-4 py-10 text-slate-100 sm:px-6">
            <section className="mx-auto max-w-4xl space-y-8">
                <Link href="/" className="text-sm font-black uppercase tracking-widest text-cyan-300 hover:text-cyan-200">
                    Back to Home
                </Link>
                <header className="space-y-4">
                    <p className="text-sm font-black uppercase tracking-widest text-cyan-300">Legal</p>
                    <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Terms and Copyright</h1>
                    <p className="text-base font-semibold text-slate-400">Last updated: July 3, 2026</p>
                </header>

                <div className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6 leading-7 text-slate-300">
                    <section className="space-y-3">
                        <h2 className="text-2xl font-black text-white">Portfolio Demo</h2>
                        <p>
                            ExamPrep Showcase is a software portfolio project by Siddhant Gupta. It is provided for demonstration, review, and testing. It is not an official exam provider, coaching institute, or paid certification service.
                        </p>
                    </section>
                    <section className="space-y-3">
                        <h2 className="text-2xl font-black text-white">No Guarantee</h2>
                        <p>
                            Demo questions, scores, leaderboards, and analytics are for product demonstration only. They should not be treated as professional academic advice or official exam preparation material.
                        </p>
                    </section>
                    <section className="space-y-3">
                        <h2 className="text-2xl font-black text-white">Acceptable Use</h2>
                        <p>
                            Do not attempt to break into accounts, bypass roles, overload the server, scrape private areas, upload harmful content, or use the app for illegal activity.
                        </p>
                    </section>
                    <section className="space-y-3">
                        <h2 className="text-2xl font-black text-white">Copyright</h2>
                        <p>
                            Copyright © 2026 Siddhant Gupta. All original design, code, branding, and demo content in this portfolio showcase are reserved unless a separate license is provided.
                        </p>
                    </section>
                </div>
            </section>
        </main>
    );
}
