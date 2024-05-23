import pkg from 'mongoose';
import jwt from 'jsonwebtoken';

const { ValidationError } = pkg;

// Middleware di gestione degli errori
const errorHandler = (err, req, res, next) => {
    // Log dell'errore sul server per il debugging
    console.error('Errore:', err);

    // Gestione degli errori di validazione di Mongoose
    if (err instanceof ValidationError) {
        return res.status(400).json({
            message: 'Errore di validazione',
            errors: Object.values(err.errors).map(e => e.message)
        });
    }

    // Gestione degli errori JWT
    if (err instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({
            message: 'Token JWT non valido'
        });
    }

    if (err instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
            message: 'Token JWT scaduto'
        });
    }

    // Gestione degli errori specifici
    if (err.status) {
        return res.status(err.status).json({
            message: err.message
        });
    }

    // Altri errori generici del server
    res.status(err.status || 500).json({
        message: err.message || 'Errore del server'
    });
};

export default errorHandler;