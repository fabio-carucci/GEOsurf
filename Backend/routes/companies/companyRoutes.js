import express from 'express';
import { getCompanyProfile, refreshCompanyToken, getCompanies, updateCompany, deleteCompany, updateCompanyLogo, changeCompanyPW } from '../../controllers/companies/companyController.js';

const router = express.Router();

// Definizione delle route
router
    .get('/companyProfile', getCompanyProfile) // Route GET per ottenere il profilo dell'azienda corrente
    .post('/refreshCompanyToken', refreshCompanyToken) // Route POST per refreshare il token scaduto
    .get('/companies', getCompanies) // Route GET per ottenere la lista delle aziende registrate
    .put('/updateCompany', updateCompany) // Route PUT per aggiornare l'azienda corrente
    .delete('/deleteCompany', deleteCompany) // Route DELETE per eliminare l'azienda corrente
    .patch('/updateCompanyLogo', updateCompanyLogo) // Route PATCH per aggiornare il logo dell'azienda
    .put('/changeCompanyPW', changeCompanyPW) // Route PUT per cambiare la password

export default router;