import express from 'express';
import multer from 'multer';
import { createCompany, loginCompany, sendMailResetPW, resetPassword, searchCompanyWithCoordinates } from '../../controllers/companies/companyController.js';
import { uploadCompanyLogo } from '../../middlewares/multer.js';

const formDataParser = multer();

const router = express.Router();

// Definizione delle route
router
    .post('/createCompany', uploadCompanyLogo, createCompany) // Route POST per creare una nuova azienda
    .post('/loginCompany', formDataParser.none(), loginCompany) // Route POST per il login dell'azienda
    .post('/forgot-password', sendMailResetPW) // Route POST per inviare la mail in caso di password dimenticata
    .post('/reset/:token', resetPassword) // Route POST per resettare la password
    .get('/searchCompanies', searchCompanyWithCoordinates) // Route GET per cercare le aziende tramite coordinate e raggio

export default router;