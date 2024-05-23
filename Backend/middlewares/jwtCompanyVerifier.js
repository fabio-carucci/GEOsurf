import jwt from 'jsonwebtoken';
import { configDotenv } from "dotenv";
import Company from "../models/company.js";

// Configuro dotenv per caricare le variabili d'ambiente dal file .env
configDotenv();

// Funzione middleware per gestire l'autenticazione
const jwtCompanyVerifier = (req, res, next) => {
    const token = req.headers['authorization']; // Ottieni il token dall'intestazione Authorization
    if (!token) {
        return res.status(401).json({ message: 'Token non fornito.' });
    }

    const myToken = token.split(' ')[1]; // Ottengo il token senza la prima parte, esempio "Bearer "

    const secret = process.env.COMPANY_JWT_SECRET;

    jwt.verify(myToken, secret, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token non valido.' });
        }
        const companyId = decoded.id;

        try {
            // Uso l'ID per fare una query al database e ottenerne il profilo
            const companyProfile = await Company.findById(companyId);

            // Verifica se l'azienda esiste
            if (!companyProfile) {
                return res.status(404).json({ message: "Profilo azienda non trovato" });
            }

            req.company = companyProfile;
            next();
        } catch (err) {
            next(err);
        }
    });
};

export default jwtCompanyVerifier;