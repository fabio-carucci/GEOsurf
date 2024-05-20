import jwt from 'jsonwebtoken';
import { configDotenv } from "dotenv";
import User from "../models/user.js";

// Configuro dotenv per caricare le variabili d'ambiente dal file .env
configDotenv();

// Funzione middleware per gestire l'autenticazione
const jwtUserVerifier = (req, res, next) => {
    const token = req.headers['authorization']; // Ottieni il token dall'intestazione Authorization
    if (!token) {
        return res.status(401).json({ message: 'Token non fornito.' });
    }

    const myToken = token.split(' ')[1]; // Ottengo il token senza la prima parte, esempio "Bearer "

    const secret = process.env.USER_JWT_SECRET;

    jwt.verify(myToken, secret, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token non valido.' });
        }
        const userId = decoded.id;

        try {
            // Uso l'ID per fare una query al database e ottenerne il profilo
            const userProfile = await User.findById(userId);

            // Verifica se l'utente esiste
            if (!userProfile) {
                return res.status(404).json({ message: "Profilo utente non trovato" });
            }

            req.user = userProfile;
            next();
        } catch (err) {
            next(err);
        }
    });
};

export default jwtUserVerifier;