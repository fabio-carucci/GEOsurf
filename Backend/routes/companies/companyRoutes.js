import express from 'express';
import { searchCompanyWithCoordinates, getCompanies, getCompanyById } from '../../controllers/companies/companyController.js';

const router = express.Router();

// Definizione delle route
router
    .get('/searchCompanies', searchCompanyWithCoordinates) // Route GET per cercare le aziende tramite coordinate e raggio
    .post('/companies', getCompanies) // Route GET per ottenere la lista delle aziende registrate
    .get('/companyProfile/:id', getCompanyById) // Route GET per ottenere il profilo dell'azienda tramite params id

export default router;