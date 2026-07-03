import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ExamPrep Showcase by Siddhant Gupta";
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = "image/png";

export default function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    background: "#07111f",
                    color: "white",
                    padding: "64px",
                    fontFamily: "Inter, Arial, sans-serif",
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                        <div
                            style={{
                                width: 78,
                                height: 78,
                                borderRadius: 18,
                                background: "#22d3ee",
                                color: "#07111f",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 42,
                                fontWeight: 900,
                            }}
                        >
                            E
                        </div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <div style={{ fontSize: 34, fontWeight: 900 }}>ExamPrep Showcase</div>
                            <div style={{ color: "#67e8f9", fontSize: 22, fontWeight: 800 }}>by Siddhant Gupta</div>
                        </div>
                    </div>
                    <div
                        style={{
                            border: "1px solid rgba(103,232,249,0.35)",
                            borderRadius: 999,
                            padding: "14px 22px",
                            color: "#a5f3fc",
                            fontSize: 18,
                            fontWeight: 900,
                            textTransform: "uppercase",
                        }}
                    >
                        Portfolio Project
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    <div style={{ maxWidth: 900, fontSize: 72, lineHeight: 1.02, fontWeight: 950, letterSpacing: 0 }}>
                        Secure exam platform demo built for trust and review.
                    </div>
                    <div style={{ maxWidth: 980, color: "#cbd5e1", fontSize: 30, lineHeight: 1.35, fontWeight: 650 }}>
                        Auth, server-side scoring, PYQ archive, seeded questions, analytics, and admin tooling.
                    </div>
                </div>

                <div style={{ display: "flex", gap: 18 }}>
                    {["460+ Questions", "60 PYQs", "Role Protected", "Demo Ready"].map((item) => (
                        <div
                            key={item}
                            style={{
                                border: "1px solid rgba(255,255,255,0.12)",
                                background: "rgba(255,255,255,0.06)",
                                borderRadius: 18,
                                padding: "16px 22px",
                                color: "#e2e8f0",
                                fontSize: 22,
                                fontWeight: 850,
                            }}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        ),
        size
    );
}
