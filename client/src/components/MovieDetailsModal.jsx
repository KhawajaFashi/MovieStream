import { useState } from 'react';
import { X, Calendar, Clock, Globe, Award, Star, Users, Film, Info, Edit } from 'lucide-react';
import MovieFormModal from './MovieFormModal';

const MovieDetailsModal = ({ movie, onClose, user }) => {
    const [isEditing, setIsEditing] = useState(false);

    if (!movie) return null;

    // Check ownership: user must exist and user._id must match movie.addedBy
    const isOwner = user && movie.addedBy === user._id;
    console.log("Is Owner:", isOwner, "User ID:", user?._id, "Movie addedBy:", movie.addedBy);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl shadow-2xl overflow-y-auto border border-slate-800 flex flex-col md:flex-row">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Edit Button (if owner) */}
                {isOwner && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="absolute top-4 right-16 z-10 p-2 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-full transition-colors flex items-center gap-2 px-4"
                        title="Edit Movie"
                    >
                        <Edit className="w-4 h-4" />
                        <span className="text-sm font-medium">Edit</span>
                    </button>
                )}

                {/* Poster Section */}
                <div className="w-full md:w-2/5 relative">
                    <img
                        src={movie.poster || "https://via.placeholder.com/400x600?text=No+Poster"}
                        alt={movie.title}
                        className="w-full h-full object-cover min-h-[400px]"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent md:bg-linear-to-r md:from-transparent md:to-slate-900" />
                </div>

                {/* Content Section */}
                <div className="w-full md:w-3/5 p-6 md:p-8 text-slate-100 overflow-y-auto">
                    <div className="mb-6">
                        <div className="flex flex-wrap gap-2 mb-3">
                            {movie.genre?.map((g, i) => (
                                <span key={i} className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                    {g}
                                </span>
                            ))}
                            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-700 text-slate-300 border border-slate-600">
                                {movie.rated || 'NR'}
                            </span>
                            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-700 text-slate-300 border border-slate-600 uppercase">
                                {movie.type || 'movie'}
                            </span>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{movie.title}</h2>

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400 mb-6">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{movie.year}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{movie.runtime ? `${movie.runtime} min` : 'N/A'}</span>
                            </div>
                            {movie.country && (
                                <div className="flex items-center gap-1">
                                    <Globe className="w-4 h-4" />
                                    <span>{movie.country.join(', ')}</span>
                                </div>
                            )}
                        </div>

                        {/* Ratings */}
                        <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl mb-6">
                            <div className="flex flex-col items-center">
                                <div className="flex items-center gap-1 text-yellow-500 text-xl font-bold">
                                    <Star className="w-5 h-5 fill-current" />
                                    <span>{movie.imdbRating || 'N/A'}</span>
                                </div>
                                <span className="text-xs text-slate-500">{movie.imdbVotes ? `${movie.imdbVotes.toLocaleString()} votes` : ''}</span>
                            </div>
                            {movie.metascore && movie.metascore !== 'N/A' && (
                                <div className="h-8 w-px bg-slate-700 mx-2"></div>
                            )}
                            {movie.metascore && movie.metascore !== 'N/A' && (
                                <div className="flex flex-col items-center">
                                    <span className={`text-xl font-bold ${parseInt(movie.metascore) >= 60 ? 'text-emerald-500' :
                                        parseInt(movie.metascore) >= 40 ? 'text-yellow-500' : 'text-red-500'
                                        }`}>
                                        {movie.metascore}
                                    </span>
                                    <span className="text-xs text-slate-500">Metascore</span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                                    <Info className="w-4 h-4 text-indigo-400" /> Plot
                                </h3>
                                <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                                    {movie.plot || 'No plot available.'}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="block text-slate-500 mb-1">Director</span>
                                    <span className="text-slate-200">{movie.director || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="block text-slate-500 mb-1">Writers</span>
                                    <span className="text-slate-200">{movie.writer?.join(', ') || 'N/A'}</span>
                                </div>
                                <div className="sm:col-span-2">
                                    <span className="block text-slate-500 mb-1">Cast</span>
                                    <span className="text-slate-200">{movie.actors?.join(', ') || 'N/A'}</span>
                                </div>
                            </div>

                            {movie.awards && movie.awards !== 'N/A' && (
                                <div className="bg-indigo-900/20 border border-indigo-500/20 p-3 rounded-lg flex items-start gap-3">
                                    <Award className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                                    <span className="text-indigo-200 text-sm">{movie.awards}</span>
                                </div>
                            )}

                            {/* Extra Details */}
                            <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-4 text-xs text-slate-400">
                                <div>Released: <span className="text-slate-300">{movie.released}</span></div>
                                <div>Box Office: <span className="text-slate-300">{movie.boxOffice || 'N/A'}</span></div>
                                <div>Production: <span className="text-slate-300">{movie.production || 'N/A'}</span></div>
                                <div>DVD: <span className="text-slate-300">{movie.dvd || 'N/A'}</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                {isEditing && (
                    <MovieFormModal
                        movie={movie}
                        onClose={() => setIsEditing(false)}
                        onSuccess={() => {
                            window.location.reload(); // Simple reload to refresh data
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default MovieDetailsModal;
