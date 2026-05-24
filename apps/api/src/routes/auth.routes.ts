import { Router } from 'express';
import { register, login, me, updateProfile, listFavorites, addFavorite, removeFavorite } from '../controllers/auth.controller.js';

export const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/me', me);
authRouter.put('/me', updateProfile);
authRouter.get('/favorites', listFavorites);
authRouter.post('/favorites/:productId', addFavorite);
authRouter.delete('/favorites/:productId', removeFavorite);
