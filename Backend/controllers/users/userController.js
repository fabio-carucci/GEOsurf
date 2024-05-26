import User from "../../models/user.js";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendMail from "../../sendMail.js";
import { configDotenv } from "dotenv";

// Configuro dotenv per caricare le variabili d'ambiente dal file .env
configDotenv();

const secret = process.env.USER_JWT_SECRET;

// Metodo per generare un token JWT
function generateToken(user) {
    const payload = {
        id: user._id,
        email: user.email
    };
    return jwt.sign(payload, secret, { expiresIn: '1h' }); // Il token scade dopo 1 ora
}

// Metodo per registrare un nuovo utente nel database
const createUser = async (req, res, next) => {
    try {
        let avatarCloudinaryURL = null;
        if(req.file && req.file.path) {
            avatarCloudinaryURL = req.file.path;
        }

        // Verifica se l'email esiste già
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email già esistente.' });
        }

        const newUser = await User.create({
            ...req.body, 
            avatar: avatarCloudinaryURL
        });

        const token = generateToken(newUser);
        res.json({ token });
    } catch (error) {
        console.error('Errore durante la creazione dell\'utente:', error);
        next(error); // Usa il middleware di gestione degli errori
    }
};

// Metodo per ottenere il profilo dell'utente autenticato tramite token
const getUserProfile = async (req, res, next) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.error('Errore durante il recupero del profilo dell\'utente:', error);
        next(error);
    }
};

// Metodo per aggiornare il token prima della scadenza
const refreshUserToken = async (req, res) => {
    try {
        // Genera un nuovo token con lo stesso payload dell'utente attuale
        const newToken = generateToken(req.user);

        // Invia il nuovo token nella risposta
        res.status(200).json({ token: newToken });
    } catch (error) {
        console.error("Errore durante l'aggiornamento del token:", error);
        res.status(500).json({ message: "Errore durante l'aggiornamento del token" });
    }
};

// Metodo per il login dell'utente
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const foundUser = await User.findOne({ email });
        if (!foundUser) {
            return res.status(404).json({ message: 'Utente non trovato.' });
        }
        const isPasswordValid = await foundUser.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Password non valida.' });
        }
        const token = generateToken(foundUser);
        res.json({ token });
    } catch (err) {
        console.error('Errore durante il login dell\'utente:', err);
        next(err);
    }
};

// Metodo per ottenere la lista degli utenti registrati
const getUsers = async (req, res, next) => {
    try {
        const { nome } = req.query;
        let query = {};
        if (nome) {
            query = { nome: { $regex: nome, $options: 'i' } };
        }
        const users = await User.find(query);
        res.json(users);
    } catch (err) {
        console.error('Errore durante il recupero degli utenti:', err);
        next(err);
    }
};

// Metodo per aggiornare un utente
const updateUser = async (req, res, next) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
        if (updatedUser) {
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'Utente non trovato.' });
        }
    } catch (err) {
        console.error('Errore durante l\'aggiornamento dell\'utente:', err);
        next(err);
    }
};

// Metodo per eliminare un'utente
const deleteUser = async (req, res, next) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.user.id);
        if (deletedUser) {
            res.status(200).json({ message: `L'utente di nome ${deletedUser.nome} è stato eliminato correttamente` });
        } else {
            res.status(404).json({ message: 'Utente non trovato.' });
        }
    } catch (err) {
        console.error('Errore durante l\'eliminazione dell\'utente:', err);
        next(err);
    }
};

// Metodo per aggiungere/modificare l'url dell'immagine dell'utente
const updateUserAvatar = async (req, res, next) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id, 
            { avatar: req.file.path },
            { new: true }
        );
        if (updatedUser) {
            res.status(200).json({ message: `L'avatar dell'utente di nome ${updatedUser.nome} è stato aggiornato correttamente` });
        } else {
            res.status(404).json({ message: 'Utente non trovato.' });
        }
    } catch (err) {
        console.error('Errore durante l\'aggiornamento dell\'avatar dell\'utente:', err);
        next(err);
    }
};

// Metodo per aggiornare la password da parte dell'utente
const changeUserPW = async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const myUser = await User.findById(req.user.id);
        if (!myUser) {
            return res.status(404).json({ message: 'Utente non trovato' });
        }
        const isMatch = await myUser.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Vecchia password non corretta' });
        }
        myUser.password = newPassword;
        await myUser.save();
        res.status(200).json({ message: 'Password aggiornata con successo' });
    } catch (error) {
        console.error('Errore durante l\'aggiornamento della password:', error);
        next(error);
    }
};

// Metodo per inviare la mail in caso di password dimenticata
const sendMailResetPW = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Nessun account trovato con questa email' });
        }
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 ora
        await user.save();
        const resetURL = `${process.env.FRONTEND_URL}/recupera-password/${token}`;
        const mailSubject = 'Reset della password';
        const mailBody = `
            <p>Stai ricevendo questa email perché hai richiesto il reset della password per il tuo account.</p>
            <p>Clicca sul pulsante qui sotto per completare il processo:</p>
            <p>
                <a href="${resetURL}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;">
                    Recupera password
                </a>
            </p>
            <p>Se non hai richiesto questo, ignora questa email e la tua password rimarrà invariata.</p>
        `;
        await sendMail(user.email, mailSubject, mailBody);
        res.status(200).json({ message: 'Email di reset della password inviata con successo' });
    } catch (error) {
        console.error('Errore durante il processo di reset della password:', error);
        next(error);
    }
};

// Metodo per resettare la password in caso di password dimenticata
const resetPassword = async (req, res, next) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    try {
        const user = await User.findOne({ 
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() } 
        });
        if (!user) {
            return res.status(400).json({ message: 'Token non valido o scaduto' });
        }
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.status(200).json({ message: 'Password aggiornata con successo' });
    } catch (error) {
        console.error('Errore durante il reset della password:', error);
        next(error);
    }
};

export { 
    createUser, 
    getUserProfile, 
    refreshUserToken,
    loginUser, 
    getUsers, 
    updateUser, 
    deleteUser, 
    updateUserAvatar, 
    changeUserPW,
    sendMailResetPW,
    resetPassword 
};