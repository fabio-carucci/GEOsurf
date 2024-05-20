import express from 'express';
import { getUserProfile, getUsers, updateUser, deleteUser, updateUserAvatar, changeUserPW } from '../../controllers/users/userController.js';

const router = express.Router();

// Definizione delle route
router
    .get('/companyProfile', getUserProfile) // Route GET per ottenere il profilo dell'utente corrente
    .get('/companies', getUsers) // Route GET per ottenere la lista degli utenti registrati
    .put('/updateCompany', updateUser) // Route PUT per aggiornare l'utente corrente
    .delete('/deleteCompany', deleteUser) // Route DELETE per eliminare l'utente corrente
    .patch('/updateCompanyLogo', updateUserAvatar) // Route PATCH per aggiornare il logo dell'utente
    .put('/changeCompanyPW', changeUserPW) // Route PUT per cambiare la password

export default router;