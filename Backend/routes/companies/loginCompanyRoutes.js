import express from 'express';
import { createCompany, loginCompany, sendMailResetPW, resetPassword } from '../../controllers/companies/companyController.js';
import { uploadCompanyLogo } from '../../middlewares/multer.js';

const router = express.Router();

// Definizione delle route
router
    .post('/createCompany', uploadCompanyLogo, createCompany) // Route POST per creare una nuova azienda
    .post('/loginCompany', loginCompany) // Route POST per il login dell'azienda
    .post('/forgot-password', sendMailResetPW) // Route POST per inviare la mail in caso di password dimenticata
    .post('/reset/:token', resetPassword) // Route POST per resettare la password

export default router;