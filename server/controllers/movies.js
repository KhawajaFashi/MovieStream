import sendEmail from "../utils/email.js";
import Movie from "../models/movies.js";
import User from "../models/user.js";
import { getOrSetCache } from "../utils/RedisCache.js";

export const getMoviesData = async (req, res) => {
    try {
        // 1. Get all movies from cache (or DB if cache miss)
        const allMovies = await getOrSetCache("movies_full_list", () => Movie.find({}));

        if (!allMovies) {
            return res.status(404).json({
                message: "Movies not found",
                movies: [],
                pagination: {
                    currentPage: 1,
                    totalPages: 0,
                    totalMovies: 0,
                    moviesPerPage: 10
                },
                found: false
            });
        }

        const { page = 1, limit = 10, search = '', sort } = req.query;

        // 2. Filter (Search)
        let filteredMovies = allMovies;
        if (search) {
            const searchLower = search.toLowerCase();
            filteredMovies = allMovies.filter(movie =>
                (movie.title && movie.title.toLowerCase().includes(searchLower)) ||
                (movie.plot && movie.plot.toLowerCase().includes(searchLower)) ||
                (movie.director && movie.director.toLowerCase().includes(searchLower))
            );
        }

        // 3. Sort
        filteredMovies.sort((a, b) => {
            switch (sort) {
                case 'latest':
                    return parseInt(b.year) - parseInt(a.year);
                case 'oldest':
                    return parseInt(a.year) - parseInt(b.year);
                case 'rating_desc':
                    return b.imdbRating - a.imdbRating;
                case 'rating_asc':
                    return a.imdbRating - b.imdbRating;
                case 'title_asc':
                    return a.title.localeCompare(b.title);
                case 'title_desc':
                    return b.title.localeCompare(a.title);
                default:
                    return new Date(b.released) - new Date(a.released);
            }
        });

        // 4. Pagination
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;

        if (pageNum < 1 || limitNum < 1) {
            return res.status(400).json({
                message: "Page and limit must be positive numbers",
                found: false
            });
        }

        const totalMovies = filteredMovies.length;
        const totalPages = Math.ceil(totalMovies / limitNum);
        const startIndex = (pageNum - 1) * limitNum;
        const paginatedMovies = filteredMovies.slice(startIndex, startIndex + limitNum);

        // 5. Response
        return res.status(200).json({
            message: "Successfully fetched movies",
            movies: paginatedMovies,
            pagination: {
                currentPage: pageNum,
                totalPages: totalPages,
                totalMovies: totalMovies,
                moviesPerPage: limitNum
            },
            found: paginatedMovies.length > 0
        });

    } catch (err) {
        console.error("Error fetching movies:", err);
        res.status(500).json({
            message: "Server error: " + err.message,
            movies: null,
            found: false
        });
    }
}


