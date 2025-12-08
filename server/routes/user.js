import express from 'express';
import { handleUserInfo, handleUserSignIn, handleUserSignUp, handleUpdatePassword, handleDeleteUser } from '../controllers/user.js';
import { restrictAccessAdmin } from '../middleware/Authorization.js';

const router = express.Router();

router.post('/signin', handleUserSignIn);
router.post('/signup', handleUserSignUp);
router.get('/me', handleUserInfo);
router.put('/password', handleUpdatePassword);
router.delete('/me', restrictAccessAdmin, handleDeleteUser);

export default router;