import express from 'express';
import { handleUserInfo, handleUserSignIn, handleUserSignUp, handleUpdatePassword, handleDeleteUser, handleUpdateProfilePhoto } from '../controllers/user.js';
import { restrictAccessAdmin } from '../middleware/Authorization.js';
import { upload } from '../config/cloudinary.js';
import validate, { signupSchema, signinSchema } from '../middleware/validate.js';

const router = express.Router();

router.post('/signin', validate(signinSchema), handleUserSignIn);
router.post('/signup', validate(signupSchema), handleUserSignUp);
router.get('/me', handleUserInfo);
router.put('/password', handleUpdatePassword);
router.delete('/me', restrictAccessAdmin, handleDeleteUser);
router.post('/profile-photo', upload.single('profilePhoto'), handleUpdateProfilePhoto);

export default router;