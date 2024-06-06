import express from 'express';
import { createNews } from '../../controllers/news/newsController.js';
import isAdmin from '../../middlewares/adminRoleVerifier.js';

const router = express.Router();

// Definizione delle route
router
    .post('/createNews', isAdmin, createNews) // Route POST per la creazione di una news

export default router;