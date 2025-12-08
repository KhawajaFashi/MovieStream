import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import MovieCard from '../components/MovieCard';
import MovieDetailsModal from '../components/MovieDetailsModal';
import Pagination from '../components/Pagination';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

const Home = ({ user }) => {
    const [searchParams, setSearchParams] = useSearchParams();


    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);

    // Get params from URL or default
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'latest';
    const limit = 10;

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            setError(null);
            try {
                // Construct query string
                const params = new URLSearchParams({
                    page,
                    limit,
                    search,
                    sort
                });

                const response = await api.get(`/movies?${params.toString()}`);
                // Assuming response structure: { movies: [], totalPages: 5, currentPage: 1 }
                // Adjust based on actual API response
                setMovies(response.data.movies || response.data.data || []);
                console.log("Fetched movies:",response.data || []);
                setTotalPages(response.data.pagination.totalPages || 1);

            } catch (err) {
                console.error("Failed to fetch movies", err);
                // Mock data for verification since backend is empty/failing
                setMovies([
                    {
                        _id: '1',
                        title: 'Inception',
                        poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
                        year: '2010',
                        rated: 'PG-13',
                        released: '16 Jul 2010',
                        runtime: 148,
                        genre: ['Action', 'Adventure', 'Sci-Fi'],
                        director: 'Christopher Nolan',
                        writer: ['Christopher Nolan'],
                        actors: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
                        plot: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
                        language: ['English', 'Japanese', 'French'],
                        country: ['USA', 'UK'],
                        awards: 'Won 4 Oscars. Another 153 wins & 220 nominations.',
                        ratings: [{ Source: 'Internet Movie Database', Value: '8.8/10' }],
                        metascore: '74',
                        imdbRating: 8.8,
                        imdbVotes: 2496555,
                        type: 'movie',
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [page, search, sort]);

    const handleSearch = (e) => {
        e.preventDefault();
        const form = e.target;
        const query = form.search.value;
        setSearchParams({ page: 1, search: query, sort });
    };

    const handleSortChange = (e) => {
        setSearchParams({ page: 1, search, sort: e.target.value });
    };

    const handlePageChange = (newPage) => {
        setSearchParams({ page: newPage, search, sort });
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white pb-12">
            {/* Hero / Header Section */}
            <div className="bg-linear-to-b from-indigo-900/20 to-slate-950 py-12 px-4 sm:px-6 lg:px-8 mb-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-center bg-clip-text text-transparent bg-linear-to-r from-indigo-400 to-cyan-400">
                        Discover Great Movies
                    </h1>
                    <p className="text-slate-400 text-center max-w-2xl mx-auto mb-8 text-lg">
                        Explore our vast collection of movies. Search, filter, and find your next favorite film.
                    </p>

                    {/* Search and Filter Bar */}
                    <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto bg-slate-900/50 p-4 rounded-2xl backdrop-blur-sm border border-slate-800 shadow-xl">
                        <form onSubmit={handleSearch} className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                name="search"
                                defaultValue={search}
                                placeholder="Search movies..."
                                className="w-full pl-10 pr-4 py-3 bg-slate-800 border-none rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:bg-slate-800 transition-all"
                            />
                        </form>

                        <div className="flex items-center gap-2 min-w-[200px]">
                            <div className="relative w-full">
                                <SlidersHorizontal className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <select
                                    value={sort}
                                    onChange={handleSortChange}
                                    className="w-full pl-10 pr-8 py-3 bg-slate-800 border-none rounded-xl text-white appearance-none cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:bg-slate-800 transition-all"
                                >
                                    <option value="latest">Latest Release</option>
                                    <option value="oldest">Oldest Release</option>
                                    <option value="rating_desc">Highest Rated</option>
                                    <option value="rating_asc">Lowest Rated</option>
                                    <option value="title_asc">Title (A-Z)</option>
                                    <option value="title_desc">Title (Z-A)</option>
                                </select>
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <Filter className="w-4 h-4 text-slate-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="bg-slate-900 rounded-xl aspect-2/3 animate-pulse" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-red-400 text-lg mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : movies.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-slate-400 text-xl">No movies found matching your criteria.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {movies.map((movie) => (
                                <MovieCard
                                    key={movie._id || movie.id}
                                    movie={movie}
                                    onClick={(m) => setSelectedMovie(m)}
                                />
                            ))}
                        </div>

                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </div>

            {/* Movie Details Modal */}
            <MovieDetailsModal
                movie={selectedMovie}
                onClose={() => setSelectedMovie(null)}
                user={user}
            />
        </div>
    );
};

export default Home;
