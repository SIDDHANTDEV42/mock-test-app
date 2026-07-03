import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"),
    title: {
        default: "ExamPrep Showcase | Siddhant Gupta",
        template: "%s | ExamPrep Showcase",
    },
    description: "A secure full-stack exam platform portfolio showcase by Siddhant Gupta with demo exams, PYQs, admin tools, and server-side scoring.",
    applicationName: "ExamPrep Showcase",
    authors: [{ name: "Siddhant Gupta", url: "https://github.com/SIDDHANTDEV42" }],
    creator: "Siddhant Gupta",
    publisher: "Siddhant Gupta",
    keywords: ["ExamPrep", "portfolio project", "Siddhant Gupta", "mock tests", "full-stack app"],
    openGraph: {
        title: "ExamPrep Showcase | Siddhant Gupta",
        description: "A portfolio-ready exam platform demo with secure auth, seeded tests, PYQ archive, admin tooling, and analytics.",
        url: "/",
        siteName: "ExamPrep Showcase",
        images: [
            {
                url: "/opengraph-image",
                width: 1200,
                height: 630,
                alt: "ExamPrep Showcase by Siddhant Gupta",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "ExamPrep Showcase | Siddhant Gupta",
        description: "Secure full-stack exam platform portfolio showcase by Siddhant Gupta.",
        images: ["/opengraph-image"],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={cn(
                "min-h-screen bg-background font-sans antialiased"
            )}>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