export const addMoviesData = async (req, res) => {
    try {
        let movieData = req.body || req.body.movieData;

        // console.log("Received movie data:", movieData);

        // Convert string values to appropriate types
        if (movieData.imdbRating && typeof movieData.imdbRating === 'string') {
            movieData.imdbRating = parseFloat(movieData.imdbRating);
        }

        if (movieData.imdbVotes && typeof movieData.imdbVotes === 'string') {
            movieData.imdbVotes = parseInt(movieData.imdbVotes.replace(/,/g, ''), 10);
        }

        if (movieData.totalSeasons && typeof movieData.totalSeasons === 'string') {
            movieData.totalSeasons = parseInt(movieData.totalSeasons, 10);
        }

        // Convert metascore to number if it's a valid number string
        if (movieData.Metascore && typeof movieData.Metascore === 'string' && movieData.Metascore !== 'N/A') {
            movieData.metascore = parseInt(movieData.Metascore, 10);
        }

        // Convert genre from string to array
        if (movieData.Genre && typeof movieData.Genre === 'string') {
            movieData.genre = movieData.Genre.split(',').map(g => g.trim());
        } else if (movieData.genre && typeof movieData.genre === 'string') {
            movieData.genre = movieData.genre.split(',').map(g => g.trim());
        }

        // Convert writer from string to array
        if (movieData.Writer && typeof movieData.Writer === 'string') {
            movieData.writer = movieData.Writer.split(',').map(w => w.trim());
        } else if (movieData.writer && typeof movieData.writer === 'string') {
            movieData.writer = movieData.writer.split(',').map(w => w.trim());
        }

        // Convert actors from string to array
        if (movieData.Actors && typeof movieData.Actors === 'string') {
            movieData.actors = movieData.Actors.split(',').map(a => a.trim());
        } else if (movieData.actors && typeof movieData.actors === 'string') {
            movieData.actors = movieData.actors.split(',').map(a => a.trim());
        }

        // Convert language from string to array
        if (movieData.Language && typeof movieData.Language === 'string') {
            movieData.language = movieData.Language.split(',').map(l => l.trim());
        } else if (movieData.language && typeof movieData.language === 'string') {
            movieData.language = movieData.language.split(',').map(l => l.trim());
        }

        // Convert country from string to array
        if (movieData.Country && typeof movieData.Country === 'string') {
            movieData.country = movieData.Country.split(',').map(c => c.trim());
        } else if (movieData.country && typeof movieData.country === 'string') {
            movieData.country = movieData.country.split(',').map(c => c.trim());
        }

        // Convert runtime to extract number
        if (movieData.Runtime && typeof movieData.Runtime === 'string') {
            const runtimeMatch = movieData.Runtime.match(/\d+/);
            movieData.runtime = runtimeMatch ? parseInt(runtimeMatch[0], 10) : 0;
        } else if (movieData.runtime && typeof movieData.runtime === 'string') {
            const runtimeMatch = movieData.runtime.match(/\d+/);
            movieData.runtime = runtimeMatch ? parseInt(runtimeMatch[0], 10) : 0;
        }

        // Map API response fields to schema fields (handle both camelCase and Title Case)
        const processedData = {
            title: movieData.Title || movieData.title,
            year: movieData.Year || movieData.year,
            rated: movieData.Rated || movieData.rated,
            released: movieData.Released || movieData.released,
            runtime: movieData.runtime,
            genre: movieData.genre || [],
            director: movieData.Director || movieData.director || 'N/A',
            writer: movieData.writer || [],
            actors: movieData.actors || [],
            plot: movieData.Plot || movieData.plot,
            language: movieData.language || ['English'],
            country: movieData.country || [],
            awards: movieData.Awards || movieData.awards || null,
            poster: movieData.Poster || movieData.poster || null,
            ratings: movieData.Ratings || movieData.ratings || [],
            metascore: movieData.metascore || movieData.Metascore || 'N/A',
            imdbRating: movieData.imdbRating || 0,
            imdbVotes: movieData.imdbVotes || 0,
            imdbID: movieData.imdbID || movieData.imdbId,
            type: (movieData.Type || movieData.type || 'movie').toLowerCase(),
            totalSeasons: movieData.totalSeasons || null,
            dvd: movieData.DVD || movieData.dvd || null,
            boxOffice: movieData.BoxOffice || movieData.boxOffice || null,
            production: movieData.Production || movieData.production || null,
            website: movieData.Website || movieData.website || null,
            addedBy: req.user._id
        };

        // console.log("Processed movie data to be saved:", processedData);

        const movies = await Movie.create(processedData);

        res.status(201).json({
            message: "Movies added successfully",
            movies: movies,
            created: true
        });

    }
    catch (err) {
        console.log("Error while adding movie data:", err);
        res.status(500).json({
            message: "Server error: " + err.message,
            movies: null,
            created: false
        });
    }
}


export const updateMovie = async (req, res) => {
    try {
        const movieId = req.params.id;
        const updateData = req.body;
        const updatedMovie = await Movie.findByIdAndUpdate(movieId, updateData, { new: true });

        if (!updatedMovie) {
            return res.status(404).json({
                message: "Movie not found",
                movies: null,
                updated: false
            });
        }
        res.status(200).json({
            message: "Movie updated successfully",
            movies: updatedMovie,
            updated: true
        });
    }
    catch (err) {
        console.log("Error while updating movie data:", err);
        res.status(500).json({
            message: "Server error: " + err.message,
            movies: null,
            updated: false
        });
    }
}


export const addMoviesUserData = async (req, res) => {
    try {
        // Get all user IDs
        // console.log("Adding addedBy field to all movies.");
        const users = await User.find({});
        const userIds = users.map(u => u._id);

        if (userIds.length === 0) {
            return res.status(400).json({ message: "No users found." });
        }

        // console.log("User IDs fetched:", userIds);
        // Update all movies with random user ID
        const updatedMovies = await Movie.updateMany(
            {},
            [
                {
                    $set: {
                        addedBy: {
                            $arrayElemAt: [
                                userIds,
                                { $floor: { $multiply: [{ $rand: {} }, userIds.length] } }
                            ]
                        }
                    }
                }
            ],
            { updatePipeline: true }
        );

        // console.log("Movies updated:", updatedMovies);

        return res.json({ message: "addedBy field added to all movies." });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server error: " + err.message,
            movies: null,
            found: false
        });
    }
}


export const deleteMovie = async (req, res) => {
    try {
        const movieId = req.params.id;
        const movie = await Movie.findById(movieId).populate('addedBy');

        if (!movie) {
            return res.status(404).json({
                message: "Movie not found",
                deleted: false
            });
        }

        const creatorEmail = movie.addedBy?.email;
        const adminName = req.user.username; // Assuming req.user is set by auth middleware
        const adminEmail = req.user.email;

        // Delete the movie
        await Movie.findByIdAndDelete(movieId);

        // Send email notification
        if (creatorEmail) {
            try {
                await sendEmail({
                    email: creatorEmail,
                    subject: 'Your movie has been deleted',
                    message: `Hello,\n\nYour movie "${movie.title}" has been deleted by Admin ${adminName} (${adminEmail}).\n\nRegards,\nMovieStream Team`
                });
            } catch (emailErr) {
                console.error("Error sending email:", emailErr);
                // Don't block the response if email fails, but maybe log it
            }
        }

        return res.status(200).json({
            message: "Movie deleted successfully",
            deleted: true
        });
    } catch (err) {
        console.error("Error deleting movie:", err);
        return res.status(500).json({
            message: "Server error: " + err.message,
            deleted: false
        });
    }
}