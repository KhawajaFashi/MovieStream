# Movie Database Application

A full-stack web application for managing and displaying movie information with search, filtering, and pagination capabilities.

**Live Demo**: [https://movie-stream-sable.vercel.app/](https://movie-stream-sable.vercel.app/)

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context for state management
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API service calls
│   │   ├── utils/         # Utility functions
│   │   ├── App.jsx        # Main App component
│   │   └── main.jsx       # Entry point
│   ├── package.json       # Frontend dependencies
│   └── vite.config.js     # Vite configuration
│
├── server/                # Node.js/Express backend
│   ├── controllers/       # Request handlers
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   ├── config/            # Configuration files
│   ├── utils/             # Utility functions
│   ├── app.js             # Express app setup
│   └── server.js          # Server entry point
│
├── package.json           # Root dependencies
├── TODO.js                # Project tasks
└── README.md              # This file
```

## Features

- **Movie Management**: Add, view, and manage movie data
- **Search Functionality**: Search movies by title, plot, and director
- **Filtering**: Filter movies by genre, rating, and other attributes
- **Sorting**: Sort movies by release date, rating, title, etc.
- **Pagination**: Browse movies with configurable page size
- **Data Integration**: Support for OMDb API data format
- **Ratings System**: Store and display multiple rating sources (IMDb, Rotten Tomatoes, Metacritic)
- **Movie & Series Support**: Handle both movies and TV series

## Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **CSS** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas connection)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   cd client && npm install
   ```

2. **Configure environment variables**
   - Create a `.env` file in the server directory
   - Add your MongoDB connection string:
     ```
     MONGODB_URI=your_mongodb_connection_string
     PORT=5000
     ```

3. **Start the development servers**
   
   Terminal 1 (Backend):
   ```bash
   npm run server
   ```
   
   Terminal 2 (Frontend):
   ```bash
   cd client
   npm run dev
   ```

The application will be available at `http://localhost:5173` (frontend) and `http://localhost:5000` (backend).

## API Endpoints

### Movies
- `GET /api/movies` - Get all movies with pagination and filtering
  - Query parameters:
    - `page` (default: 1) - Page number
    - `limit` (default: 10) - Items per page
    - `search` - Search term for title, plot, or director
    - `sort` - Sort option (latest, oldest, rating_asc, rating_desc, title_asc, title_desc)

- `POST /api/movies` - Add a new movie
  - Body: Movie object (supports OMDb API format)

- `GET /api/movies/:id` - Get a specific movie

- `PUT /api/movies/:id` - Update a movie

- `DELETE /api/movies/:id` - Delete a movie

## Movie Schema

```javascript
{
  title: String,
  year: String,
  rated: String (G, PG, PG-13, R, NC-17, TV-14, TV-G, TV-PG, TV-MA, Not Rated, N/A),
  released: String,
  runtime: Number (minutes),
  genre: [String],
  director: String,
  writer: [String],
  actors: [String],
  plot: String,
  language: [String],
  country: [String],
  awards: String,
  poster: String (URL),
  ratings: [{
    source: String,
    value: String
  }],
  metascore: String | Number,
  imdbRating: Number,
  imdbVotes: Number,
  imdbID: String,
  type: String (movie, series, episode),
  totalSeasons: Number,
  dvd: String,
  boxOffice: String,
  production: String,
  website: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Data Conversion

The backend automatically converts OMDb API responses:
- Parses numeric strings (e.g., "9.0" → 9.0)
- Removes number formatting (e.g., "331,084" → 331084)
- Converts comma-separated strings to arrays (e.g., "Action, Drama" → ["Action", "Drama"])
- Extracts runtime values (e.g., "148 min" → 148)
- Handles both Title Case (API format) and camelCase (database format)

## Example: Adding a Movie

```bash
curl -X POST http://localhost:5000/api/movies \
  -H "Content-Type: application/json" \
  -d '{
    "Title": "Inception",
    "Year": "2010",
    "Rated": "PG-13",
    "Released": "16 Jul 2010",
    "Runtime": "148 min",
    "Genre": "Action, Adventure, Sci-Fi",
    "Director": "Christopher Nolan",
    "Writer": "Christopher Nolan",
    "Actors": "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page",
    "Plot": "A thief who steals corporate secrets through dream-sharing technology...",
    "Language": "English, Japanese, French",
    "Country": "United States, United Kingdom",
    "Poster": "https://...",
    "Ratings": [{"Source": "IMDb", "Value": "8.8/10"}],
    "imdbRating": "8.8",
    "imdbVotes": "2,757,709",
    "imdbID": "tt1375666",
    "Type": "movie"
  }'
```

## Development

### Available Scripts

**Root level:**
- `npm install` - Install all dependencies
- `npm run server` - Start backend development server
- `npm run build` - Build frontend for production

**Client level:**
- `npm run dev` - Start frontend development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## File Structure Details

### Backend Routes
- `/api/movies` - Movie CRUD operations

### Frontend Components
- `Navbar` - Navigation component
- `MovieCard` - Individual movie display
- `MovieList` - List of movies with pagination
- `SearchBar` - Search functionality
- `FilterPanel` - Filtering options

## Future Enhancements

- User authentication and authorization
- Movie ratings and reviews
- Watchlist functionality
- Advanced filtering options
- Movie recommendations
- Image optimization
- Caching mechanism
- API rate limiting

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check your connection string in `.env`
- Verify network access if using MongoDB Atlas

### Port Already in Use
- Change the PORT in `.env`
- Or kill the process using the port

### CORS Errors
- Ensure backend and frontend are running
- Check CORS configuration in Express app

## License

This project is part of Assignment 4.

## Contributing

For contributions, please follow the existing code structure and naming conventions.
*
