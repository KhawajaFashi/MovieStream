import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import api from '../services/api';

const MovieFormModal = ({ movie, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        year: '',
        plot: '',
        runtime: '',
        director: '',
        actors: '',
        poster: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (movie) {
            setFormData({
                title: movie.title || '',
                year: movie.year || '',
                plot: movie.plot || '',
                runtime: movie.runtime || '',
                director: movie.director || '',
                actors: Array.isArray(movie.actors) ? movie.actors.join(', ') : movie.actors || '',
                poster: movie.poster || ''
            });
        }
    }, [movie]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Basic validation
            if (!formData.title) throw new Error("Title is required");

            const payload = {
                ...formData,
                // Ensure actors is array if your backend expects array
                // But for updateMovie controller we wrote, it might just take what's given. 
                // Let's safe-parse actors potentially if backend strict, but our controller seemed loose.
                // Re-aligned with schema just in case:
                actors: formData.actors.split(',').map(a => a.trim())
            };

            const updatedMovie = await api.put(`/movies/${movie._id}`, payload);

            if (onSuccess) onSuccess();
            console.log("Movie updated successfully:", updatedMovie.data);
            onClose();
        } catch (err) {
            console.error("Failed to update movie", err);
            setError(err.response?.data?.message || err.message || "Failed to update movie");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            <div className="relative w-full max-w-2xl bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 flex flex-col max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white">Edit Movie</h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-slate-800 border-none rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Year</label>
                            <input
                                type="text"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-slate-800 border-none rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Runtime (min)</label>
                            <input
                                type="number"
                                name="runtime"
                                value={formData.runtime}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-slate-800 border-none rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Poster URL</label>
                        <input
                            type="text"
                            name="poster"
                            value={formData.poster}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-slate-800 border-none rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Director</label>
                        <input
                            type="text"
                            name="director"
                            value={formData.director}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-slate-800 border-none rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Actors (comma separated)</label>
                        <input
                            type="text"
                            name="actors"
                            value={formData.actors}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-slate-800 border-none rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>


                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Plot</label>
                        <textarea
                            name="plot"
                            rows="4"
                            value={formData.plot}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-slate-800 border-none rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 mr-3 text-slate-300 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="w-4 h-4" />
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MovieFormModal;
