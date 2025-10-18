import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Hirelytics" },
        { name: "description", content: "Smart feedback for your dream job!" },
    ];
}

export default function Home() {
    const { auth, kv } = usePuterStore();
    const navigate = useNavigate();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loadingResumes, setLoadingResumes] = useState(false);

    useEffect(() => {
        if(!auth.isAuthenticated) navigate('/auth?next=/');
    }, [auth.isAuthenticated]);

    useEffect(() => {
        const loadResumes = async () => {
            setLoadingResumes(true);
            const resumes = (await kv.list('resume:*', true)) as KVItem[];
            const parsedResumes = resumes?.map((resume) => (
                JSON.parse(resume.value) as Resume
            ));
            setResumes(parsedResumes || []);
            setLoadingResumes(false);
        };
        loadResumes();
    }, []);

    return (
        <main className="bg-gradient-to-b from-[#e0f7fa] to-[#f1f8e9] min-h-screen">
            <Navbar />

            <section className="main-section px-6 md:px-16 py-16">
                <div className="page-heading text-center max-w-3xl mx-auto mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#2b6777] mb-4">
                        Track Your Applications & Resume Ratings
                    </h1>
                    {!loadingResumes && resumes?.length === 0 ? (
                        <h2 className="text-lg text-[#4a7081]">
                            No resumes found. Upload your first resume to get feedback.
                        </h2>
                    ) : (
                        <h2 className="text-lg text-[#4a7081]">
                            Review your submissions and check AI-powered feedback.
                        </h2>
                    )}
                </div>

                {loadingResumes && (
                    <div className="flex flex-col items-center justify-center">
                        <img src="/images/resume-scan-2.gif" className="w-[200px] animate-pulse" />
                        <p className="mt-4 text-[#2b6777] font-medium">Loading your resumes...</p>
                    </div>
                )}

                {!loadingResumes && resumes.length > 0 && (
                    <div className="resumes-section grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resumes.map((resume) => (
                            <ResumeCard key={resume.id} resume={resume} />
                        ))}
                    </div>
                )}

                {!loadingResumes && resumes?.length === 0 && (
                    <div className="flex flex-col items-center justify-center mt-10 gap-4">
                        <Link
                            to="/upload"
                            className="px-6 py-3 rounded-lg bg-[#2b6777] text-white font-semibold text-lg shadow-md hover:bg-[#24555e] hover:shadow-lg transition-all duration-300"
                        >
                            Upload Resume
                        </Link>
                    </div>
                )}
            </section>
        </main>
    );
}
