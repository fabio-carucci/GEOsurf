import express from 'express';
import { createUser, loginUser, sendMailResetPW, resetPassword } from '../../controllers/users/userController.js';
import { uploadAvatar } from '../../middlewares/multer.js';

const router = express.Router();

// Definizione delle route
router
    .post('/creatUser', uploadAvatar, createUser) // Route POST per creare un nuovo utente
    .post('/loginUser', loginUser) // Route POST per il login dell'utente
    .post('/forgot-password', sendMailResetPW) // Route POST per inviare la mail in caso di password dimenticata
    .post('/reset/:token', resetPassword) // Route POST per resettare la password

export default router;