import { useState, useEffect } from 'react';
import { LayoutDashboard, Film, TrendingUp, Star, Upload, Users, Award, Globe } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../services/api';
const Dashboard = ({ user }) => {
    const [stats, setStats] = useState({
        totalMovies: 12,
        totalBoxOfficeCollection: 1250,
        avgRating: 4.5,
        genreDistribution: [
            { name: 'Action', value: 4 },
            { name: 'Drama', value: 3 },
            { name: 'Comedy', value: 3 },
            { name: 'Sci-Fi', value: 2 },
        ],
        viewsOverTime: [
            { name: 'Jan', views: 400 },
            { name: 'Feb', views: 300 },
            { name: 'Mar', views: 550 },
            { name: 'Apr', views: 450 },
            { name: 'May', views: 600 },
            { name: 'Jun', views: 700 },
        ]
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Assuming /api/dashboard returns { totalMovies, totalViews, genreDistribution: [], ratings: [] }
                // If endpoint differs, I'll need to adjust.
                const response = await api.get('/dashboard');
                if (response.data.found) {
                    console.log("Dashboard stats fetched:", response.data);
                    setStats(response.data);
                }
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
                // Mock data for visualization if API fails or is not ready
                setStats({
                    totalMovies: 12,
                    totalBoxOfficeCollection: 1250,
                    avgRating: 4.5,
                    genreDistribution: [
                        { name: 'Action', value: 4 },
                        { name: 'Drama', value: 3 },
                        { name: 'Comedy', value: 3 },
                        { name: 'Sci-Fi', value: 2 },
                    ],
                    viewsOverTime: [
                        { name: 'Jan', views: 400 },
                        { name: 'Feb', views: 300 },
                        { name: 'Mar', views: 550 },
                        { name: 'Apr', views: 450 },
                        { name: 'May', views: 600 },
                        { name: 'Jun', views: 700 },
                    ]
                });
                // setError('Failed to load analytics.');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#10b981', '#06b6d4', '#3b82f6'];

    if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading Dashboard...</div>;

    return (
        <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <LayoutDashboard className="text-indigo-500" />
                        Dashboard
                    </h1>
                    <p className="text-slate-400 mt-2">Overview of your collection</p>
                </div>

                {/* 1. Key Highlights Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        title="Total Titles"
                        value={stats?.totalTitles || 0}
                        icon={<Film className="text-indigo-400" />}
                        subtext={`${stats?.moviesCount || 0} Movies, ${stats?.seriesCount || 0} Series`}
                    />
                    <StatCard
                        title="Avg Rating"
                        value={stats?.avgRating || 0}
                        icon={<Star className="text-yellow-400" />}
                        subtext="IMDb Average"
                    />
                    <StatCard
                        title="Total Awards"
                        value={stats?.totalAwards?.wins || 0}
                        icon={<Award className="text-emerald-400" />}
                        subtext={`${stats?.totalAwards?.nominations || 0} Nominations`}
                    />
                    <StatCard
                        title="Top Genre"
                        value={stats?.mostPopularGenre?.name || 'N/A'}
                        icon={<TrendingUp className="text-purple-400" />}
                        subtext={`${stats?.mostPopularGenre?.count || 0} titles`}
                    />
                </div>

                {/* 2. Spotlight Section (Highest Rated, Most Voted, etc) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <SpotlightCard title="Highest Rated" movie={stats?.highestRated} icon={<Star className="w-4 h-4 text-yellow-500" />} />
                    <SpotlightCard title="Most Voted" movie={stats?.mostVoted} icon={<Users className="w-4 h-4 text-blue-500" />} />
                    <SpotlightCard title="Highest Box Office" movie={stats?.highestBoxOffice} icon={<TrendingUp className="w-4 h-4 text-green-500" />} isBoxOffice />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <SimpleCard title="Newest Release" movie={stats?.newestRelease} label="newest" />
                    <SimpleCard title="Oldest Release" movie={stats?.oldestRelease} label="oldest" />
                </div>


                {/* 3. Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Genre Distribution */}
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg flex flex-col">
                        <h3 className="text-xl font-bold mb-6 text-slate-200">Genre Distribution</h3>
                        <div className="h-64 flex-1">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats?.genreDistribution || []}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {stats?.genreDistribution?.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4 justify-center">
                            {stats?.genreDistribution?.slice(0, 5).map((entry, index) => (
                                <div key={index} className="flex items-center gap-1 text-xs text-slate-400">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                    {entry.name}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Rating Distribution */}
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
                        <h3 className="text-xl font-bold mb-6 text-slate-200">Rating Distribution</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats?.ratingDistribution || []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} cursor={{ fill: '#334155', opacity: 0.2 }} />
                                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Timeline */}
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
                        <h3 className="text-xl font-bold mb-6 text-slate-200">Release Timeline</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats?.viewsOverTime || []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                                    <YAxis stroke="#94a3b8" fontSize={12} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                                    <Bar dataKey="views" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Titles Released" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Language Distribution */}
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
                        <h3 className="text-xl font-bold mb-6 text-slate-200">Top Languages</h3>
                        <div className="space-y-4">
                            {stats?.languageDistribution?.map((lang, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <span className="text-slate-300 flex items-center gap-2">
                                        <Globe className="w-4 h-4 text-slate-500" /> {lang.name}
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-indigo-500 rounded-full"
                                                style={{ width: `${(lang.value / (stats?.totalTitles || 1)) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-medium text-slate-400">{lang.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

// Helper Components
const StatCard = ({ title, value, icon, subtext }) => (
    <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-800 shadow-lg hover:border-indigo-500/30 transition-colors">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
            <div className="p-2 bg-slate-800 rounded-lg">{icon}</div>
        </div>
        <p className="text-3xl font-bold text-white mb-1">{value}</p>
        {subtext && <p className="text-xs text-slate-500">{subtext}</p>}
    </div>
);

const SpotlightCard = ({ title, movie, icon, isBoxOffice }) => {
    if (!movie) return (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg flex items-center justify-center h-full min-h-40">
            <p className="text-slate-500 text-sm">No data for {title}</p>
        </div>
    );
    return (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-lg overflow-hidden flex relative group">
            <div className="w-1/3 min-w-[100px]">
                <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="p-4 flex flex-col justify-center flex-1">
                <div className="flex items-center gap-2 text-xs font-medium text-indigo-400 mb-1 uppercase tracking-wider">
                    {icon} {title}
                </div>
                <h4 className="font-bold text-lg text-white leading-tight mb-2 line-clamp-2">{movie.title}</h4>
                <div className="text-2xl font-bold text-slate-200">
                    {isBoxOffice ? (movie.value || 'N/A') : (movie.imdbRating || movie.imdbVotes?.toLocaleString())}
                </div>
                {!isBoxOffice && <div className="text-xs text-slate-500">{movie.imdbVotes ? 'votes' : '/ 10'}</div>}
            </div>
        </div>
    )
};

const SimpleCard = ({ title, movie, label }) => {
    if (!movie) return null;
    return (
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">{title}</span>
                <span className="font-medium text-indigo-300">{movie.title}</span>
                <span className="text-slate-500 text-sm ml-2">({movie.year})</span>
            </div>
            <span className="px-2 py-1 bg-slate-800 text-xs rounded text-slate-400">{label}</span>
        </div>
    )
}

export default Dashboard;
