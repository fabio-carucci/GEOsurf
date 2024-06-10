import Company from "../../models/company.js";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendMail from "../../sendMail.js";
import { configDotenv } from "dotenv";
import fetch from 'node-fetch';
import Countries from '../../countries.json' assert { type: "json" };

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
        if (req.file && req.file.path) {
            logoCloudinaryURL = req.file.path;
        }

        // Verifica se l'email esiste già
        const existingCompany = await Company.findOne({ email: req.body.email });
        if (existingCompany) {
            return res.status(400).json({ message: 'Email già esistente.' });
        }

        // Analizza l'oggetto indirizzo dal corpo della richiesta
        const indirizzo = JSON.parse(req.body.indirizzo);

        // Costruisci l'indirizzo completo
        const { via, città, CAP, provincia, regione, paese } = indirizzo;
        const address = `${via}, ${CAP} ${città}, ${provincia}, ${regione}, ${paese}`;

        // Ottieni le coordinate dall'API di Nominatim
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`);
        const data = await response.json();

        if (data.length === 0) {
            return res.status(400).json({ message: 'Impossibile ottenere le coordinate per l\'indirizzo fornito.' });
        }

        const coordinates = [parseFloat(data[0].lat), parseFloat(data[0].lon)];

        // Crea la nuova azienda con le coordinate ottenute
        const newCompany = await Company.create({
            ...req.body,
            indirizzo: {
                ...indirizzo,
                location: {
                    type: 'Point',
                    coordinates
                }
            },
            logo: logoCloudinaryURL,
        });

        const token = generateToken(newCompany);
        res.json({ token, id: newCompany._id });
    } catch (error) {
        console.error('Errore durante la creazione dell\'azienda:', error);
        next(error);
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

// Metodo per aggiornare il token prima della scadenza
const refreshCompanyToken = async (req, res) => {
    try {
        // Genera un nuovo token con lo stesso payload dell'azienda attuale
        const newToken = generateToken(req.company);

        // Invia il nuovo token nella risposta
        res.status(200).json({ token: newToken });
    } catch (error) {
        console.error("Errore durante l'aggiornamento del token:", error);
        res.status(500).json({ message: "Errore durante l'aggiornamento del token" });
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
        const { ids } = req.body;
        const companies = await Company.find({ _id: { $in: ids } });
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
            res.status(200).json({ message: `Il logo dell'azienda di nome ${updatedCompany.nome} è stato aggiornato correttamente`, updatedCompany });
        } else {
            res.status(404).json({ message: 'Azienda non trovata.' });
        }
    } catch (err) {
        console.error('Errore durante l\'aggiornamento del logo dell\'azienda:', err);
        next(err);
    }
};

