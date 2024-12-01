import { signup, login, verify, logout } from '../controllers/AuthController.js';
import express from 'express';

const router = express.Router();

router.post('/signup', signup); // Add signup route
router.post('/login', login);
router.get('/verify', verify);
router.post('/logout' , logout);

export default router;
