import { Router } from 'express';
import { register, login, me, updateProfile } from '../controllers/auth.controller.js';

export const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/me', me);
authRouter.put('/me', updateProfile);
