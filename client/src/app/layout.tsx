import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
    title: "Mock Test App",
    description: "MHT CET & JEE Mock Test Application",
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