// Metodo per aggiungere/modificare l'url della cover dell'azienda
const updateCompanyCover = async (req, res, next) => {
    try {
        const updatedCompany = await Company.findByIdAndUpdate(
            req.company.id, 
            { cover: req.file.path },
            { new: true }
        );
        if (updatedCompany) {
            res.status(200).json({ message: `La cover dell'azienda di nome ${updatedCompany.nome} è stato aggiornato correttamente`, updatedCompany });
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

// Metodo per cercare le aziende che si trovano entro un certo raggio di distanza da coordinate
const searchCompanyWithCoordinates = async (req, res, next) => {
    const { lat, lon, radius } = req.query;
    const radiusInKilometers = parseFloat(radius);
    const coordinates = [parseFloat(lat), parseFloat(lon)];

    try {
        const companies = await Company.find({
            "indirizzo.location": {
                $geoWithin: {
                    $centerSphere: [coordinates, radiusInKilometers / 6378.1]
                }
            }
        });
        res.json(companies);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Errore nella ricerca delle Aziende' });
    }
};

// Metodo per trovare l'azienda tramite id
const getCompanyById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const company = await Company.findById(id);
        if (!company) {
            return res.status(404).json({ message: 'Azienda non trovata.' });
        }
        // Creare un oggetto con solo i campi desiderati
        const companyData = {
            nome: company.nome,
            email: company.email,
            indirizzo: company.indirizzo,
            telefono: company.telefono,
            logo: company.logo,
            cover: company.cover,
            websiteURL: company.websiteURL,
            servizi: company.servizi,
            reviews: company.reviews
        };
        res.status(200).json(companyData);
    } catch (error) {
        console.error('Errore durante il recupero dell\'azienda tramite ID:', error);
        next(error); // Usa il middleware di gestione degli errori
    }
};

// Metodo per aggiornare i servizi dell'azienda
const updateCompanyServices = async (req, res, next) => {
    try {
        // Lista dei servizi ricevuti dal body della richiesta
        const servicesToUpdate = req.body.services;

        // Lista dei servizi attualmente disponibili nell'azienda
        let updatedServices = req.company.servizi || [];

        // Mappatura dei nomi dei servizi con le rispettive icone
        const serviceIconsMap = {
            'Corsi Surf': '🏄‍♂️',
            'Noleggio Attrezzatura': '🏄‍♀️',
            'Corsi Kitesurf': '🪂',
            'Rimessaggio Tavole': '🛶',
            'Esperienze Outdoor': '⛰️',
            'Corsi Windsurf': '🪁',
            'Yoga SUP': '🧘🏼‍♀️',
            'Corsi Skate': '🛹',
            'Academy': '🎓',
            'Surf trips': '🛩️'
        };

        // Aggiungi nuovi servizi alla lista dei servizi dell'azienda
        servicesToUpdate.forEach(service => {
            if (!updatedServices.find(s => s.nome === service)) {
                // Servizio non presente, aggiungilo con l'icona corrispondente
                updatedServices.push({ nome: service, icona: serviceIconsMap[service] || '' });
            }
        });

        // Rimuovi servizi dalla lista se non sono più selezionati
        updatedServices = updatedServices.filter(service => servicesToUpdate.includes(service.nome));

        // Aggiorna i servizi dell'azienda
        req.company.servizi = updatedServices;
        const updatedCompany = await req.company.save();

        res.status(200).json({ message: `I servizi dell'azienda di nome ${updatedCompany.nome} sono stati aggiornati correttamente`, updatedCompany });
    } catch (err) {
        console.error('Errore durante l\'aggiornamento dei servizi dell\'azienda:', err);
        next(err);
    }
};

// Metodo per contare le aziende per paese utilizzando l'aggregazione di MongoDB
const countCompaniesByCountry = async (req, res, next) => {
    try {
        // Esegue l'aggregazione per contare le aziende per paese
        const aggregationPipeline = [
            {
                $group: {
                    _id: '$indirizzo.paese',
                    count: { $sum: 1 }
                }
            }
        ];

        const companyCounts = await Company.aggregate(aggregationPipeline);

        // Mappa i risultati per aggiungere il codice ISO del paese
        const formattedData = companyCounts.map(({ _id, count }) => {
            const country = Countries.data.find(country => country.label === _id);
            return {
                id: country ? country.value : _id, // Usa il codice ISO del paese se disponibile, altrimenti usa il nome del paese
                value: count
            };
        });

        // Invia i risultati
        res.json(formattedData);
    } catch (error) {
        console.error('Errore nel conteggio delle aziende per paese:', error);
        next(error);
    }
};

// Esportazione di tutti i metodi
export { 
    createCompany, 
    getCompanyProfile, 
    refreshCompanyToken,
    loginCompany, 
    getCompanies, 
    updateCompany, 
    deleteCompany, 
    updateCompanyLogo, 
    updateCompanyCover,
    changeCompanyPW,
    sendMailResetPW,
    resetPassword,
    searchCompanyWithCoordinates,
    getCompanyById,
    updateCompanyServices,
    countCompaniesByCountry
};
