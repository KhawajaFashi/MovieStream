import { Link, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, User } from 'lucide-react';
const Navbar = ({ user, logout }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center space-x-2 text-indigo-500 hover:text-indigo-400 transition-colors">
                        <img src='../../public/movie.png' className="w-8 h-8" />
                        <span className="text-xl font-bold tracking-tight text-white">MovieStream</span>
                    </Link>

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    <span>Dashboard</span>
                                </Link>
                                <Link
                                    to="/profile"
                                    className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    <User className="w-4 h-4" />
                                    <span>Profile</span>
                                </Link>
                                <div className="flex items-center space-x-2 border-l border-slate-700 pl-4 ml-2">
                                    <div className="flex-col items-end hidden sm:flex">
                                        <span className="text-sm font-medium text-white">{user.name || 'User'}</span>
                                        <span className="text-xs text-slate-400">{user.email}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-full hover:bg-slate-800"
                                        title="Logout"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-lg shadow-indigo-500/20"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
