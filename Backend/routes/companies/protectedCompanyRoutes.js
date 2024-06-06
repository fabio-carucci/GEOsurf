import express from 'express';
import { getCompanyProfile, refreshCompanyToken, updateCompany, deleteCompany, updateCompanyLogo, updateCompanyCover, changeCompanyPW, updateCompanyServices } from '../../controllers/companies/companyController.js';
import { uploadCompanyLogo, uploadCompanyCover } from '../../middlewares/multer.js';

const router = express.Router();

// Definizione delle route
router
    .get('/myProfile', getCompanyProfile) // Route GET per ottenere il profilo dell'azienda corrente
    .post('/refreshCompanyToken', refreshCompanyToken) // Route POST per refreshare il token scaduto
    .put('/updateCompany', updateCompany) // Route PUT per aggiornare l'azienda corrente
    .delete('/deleteCompany', deleteCompany) // Route DELETE per eliminare l'azienda corrente
    .patch('/updateCompanyLogo', uploadCompanyLogo, updateCompanyLogo) // Route PATCH per aggiornare il logo dell'azienda
    .patch('/updateCompanyCover', uploadCompanyCover, updateCompanyCover) // Route PATCH per aggiornare la cover dell'azienda
    .put('/changeCompanyPW', changeCompanyPW) // Route PUT per cambiare la password
    .patch('/updateCompanyServices', updateCompanyServices) // Route PATCH per aggiornare i servizi offerti dall'azienda

export default router;