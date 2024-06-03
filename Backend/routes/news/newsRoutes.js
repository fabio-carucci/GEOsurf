import express from 'express';
import { getNews } from '../../controllers/news/newsController.js';

const router = express.Router();

// Definizione delle route
router
    .get('/getNews', getNews) // Route POST per recuperare le news

export default router;