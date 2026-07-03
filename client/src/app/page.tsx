import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Building2, Database, ExternalLink, Github, GraduationCap, Instagram, Linkedin, LockKeyhole, ShieldCheck, Sparkles, UserRound } from "lucide-react";

const portfolioHref = "#portfolio-link-coming-soon";
const snPortfolioHref = "#sn-dev-portfolio-coming-soon";
const siddhantInstagramHref = "https://www.instagram.com/siddhant.dev42/?hl=en";
const snInstagramHref = "https://www.instagram.com/sn.dev2425/";
const githubHref = "https://github.com/SIDDHANTDEV42";
const linkedinHref = "#linkedin-coming-soon";

export default function Home() {
    return (
        <div className="min-h-screen overflow-x-hidden bg-[#07111f] text-slate-100">
            <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#07111f]/90 backdrop-blur-xl">
                <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500 text-slate-950">
                            <GraduationCap className="h-6 w-6" />
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-base font-black uppercase tracking-tight sm:text-lg">ExamPrep Showcase</p>
                            <a href={githubHref} target="_blank" rel="noreferrer" className="text-xs font-bold uppercase tracking-widest text-cyan-300 hover:text-cyan-200">
                                by Siddhant Gupta
                            </a>
                        </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                        <Link href={portfolioHref} className="hidden text-sm font-bold text-slate-300 hover:text-white sm:inline">
                            siddhant.dev
                        </Link>
                        <Link href="/auth/login">
                            <Button className="rounded-xl bg-cyan-400 px-4 font-black text-slate-950 hover:bg-cyan-300 sm:px-6">
                                <span className="sm:hidden">Demo</span>
                                <span className="hidden sm:inline">View Demo</span>
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            <main>
                <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20 md:py-28">
                    <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-black uppercase tracking-widest text-cyan-200">
                                <Sparkles className="h-4 w-4" />
                                Portfolio project
                            </div>

                            <div className="space-y-5">
                                <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-7xl">
                                    Exam platform demo built for trust, flow, and full-stack proof.
                                </h1>
                                <p className="max-w-2xl text-lg font-medium leading-8 text-slate-300">
                                    A solo portfolio showcase by{" "}
                                    <a href={githubHref} target="_blank" rel="noreferrer" className="font-black text-cyan-200 hover:text-cyan-100">
                                        Siddhant Gupta
                                    </a>{" "}
                                    featuring authentication, admin tooling, seeded exam content, test taking, PYQ archives, analytics, reviews, and secure server-side scoring.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Link href="/auth/login">
                                    <Button className="h-14 rounded-xl bg-cyan-400 px-8 text-base font-black text-slate-950 hover:bg-cyan-300">
                                        Try Demo Login <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link href={portfolioHref}>
                                    <Button variant="outline" className="h-14 rounded-xl border-white/15 bg-white/5 px-8 text-base font-black text-white hover:bg-white/10">
                                        Portfolio Link Placeholder
                                    </Button>
                                </Link>
                            </div>

                            <div className="grid max-w-2xl grid-cols-3 gap-4 pt-4">
                                <div>
                                    <p className="text-3xl font-black text-white">460+</p>
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Seeded questions</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-white">18</p>
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Demo tests</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-white">60</p>
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">PYQ items</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/30">
                            <div className="rounded-xl bg-slate-950 p-5">
                                <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
                                    <div>
                                        <p className="text-sm font-black uppercase tracking-widest text-cyan-300">Live Demo Console</p>
                                        <p className="text-xs font-semibold text-slate-500">Seeded for reviewer walkthroughs</p>
                                    </div>
                                    <ShieldCheck className="h-6 w-6 text-emerald-300" />
                                </div>

                                <div className="grid gap-3">
                                    {[
                                        { label: "Authentication", value: "Admin and student demo accounts", icon: <LockKeyhole className="h-5 w-5" /> },
                                        { label: "Question Bank", value: "100+ per subject with PYQ archive", icon: <Database className="h-5 w-5" /> },
                                        { label: "Secure Scoring", value: "Answers scored on the server", icon: <ShieldCheck className="h-5 w-5" /> },
                                        { label: "Analytics", value: "Results, weak areas, leaderboard", icon: <BarChart3 className="h-5 w-5" /> },
                                    ].map((item) => (
                                        <div key={item.label} className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-200">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <p className="font-black text-white">{item.label}</p>
                                                <p className="text-sm font-medium text-slate-400">{item.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="border-b border-white/10 px-4 py-16 sm:px-6">
                    <div className="mx-auto max-w-7xl space-y-8">
                        <div className="max-w-3xl space-y-4">
                            <p className="text-sm font-black uppercase tracking-widest text-cyan-300">About this showcase</p>
                            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                                Built by{" "}
                                <a href={githubHref} target="_blank" rel="noreferrer" className="text-cyan-200 hover:text-cyan-100">
                                    Siddhant Gupta
                                </a>
                                , presented with founder-level ownership.
                            </h2>
                            <p className="text-base font-medium leading-7 text-slate-300">
                                This exam platform is a solo project by{" "}
                                <a href={siddhantInstagramHref} target="_blank" rel="noreferrer" className="font-black text-white hover:text-cyan-200">
                                    Siddhant Gupta
                                </a>
                                . It is designed for Siddhant's portfolio and can also be shown inside the SN.dev company portfolio as proof of product thinking, full-stack execution, and security-aware engineering.
                            </p>
                        </div>

                        <div className="grid gap-5 lg:grid-cols-3">
                            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-200">
                                    <UserRound className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-black text-white">Siddhant.dev</h3>
                                <p className="mt-3 text-sm font-medium leading-6 text-slate-400">
                                    Personal developer identity for Siddhant Gupta, founder, builder, and owner of this project.
                                </p>
                                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                                    <a href={githubHref} target="_blank" rel="noreferrer" className="inline-flex items-center justify-between rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm font-black text-slate-200 hover:border-cyan-300/40 hover:text-cyan-200">
                                        <span className="inline-flex items-center gap-2"><Github className="h-4 w-4" /> GitHub</span>
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                    <a href={siddhantInstagramHref} target="_blank" rel="noreferrer" className="inline-flex items-center justify-between rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm font-black text-slate-200 hover:border-cyan-300/40 hover:text-cyan-200">
                                        <span className="inline-flex items-center gap-2"><Instagram className="h-4 w-4" /> Instagram</span>
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                    <Link href={portfolioHref} className="inline-flex items-center justify-between rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm font-black text-slate-200 hover:border-cyan-300/40 hover:text-cyan-200">
                                        <span>Portfolio placeholder</span>
                                        <ExternalLink className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-200">
                                    <Building2 className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-black text-white">SN.dev Agency</h3>
                                <p className="mt-3 text-sm font-medium leading-6 text-slate-400">
                                    SN.dev was founded by Siddhant Gupta with one cofounder from the start, and another cofounder joined later. This app remains Siddhant's solo build.
                                </p>
                                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                                    <a href={snInstagramHref} target="_blank" rel="noreferrer" className="inline-flex items-center justify-between rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm font-black text-slate-200 hover:border-cyan-300/40 hover:text-cyan-200">
                                        <span className="inline-flex items-center gap-2"><Instagram className="h-4 w-4" /> SN.dev Instagram</span>
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                    <Link href={snPortfolioHref} className="inline-flex items-center justify-between rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm font-black text-slate-200 hover:border-cyan-300/40 hover:text-cyan-200">
                                        <span>SN.dev portfolio placeholder</span>
                                        <ExternalLink className="h-4 w-4" />
                                    </Link>
                                    <Link href={linkedinHref} className="inline-flex items-center justify-between rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm font-black text-slate-200 hover:border-cyan-300/40 hover:text-cyan-200">
                                        <span className="inline-flex items-center gap-2"><Linkedin className="h-4 w-4" /> LinkedIn placeholder</span>
                                        <ExternalLink className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-6">
                                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 text-cyan-200">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-black text-white">Why This Project Exists</h3>
                                <p className="mt-3 text-sm font-medium leading-6 text-slate-300">
                                    It gives reviewers a real app to test instead of an empty concept: demo logins, seeded content, role-protected admin screens, exam flows, PYQ archive, analytics, and backend-owned scoring.
                                </p>
                                <div className="mt-6 rounded-xl border border-white/10 bg-slate-950 p-4 text-sm font-bold leading-6 text-slate-300">
                                    Click Siddhant Gupta anywhere on this page to open a real Siddhant.dev profile link.
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="border-y border-white/10 bg-white/[0.03] px-6 py-16">
                    <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
                        {[
                            {
                                title: "Reviewer Ready",
                                desc: "Visible demo credentials and seeded records mean nobody lands on an empty screen.",
                            },
                            {
                                title: "Built Like A Product",
                                desc: "Admin CRUD, student flows, PYQ archive, custom mocks, leaderboard, and results pages are wired together.",
                            },
                            {
                                title: "Security Aware",
                                desc: "JWT fallback removed, dependencies audited, reset tokens hashed, and test scoring moved to the backend.",
                            },
                        ].map((item) => (
                            <div key={item.title} className="rounded-2xl border border-white/10 bg-[#07111f] p-6">
                                <h2 className="text-xl font-black text-white">{item.title}</h2>
                                <p className="mt-3 text-sm font-medium leading-6 text-slate-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <footer className="px-6 py-10">
                <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm font-bold text-slate-400 md:flex-row md:items-center md:justify-between">
                    <p>
                        Made by{" "}
                        <a href={githubHref} target="_blank" rel="noreferrer" className="text-cyan-300 hover:text-cyan-200">
                            Siddhant Gupta
                        </a>{" "}
                        for portfolio review.
                    </p>
                    <Link href={portfolioHref} className="text-cyan-300 hover:text-cyan-200">
                        Portfolio placeholder: siddhant.dev
                    </Link>
                </div>
            </footer>
        </div>
    );
}
