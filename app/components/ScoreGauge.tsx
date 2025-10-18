import { useEffect, useRef, useState } from "react";

const ScoreGauge = ({ score = 75 }: { score: number }) => {
    const [pathLength, setPathLength] = useState(0);
    const pathRef = useRef<SVGPathElement>(null);

    const percentage = score / 100;

    // New aesthetic colors based on score
    let gradientStart = "";
    let gradientMiddle = "";
    let gradientEnd = "";
    let backgroundColor = "";

    if (score > 70) {
        // High score: mint → teal → turquoise
        gradientStart = "#a7f3d0"; // soft mint
        gradientMiddle = "#34d399"; // medium teal
        gradientEnd = "#0d9488"; // turquoise
        backgroundColor = "#d1fae5"; // light mint
    } else if (score > 49) {
        // Medium score: peach → coral → apricot
        gradientStart = "#fed7aa"; // soft peach
        gradientMiddle = "#fb923c"; // coral
        gradientEnd = "#f97316"; // apricot
        backgroundColor = "#fff7ed"; // light peach
    } else {
        // Low score: lavender → lilac → rose
        gradientStart = "#e9d5ff"; // lavender
        gradientMiddle = "#c084fc"; // lilac
        gradientEnd = "#f43f5e"; // rose
        backgroundColor = "#f5f3ff"; // light lavender
    }

    useEffect(() => {
        if (pathRef.current) {
            setPathLength(pathRef.current.getTotalLength());
        }
    }, []);

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-40 h-20">
                <svg viewBox="0 0 100 50" className="w-full h-full">
                    <defs>
                        <linearGradient
                            id="gaugeGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                        >
                            <stop offset="0%" stopColor={gradientStart} />
                            <stop offset="50%" stopColor={gradientMiddle} />
                            <stop offset="100%" stopColor={gradientEnd} />
                        </linearGradient>
                    </defs>

                    {/* Background arc */}
                    <path
                        d="M10,50 A40,40 0 0,1 90,50"
                        fill="none"
                        stroke={backgroundColor}
                        strokeWidth="10"
                        strokeLinecap="round"
                    />

                    {/* Foreground arc with gradient */}
                    <path
                        ref={pathRef}
                        d="M10,50 A40,40 0 0,1 90,50"
                        fill="none"
                        stroke="url(#gaugeGradient)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={pathLength}
                        strokeDashoffset={pathLength * (1 - percentage)}
                    />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                    <div className="text-xl font-semibold pt-4">{score}/100</div>
                </div>
            </div>
        </div>
    );
};

export default ScoreGauge;
