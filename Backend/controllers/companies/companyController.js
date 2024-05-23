import Company from "../../models/company.js";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendMail from "../../sendMail.js";
import { configDotenv } from "dotenv";

// Configuro dotenv per caricare le variabili d'ambiente dal file .env
configDotenv();

const secret = process.env.COMPANY_JWT_SECRET;

// Metodo per generare un token JWT
function generateToken(company) {
    const payload = {
        id: company._id,
        email: company.email
    };
    return jwt.sign(payload, secret, { expiresIn: '1h' }); // Il token scade dopo 1 ora
}

// Metodo per registrare una nuova azienda nel database
const createCompany = async (req, res, next) => {
    try {
        let logoCloudinaryURL = null;
        if(req.file && req.file.path) {
            logoCloudinaryURL = req.file.path;
        }

        // Verifica se l'email esiste già
        const existingCompany = await Company.findOne({ email: req.body.email });
        if (existingCompany) {
            return res.status(400).json({ message: 'Email già esistente.' });
        };

        const newCompany = await Company.create({
            ...req.body, 
            logo: logoCloudinaryURL
        });

        const token = generateToken(newCompany);
        res.json({ token });
    } catch (error) {
        console.error('Errore durante la creazione dell\'azienda:', error);
        next(error); // Usa il middleware di gestione degli errori
    }
};

// Metodo per ottenere il profilo dell'azienda autenticato tramite token
const getCompanyProfile = async (req, res, next) => {
    try {
        res.status(200).json(req.company);
    } catch (error) {
        console.error('Errore durante il recupero del profilo dell\'azienda:', error);
        next(error);
    }
};

// Metodo per il login dell'azienda
const loginCompany = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const foundCompany = await Company.findOne({ email });
        if (!foundCompany) {
            return res.status(404).json({ message: 'Azienda non trovata.' });
        }
        const isPasswordValid = await foundCompany.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Password non valida.' });
        }
        const token = generateToken(foundCompany);
        res.json({ token });
    } catch (err) {
        console.error('Errore durante il login dell\'azienda:', err);
        next(err);
    }
};

// Metodo per ottenere la lista delle aziende registrate
const getCompanies = async (req, res, next) => {
    try {
        const { nome } = req.query;
        let query = {};
        if (nome) {
            query = { nome: { $regex: nome, $options: 'i' } };
        }
        const companies = await Company.find(query);
        res.json(companies);
    } catch (err) {
        console.error('Errore durante il recupero delle aziende:', err);
        next(err);
    }
};

// Metodo per aggiornare un'azienda
const updateCompany = async (req, res, next) => {
    try {
        const updatedCompany = await Company.findByIdAndUpdate(req.company.id, req.body, { new: true });
        if (updatedCompany) {
            res.json(updatedCompany);
        } else {
            res.status(404).json({ message: 'Azienda non trovata.' });
        }
    } catch (err) {
        console.error('Errore durante l\'aggiornamento dell\'azienda:', err);
        next(err);
    }
};

// Metodo per eliminare un'azienda
const deleteCompany = async (req, res, next) => {
    try {
        const deletedCompany = await Company.findByIdAndDelete(req.company.id);
        if (deletedCompany) {
            res.status(200).json({ message: `L'azienda di nome ${deletedCompany.nome} è stata eliminata correttamente` });
        } else {
            res.status(404).json({ message: 'Azienda non trovata.' });
        }
    } catch (err) {
        console.error('Errore durante l\'eliminazione dell\'azienda:', err);
        next(err);
    }
};

// Metodo per aggiungere/modificare l'url dell'immagine dell'azienda
const updateCompanyLogo = async (req, res, next) => {
    try {
        const updatedCompany = await Company.findByIdAndUpdate(
            req.company.id, 
            { logo: req.file.path },
            { new: true }
        );
        if (updatedCompany) {
            res.status(200).json({ message: `Il logo dell'azienda di nome ${updatedCompany.nome} è stato aggiornato correttamente` });
        } else {
            res.status(404).json({ message: 'Azienda non trovata.' });
        }
    } catch (err) {
        console.error('Errore durante l\'aggiornamento del logo dell\'azienda:', err);
        next(err);
    }
};

// Metodo per aggiornare la password da parte dell'utente
const changeCompanyPW = async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const myCompany = await Company.findById(req.company.id);
        if (!myCompany) {
            return res.status(404).json({ message: 'Azienda non trovata' });
        }
        const isMatch = await myCompany.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Vecchia password non corretta' });
        }
        myCompany.password = newPassword;
        await myCompany.save();
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
        const company = await Company.findOne({ email });
        if (!company) {
            console.log('Nessun account trovato con questa email:', email);
            return res.status(404).json({ message: 'Nessun account trovato con questa email' });
        }
        const token = crypto.randomBytes(20).toString('hex');
        company.resetPasswordToken = token;
        company.resetPasswordExpires = Date.now() + 3600000; // 1 ora
        await company.save();
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
        await sendMail(company.email, mailSubject, mailBody);
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
        const company = await Company.findOne({ 
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() } 
        });
        if (!company) {
            return res.status(400).json({ message: 'Token non valido o scaduto' });
        }
        company.password = newPassword;
        company.resetPasswordToken = undefined;
        company.resetPasswordExpires = undefined;
        await company.save();
        res.status(200).json({ message: 'Password aggiornata con successo' });
    } catch (error) {
        console.error('Errore durante il reset della password:', error);
        next(error);
    }
};

export { 
    createCompany, 
    getCompanyProfile, 
    loginCompany, 
    getCompanies, 
    updateCompany, 
    deleteCompany, 
    updateCompanyLogo, 
    changeCompanyPW,
    sendMailResetPW,
    resetPassword 
};
