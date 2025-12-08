import mongoose from "mongoose";
import Movie from "../models/movies.js";

export const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const query = { addedBy: new mongoose.Types.ObjectId(userId) };
        // console.log("Generating dashboard stats for user:", userId);

        // We could do one massive aggregation, but separate queries might be cleaner to maintain/debug
        // 1. Basic Counts & Avg
        const basicStats = await Movie.aggregate([
            { $match: query },
            {
                $group: {
                    _id: null,
                    totalTitles: { $sum: 1 },
                    avgRating: { $avg: "$imdbRating" },
                    totalVotes: { $sum: "$imdbVotes" }
                }
            }
        ]);

        // console.log("Basic Stats:", basicStats);

        const totalTitles = basicStats[0]?.totalTitles || 0;
        const avgRating = parseFloat((basicStats[0]?.avgRating || 0).toFixed(1));

        // 2. Movies vs Series
        const typeDistribution = await Movie.aggregate([
            { $match: query },
            { $group: { _id: "$type", count: { $sum: 1 } } }
        ]);

        const moviesCount = typeDistribution.find(t => t._id === 'movie')?.count || 0;
        const seriesCount = typeDistribution.find(t => t._id === 'series')?.count || 0;

        // 3. Distributions (Genre, Language)
        const genreDist = await Movie.aggregate([
            { $match: query },
            { $unwind: "$genre" },
            { $group: { _id: "$genre", count: { $sum: 1 } } },
            { $sort: { count: -1 } } // Sort by most popular
        ]);

        const languageDist = await Movie.aggregate([
            { $match: query },
            { $unwind: "$language" },
            { $group: { _id: "$language", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // 4. Rating Distribution (Buckets)
        const ratingDist = await Movie.aggregate([
            { $match: query },
            {
                $bucket: {
                    groupBy: "$imdbRating",
                    boundaries: [0, 7, 8, 9, 10.1], // 10.1 to include 10
                    default: "Unknown",
                    output: { count: { $sum: 1 } }
                }
            }
        ]);

        // Map bucket keys to labels
        const ratingLabels = {
            0: "< 7",
            7: "7.0 - 7.9",
            8: "8.0 - 8.9",
            9: "9.0+"
        };

        const formattedRatingDist = ratingDist.map(r => ({
            name: ratingLabels[r._id] || r._id,
            value: r.count
        }));

        // 5. Timeline (Release Year)
        // Extract year from "16 Jul 2010" or "2010" or "2010–2014"
        // Simplest is to rely on the 'year' field which usually starts with the release year
        const yearDist = await Movie.aggregate([
            { $match: query },
            {
                $project: {
                    // Extract first 4 digits
                    yearStr: { $substr: ["$year", 0, 4] }
                }
            },
            { $group: { _id: "$yearStr", count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        // 6. Specific Titles (Highest Rated, Most Voted, etc)
        // We'll fetch these individually to ensure we get full details cleanly
        const highestRated = await Movie.findOne(query).sort({ imdbRating: -1 }).select('title poster imdbRating');
        const mostVoted = await Movie.findOne(query).sort({ imdbVotes: -1 }).select('title poster imdbVotes');

        // For Newest/Oldest, sorting by string 'released' "16 Jul 2010" is tricky in Mongo.
        // Javascript sort is safer for this format unless we convert in DB.
        // Let's fetch all dates and sort in JS, or use 'year' field as proxy.
        // Given 'year' is "2010", it's good enough for Year granularity. 
        // For accurate date, let's fetch strictly needed fields and sort in JS (assuming list isn't massive).
        // If list is massive, this is bad. But assignment implies reasonable size.
        // Better: Use aggregation with $toDate if compatible, but format "DD MMM YYYY" is hard.
        // Let's rely on `createdAt` as fallback for "Added recently" but for "Released", use `year` desc, then `released` text sort?
        // Actually, we can use the `year` field for Oldest/Newest roughly.
        const newestRelease = await Movie.findOne(query).sort({ year: -1 }); // Approx
        const oldestRelease = await Movie.findOne(query).sort({ year: 1 });  // Approx

        // 7. Box Office
        // Box office is string like "$292,587,330". We need to parse.
        // Aggregate to convert and sort.
        const boxOfficeMovies = await Movie.aggregate([
            { $match: { ...query, boxOffice: { $ne: null, $ne: 'N/A' } } },
            // Easier way since $replaceAll is newer:
            {
                $addFields: {
                    cleanBox: {
                        $replaceAll: { input: { $replaceAll: { input: "$boxOffice", find: ",", replacement: "" } }, find: { $literal: "$" }, replacement: "" }
                    }
                }
            },
            {
                $addFields: {
                    boxVal: { $toDouble: "$cleanBox" }
                }
            },
            { $sort: { boxVal: -1 } },
            { $limit: 1 }
        ]);

        const highestBoxOffice = boxOfficeMovies[0] ? {
            title: boxOfficeMovies[0].title,
            value: boxOfficeMovies[0].boxOffice,
            poster: boxOfficeMovies[0].poster
        } : null;

        // 8. Awards Calculation
        // Fetch all awards strings and parse in JS
        const allAwards = await Movie.find(query).select('awards');
        let totalWins = 0;
        let totalNominations = 0;

        allAwards.forEach(m => {
            if (m.awards && m.awards !== 'N/A') {
                // "Won 4 Oscars. 159 wins & 220 nominations total"
                // "38 wins & 45 nominations"
                const winsMatch = m.awards.match(/(\d+)\s+win/);
                const oscarMatch = m.awards.match(/Won\s+(\d+)\s+Oscar/);
                const nomsMatch = m.awards.match(/(\d+)\s+nomination/);

                if (oscarMatch) totalWins += parseInt(oscarMatch[1]);
                if (winsMatch) totalWins += parseInt(winsMatch[1]);
                if (nomsMatch) totalNominations += parseInt(nomsMatch[1]);
            }
        });

        const statsObj = {
            totalTitles,
            moviesCount,
            seriesCount,
            avgRating,
            highestRated,
            mostVoted,
            newestRelease, // Using entire object, frontend can pick fields
            oldestRelease,
            highestBoxOffice,
            totalAwards: { wins: totalWins, nominations: totalNominations },
            mostPopularGenre: genreDist[0] ? { name: genreDist[0]._id, count: genreDist[0].count } : null,
            genreDistribution: genreDist.map(g => ({ name: g._id, value: g.count })),
            languageDistribution: languageDist.map(l => ({ name: l._id, value: l.count })),
            ratingDistribution: formattedRatingDist,
            viewsOverTime: yearDist.map(y => ({ name: y._id, views: y.count }))
        };
        // console.log("Stats Object:", statsObj);

        // Construct Response
        res.status(200).json({
            found: true,
            totalTitles,
            moviesCount,
            seriesCount,
            avgRating,
            highestRated,
            mostVoted,
            newestRelease, // Using entire object, frontend can pick fields
            oldestRelease,
            highestBoxOffice,
            totalAwards: { wins: totalWins, nominations: totalNominations },
            mostPopularGenre: genreDist[0] ? { name: genreDist[0]._id, count: genreDist[0].count } : null,
            genreDistribution: genreDist.map(g => ({ name: g._id, value: g.count })),
            languageDistribution: languageDist.map(l => ({ name: l._id, value: l.count })),
            ratingDistribution: formattedRatingDist,
            viewsOverTime: yearDist.map(y => ({ name: y._id, views: y.count })) // Using Year as timeline
        });

    } catch (err) {
        console.error("Dashboard stats error:", err);
        res.status(500).json({ message: err.message, found: false });
    }
}