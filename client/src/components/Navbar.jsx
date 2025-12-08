import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, User, Menu, X } from 'lucide-react';

const Navbar = ({ user, logout }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
        setIsOpen(false);
    };

    return (
        <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center space-x-2 text-indigo-500 hover:text-indigo-400 transition-colors">
                        <img src='../../public/movie.png' className="w-8 h-8" alt="Logo" />
                        <span className="text-xl font-bold tracking-tight text-white">MovieStream</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-4">
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
                                    <div className="flex flex-col items-end">
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

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-slate-300 hover:text-white p-2"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="md:hidden bg-slate-900 border-b border-slate-800 absolute w-full left-0 top-16 shadow-xl">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {user ? (
                            <>
                                <div className="px-3 py-2 border-b border-slate-800 mb-2">
                                    <div className="text-base font-medium text-white">{user.name || 'User'}</div>
                                    <div className="text-sm text-slate-400">{user.email}</div>
                                </div>
                                <Link
                                    to="/dashboard"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center space-x-2 text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-base font-medium"
                                >
                                    <LayoutDashboard className="w-5 h-5" />
                                    <span>Dashboard</span>
                                </Link>
                                <Link
                                    to="/profile"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center space-x-2 text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-base font-medium"
                                >
                                    <User className="w-5 h-5" />
                                    <span>Profile</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center space-x-2 text-slate-300 hover:text-red-400 hover:bg-slate-800 px-3 py-2 rounded-md text-base font-medium text-left"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <div className="grid grid-cols-2 gap-2 p-2">
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="text-center block w-full px-5 py-3 text-white bg-slate-800 hover:bg-slate-700 rounded-lg font-medium"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/signup"
                                    onClick={() => setIsOpen(false)}
                                    className="text-center block w-full px-5 py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
