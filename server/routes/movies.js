import express from 'express';
import { addMoviesData, addMoviesUserData, getMoviesData, updateMovie, deleteMovie } from '../controllers/movies.js';
import { restrictAccessUser, restrictAccessAdmin } from '../middleware/Authorization.js';

const router = express.Router();


router.get('/', getMoviesData);
router.post('/', addMoviesData);
router.put('/user', addMoviesUserData);
router.put('/:id', restrictAccessUser, updateMovie);
router.delete('/:id', restrictAccessAdmin, deleteMovie);


export default router;