import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import addressSchema from './address.js';

const userSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'Il nome è obbligatorio']
    },
    cognome: {
        type: String,
        required: [true, 'Il cognome è obbligatorio']
    },
    email: {
        type: String,
        required: [true, 'L\'email è obbligatoria'],
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Per favore, utilizza un indirizzo email valido']
    },
    dataDiNascita: {
        type: Date,
        required: false
    },
    avatar: {
        type: String,
        required: false,
        default: ''
    },
    password: {
        type: String,
        required: false
    },
    googleId: {
        type: String,
        required: false,
        default: ''
    },
    indirizzo: {
        type: addressSchema,
        required: false
    },
    resetPasswordToken: {
        type: String,
        required: false
    },
    resetPasswordExpires: {
        type: Date,
        required: false,
        index: true // Aggiunge un indice su questo campo
    }
}, {
    timestamps: true // Aggiunge createdAt e updatedAt automaticamente
});

// Middleware di pre-save per hashare la password prima di salvarla nel database
userSchema.pre('save', async function (next) {
    const user = this;
    // Se la password non è stata modificata o non è presente, continua
    if (!user.isModified('password') || !user.password) {
        return next();
    }
    try {
        // Genera il salt e hash della password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
        next();
    } catch (error) {
        console.error('Errore durante il hashing della password:', error);
        return next(error);
    }
});

// Metodo per confrontare la password fornita con quella nel database
userSchema.methods.comparePassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw error;
    }
};

export default mongoose.model('User', userSchema);