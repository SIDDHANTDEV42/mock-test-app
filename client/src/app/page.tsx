import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowRight, ShieldCheck, Zap, BarChart3, Users, Globe } from "lucide-react";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen bg-[#020617] text-slate-100 overflow-x-hidden">
            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tighter uppercase">EXAM<span className="text-indigo-500">PREP</span></span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/auth/login" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Sign In</Link>
                        <Link href="/auth/register">
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-6">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-24 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-7xl mx-auto text-center relative z-10 space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-indigo-400 text-sm font-bold animate-fade-in">
                        <Zap className="w-4 h-4 fill-current" />
                        <span>The #1 Platform for JEE & MHT-CET Prep</span>
                    </div>
                    
                    <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[1.05]">
                        Master Your Exams with <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-400 animate-gradient">Precision Analytics.</span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-xl text-slate-400 font-medium leading-relaxed">
                        Say goodbye to guesswork. Practice with thousands of high-quality questions, 
                        get real-time insights, and dominate JEE, CET, and NEET.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link href="/auth/register">
                            <Button className="h-16 px-10 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xl rounded-2xl shadow-2xl shadow-indigo-500/40 hover:scale-105 transition-all group">
                                Start Free Practice <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="/auth/login">
                            <Button variant="outline" className="h-16 px-10 border-white/10 bg-white/5 hover:bg-white/10 text-white font-black text-xl rounded-2xl backdrop-blur-md transition-all">
                                View Demo Tests
                            </Button>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-20 max-w-4xl mx-auto text-center">
                        <div className="space-y-1">
                            <div className="text-4xl font-black text-white">50k+</div>
                            <div className="text-sm font-bold text-slate-500 tracking-widest uppercase">Students</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-4xl font-black text-white">1.2M+</div>
                            <div className="text-sm font-bold text-slate-500 tracking-widest uppercase">Questions</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-4xl font-black text-white">98.2%</div>
                            <div className="text-sm font-bold text-slate-500 tracking-widest uppercase">Success Rate</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-4xl font-black text-white">24/7</div>
                            <div className="text-sm font-bold text-slate-500 tracking-widest uppercase">Expert Support</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-24 px-6 bg-slate-950/50 relative">
                <div className="max-w-7xl mx-auto space-y-16">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-black tracking-tight">Everything you need to <span className="text-indigo-400">excel.</span></h2>
                        <p className="text-slate-400 font-medium max-w-xl mx-auto">Our tools are built by top educators and engineers to give you the ultimate edge in your exam preparation.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <BarChart3 className="w-8 h-8" />,
                                title: "Smart Analytics",
                                desc: "Track your performance by subject, chapter, and difficulty levels with detailed heatmaps."
                            },
                            {
                                icon: <Zap className="w-8 h-8" />,
                                title: "AI Generation",
                                desc: "Create unlimited custom mock tests instantly with our smart random question generator."
                            },
                            {
                                icon: <ShieldCheck className="w-8 h-8" />,
                                title: "Verified Content",
                                desc: "Every single question is reviewed by experts to ensure accuracy and exam-relevance."
                            }
                        ].map((feature, i) => (
                            <div key={i} className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all hover:bg-white/[0.07] group">
                                <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-black mb-4">{feature.title}</h3>
                                <p className="text-slate-400 font-medium leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-white/5 mt-auto">
                <div className="max-w-7xl mx-auto flex flex-col md:row items-center justify-between gap-8">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-indigo-500" />
                        <span className="text-sm font-black tracking-widest uppercase">EXAMPREP</span>
                    </div>
                    <div className="flex gap-8 text-sm font-bold text-slate-500">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="#" className="hover:text-white transition-colors">Contact Us</Link>
                    </div>
                    <div className="text-sm font-bold text-slate-500">
                        © 2026 EXAMPREP. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
