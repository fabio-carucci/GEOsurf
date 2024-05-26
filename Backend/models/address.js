import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    via: {
        type: String,
        required: [true, 'La via è obbligatoria'],
        trim: true // Rimuove spazi vuoti all'inizio e alla fine
    },
    città: {
        type: String,
        required: [true, 'La città è obbligatoria'],
        trim: true,
        set: v => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase(), // Capitalizzazione
        index: true // Aggiunge un indice per ricerche rapide
    },
    CAP: {
        type: String,
        required: [true, 'Il CAP è obbligatorio'],
        match: [/^\d{5}$/, 'Il CAP deve essere un numero di 5 cifre'] // Valida il formato del CAP
    },
    provincia: {
        type: String,
        required: false,
        default: '',
        trim: true,
        set: v => v.toUpperCase() // Trasformazione in maiuscolo
    },
    regione: {
        type: String,
        required: false,
        default: '',
        trim: true,
        set: v => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase() // Capitalizzazione
    },
    paese: {
        type: String,
        required: [true, 'Il paese è obbligatorio'],
        trim: true,
        set: v => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase(), // Capitalizzazione
        index: true // Aggiunge un indice per ricerche rapide
    },
    location: {
        type: {
            type: String,
            enum: ['Point'], // Solo 'Point' è supportato per GeoJSON
            required: true
        },
        coordinates: {
            type: [Number],
            required: true,
            validate: {
                validator: function(arr) {
                    return arr.length === 2;
                },
                message: 'Coordinates must be an array of two numbers [latitude, longitude]'
            }
        }
    }
});

// Aggiunge un indice combinato per città e paese per ricerche rapide
addressSchema.index({ città: 1, paese: 1 });
// Aggiunge un indice 2dsphere per il campo 'location' per le query geospaziali
addressSchema.index({ location: '2dsphere' });

export default addressSchema;