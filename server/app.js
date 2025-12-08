import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors';
import userRouter from './routes/user.js';
import moviesRouter from './routes/movies.js';
import dashboardRouter from './routes/dashboard.js';
import connection from './config/connection.js';
import cookieParser from 'cookie-parser';
import { verifyToken } from './middleware/Authentication.js';
import { restrictAccessLoggedInUser } from './middleware/Authorization.js';
import limiter from './middleware/RateLimiting.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT;

connection(process.env.mongoURI)

app.use(express.json());
app.use(cookieParser());
app.use(verifyToken);

const allowedOrigins = ['http://localhost:5173', 'https://yourclientapp.com'];

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};

app.use(cors(corsOptions));


app.use(limiter);

app.use('/api/user', userRouter);
app.use('/api/movies',restrictAccessLoggedInUser, moviesRouter);
app.use('/api/dashboard', dashboardRouter);

app.listen(PORT, () => console.log("Server is running at PORT:", PORT))