import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "Privacy policy for the ExamPrep Showcase portfolio demo.",
};

const updated = "July 3, 2026";

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-[#07111f] px-4 py-10 text-slate-100 sm:px-6">
            <section className="mx-auto max-w-4xl space-y-8">
                <Link href="/" className="text-sm font-black uppercase tracking-widest text-cyan-300 hover:text-cyan-200">
                    Back to Home
                </Link>
                <header className="space-y-4">
                    <p className="text-sm font-black uppercase tracking-widest text-cyan-300">Legal</p>
                    <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Privacy Policy</h1>
                    <p className="text-base font-semibold text-slate-400">Last updated: {updated}</p>
                </header>

                <div className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6 leading-7 text-slate-300">
                    <p>
                        ExamPrep Showcase is a portfolio demo created by Siddhant Gupta. It is not a paid education service and should not be used to store sensitive personal, financial, health, or government identity information.
                    </p>
                    <section className="space-y-3">
                        <h2 className="text-2xl font-black text-white">Information We Collect</h2>
                        <p>
                            The app may collect the name, email address, password hash, selected subject stream, test submissions, scores, review text, and basic account activity needed to run the demo.
                        </p>
                    </section>
                    <section className="space-y-3">
                        <h2 className="text-2xl font-black text-white">How We Use It</h2>
                        <p>
                            Data is used to create demo accounts, authenticate users, show dashboards, calculate exam results, protect admin-only areas, and improve the project as a portfolio showcase.
                        </p>
                    </section>
                    <section className="space-y-3">
                        <h2 className="text-2xl font-black text-white">What We Do Not Do</h2>
                        <p>
                            We do not sell personal data, run payment processing, knowingly collect children's data, or send real password reset emails unless an email provider is added later.
                        </p>
                    </section>
                    <section className="space-y-3">
                        <h2 className="text-2xl font-black text-white">Security</h2>
                        <p>
                            Login uses server-issued HttpOnly cookies. Passwords are stored as hashes. Test scoring is handled on the server. No system can be promised as impossible to breach, so demo users should not reuse important passwords.
                        </p>
                    </section>
                    <section className="space-y-3">
                        <h2 className="text-2xl font-black text-white">Contact</h2>
                        <p>
                            For privacy requests, contact Siddhant Gupta through the portfolio or GitHub profile linked on the home page.
                        </p>
                    </section>
                </div>
            </section>
        </main>
    );
}
