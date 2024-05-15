import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import addressSchema from "./address";

const companySchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    partitaIVA: {
        type: String,
        required: true,
        unique: true
    },
    indirizzo: {
        type: addressSchema,
        required: true
    },
    telefono: {
        type: String,
        required: false
    },
    logo: {
        type: String, 
        required: false
    },
    websiteURL: {
        type: String, 
        required: false
    }
});

// Middleware di pre-save per hashare la password prima di salvarla nel database
companySchema.pre('save', async function (next) {
    const company = this;
    // Se la password non è stata modificata, continua
    if (!company.isModified('password')) {
        return next();
    }
    try {
        // Genera il salt e hash della password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(company.password, salt);
        company.password = hashedPassword;
        next();
    } catch (error) {
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