import { Star, Calendar, Trash2 } from 'lucide-react';

const MovieCard = ({ movie, onClick, isAdmin, onDelete }) => {
    // console.log(movie)
    return (
        <div
            onClick={(e) => {
                // If delete button was clicked, don't trigger the main onClick
                if (e.target.closest('.delete-btn')) return;
                onClick && onClick(movie);
            }}
            className="group relative bg-slate-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
        >
            {/* Image Container */}
            <div className="aspect-2/3 overflow-hidden relative">
                <img
                    src={movie.poster || "https://via.placeholder.com/300x450?text=No+Poster"}
                    alt={movie.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-indigo-400 transition-colors flex-1">
                        {movie.title}
                    </h3>
                    {isAdmin && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete && onDelete(movie._id || movie.id);
                            }}
                            className="delete-btn p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 ml-2"
                            title="Delete Movie"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <div className="flex items-center justify-between text-slate-400 text-sm mb-3">
                    <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{movie.year || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{movie.ratings[0]?.Value || movie.ratings[0]?.value || movie.imdbRating || '0.0'}</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {movie.genre && movie.genre.slice(0, 2).map((g, index) => (
                        <span key={index} className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                            {g}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MovieCard;
