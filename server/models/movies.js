import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters']
        },
        year: {
            type: String
        },
        rated: {
            type: String,
            enum: ['G', 'PG', 'PG-13', 'R', 'NC-17', 'TV-14', 'TV-G', 'TV-PG', 'TV-MA', 'Not Rated', 'N/A', 'Approved'],
            default: 'Not Rated'
        },
        released: {
            type: String
        },
        runtime: {
            type: Number,
            default: 0
        },
        genre: {
            type: [String],
            default: []
        },
        director: {
            type: String,
            default: null,
            trim: true
        },
        writer: {
            type: [String],
            default: []
        },
        actors: {
            type: [String],
            default: []
        },
        plot: {
            type: String,
            trim: true,
            maxlength: [2000, 'Plot cannot exceed 2000 characters']
        },
        language: {
            type: [String],
            default: ['English']
        },
        country: {
            type: [String],
            default: []
        },
        awards: {
            type: String,
            default: null
        },
        poster: {
            type: String,
            default: null
        },
        ratings: [
            {
                Source: {
                    type: String,
                    required: true
                },
                Value: {
                    type: String,
                    required: true
                }
            }
        ],
        metascore: {
            type: String,
            default: 'N/A'
        },
        imdbRating: {
            type: Number,
            default: 0
        },
        imdbVotes: {
            type: Number,
            default: 0
        },
        imdbID: {
            type: String,
            unique: true,
            trim: true
        },
        type: {
            type: String,
            enum: ['movie', 'series', 'episode'],
            default: 'movie'
        },
        totalSeasons: {
            type: Number,
            default: null
        },
        dvd: {
            type: String,
            default: null
        },
        boxOffice: {
            type: String,
            default: null
        },
        production: {
            type: String,
            default: null
        },
        website: {
            type: String,
            default: null
        },
        isActive: {
            type: Boolean,
            default: true
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;