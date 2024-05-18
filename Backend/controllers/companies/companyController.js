import Company from "../../models/company.js";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendMail from "../../sendMail.js";
import { configDotenv } from "dotenv";

// Configuro dotenv per caricare le variabili d'ambiente dal file .env
configDotenv();

const secret = process.env.JWT_SECRET;

// Metodo per generare un token JWT
function generateToken(company) {
    const payload = {
        id: company._id,
        email: company.email
    };
    return jwt.sign(payload, secret, { expiresIn: '1h' }); // Il token scade dopo 1 ora
};

// Metodo per registrare una nuova azienda nel database
const createCompany = async (req, res) => {
    try {
        const logoCloudinaryURL = null;
        // Verifico se è stato caricato un file 
        if(req.file && req.file.path) {
            // Il logo è stato caricato su cloudinary dal middleware in multer.js "uploadCompanyLogo"
            logoCloudinaryURL = req.file.path;
        };

        // Crea una nuova azienda nel database "Company" utilizzando i dati forniti e il link di Cloudinary come Company.logo se presente
        const newCompany = await Company.create({
            ...req.body, 
            logo: logoCloudinaryURL
        });

        // Se l'azienda è registrata con successo, genera un token JWT
        const token = generateToken(newCompany);

        // Invia il token JWT al client
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Si è verificato un errore durante la creazione dell\'azienda.' });
    }
};

// Metodo per ottenere il profilo dell'azienda autenticato tramite token
const getCompanyProfile = async (req, res) => {
    try {
        // Se l'azienda esiste, restituisci il profilo
        res.status(200).json(req.company);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Si è verificato un errore durante il recupero del profilo dell'azienda" });
    }
};

// Metodo per il login dell'azienda
const loginCompany = async (req, res) => {
    try {
        const { email, password } = req.body; // Ottieni email e password dall'oggetto di richiesta
        // Cerca l'azienda con l'email specificata nel database
        const foundCompany = await Company.findOne({ email });
        // Se l'azienda non è stata trovata, invia un messaggio di errore
        if (!foundCompany) {
            return res.status(404).json({ message: 'Azienda non trovato.' });
        }
        // Verifica se la password è valida
        const isPasswordValid = await foundCompany.comparePassword(password);
        if (!isPasswordValid) {
            // Se la password non è valida, invia un messaggio di errore
            return res.status(401).json({ message: 'Password non valida.' });
        }
        // Se l'utente è autenticato con successo, genera un token JWT
        const token = generateToken(foundCompany);

        // Invia il token JWT al client
        res.json({ token });
    } catch (err) {
        // Se si verifica un errore, invia un messaggio di errore come risposta
        console.error(err);
        res.status(500).json({ message: 'Si è verificato un errore durante il recupero dell\'azienda.' });
    }
};

// Metodo per ottenere la lista delle aziende registrate
const getCompanies = async (req, res) => {
    try {
        // Controlla se è presente il parametro 'nome' nella query della richiesta
        const { nome } = req.query;
        let query = {};

        // Se il parametro 'nome' è presente, crea una query per cercare le aziende con nome corrispondente
        if (nome) {
            query = { nome: { $regex: nome, $options: 'i' } }; // Utilizza regex per una corrispondenza non case-sensitive
        }

        // Ottieni la lista delle aziende dal database con la query appropriata
        const Companies = await Company.find(query);

        // Invia la lista delle aziende come risposta
        res.json(Companies);
    } catch (err) {
        // Se si verifica un errore, invia un messaggio di errore come risposta
        console.error(err);
        res.status(500).json({ message: 'Si è verificato un errore durante il recupero delle aziende.' });
    }
};

// Metodo per aggiornare un'azienda
const updateCompany = async (req, res) => {
    try {
        // Trova l'azienda con l'ID specificato nel database e aggiorna i dati con quelli ricevuti nel corpo della richiesta
        const updatedCompany = await Company.findByIdAndUpdate(req.company.id, req.body, { new: true });
        // Se l'azienda è stata trovata e aggiornata correttamente, invia l'azienda aggiornata come risposta
        if (updatedCompany) {
            res.json(updatedCompany);
        } else {
            // Se l'azienda non è stata trovata, invia un messaggio di errore
            res.status(404).json({ message: 'Azienda non trovata.' });
        } 
    } catch (err) {
        // Se si verifica un errore, invia un messaggio di errore come risposta
        console.error(err);
        res.status(500).json({ message: 'Si è verificato un errore durante l\'aggiornamento dell\'azienda.' });
    }
};

//Metodo per eliminare un'azienda
const deleteCompany = async (req, res) => {
    try {
        // Trova l'azienda con l'ID specificato nel database 
        const deletedCompany = await Company.findByIdAndDelete(req.company.id);
        // Se l'azienda è stata trovata e eliminata correttamente, invia un messaggio di conferma
        if (deletedCompany) {
            res.status(200).json({ message: `L\'azienda di nome ${deletedCompany.nome} è stata eliminata correttamente` });
        } else {
            // Se l'azienda non è stata trovata, invia un messaggio di errore
            res.status(404).json({ message: 'Azienda non trovata.' });
        } 
    } catch (err) {
        // Se si verifica un errore, invia un messaggio di errore come risposta
        console.error(err);
        res.status(500).json({ message: 'Si è verificato un errore durante l\'eliminazione dell\'azienda.' });
    }
};

// Metodo per aggiungere/modificare l'url dell'immagine dell'azienda
const updateCompanyLogo = async (req, res) => {
    try {
        // Cercare e aggiornare azienda con Id specifico alla proprietà logo
        const updatedCompany = await Company.findByIdAndUpdate(
            req.company.id, 
            { logo: req.file.path },
            { new: true }
        );
        // Se l'azienda è stata trovata e aggiornata correttamente, invia l'azienda aggiornata come risposta
        if(updatedCompany) {
            res.status(200).json({ message: `Il logo dell\'azienda di nome ${updatedCompany.nome} è stata aggiornata correttamente` });
        } else {
            // Se l'azienda non è stata trovata, invia un messaggio di errore
            res.status(404).json({ message: 'Azienda non trovato.' });
        };
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Si è verificato un errore durante l\'aggiornamento dell\'azienda.' });
    };  
};

// Metodo per aggiornare la password da parte dell'utente
const changeCompanyPW = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        // Trova l'azienda autenticata
        const myCompany = await Company.findById(req.company.id);

        if (!myCompany) {
            return res.status(404).json({ message: 'Azienda non trovata' });
        }

        // Verifica la vecchia password
        const isMatch = await myCompany.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Vecchia password non corretta' });
        }

        // Aggiorna la password e salva
        myCompany.password = newPassword;
        await myCompany.save();

        res.status(200).json({ message: 'Password aggiornata con successo' });
    } catch (error) {
        console.error(err);
        res.status(500).json({ message: 'Errore del server' });
    }
};

// Metodo per inviare la mail in caso di password dimenticata
const sendMailResetPW = async (req, res) => {
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

        const resetURL = `${process.env.FRONTEND_URL}/recupera-password/${token}`

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
        res.status(500).json({ message: 'Errore del server' });
    }
};

// Metodo per resettare la mail in caso di password dimenticata
const resetPassword = async (req, res) => {
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
        res.status(500).json({ message: 'Errore del server' });
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