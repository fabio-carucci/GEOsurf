import express from 'express';
import { getUserProfile, refreshUserToken, getUsers, updateUser, deleteUser, updateUserAvatar, changeUserPW } from '../../controllers/users/userController.js';

const router = express.Router();

// Definizione delle route
router
    .get('/userProfile', getUserProfile) // Route GET per ottenere il profilo dell'utente corrente
    .post('/refreshUserToken', refreshUserToken) // Route POST per refreshare il token scaduto
    .get('/users', getUsers) // Route GET per ottenere la lista degli utenti registrati
    .put('/updateUser', updateUser) // Route PUT per aggiornare l'utente corrente
    .delete('/deleteUser', deleteUser) // Route DELETE per eliminare l'utente corrente
    .patch('/updateUserAvatar', updateUserAvatar) // Route PATCH per aggiornare il logo dell'utente
    .put('/changeUserPW', changeUserPW) // Route PUT per cambiare la password

export default router;