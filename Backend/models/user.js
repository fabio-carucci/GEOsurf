import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import addressSchema from "./address";

const userSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    cognome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    dataDiNascita: {
        type: Date,
        required: false
    },
    avatar: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    }, 
    googleId: {
        type: String,
        required: false
    }, 
    indirizzo: {
        type: addressSchema,
        required: false
    }
});

// Middleware di pre-save per hashare la password prima di salvarla nel database
userSchema.pre('save', async function (next) {
    const user = this;
    // Se la password non è stata modificata, continua
    if (!user.isModified('password')) {
        return next();
    }
    try {
        // Genera il salt e hash della password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
        next();
    } catch (error) {
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