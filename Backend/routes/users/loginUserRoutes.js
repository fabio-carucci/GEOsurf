import express from 'express';
import multer from 'multer';
import passport from 'passport';
import { createUser, loginUser, sendMailResetPW, resetPassword } from '../../controllers/users/userController.js';
import { uploadAvatar } from '../../middlewares/multer.js';
import { configDotenv } from "dotenv";

// Configuro dotenv per caricare le variabili d'ambiente dal file .env
configDotenv();

const formDataParser = multer();

const router = express.Router();

// Definizione delle route
router
    .post('/createUser', uploadAvatar, createUser) // Route POST per creare un nuovo utente
    .post('/loginUser', formDataParser.none(), loginUser) // Route POST per il login dell'utente
    .post('/forgot-password', sendMailResetPW) // Route POST per inviare la mail in caso di password dimenticata
    .post('/reset/:token', resetPassword) // Route POST per resettare la password
    .get('/googleLogin', passport.authenticate("google", {scope: ["profile", "email"]})) // Route GET per il login con Google
    .get('/callback', passport.authenticate("google", {session: false}), (req, res, next) => {
        try {
            res.redirect(`${process.env.FRONTEND_URL}/?accessToken=${req.user.token}`)
        } catch (error) {
            next(error);
        }
    })

export default router;