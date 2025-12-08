import express from 'express';
import { addMoviesData, addMoviesUserData, getMoviesData, updateMovie } from '../controllers/movies.js';
import { restrictAccessUser } from '../middleware/Authorization.js';

const router = express.Router();


router.get('/', getMoviesData);
router.post('/', addMoviesData);
router.put('/user', addMoviesUserData);
router.put('/:id', restrictAccessUser, updateMovie);


export default router;