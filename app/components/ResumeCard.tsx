import { Link } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

// Dynamic ScoreCircle with colors based on score and border
const ScoreCircle = ({ score = 75 }: { score: number }) => {
    const radius = 40;
    const stroke = 8;
    const normalizedRadius = radius - stroke / 2;
    const circumference = 2 * Math.PI * normalizedRadius;
    const progress = score / 100;
    const strokeDashoffset = circumference * (1 - progress);

    // Color logic based on score
    let gradientStart = "";
    let gradientMiddle = "";
    let gradientEnd = "";
    let backgroundColor = "";
    let borderColor = "";

    if (score > 70) {
        gradientStart = "#a7f3d0"; // soft mint
        gradientMiddle = "#34d399"; // teal
        gradientEnd = "#0d9488"; // turquoise
        backgroundColor = "#d1fae5"; // light mint
        borderColor = "#34d399"; // teal border
    } else if (score > 49) {
        gradientStart = "#fed7aa"; // peach
        gradientMiddle = "#fb923c"; // coral
        gradientEnd = "#f97316"; // apricot
        backgroundColor = "#fff7ed"; // light peach
        borderColor = "#fb923c"; // coral border
    } else {
        gradientStart = "#e9d5ff"; // lavender
        gradientMiddle = "#c084fc"; // lilac
        gradientEnd = "#f43f5e"; // rose
        backgroundColor = "#f5f3ff"; // light lavender
        borderColor = "#c084fc"; // lilac border
    }

    return (
        <div
            className="relative w-[100px] h-[100px] rounded-full p-1"
            style={{ border: `2px solid ${borderColor}` }}
        >
            <svg
                height="100%"
                width="100%"
                viewBox="0 0 100 100"
                className="transform -rotate-90 rounded-full"
            >
                {/* Background circle */}
                <circle
                    cx="50"
                    cy="50"
                    r={normalizedRadius}
                    stroke={backgroundColor}
                    strokeWidth={stroke}
                    fill="transparent"
                />

                {/* Foreground gradient circle */}
                <defs>
                    <linearGradient id={`grad-${score}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={gradientStart} />
                        <stop offset="50%" stopColor={gradientMiddle} />
                        <stop offset="100%" stopColor={gradientEnd} />
                    </linearGradient>
                </defs>
                <circle
                    cx="50"
                    cy="50"
                    r={normalizedRadius}
                    stroke={`url(#grad-${score})`}
                    strokeWidth={stroke}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                />
            </svg>

            {/* Centered score */}
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-semibold text-sm">{`${score}/100`}</span>
            </div>
        </div>
    );
};

const ResumeCard = ({
                        resume: { id, companyName, jobTitle, feedback, imagePath },
                    }: {
    resume: Resume;
}) => {
    const { fs } = usePuterStore();
    const [resumeUrl, setResumeUrl] = useState<string | null>(null);

    useEffect(() => {
        const loadResume = async () => {
            if (!imagePath) return;

            try {
                const blob = await fs.read(imagePath);
                if (!blob) return;
                const url = URL.createObjectURL(blob);
                setResumeUrl(url);
            } catch (err) {
                console.error("Error reading image from Puter:", err);
            }
        };

        loadResume();
    }, [imagePath]);

    // Card border color based on score
    const cardBorderColor =
        feedback?.overallScore && feedback.overallScore > 70
            ? "#34d399"
            : feedback?.overallScore && feedback.overallScore > 49
                ? "#fb923c"
                : "#c084fc";

    return (
        <div className="mb-8"> {/* Vertical gap between cards */}
            <Link
                to={`/resume/${id}`}
                className="block rounded-2xl shadow-lg overflow-hidden transition-transform transform hover:scale-105 duration-300 bg-white"
                style={{ border: `2px solid ${cardBorderColor}` }}
            >
                <div className="resume-card-header flex justify-between items-start p-5 bg-white border-b border-gray-200">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-gray-900 font-bold text-lg md:text-xl break-words">
                            {companyName || "Resume"}
                        </h2>
                        {jobTitle && (
                            <h3 className="text-gray-500 text-sm md:text-base break-words">
                                {jobTitle}
                            </h3>
                        )}
                    </div>

                    {/* Dynamic ScoreCircle */}
                    {feedback && <ScoreCircle score={feedback.overallScore || 0} />}
                </div>

                {/* Resume Image */}
                {resumeUrl ? (
                    <div className="relative w-full h-[350px] max-sm:h-[200px] overflow-hidden">
                        <img
                            src={resumeUrl}
                            alt="resume"
                            className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none"></div>
                    </div>
                ) : (
                    <div className="w-full h-[350px] max-sm:h-[200px] flex items-center justify-center bg-gray-100 text-gray-400 font-medium">
                        Image not available
                    </div>
                )}
            </Link>
        </div>
    );
};

export default ResumeCard;
