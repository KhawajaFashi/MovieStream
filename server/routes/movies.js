import express from 'express';
import { addMoviesData, addMoviesUserData, getMoviesData, updateMovie } from '../controllers/movies.js';

const router = express.Router();


router.get('/', getMoviesData);
router.post('/', addMoviesData);
router.put('/user', addMoviesUserData);
router.put('/:id', updateMovie);


export default router;