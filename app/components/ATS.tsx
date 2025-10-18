import React from 'react'

interface Suggestion {
    type: "good" | "improve";
    tip: string;
}

interface ATSProps {
    score: number;
    suggestions: Suggestion[];
}

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
    // Determine background gradient based on score
    const gradientClass = score > 69
        ? 'from-sky-50 via-blue-50'
        : score > 49
            ? 'from-indigo-50 via-purple-50'
            : 'from-rose-50 via-pink-50';

    // Determine icon based on score
    const iconSrc = score > 69
        ? '/icons/ats-good.svg'
        : score > 49
            ? '/icons/ats-warning.svg'
            : '/icons/ats-bad.svg';

    // Determine subtitle based on score
    const subtitle = score > 69
        ? 'Excellent Performance!'
        : score > 49
            ? 'Room to Grow'
            : 'Needs Improvement';

    // Determine accent color
    const accentColor = score > 69
        ? 'text-sky-700'
        : score > 49
            ? 'text-indigo-700'
            : 'text-rose-700';

    return (
        <div className={`bg-gradient-to-b ${gradientClass} to-white rounded-3xl shadow-xl w-full p-8 border border-gray-100`}>
            {/* Top section with icon and headline */}
            <div className="flex items-center gap-5 mb-8">
                <img src={iconSrc} alt="ATS Score Icon" className="w-14 h-14" />
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        ATS Score <span className={accentColor}>– {score}/100</span>
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">AI resume compatibility rating</p>
                </div>
            </div>

            {/* Description section */}
            <div className="mb-6">
                <h3 className={`text-2xl font-semibold mb-3 ${accentColor}`}>{subtitle}</h3>
                <p className="text-gray-600 mb-5 leading-relaxed">
                    This score indicates how optimized your resume is for Applicant Tracking Systems (ATS) that recruiters use to filter candidates.
                </p>

                {/* Suggestions list */}
                <div className="space-y-3">
                    {suggestions.map((suggestion, index) => (
                        <div
                            key={index}
                            className={`flex items-start gap-3 p-3 rounded-xl border ${
                                suggestion.type === "good"
                                    ? "bg-sky-50 border-sky-100"
                                    : "bg-indigo-50 border-indigo-100"
                            }`}
                        >
                            <img
                                src={suggestion.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                                alt={suggestion.type === "good" ? "Check" : "Warning"}
                                className="w-5 h-5 mt-1"
                            />
                            <p
                                className={`text-sm ${
                                    suggestion.type === "good" ? "text-sky-800" : "text-indigo-800"
                                }`}
                            >
                                {suggestion.tip}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Closing encouragement */}
            <p className="text-gray-700 italic mt-8 text-center">
                Keep refining your resume to improve visibility and boost your interview opportunities 🚀
            </p>
        </div>
    )
}

export default ATS
