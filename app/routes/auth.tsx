import { usePuterStore } from "~/lib/puter";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

export const meta = () => ([
    { title: 'Resumind | Auth' },
    { name: 'description', content: 'Log into your account' },
]);

const Auth = () => {
    const { isLoading, auth } = usePuterStore();
    const location = useLocation();
    const next = location.search.split('next=')[1];
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.isAuthenticated) navigate(next || '/');
    }, [auth.isAuthenticated, next]);

    return (
        <main className="bg-gradient-to-b from-[#e0f7fa] to-[#f1f8e9] min-h-screen flex items-center justify-center">
            <div className="p-1 rounded-3xl bg-gradient-to-r from-[#80deea] via-[#4dd0e1] to-[#26c6da] shadow-xl">
                <section className="flex flex-col gap-8 bg-white rounded-2xl p-10 w-full max-w-md">
                    <div className="flex flex-col items-center gap-3 text-center">
                        <h1 className="text-3xl font-extrabold text-[#2b6777]">Welcome</h1>
                        <h2 className="text-[#4a7081] text-base md:text-lg">
                            Log In to Continue Your Job Journey
                        </h2>
                    </div>
                    <div className="flex flex-col gap-4">
                        {isLoading ? (
                            <button className="w-full py-3 rounded-xl bg-[#2b6777] text-white font-semibold shadow-md animate-pulse hover:brightness-110 transition-all duration-300">
                                Signing you in...
                            </button>
                        ) : (
                            <>
                                {auth.isAuthenticated ? (
                                    <button
                                        className="w-full py-3 rounded-xl bg-[#e53935] text-white font-semibold shadow-md hover:brightness-110 transition-all duration-300"
                                        onClick={auth.signOut}
                                    >
                                        Log Out
                                    </button>
                                ) : (
                                    <button
                                        className="w-full py-3 rounded-xl bg-[#2b6777] text-white font-semibold shadow-md hover:brightness-110 transition-all duration-300"
                                        onClick={auth.signIn}
                                    >
                                        Log In
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Auth;
