import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import cors from 'cors';
import googleStrategy from './middlewares/passport.js';
import { configDotenv } from 'dotenv';

// Configuro dotenv per caricare le variabili d'ambiente dal file .env
configDotenv();

import errorHandler from './middlewares/errorHandler.js';

// Importo le routes delle aziende
import loginCompanyRoutes from './routes/companies/loginCompanyRoutes.js';
import protectedCompanyRoutes from './routes/companies/protectedCompanyRoutes.js';
import jwtCompanyVerifier from './middlewares/jwtCompanyVerifier.js';
import companyRoutes from './routes/companies/companyRoutes.js';

// Importo le routes degli utenti
import loginUserRoutes from './routes/users/loginUserRoutes.js';
import userRoutes from './routes/users/userRoutes.js';
import jwtUserVerifier from './middlewares/jwtUserVerifier.js';

// Importo le routes delle news
import protectedNewsRoutes from './routes/news/protectedNewsRoutes.js';
import newsRoutes from './routes/news/newsRoutes.js';

// Importo le routes delle reviews
import reviewsRoutes from './routes/reviews/reviewsRoutes.js';

// Importo la variabile PORT e il link di connessione al database dal file .env
const PORT = process.env.PORT || 5002;
const db = process.env.DB_URL;

const app = express(); // Crea un'istanza di Express

// URL consentiti per le richieste all'API
const whitelist = ["https://geosurf.vercel.app"];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not Allowed by CORS"));
        }
    },
};

// Middleware per consentire le richieste CORS dal frontend
app.use(cors(corsOptions));

// Middleware per analizzare i body delle richieste in formato JSON
app.use(express.json());

// Imposto una route principale per fornire un feedback al client in fase di deploy
app.get('/', (req, res) => {
    res.send("Server listening...");
});

// Middleware per strategy di Google
passport.use('google', googleStrategy);

// Routes di login 
app.use('/auth', loginCompanyRoutes);
app.use('/auth', loginUserRoutes);

// Routes generali
app.use('/', companyRoutes);
app.use('/', newsRoutes);
app.use('/', reviewsRoutes);

// Routes a seguito dell'autenticazione
app.use('/company', jwtCompanyVerifier, protectedCompanyRoutes);
app.use('/user', jwtUserVerifier, userRoutes);

app.use('/news', jwtUserVerifier, protectedNewsRoutes);

// Middleware per la gestione degli errori
app.use(errorHandler);

// Connessione al database MongoDB utilizzando Mongoose
const connectDB = async () => {
    try {
        await mongoose.connect(db);
        console.log('Connessione al database MongoDB riuscita');
        // Avvia il server solo dopo che la connessione al database è stata stabilita con successo
        app.listen(PORT, () => {
            console.log(`Il server è in ascolto sulla porta ${PORT}`);
        });
    } catch (error) {
        console.error('Errore durante la connessione al database MongoDB:', error);
    }
};

// Invocazione della funzione di connessione al database
connectDB();