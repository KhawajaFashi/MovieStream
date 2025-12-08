import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AddMovie = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        year: '',
        genre: '',
        director: '',
        plot: '',
        poster: '',
        imdbRating: '',
        runtime: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Prepare data - split genre by comma if needed, though backend handles it too
            await api.post('/movies', formData);
            alert('Movie added successfully!');
            navigate('/');
        } catch (err) {
            console.error("Error adding movie:", err);
            setError(err.response?.data?.message || "Failed to add movie");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-slate-900 p-8 rounded-xl shadow-2xl border border-slate-800">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                        Add New Movie
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="title" className="sr-only">Title</label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                required
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-slate-700 placeholder-gray-500 text-white bg-slate-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Movie Title"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="year" className="sr-only">Year</label>
                                <input
                                    id="year"
                                    name="year"
                                    type="text"
                                    required
                                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-slate-700 placeholder-gray-500 text-white bg-slate-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Year"
                                    value={formData.year}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="runtime" className="sr-only">Runtime (min)</label>
                                <input
                                    id="runtime"
                                    name="runtime"
                                    type="number"
                                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-slate-700 placeholder-gray-500 text-white bg-slate-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Runtime (min)"
                                    value={formData.runtime}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="genre" className="sr-only">Genre</label>
                            <input
                                id="genre"
                                name="genre"
                                type="text"
                                required
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-slate-700 placeholder-gray-500 text-white bg-slate-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Genre (comma separated)"
                                value={formData.genre}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="director" className="sr-only">Director</label>
                            <input
                                id="director"
                                name="director"
                                type="text"
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-slate-700 placeholder-gray-500 text-white bg-slate-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Director"
                                value={formData.director}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="poster" className="sr-only">Poster URL</label>
                            <input
                                id="poster"
                                name="poster"
                                type="url"
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-slate-700 placeholder-gray-500 text-white bg-slate-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Poster Image URL"
                                value={formData.poster}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="imdbRating" className="sr-only">IMDB Rating</label>
                            <input
                                id="imdbRating"
                                name="imdbRating"
                                type="number"
                                step="0.1"
                                max="10"
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-slate-700 placeholder-gray-500 text-white bg-slate-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="IMDB Rating (0-10)"
                                value={formData.imdbRating}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="plot" className="sr-only">Plot</label>
                            <textarea
                                id="plot"
                                name="plot"
                                rows="3"
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-slate-700 placeholder-gray-500 text-white bg-slate-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Movie Plot"
                                value={formData.plot}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-lg shadow-indigo-500/30"
                        >
                            {loading ? 'Adding...' : 'Add Movie'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMovie;
