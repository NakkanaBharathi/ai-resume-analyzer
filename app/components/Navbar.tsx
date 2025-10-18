import { Link } from "react-router";

const Navbar = () => {
    return (
        <nav className="w-full flex items-center justify-between px-8 py-4">
            {/* Logo */}
            <Link to="/">
                <p className="text-2xl font-extrabold text-[#2b6777] transition-transform duration-300 hover:scale-105">
                    Hirelytics
                </p>
            </Link>

            {/* Upload Button */}
            <Link
                to="/upload"
                className="px-5 py-2.5 rounded-lg font-semibold text-[#2b6777] shadow-md transition-all duration-300
                           hover:bg-[#1f5666] hover:text-white hover:shadow-lg hover:-translate-y-0.5"
            >
                Upload Resume
            </Link>
        </nav>
    );
};

export default Navbar;
