import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Il nome del modello a cui fa riferimento l'ID
        required: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
}, {
    timestamps: true // Aggiunge createdAt e updatedAt automaticamente
});

export default mongoose.model('News', newsSchema);
