import express from 'express';
import mongoose from "mongoose";
import passport from 'passport';
import cors from 'cors';
import { configDotenv } from "dotenv";

// Configuro dotenv per caricare le variabili d'ambiente dal file .env
configDotenv();

// Importo la variabile PORT e il link di connessione al database dal file .env
const PORT = process.env.PORT || 5002;
const db = process.env.DB_URL;

const app = express(); // Crea un'istanza di Express

// URL consentiti per le richieste all'API
const whitelist = ["https://localhost:3000"];

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
    res.send("Server listening...")
});

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