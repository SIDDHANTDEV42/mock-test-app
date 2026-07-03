import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cookie Notice",
    description: "Cookie notice for the ExamPrep Showcase portfolio demo.",
};

export default function CookieNoticePage() {
    return (
        <main className="min-h-screen bg-[#07111f] px-4 py-10 text-slate-100 sm:px-6">
            <section className="mx-auto max-w-4xl space-y-8">
                <Link href="/" className="text-sm font-black uppercase tracking-widest text-cyan-300 hover:text-cyan-200">
                    Back to Home
                </Link>
                <header className="space-y-4">
                    <p className="text-sm font-black uppercase tracking-widest text-cyan-300">Legal</p>
                    <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Cookie Notice</h1>
                    <p className="text-base font-semibold text-slate-400">Last updated: July 3, 2026</p>
                </header>

                <div className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6 leading-7 text-slate-300">
                    <p>
                        ExamPrep Showcase uses only the cookies needed for the demo to work properly. The main cookie is an authentication cookie created after login.
                    </p>
                    <section className="space-y-3">
                        <h2 className="text-2xl font-black text-white">Essential Cookies</h2>
                        <p>
                            The authentication cookie keeps you signed in and helps protect role-based pages. It is HttpOnly, which means browser JavaScript cannot read it.
                        </p>
                    </section>
                    <section className="space-y-3">
                        <h2 className="text-2xl font-black text-white">Analytics or Ads</h2>
                        <p>
                            This demo does not intentionally use advertising cookies, third-party tracking cookies, or analytics cookies. If analytics is added later, this notice should be updated before launch.
                        </p>
                    </section>
                    <section className="space-y-3">
                        <h2 className="text-2xl font-black text-white">Your Choice</h2>
                        <p>
                            You can clear cookies in your browser settings. Clearing the login cookie will sign you out of the demo.
                        </p>
                    </section>
                </div>
            </section>
        </main>
    );
}
