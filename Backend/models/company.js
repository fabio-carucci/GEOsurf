import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import addressSchema from "./address.js";

const companySchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'Il nome è obbligatorio']
    },
    email: {
        type: String,
        required: [true, 'L\'email è obbligatoria'],
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Per favore, utilizza un indirizzo email valido.']
    },
    password: {
        type: String,
        required: [true, 'La password è obbligatoria']
    },
    partitaIVA: {
        type: String,
        required: [true, 'La partita IVA è obbligatoria'],
        unique: true,
        match: [/^\d{11}$/, 'Per favore, utilizza una partita IVA valida']
    },
    indirizzo: {
        type: addressSchema,
        required: [true, 'L\'indirizzo è obbligatorio']
    },
    telefono: {
        type: String,
        required: false,
        default: ''
    },
    logo: {
        type: String, 
        required: false,
        default: ''
    },
    cover: {
        type: String, 
        required: false,
        default: ''
    },
    websiteURL: {
        type: String, 
        required: false,
        default: ''
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
companySchema.pre('save', async function (next) {
    const company = this;
    // Se la password non è stata modificata o non è presente, continua
    if (!company.isModified('password') || !company.password) {
        return next();
    }
    try {
        // Genera il salt e hash della password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(company.password, salt);
        company.password = hashedPassword;
        next();
    } catch (error) {
        console.error('Errore durante il hashing della password:', error);
        return next(error);
    }
});

// Metodo per confrontare la password fornita con quella nel database
companySchema.methods.comparePassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw error;
    }
};

export default mongoose.model('Company', companySchema);