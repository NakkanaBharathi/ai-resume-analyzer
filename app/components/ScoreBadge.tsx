interface ScoreBadgeProps {
    score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
    let badgeColor = '';
    let badgeText = '';

    if (score > 70) {
        badgeColor =
            'bg-blue-100 text-blue-800 border border-blue-200 shadow-sm'; // soft light blue background
        badgeText = 'Strong';
    } else if (score > 49) {
        badgeColor =
            'bg-sky-100 text-sky-800 border border-sky-200 shadow-sm'; // medium light blue
        badgeText = 'Good Start';
    } else {
        badgeColor =
            'bg-cyan-100 text-cyan-800 border border-cyan-200 shadow-sm'; // lighter cyan
        badgeText = 'Needs Work';
    }

    return (
        <div
            className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full font-medium text-sm transition-all duration-300 ${badgeColor}`}
        >
            {badgeText}
        </div>
    );
};

export default ScoreBadge;
